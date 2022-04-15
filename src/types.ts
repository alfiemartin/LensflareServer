import MongoStore from "connect-mongo";
import { Request, Response } from "express";
import { Connection } from "typeorm";
import { ObjectId } from "mongodb";

export interface ITokenData {
  iss: string;
  aud: string;
  exp: number;
  iat: number;
  sub: string;
  c_hash: string;
  email: string;
  email_verified: string;
  auth_time: number;
  nonce_supported: boolean;
}

export interface IAppleKey {
  kty: string;
  kid: string;
  use: string;
  alg: string;
  n: string;
  e: string;
}

export interface ITokenHeader {
  kid: string;
  alg: string;
}

export type TContext = { req: Request; res: Response; store: MongoStore; dbConnection: Connection };

export type RandomUser = {
  name: {
    title: string;
    first: string;
    last: string;
  };
  picture: string;
  id: string;
};
