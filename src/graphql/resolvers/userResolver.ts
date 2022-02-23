import { Resolver, Arg, Ctx, Mutation, Query } from "type-graphql";
import { Users } from "../../entity/Users";
import { TContext } from "../../types";

@Resolver(Users)
export class UsersResolver {
  @Query(() => [Users])
  async users(@Ctx() { dbConnection }: TContext) {
    return dbConnection.manager.find(Users);
  }
}
