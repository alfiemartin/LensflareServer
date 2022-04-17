import "dotenv/config";
import "reflect-metadata";
import express from "express";
import session from "express-session";
import cors from "cors";
import MongoStore from "connect-mongo";
import * as path from "path";
import * as cookieParser from "cookie-parser";
import { Connection, createConnection } from "typeorm";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server-express";
import { __Directive } from "graphql";
import { ObjectId } from "mongodb";
import { DevResolver, AppleAuthResolver, PostResolver, UserResolver } from "./graphql/resolvers";
import { badLog, goodLog, logLog } from "./utilities";

declare module "express-session" {
  interface SessionData {
    name: string | undefined;
    userId: string | ObjectId | undefined;
  }
}

const main = async () => {
  const DB_URI = process.env.DB_URI!;

  const app = express();
  let dbConnection: Connection;

  try {
    dbConnection = await createConnection();
  } catch (e) {
    badLog("could not connected to mongo db", e);
    return;
  }
  goodLog("connected to mongodb");

  const schema = await buildSchema({
    resolvers: [DevResolver, UserResolver, AppleAuthResolver, PostResolver],
    emitSchemaFile: path.resolve(__dirname, "gql_schema.gql"),
  });

  const secret = "jdnasdjsad883e3392jd29jd";

  app.use(cookieParser.default(secret));

  const store = MongoStore.create({
    mongoUrl: DB_URI,
  });

  app.use(
    session({
      name: "session",
      store: store,
      resave: true,
      secret: secret,
      saveUninitialized: true,
      cookie: {
        httpOnly: false,
        sameSite: "none",
        secure: true,
      },
    })
  );

  app.use(cors({ origin: "*", credentials: true }));
  app.use(express.json());

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res, store, dbConnection }),
  });
  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    path: "/graphql",
    cors: { origin: "*", credentials: true },
  });

  app.listen(4000, () => {
    goodLog("server running on http://localhost:4000/graphql");
  });

  app.get("/", (_, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
  });
};

main();
