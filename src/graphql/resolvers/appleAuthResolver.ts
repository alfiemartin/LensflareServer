import axios from "axios";
import { SessionData } from "express-session";
import { GraphQLInputObjectType } from "graphql";
import jwtDecode from "jwt-decode";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { IAppleKey, IContext, ITokenHeader } from "../../types";
import { AppleAuthenticationCredential, AppleAuthResponse } from "../schema";

@Resolver()
export class AppleAuthResolver {
  @Query((returns) => AppleAuthResponse)
  async test(@Ctx() { req, res, store }: IContext) {
    const response = new AppleAuthResponse();

    const sessionId = req.session.id;
    console.log(req.session);

    store.get(sessionId, (err, session) => {
      console.log(session);

      const newSessionData = session;

      if (newSessionData && newSessionData.name) newSessionData.name += "a";

      if (newSessionData) store.set(sessionId, newSessionData);
    });

    if (!req.session.name) req.session.name = "alfie";

    response.message = "test endpoint";
    response.sessionId = sessionId;
    response.success = true;
    response.data = [req.session.name];

    return response;
  }

  @Mutation((returns) => AppleAuthResponse)
  async appleSignIn(
    @Ctx() { req, res, store }: IContext,
    @Arg("sessionId") sessionId: string,
    @Arg("credential") credential: AppleAuthenticationCredential
  ) {
    const response = new AppleAuthResponse();

    return response;
    // const clientSessionId: string | undefined = sessionId;

    // const getPrevSession = (clientSessionId: string) => {
    //   return new Promise<SessionData>((resolve, reject) => {
    //     store.get(clientSessionId, (err, session) => {
    //       if (session) {
    //         resolve(session);
    //       } else {
    //         reject();
    //       }
    //     });
    //   });
    // };

    // if (clientSessionId && clientSessionId != req.sessionID) {
    //   try {
    //     const prevSession = await getPrevSession(clientSessionId);

    //     req.session.userId = prevSession.userId;
    //     req.session.name = prevSession.name;

    //     response.success = true;
    //     response.message = "Successfully set session to previous session";
    //     response.sessionId = req.sessionID;
    //     response.data = [req.session.name ?? "no name"];

    //     //we are now logged in
    //     return response;
    //   } catch (e) {
    //     response.success = false;
    //     response.message = "error getting previous sesssion from client sessionID";
    //     response.data = ["clientSessionId: " + clientSessionId];
    //     // return response;
    //   }
    // }

    //if we are here then we have no client sessionID, so need to auth with apple..
    // const token = credentials.identityToken;

    // const decodedHeader: ITokenHeader = jwtDecode(token, { header: true });

    // const appleKeys: Array<IAppleKey> = await (
    //   await axios.get("https://appleid.apple.com/auth/keys")
    // ).data.keys;

    // const matchingKey = appleKeys.filter((key) => key.kid == decodedHeader.kid)[0];

    // const client = new jwksRsa.JwksClient({
    //   jwksUri: "https://appleid.apple.com/auth/keys",
    // });

    // const key = await client.getSigningKey(matchingKey.kid);
    // const signingKey = key.getPublicKey();

    // let verifiedTokenData: ITokenData;
    // try {
    //   verifiedTokenData = jwt.verify(token, signingKey) as ITokenData;
    // } catch (e) {
    //   res.send("error signing up with apple");
    //   throw new Error("Failed to verify token");
    // }

    // if (verifiedTokenData.iss != "https://appleid.apple.com") {
    //   res.send("error signing up with apple");
    //   throw new Error("issuer does not match");
    // }

    // const user: User = await userModel.findOne({
    //   username: verifiedTokenData.email,
    //   password: "apple",
    // });

    // console.log(user);

    // if (user) {
    //   req.session.userId = user._id;

    //   res.send({ message: "login successful", success: true, sessionId: req.session.id });
    // } else {
    //   res.send({ message: "could not find user", success: false });
    //   throw new Error("User does not exist");
    // }
  }
}
