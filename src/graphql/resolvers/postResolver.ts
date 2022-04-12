import { Resolver, Query, Ctx, Mutation, Arg } from "type-graphql";
import { getOneOrMinusOne, getRandomPic, getRandomUser } from "../../utilities/mockData";
import { Post } from "../../entity/Post";
import { TContext } from "../../types";

@Resolver(Post)
export class PostResolver {
  @Query(() => [Post])
  async getPosts(@Ctx() { dbConnection }: TContext) {
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

  @Mutation(() => Post)
  async createRandomPost(@Ctx() { dbConnection }: TContext) {
    const newPost = new Post();
    const [randomLong, randomLat] = [
      getOneOrMinusOne() * Math.random() * 180,
      getOneOrMinusOne() * Math.random() * 90,
    ];
    const randomUser = await getRandomUser();
    const randomPic = await getRandomPic();

    newPost.geometry = { coordinates: [randomLong, randomLat], type: "Point" };
    newPost.posterName = randomUser.name.first;
    newPost.posterProfilePic = randomUser.picture;
    newPost.postImage = randomPic;

    await dbConnection.manager.insert(Post, newPost);

    return newPost;
  }
}
