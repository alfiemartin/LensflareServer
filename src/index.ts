require("dotenv").config();
import "reflect-metadata";

import express, { Request } from "express";
import session, { MemoryStore } from "express-session";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import mongoose from "mongoose";
import { NameResolver, UserResolver } from "./graphql/resolvers";
import { buildSchema } from "type-graphql";
import * as path from "path";
import { appleSignUp } from "./appleSignUp";
var cookieParser = require("cookie-parser");

const main = async () => {
  const DB_URI = process.env.DB_URI!;
  const app = express();

  const schema = await buildSchema({
    resolvers: [NameResolver, UserResolver],
    emitSchemaFile: path.resolve(__dirname, "schema.gql"),
  });
  const secret = "hdsahdhsbdasd";

  app.use(cookieParser(secret));

  app.use(
    session({
      name: "mine",
      store: new MemoryStore(),
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
    context: ({ req, res }) => ({ req, res }),
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

  app.get("/test", (req, res) => {
    const sessionId = req.session.id;

    res.send({ message: "test endpoint", sessionId: sessionId });
  });

  app.post("/appleSignUp", (req, res) =>
    appleSignUp(req as Request & { session: { name: string } }, res)
  );

  try {
    await mongoose.connect(DB_URI);
  } catch (error) {
    console.log("Error connecting to mongo db", error);
  }

  console.log("Successfully connected to mongo db");
};

main();
