import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Name {
  @Field()
  _id: string;
  @Field()
  firstname: string;
  @Field()
  secondname: string;
}

@ObjectType()
export class User {
  @Field()
  _id: string;
  @Field()
  username: string;
  @Field()
  email: string;
  @Field()
  password: string;
}
@ObjectType()
export class CrudResponse {
  @Field()
  message: string;
  @Field()
  success: boolean;
}