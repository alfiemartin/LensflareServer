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
import { appleSignIn, appleSignUp } from "./appleSignUp";
var cookieParser = require("cookie-parser");

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
    resolvers: [NameResolver, UserResolver],
    emitSchemaFile: path.resolve(__dirname, "schema.gql"),
  });
  const secret = "hdsahdhsbdasd";

  app.use(cookieParser(secret));

  const store = new MemoryStore();

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
    console.log(sessionId);

    store.get(sessionId, (err, session) => {
      console.log(session);

      const newSessionData = session;
      if (newSessionData && newSessionData.name) newSessionData.name += "a";

      if (newSessionData) store.set(sessionId, newSessionData);
    });

    //can get sessionId from body
    //this will be saved to keychain
    //access session through store.get
    //can probably just set the new session each time to the saved session on server

    if (!req.session.name) req.session.name = "alfie";

    res.send({ message: "test endpoint", sessionId: sessionId });
  });

  app.post("/appleSignIn", appleSignIn);

  try {
    await mongoose.connect(DB_URI);
  } catch (error) {
    console.log("Error connecting to mongo db", error);
  }

  console.log("Successfully connected to mongo db");
};

main();
