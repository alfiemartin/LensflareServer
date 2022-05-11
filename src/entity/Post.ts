import { Field, ObjectType } from "type-graphql";
import { Entity, ObjectIdColumn, Column, PrimaryGeneratedColumn } from "typeorm";
import { ObjectId } from "mongodb";

@ObjectType()
export class Location {
  constructor(location?: Partial<Location>) {
    Object.assign(this, location);
  }

  @Field()
  type: "Point";

  @Field((returns) => [Number, Number])
  coordinates: [number, number];
}

@Entity()
@ObjectType()
export class Post {
  constructor(post?: Partial<Post>) {
    Object.assign(this, post);
  }

  @ObjectIdColumn()
  @Field(() => String, { nullable: true })
  _id: ObjectId;

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
  @Field({ nullable: false })
  postImage: string;

  @Column()
  @Field((returns) => Location, { nullable: true })
  geometry: Location;
}
