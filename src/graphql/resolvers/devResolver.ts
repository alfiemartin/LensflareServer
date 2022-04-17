import { Resolver, Query, Ctx } from "type-graphql";
import { TestResponse } from "../../entity/Test";
import { User } from "../../entity/User";
import { TContext } from "../../types";
import { logEntity, logLog } from "../../utilities/logging";
import _ from "lodash";

@Resolver()
export class DevResolver {
  @Query((returns) => TestResponse)
  async test(@Ctx() { req, res, store }: TContext) {
    const response = new TestResponse();

    const sessionId = req.session.id;

    if (req.session.name) {
      req.session.name += "a";
    }

    response.message = "test endpoint";
    response.sessionId = sessionId;
    response.success = true;
    response.name = req.session.name;

    logEntity(response);
    return response;
  }

  @Query((returns) => [User])
  async testMongo(@Ctx() { dbConnection }: TContext) {
    const User1 = await dbConnection.manager.find(User);

    return User1;
  }
}
