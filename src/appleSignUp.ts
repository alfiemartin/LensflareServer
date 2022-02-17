import { Request, Response } from "express";
import jwksRsa from "jwks-rsa";
import jwt from "jsonwebtoken";
import jwtDecode from "jwt-decode";
import axios from "axios";
import { userModel } from "./mongoDB/modals";
import { ITokenData, ITokenHeader, IAppleKey } from "./types";

const createUser = async (tokenData: ITokenData) => {
  const username = tokenData.email;
  console.log(tokenData);
  try {
    await userModel.create({ username, password: "apple", email: username });
  } catch (e) {
    throw new Error("could not create user");
  }
};

export const appleSignUp = async (
  req: Request & {
    session: {
      name: string;
    };
  },
  res: Response
) => {
  const token: string = req.body.identityToken;

  console.log(req.session.name);

  const decodedHeader: ITokenHeader = jwtDecode(token, { header: true });

  const appleKeys: Array<IAppleKey> = await (
    await axios.get("https://appleid.apple.com/auth/keys")
  ).data.keys;

  const matchingKey = appleKeys.filter((key) => key.kid == decodedHeader.kid)[0];

  const client = new jwksRsa.JwksClient({
    jwksUri: "https://appleid.apple.com/auth/keys",
  });

  const key = await client.getSigningKey(matchingKey.kid);
  const signingKey = key.getPublicKey();

  let verifiedTokenData: ITokenData;
  try {
    verifiedTokenData = jwt.verify(token, signingKey) as ITokenData;
  } catch (e) {
    res.send("error signing up with apple");
    throw new Error("Failed to verify token");
  }

  if (verifiedTokenData.iss != "https://appleid.apple.com") {
    res.send("error signing up with apple");
    throw new Error("issuer does not match");
  }

  // createUser(verifiedTokenData);
  const sessionId = req.session.id;

  res.send({ message: "signup was succesful", sessionId: sessionId });
};
