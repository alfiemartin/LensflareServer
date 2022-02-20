import { Ctx, Query, Resolver } from "type-graphql";
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
}
