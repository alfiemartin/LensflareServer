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
import jwtDecode, { JwtHeader } from "jwt-decode";
import axios from "axios";
const jwksClient = require("jwks-rsa");
const jwt = require("jsonwebtoken");

const main = async () => {
  const DB_URI = process.env.DB_URI!;
  const app = express();

  const schema = await buildSchema({
    resolvers: [NameResolver, UserResolver],
    emitSchemaFile: path.resolve(__dirname, "schema.gql"),
  });

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
    res.send("test endpoint get successful");
  });

  app.post("/appleSignUp", async (req, res) => {
    const token = req.body.identityToken;

    const decodedHeader: { kid: string; alg: string } = jwtDecode(token, { header: true });

    const keys: Array<any> = await (
      await axios.get("https://appleid.apple.com/auth/keys")
    ).data.keys;

    const matchingKey = keys.filter((key) => key.kid == decodedHeader.kid)[0];

    const client = jwksClient({
      jwksUri: "https://appleid.apple.com/auth/keys",
    });

    const key = await client.getSigningKey(matchingKey.kid);
    const signingKey = key.getPublicKey();

    let verifiedTokenData;
    try {
      verifiedTokenData = jwt.verify(token, signingKey);
    } catch (e) {
      res.send("error signing up with apple");
      throw new Error("Failed to verify token");
    }

    if (verifiedTokenData.iss != "https://appleid.apple.com") {
      res.send("error signing up with apple");
      throw new Error("issuer does not match");
    }

    res.send({ message: "signup was succesful", ...verifiedTokenData });
  });

  try {
    await mongoose.connect(DB_URI);
  } catch (error) {
    console.log("Error connecting to mongo db", error);
  }

  console.log("Successfully connected to mongo db");
};

main();
