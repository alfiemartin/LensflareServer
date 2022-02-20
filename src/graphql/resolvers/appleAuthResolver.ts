import { SessionData } from "express-session";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { IContext } from "../../types";
import { AppleAuthResponse } from "../schema";

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
  async appleSignIn(@Ctx() { req, res, store }: IContext, @Arg("sessionId") sessionId: string) {
    const response = new AppleAuthResponse();

    const token: string = req.body.identityToken;
    const clientSessionId: string | undefined = sessionId;
    const userId: string | undefined = req.body.userId;

    const getPrevSession = (clientSessionId: string) => {
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

    if (clientSessionId && clientSessionId != req.sessionID) {
      try {
        const prevSession = await getPrevSession(clientSessionId);

        req.session.userId = prevSession.userId;
        req.session.name = prevSession.name;

        response.success = true;
        response.message = "Successfully set session to previous session";
        response.sessionId = req.sessionID;
        response.data = [req.session.name ?? "no name"];

        //we are now logged in
        return response;
      } catch (e) {
        response.success = false;
        response.message = "error getting previous sesssion from client sessionID";
        response.data = ["clientSessionId: " + clientSessionId];
        return response;
      }
    }
  }
}
