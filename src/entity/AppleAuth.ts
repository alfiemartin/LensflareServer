import { ObjectType, Field, InputType } from "type-graphql";

@ObjectType()
export class CrudResponse {
  constructor(crudResponse?: Partial<CrudResponse>) {
    Object.assign(this, crudResponse);
  }

  @Field()
  message: string;
  @Field()
  success: boolean;
}

@ObjectType()
export class AppleAuthResponse {
  constructor(appleAuthResponse?: Partial<AppleAuthResponse>) {
    Object.assign(this, appleAuthResponse);
  }

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
  constructor(appleCredsFullName?: Partial<AppleCredsFullName>) {
    Object.assign(this, appleCredsFullName);
  }

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
  constructor(appleAuthenticationCredential?: Partial<AppleAuthenticationCredential>) {
    Object.assign(this, appleAuthenticationCredential);
  }

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
