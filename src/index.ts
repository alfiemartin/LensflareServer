import "dotenv/config";
import "reflect-metadata";
import express from "express";
import session from "express-session";
import cors from "cors";
import MongoStore from "connect-mongo";
import { createConnection, ObjectID } from "typeorm";
import { buildSchema } from "type-graphql";
import * as path from "path";
import * as cookieParser from "cookie-parser";
import { UsersResolver } from "./graphql/resolvers/userResolver";
import { ApolloServer } from "apollo-server-express";
import { AppleAuthResolver } from "./graphql/resolvers/appleAuthResolver";

declare module "express-session" {
  interface SessionData {
    name: string | undefined;
    userId: string | ObjectID | undefined;
  }
}

const main = async () => {
  const DB_URI = process.env.DB_URI!;

  const app = express();

  const dbConnection = await createConnection();

  console.log("connected to mongodb database");

  const schema = await buildSchema({
    resolvers: [UsersResolver, AppleAuthResolver],
    emitSchemaFile: path.resolve(__dirname, "gql_schema.gql"),
  });

  const secret = "hdsahdhsbdasd";

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
        secure: false,
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
    console.log("server running on http://localhost:4000");
  });

  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
  });
};

main();
