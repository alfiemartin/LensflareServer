import { Resolver, Query, Ctx, Mutation, Arg } from "type-graphql";
import { Post } from "../../entity/Post";
import { TContext } from "../../types";

@Resolver(Post)
export class PostResolver {
  @Query(() => [Post])
  async getPosts(@Ctx() { dbConnection }: TContext) {
    const postRepository = dbConnection.getMongoRepository(Post);
    return dbConnection.manager.find(Post);
  }

  @Query(() => [Post])
  async getPostsWithinDistance(
    @Ctx() { dbConnection }: TContext,
    @Arg("long") long: number,
    @Arg("lat") lat: number,
    @Arg("distance") distance: number
  ) {
    const postRepository = dbConnection.getMongoRepository(Post);

    const postsWithinRadius = await postRepository.find({
      geometry: {
        $geoWithin: { $centerSphere: [[long, lat], distance / 6371] },
      },
    } as any);

    return postsWithinRadius;
  }

  @Mutation(() => [Post])
  async newPost(@Ctx() { dbConnection }: TContext) {
    const newPost = new Post();
    newPost.geometry = { coordinates: [-23.93414657, 10.82302903], type: "Point" };
    newPost.posterName = "test";

    await dbConnection.manager.insert(Post, newPost);

    return [newPost];
  }
}

//---
/*
const postRepository = dbConnection.getMongoRepository(Post);

  const intersects = await postRepository.find({
    geometry: {
      $geoIntersects: { $geometry: { type: "Point", coordinates: [-73.93414657, 40.82302903] } },
    },
  } as any);



  const inside = await postRepository.find({
    geometry: {
      $geoWithin: { $center: [[-73, 42], 10] },
    },
  } as any);
*/
