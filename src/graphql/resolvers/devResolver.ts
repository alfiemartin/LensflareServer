import { Resolver, Query, Ctx } from "type-graphql";
import { TestResponse } from "../../entity/Test";
import { User } from "../../entity/User";
import { TContext } from "../../types";
import { logEntity, logLog } from "../../utilities/logging";

@Resolver()
export class DevResolver {
  @Query((returns) => TestResponse)
  async test(@Ctx() { req, res, store }: TContext) {
    const sessionId = req.session.id;

    if (req.session.name) {
      req.session.name += "a";
    }

    const response = new TestResponse({
      message: "test endpoint",
      sessionId: sessionId,
      success: true,
      name: req.session.name,
    });

    logEntity(response);
    return response;
  }

  @Query((returns) => [User])
  async testMongo(@Ctx() { dbConnection }: TContext) {
    const User1 = await dbConnection.manager.find(User);

    return User1;
  }
}
