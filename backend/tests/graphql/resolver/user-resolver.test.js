"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const addHours_1 = __importDefault(require("date-fns/addHours"));
const subHours_1 = __importDefault(require("date-fns/subHours"));
const sinon_1 = __importDefault(require("sinon"));
const user_1 = require("../../../src/graphql/entities/user");
const user_resolver_1 = require("../../../src/graphql/resolvers/user-resolver");
const user_helper_1 = __importDefault(require("../../../src/helper/user-helper"));
describe("User Resolver", () => {
    let userResolver;
    let user;
    before(() => {
        userResolver = new user_resolver_1.UserResolver();
        user = new user_1.User();
        user.refreshToken = "token-for-refresh";
        user.refreshTokenExpireDate = (0, addHours_1.default)(new Date(), 10);
        sinon_1.default.stub(user_1.UserModel, "findById");
        sinon_1.default.stub(user_helper_1.default, "generateToken");
        // @ts-ignore
        user_helper_1.default.generateToken.returns("new-token");
    });
    after(() => {
        // @ts-ignore
        user_1.UserModel.findById.restore();
        // @ts-ignore
        user_helper_1.default.generateToken.restore();
    });
    it("should return a new token", (done) => {
        // @ts-ignore
        user_1.UserModel.findById.returns(user);
        userResolver.getToken("user123", "token-for-refresh")
            .then(newToken => {
            (0, chai_1.expect)(newToken).to.equal("new-token");
            done();
        })
            .catch(e => {
            done(e);
        });
    });
    it("should return an error if there is no user", (done) => {
        // @ts-ignore
        user_1.UserModel.findById.returns(null);
        userResolver.getToken("user123", "token-for-refresh")
            .then(newToken => {
            done(new Error("Got a token, but expected an error."));
        })
            .catch(e => {
            (0, chai_1.expect)(e).to.be.an("error");
            (0, chai_1.expect)(e).to.have.property("message", "No user found");
            done();
        });
    });
    it("should return an error if the refresh token is wrong", (done) => {
        // @ts-ignore
        user_1.UserModel.findById.returns(user);
        userResolver.getToken("user123", "wrong-token-for-refresh")
            .then(newToken => {
            done(new Error("Got a token, but expected an error."));
        })
            .catch(e => {
            (0, chai_1.expect)(e).to.be.an("error");
            (0, chai_1.expect)(e).to.have.property("message", "Invalid refresh token");
            done();
        });
    });
    it("should return an error if the refresh token is expired", (done) => {
        user.refreshTokenExpireDate = (0, subHours_1.default)(new Date(), 10);
        // @ts-ignore
        user_1.UserModel.findById.returns(user);
        userResolver.getToken("user123", "token-for-refresh")
            .then(newToken => {
            done(new Error("Got a token, but expected an error."));
        })
            .catch(e => {
            (0, chai_1.expect)(e).to.be.an("error");
            (0, chai_1.expect)(e).to.have.property("message", "Expired refresh token");
            done();
        });
    });
});
//# sourceMappingURL=user-resolver.test.js.map