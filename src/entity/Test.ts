import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class TestResponse {
  @Field()
  sessionId: string;
  @Field()
  success: boolean;
  @Field()
  message: string;
  @Field({ nullable: true })
  name: string;
}
