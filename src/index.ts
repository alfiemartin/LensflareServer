require("dotenv").config();
import "reflect-metadata";

import express from "express";
import session from "express-session";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import mongoose from "mongoose";
import { NameResolver, UserResolver } from "./graphql/resolvers";
import { buildSchema } from "type-graphql";
import * as path from "path";

const main = async () => {
  const DB_URI = process.env.DB_URI!;
  const app = express();

  const schema = await buildSchema({
    resolvers: [NameResolver, UserResolver],
    emitSchemaFile: path.resolve(__dirname, "schema.gql"),
  });

  app.use(cors());

  app.use(
    session({
      name: "mine",
      secret: "your mama",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        maxAge: 60 * 60 * 1000 * 24,
        httpOnly: true,
      },
    })
  );

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }): any => ({ req, res }),
  });
  await apolloServer.start();

  apolloServer.applyMiddleware({ app, path: "/graphql" });

  app.listen(4000, () => {
    console.log("server running on http://localhost:4000");
  });

  try {
    await mongoose.connect(DB_URI);
  } catch (error) {
    console.log("Error connecting to mongo db", error);
    return;
  }

  console.log("Successfully connected to mongo db");
};

main();
