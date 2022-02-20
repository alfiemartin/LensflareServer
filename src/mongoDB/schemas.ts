import mongoose from "mongoose";

export const nameSchema = new mongoose.Schema({
  firstname: String,
  secondname: String,
});

export const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  name: String,
});
