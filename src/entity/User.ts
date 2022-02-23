import { Field, ObjectType } from "type-graphql";
import { Entity, ObjectIdColumn, ObjectID, Column } from "typeorm";

@Entity()
@ObjectType()
export class User {
  @ObjectIdColumn()
  @Field(() => String)
  id: ObjectID;

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
