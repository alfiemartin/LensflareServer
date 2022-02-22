import mongoose from "mongoose";
import { nameSchema, userSchema } from "./schemas";

export const nameModel = mongoose.model("names", nameSchema);

export const userModel = mongoose.model("users", userSchema);
