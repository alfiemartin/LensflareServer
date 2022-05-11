import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class TestResponse {
  constructor(testResponse?: Partial<TestResponse>) {
    Object.assign(this, testResponse);
  }

  @Field()
  sessionId: string;
  @Field()
  success: boolean;
  @Field()
  message: string;
  @Field({ nullable: true })
  name: string;
}
