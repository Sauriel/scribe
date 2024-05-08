import express from "express";
import bodyParser from "body-parser";
import { connect } from "mongoose";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { Request, Response, NextFunction } from "express";
import { ApolloContext, RequestError } from "./types/custom";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./graphql/resolvers/user-resolver";
import { DocumentResolver } from "./graphql/resolvers/document-resolver";
import { DateScalar } from "./graphql/scalars/date";
import jwt from "express-jwt";
import cors from "cors";
import morgan from "morgan";
import { checkPatreonInformation, confirmPatreonController } from "./controller/patreon-controller";
import { UserModel } from "./graphql/entities/user";
import schedule from "node-schedule";
import { DBUser } from "./models";

// Mongo config
const MONGO_CONFIG = {
  user: process.env.MONGO_USER,
  password: process.env.MONGO_PASSWORD ? encodeURIComponent(process.env.MONGO_PASSWORD) : undefined,
  server: process.env.MONGO_SERVER,
  port: process.env.MONGO_PORT,
  database: process.env.MONGO_DEFAULT_DATABASE,
};

const main = async () => {
  // Create express
  const app = express();
  const mongoosePlugins = [];
  if (process.env.NODE_ENV === "production") {
    app.use(morgan("combined"));
  } else {
    mongoosePlugins.push(ApolloServerPluginLandingPageGraphQLPlayground);
  }
  app.use(bodyParser.json({ limit: "20mb" }));
  app.use(cors({
    origin: process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
    methods: process.env.ACCESS_CONTROL_ALLOW_METHODS,
    allowedHeaders: process.env.ACCESS_CONTROL_ALLOW_HEADERS,
    optionsSuccessStatus: 200
  }));
  app.use(jwt({
    secret: process.env.JWT_SECRET || "",
    algorithms: ['HS256'],
    credentialsRequired: false
  }));

  // Apollo/GraphQL Config
  const schema = await buildSchema({
    resolvers: [
      UserResolver,
      DocumentResolver
    ],
    emitSchemaFile: true,
    validate: false,
  });

  // Connect to DB
  const mongoURI = `mongodb://${MONGO_CONFIG.user}:${MONGO_CONFIG.password}@${MONGO_CONFIG.server}:${MONGO_CONFIG.port}/${MONGO_CONFIG.database}?authSource=admin&retryWrites=true&w=majority`;
  const mongoose = await connect(mongoURI)
  mongoose.connection;

  // Start Apollo/GraphQL Server
  const server = new ApolloServer({
    schema,
    resolvers: {
      Date: DateScalar
    },
    context: ({ req }) => {
      const context: ApolloContext = {
        req,
        user: req.user
      };
      return context;
    },
    plugins: mongoosePlugins
  });
  await server.start();
  server.applyMiddleware({ app });

  // Start express
  app.listen(process.env.EXPRESS_PORT || 8080, () => {
    console.log(`⚡️[server]: Server is running at ${process.env.BASE_URL}:${process.env.EXPRESS_PORT}`);
  });

  return app;
}

main()
  .then(app => {
    app.get("/", (req, res) => res.redirect(process.env.FRONTEND_URL || "https://scribe.local"));

    app.get("/patreon", confirmPatreonController);

    app.use((error: RequestError, req: Request, res: Response, next: NextFunction) => {
      console.error(error);
      const status = error.statusCode || 500;
      const message = error.message;
      const data = error.data;
      res.status(status).json({ message: message, data: data });
    });

    // minute(0-59), hour(0-23), day(1-31), month(1-12), weekday(0-7 - 0 & 7 is Sunday)
    schedule.scheduleJob("0 0 * * 1", () => { // every monday at 0:00 "0 0 * * 1"
      UserModel.find({ patreon: { $ne: null } })
        .then((users: DBUser[]) => {
          users.forEach(checkPatreonInformation);
        })
    });
  })
  .catch(e => {
    console.error(e);
  });