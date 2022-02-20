import { GraphQLScalarType } from "graphql";
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

@ObjectType()
export class AppleAuthResponse {
  @Field({ nullable: true })
  message?: string;
  @Field({ nullable: true })
  success?: boolean;
  @Field({ nullable: true })
  sessionId?: string;
  @Field(() => [String], { nullable: true })
  data?: string[];
}
