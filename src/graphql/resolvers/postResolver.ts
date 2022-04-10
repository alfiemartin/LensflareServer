import { Resolver, Query, Ctx, Mutation } from "type-graphql";
import { getMongoRepository } from "typeorm";
import { Post } from "../../entity/Post";
import { TContext } from "../../types";

@Resolver(Post)
export class PostResolver {
  @Query(() => [Post])
  async getPosts(@Ctx() { dbConnection }: TContext) {
    return dbConnection.manager.find(Post);
  }

  @Mutation(() => [Post])
  async newPost(@Ctx() { dbConnection }: TContext) {
    const newPost = new Post();
    newPost.geometry = { coordinates: [-104.9903, 39.7392], type: "Point" };
    newPost.posterName = "test";

    await dbConnection.manager.insert(Post, newPost);

    return [newPost];
  }
}
