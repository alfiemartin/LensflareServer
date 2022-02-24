import axios from "axios";
import MongoStore from "connect-mongo";
import { SessionData } from "express-session";
import jwt from "jsonwebtoken";
import jwksRsa from "jwks-rsa";
import jwtDecode from "jwt-decode";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { AppleAuthenticationCredential, AppleAuthResponse } from "../../entity/AppleAuth";
import { User } from "../../entity/User";
import { IAppleKey, ITokenData, ITokenHeader, TContext } from "../../types";

const getPrevSession = (clientSessionId: string, store: MongoStore) => {
  return new Promise<SessionData>((resolve, reject) => {
    store.get(clientSessionId, (err, session) => {
      if (session) {
        resolve(session);
      } else {
        reject();
      }
    });
  });
};

@Resolver()
export class AppleAuthResolver {
  @Query((returns) => AppleAuthResponse)
  async test(@Ctx() { req, res, store }: TContext) {
    const response = new AppleAuthResponse();

    const sessionId = req.session.id;

    if (req.session.name) {
      req.session.name += "a";
    }

    response.message = "test endpoint";
    response.sessionId = sessionId;
    response.success = true;
    response.name = req.session.name;

    console.log(response);
    return response;
  }

  @Query((returns) => [User])
  async testMongo(@Ctx() { dbConnection }: TContext) {
    const User1 = await dbConnection.manager.find(User);

    return User1;
  }

  @Query((returns) => AppleAuthResponse)
  async appleSignIn(
    @Arg("credential") credential: AppleAuthenticationCredential,
    @Arg("sessionId", { nullable: true }) sessionId: string,
    @Ctx() { req, res, store, dbConnection }: TContext
  ) {
    const response = new AppleAuthResponse();
    const clientSessionId = sessionId;

    if (clientSessionId) {
      if (clientSessionId == req.sessionID) {
        response.success = true;
        response.sessionId = req.sessionID;
        response.name = req.session.name;
        response.message = "already logged in";

        return response;
      } else if (clientSessionId != req.sessionID) {
        try {
          const prevSession = await getPrevSession(clientSessionId, store);

          store.destroy(clientSessionId);

          req.session.userId = prevSession.userId;
          req.session.name = prevSession.name;

          response.success = true;
          response.message = "Successfully set session to previous session";
          response.sessionId = req.sessionID;
          response.name = req.session.name;
          //we are now logged in
          return response;
        } catch (e) {
          response.success = false;
          response.message = "error getting previous sesssion from client sessionID";
        }
      }
    }

    //if we are here then we have no client sessionID, so need to auth with apple..

    const token = credential.identityToken;

    const decodedHeader: ITokenHeader = jwtDecode(token, { header: true });

    const appleKeys: Array<IAppleKey> = await (
      await axios.get("https://appleid.apple.com/auth/keys")
    ).data.keys;

    const matchingKey = appleKeys.filter((key) => key.kid == decodedHeader.kid)[0];

    const client = new jwksRsa.JwksClient({
      jwksUri: "https://appleid.apple.com/auth/keys",
    });

    const key = await client.getSigningKey(matchingKey.kid);
    const signingKey = key.getPublicKey();

    let verifiedTokenData: ITokenData;
    try {
      verifiedTokenData = jwt.verify(token, signingKey) as ITokenData;
    } catch (e) {
      response.message = "Failed to verify token: ";
      response.success = false;

      return response;
    }

    if (verifiedTokenData.iss != "https://appleid.apple.com") {
      response.message = "Token issuer incorrect";
      response.success = false;

      return response;
    }

    const user = await dbConnection.manager.findOne(User, {
      username: verifiedTokenData.email,
      password: "apple",
    });

    if (user) {
      req.session.userId = user.id;
      response.message = "signed in successfully";
      response.success = true;
      response.sessionId = req.sessionID;
      response.name = user.name;
    } else {
      response.message = "failed to find user. User does not exist";
      response.success = false;
    }

    return response;
  }

  @Mutation((returns) => AppleAuthResponse)
  async appleSignUp(
    @Arg("credential") credential: AppleAuthenticationCredential,
    @Ctx() { req, res, store, dbConnection }: TContext
  ) {
    const response = new AppleAuthResponse();

    const token = credential.identityToken;

    const decodedHeader: ITokenHeader = jwtDecode(token, { header: true });

    const appleKeys: Array<IAppleKey> = await (
      await axios.get("https://appleid.apple.com/auth/keys")
    ).data.keys;

    const matchingKey = appleKeys.filter((key) => key.kid == decodedHeader.kid)[0];

    const client = new jwksRsa.JwksClient({
      jwksUri: "https://appleid.apple.com/auth/keys",
    });

    const key = await client.getSigningKey(matchingKey.kid);
    const signingKey = key.getPublicKey();

    let verifiedTokenData: ITokenData;
    try {
      verifiedTokenData = jwt.verify(token, signingKey) as ITokenData;
    } catch (e) {
      response.message = "Failed to verify token: ";
      response.success = false;

      return response;
    }

    if (verifiedTokenData.iss != "https://appleid.apple.com") {
      response.message = "Token issuer incorrect";
      response.success = false;

      return response;
    }

    const { email, fullName } = credential;

    try {
      const user = dbConnection.manager.create(User, {
        username: email ?? "alfie.martin@hotmail.co.uk",
        email: email ?? "alfie.martin@hotmail.co.uk",
        name: fullName.givenName ?? "alfie",
        password: "apple",
      });

      await dbConnection.manager.save(user);

      response.success = true;
      response.message = "successfully creatde new user";
      response.sessionId = req.sessionID;
      response.name = user.name;
      return response;
    } catch (e) {
      response.success = false;
      response.message = "failed to signup user";
      response.name = fullName.givenName;

      return response;
    }
  }
}
