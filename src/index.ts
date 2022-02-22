require("dotenv").config();
import "reflect-metadata";

import express, { Request } from "express";
import session from "express-session";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import mongoose from "mongoose";
import { AppleAuthResolver, NameResolver, UserResolver } from "./graphql/resolvers";
import { buildSchema } from "type-graphql";
import * as path from "path";
var cookieParser = require("cookie-parser");
import MongoStore from "connect-mongo";

declare module "express-session" {
  interface SessionData {
    name: string | undefined;
    userId: string | undefined;
  }
}

const main = async () => {
  const DB_URI = process.env.DB_URI!;
  const app = express();

  const schema = await buildSchema({
    resolvers: [NameResolver, UserResolver, AppleAuthResolver],
    emitSchemaFile: path.resolve(__dirname, "schema.gql"),
  });
  const secret = "hdsahdhsbdasd";

  app.use(cookieParser(secret));

  const store = MongoStore.create({
    mongoUrl: DB_URI,
  });

  app.use(
    session({
      name: "mine",
      store: store,
      resave: true,
      secret: secret,
      saveUninitialized: true,
      cookie: {
        httpOnly: false,
        sameSite: "none",
        secure: false,
      },
    })
  );

  app.use(cors({ origin: "*", credentials: true }));
  app.use(express.json());

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res, store }),
  });
  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    path: "/graphql",
    cors: { origin: "*", credentials: true },
  });

  app.listen(4000, () => {
    console.log("server running on http://localhost:4000");
  });

  try {
    await mongoose.connect(DB_URI);
  } catch (error) {
    console.log("Error connecting to mongo db", error);
  }

  console.log("Successfully connected to mongo db");
};

main();
