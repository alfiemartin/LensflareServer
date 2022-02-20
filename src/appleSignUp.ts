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
