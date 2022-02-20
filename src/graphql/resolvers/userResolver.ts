import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { userModel } from "../../mongoDB/modals";
import { User, CrudResponse } from "../schema";
import * as argon2 from "argon2";

@Resolver(User)
export class UserResolver {
  @Query((returns) => [User])
  async users() {
    return userModel.find().exec();
  }

  @Mutation((returns) => CrudResponse)
  async createUser(
    @Arg("username") username: string,
    @Arg("password") password: string,
    @Arg("email") email: string,
    @Ctx() context: any
  ) {
    let hashedPassword;
    const response = new CrudResponse();

    const usernameAlreadyExists = await userModel.findOne({ username }).exec();
    const emailAlreadyExists = await userModel.findOne({ email }).exec();

    console.log(context.req.session);

    if (usernameAlreadyExists) {
      response.message = "username already exists";
      response.success = false;
      return response;
    }

    if (emailAlreadyExists) {
      response.message = "email already exists";
      response.success = false;
      return response;
    }

    try {
      hashedPassword = await argon2.hash(password);
    } catch (err) {
      console.log(err);
      response.message = `Could not create user ${err}`;
      response.success = false;
      return response;
    }

    try {
      await userModel.create({ username, password: hashedPassword, email });
    } catch (err) {
      console.log(err);
      response.message = `Could not create user ${err}`;
      response.success = false;
      return response;
    }

    response.message = `user ${username} successfully created`;
    response.success = true;

    return response;
  }
}
