import { expect, assert } from "chai";
import addHours from "date-fns/addHours";
import subHours from "date-fns/subHours";
import sinon from "sinon";
import { UserModel, User } from "../../../src/graphql/entities/user";
import { UserResolver } from "../../../src/graphql/resolvers/user-resolver";
import UserHelper from "../../../src/helper/user-helper";

describe("User Resolver", () => {

  let userResolver: UserResolver;
  let user: User;

  before(() => {
    userResolver = new UserResolver();

    user = new User();
    user.refreshToken = "token-for-refresh";
    user.refreshTokenExpireDate = addHours(new Date(), 10);

    sinon.stub(UserModel, "findById");

    sinon.stub(UserHelper, "generateToken");
    // @ts-ignore
    UserHelper.generateToken.returns("new-token");
  });

  after(() => {
    // @ts-ignore
    UserModel.findById.restore();
    // @ts-ignore
    UserHelper.generateToken.restore();
  })

  it("should return a new token", (done) => {
    // @ts-ignore
    UserModel.findById.returns(user);

    userResolver.getToken("user123", "token-for-refresh")
      .then(newToken => {
        expect(newToken).to.equal("new-token");
        done();
      })
      .catch(e => {
        done(e);
      });
  })

  it("should return an error if there is no user", (done) => {
    // @ts-ignore
    UserModel.findById.returns(null);

    userResolver.getToken("user123", "token-for-refresh")
      .then(newToken => {
        done(new Error("Got a token, but expected an error."));
      })
      .catch(e => {
        expect(e).to.be.an("error");
        expect(e).to.have.property("message", "No user found");
        done();
      });
  })

  it("should return an error if the refresh token is wrong", (done) => {
    // @ts-ignore
    UserModel.findById.returns(user);

    userResolver.getToken("user123", "wrong-token-for-refresh")
      .then(newToken => {
        done(new Error("Got a token, but expected an error."));
      })
      .catch(e => {
        expect(e).to.be.an("error");
        expect(e).to.have.property("message", "Invalid refresh token");
        done();
      });
  })

  it("should return an error if the refresh token is expired", (done) => {
    user.refreshTokenExpireDate = subHours(new Date(), 10);
    // @ts-ignore
    UserModel.findById.returns(user);

    userResolver.getToken("user123", "token-for-refresh")
      .then(newToken => {
        done(new Error("Got a token, but expected an error."));
      })
      .catch(e => {
        expect(e).to.be.an("error");
        expect(e).to.have.property("message", "Expired refresh token");
        done();
      });
  })
  
})