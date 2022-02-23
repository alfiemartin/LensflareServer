import { Resolver, Arg, Ctx, Mutation, Query } from "type-graphql";
import { User } from "../../entity/User";
import { TContext } from "../../types";

@Resolver(User)
export class UserResolver {
  @Query(() => [User])
  async User(@Ctx() { dbConnection }: TContext) {
    return dbConnection.manager.find(User);
  }
}
