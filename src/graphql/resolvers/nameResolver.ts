import { Resolver, Arg, Ctx, Mutation, Query } from "type-graphql";
import { nameModel } from "../../mongoDB/modals";
import { Name, CrudResponse } from "../schema";

@Resolver(Name)
export class NameResolver {
  @Query((returns) => [Name])
  async names() {
    return nameModel.find().exec();
  }

  @Query((returns) => Name)
  async name(@Arg("firstname") firstname: string, @Ctx() context: any) {
    console.log(context.req.session);

    return nameModel.findOne({ firstname }).exec();
  }

  @Mutation((returns) => CrudResponse)
  async addName(@Arg("firstname") firstname: string, @Arg("secondname") secondname: string) {
    const userAlreadyExists = await nameModel.findOne({ firstname, secondname }).exec();
    const response = new CrudResponse();

    if (userAlreadyExists) {
      response.message = "Failed to create user. Already exists";
      response.success = false;
      return response;
    }

    try {
      await nameModel.create({ firstname, secondname });
    } catch (err) {
      response.message = "error creating user";
      return response;
    }

    response.message = `Successfully created user ${firstname} ${secondname}`;
    response.success = true;
    return response;
  }
}
