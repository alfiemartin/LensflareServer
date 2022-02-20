import { GraphQLScalarType } from "graphql";
import { Field, InputType, ObjectType, registerEnumType } from "type-graphql";

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
  @Field()
  name: string;
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
  name?: string;
  @Field({ nullable: true })
  sessionId?: string;
  @Field(() => [String], { nullable: true })
  data?: string[];
}

@InputType()
class AppleCredsFullName {
  @Field({ nullable: true })
  namePrefix: string;
  @Field({ nullable: true })
  givenName: string;
  @Field({ nullable: true })
  middleName: string;
  @Field({ nullable: true })
  familyName: string;
  @Field({ nullable: true })
  nameSuffix: string;
  @Field({ nullable: true })
  nickname: string;
}

@InputType()
export class AppleAuthenticationCredential {
  @Field((returns) => String, { nullable: true })
  user: string;
  @Field((returns) => String, { nullable: true })
  state: string;
  @Field((returns) => AppleCredsFullName, { nullable: true })
  fullName: AppleCredsFullName;
  @Field((returns) => String, { nullable: true })
  email: string;
  @Field((returns) => Number, { nullable: true })
  realUserStatus: number;
  @Field((returns) => String, { nullable: true })
  identityToken: string;
  @Field((returns) => String, { nullable: true })
  authorizationCode: string;
}
