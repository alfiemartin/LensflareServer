import { Resolver, Query, Ctx, Mutation } from "type-graphql";
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
    newPost.geometry = { coordinates: [-73.93414657, 40.82302903], type: "Point" };
    newPost.posterName = "test";

    await dbConnection.manager.insert(Post, newPost);

    return [newPost];
  }
}

//---

/*
const postRepository = dbConnection.getMongoRepository(Post);

  const inside = await postRepository.find({
    geometry: {
      $geoIntersects: { $geometry: { type: "Point", coordinates: [-73.93414657, 40.82302903] } },
    },
  } as any);
  */
