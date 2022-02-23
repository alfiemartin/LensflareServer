import MongoStore from "connect-mongo";
import { Request, Response } from "express";
import { Connection } from "typeorm";

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
