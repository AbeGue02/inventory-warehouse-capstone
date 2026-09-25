/**
 * User schema for the Inventory Warehouse database.
 */
import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true },
);

export default models.User || model("User", UserSchema);
