import { ObjectId } from "mongodb";
import { Field, ObjectType } from "type-graphql";
import { Entity, ObjectIdColumn, Column } from "typeorm";

@Entity()
@ObjectType()
export class User {
  constructor(user?: Partial<User>) {
    Object.assign(this, user);
  }

  @ObjectIdColumn()
  @Field(() => String)
  _id: ObjectId;

  @Column()
  @Field()
  username: string;

  @Column()
  @Field()
  email: string;

  @Column()
  @Field()
  password: string;

  @Column()
  @Field()
  name: string;
}
