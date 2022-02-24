import { Field, ObjectType } from "type-graphql";
import { Entity, ObjectIdColumn, ObjectID, Column } from "typeorm";

@ObjectType()
export class Location {
  @Field()
  type: "Point";

  @Field((returns) => [Number, Number])
  coordinates: [number, number];
}

@Entity()
@ObjectType()
export class Post {
  @ObjectIdColumn()
  @Field(() => String, { nullable: true })
  id: ObjectID;

  @Column()
  @Field({ nullable: true })
  posterId: string;

  @Column()
  @Field({ nullable: true })
  posterName: string;

  @Column()
  @Field({ nullable: true })
  posterProfilePic: string;

  @Column()
  @Field((returns) => Location, { nullable: true })
  geometry: Location;
}
