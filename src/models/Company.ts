/**
 * Company schema for the Inventory Warehouse database.
 */
import { Schema, model, models } from "mongoose";

const CompanySchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    admins: [{ type: Schema.Types.ObjectId, ref: "User" }],
    employees: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
);

export default models.Company || model("Company", CompanySchema);
