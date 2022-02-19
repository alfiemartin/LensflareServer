import { Request, Response } from "express";
import jwksRsa from "jwks-rsa";
import jwt from "jsonwebtoken";
import jwtDecode from "jwt-decode";
import axios from "axios";
import { userModel } from "./mongoDB/modals";
import { ITokenData, ITokenHeader, IAppleKey } from "./types";
import { User } from "./graphql/schema";
import { MemoryStore } from "express-session";
import MongoStore from "connect-mongo";

const createUser = async (tokenData: ITokenData) => {
  const username = tokenData.email;

  try {
    await userModel.create({ username, password: "apple", email: username });
  } catch (e) {
    throw new Error("could not create user");
  }
};

export const appleSignUp = async (req: Request, res: Response) => {
  res.send({ message: "signup was succesful" });
};

export const appleSignIn = async (req: Request, res: Response, store: MongoStore) => {
  //this code is only reached if user is already signed up
  //if we have a sessionId then set current session to sessionIds session data
  //send back this current sessionId for local save

  //if no sessionId then run below checks

  const token: string = req.body.identityToken;
  const sessionId: string | undefined = req.body.sessionId;

  console.log(req.session);

  if (sessionId) {
    store.get(sessionId, (err, session) => {
      console.log("old store", session);
      //set current session to previous session
      if (session) {
        store.set(req.sessionID, session, (err) => {});

        res.json({ message: "logged in", success: true });
      }
    });
  }

  console.log(req.session);

  // const decodedHeader: ITokenHeader = jwtDecode(token, { header: true });

  // const appleKeys: Array<IAppleKey> = await (
  //   await axios.get("https://appleid.apple.com/auth/keys")
  // ).data.keys;

  // const matchingKey = appleKeys.filter((key) => key.kid == decodedHeader.kid)[0];

  // const client = new jwksRsa.JwksClient({
  //   jwksUri: "https://appleid.apple.com/auth/keys",
  // });

  // const key = await client.getSigningKey(matchingKey.kid);
  // const signingKey = key.getPublicKey();

  // let verifiedTokenData: ITokenData;
  // try {
  //   verifiedTokenData = jwt.verify(token, signingKey) as ITokenData;
  // } catch (e) {
  //   res.send("error signing up with apple");
  //   throw new Error("Failed to verify token");
  // }

  // if (verifiedTokenData.iss != "https://appleid.apple.com") {
  //   res.send("error signing up with apple");
  //   throw new Error("issuer does not match");
  // }

  // const user: User = await userModel.findOne({
  //   username: verifiedTokenData.email,
  //   password: "apple",
  // });

  // console.log(user);

  // if (user) {
  //   req.session.userId = user._id;

  //   res.send({ message: "login successful", success: true, sessionId: req.session.id });
  // } else {
  //   res.send({ message: "could not find user", success: false });
  //   throw new Error("User does not exist");
  // }
};
