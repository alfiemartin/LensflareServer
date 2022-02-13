import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { nameModel, userModel } from "../mongoDB/modals";
import { CrudResponse, Name, User } from "./schema";
import * as argon2 from "argon2";

@Resolver(Name)
export class NameResolver {
  
  @Query(returns => [Name])
  async names() {
    return nameModel.find().exec();
  }

  @Query(returns => Name)
  async name(@Arg("firstname") firstname: string, @Ctx() context: any) {
    console.log(context.req.session);

    return nameModel.findOne({firstname}).exec();
  }

  @Mutation(returns => CrudResponse)
  async addName(@Arg("firstname") firstname: string, @Arg("secondname") secondname: string ) {
    const userAlreadyExists = await nameModel.findOne({firstname, secondname}).exec();
    const response = new CrudResponse();

    if (userAlreadyExists) {
      response.message = "Failed to create user. Already exists";
      response.success = false;
      return response;
    }

    try {
      await nameModel.create({firstname, secondname});
    } catch(err) {
      response.message = "error creating user"
      return response;
    }
    
    response.message = `Successfully created user ${firstname} ${secondname}`;
    response.success = true;
    return response;
  }
}

@Resolver(User)
export class UserResolver {
  
  @Query(returns => [User])
  async users() {
    return userModel.find().exec();
  }

  @Mutation(returns => CrudResponse)
  async createUser(@Arg("username") username: string, @Arg("password") password: string, @Arg("email") email: string, @Ctx() context: any) {
    let hashedPassword;
    const response = new CrudResponse();

    const usernameAlreadyExists = await userModel.findOne({username}).exec();
    const emailAlreadyExists = await userModel.findOne({email}).exec();

    console.log(context.req.session);

    if(usernameAlreadyExists) {
      response.message = "username already exists";
      response.success = false;
      return response;
    }

    if(emailAlreadyExists) {
      response.message = "email already exists";
      response.success = false;
      return response;
    }

    try {
      hashedPassword = await argon2.hash(password);
    } catch(err) {
      console.log(err);
      response.message = `Could not create user ${err}`;
      response.success = false;
      return response;
    }

    try {
      await userModel.create({username, password: hashedPassword, email});
    } catch(err) {
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