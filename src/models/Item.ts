/**
 * Item schema for the Inventory Warehouse database.
 */
import { Schema, model, models } from "mongoose";

const ItemSchema = new Schema(
  {
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    quantity: { type: Number, required: true },
    company: { type: Schema.Types.ObjectId, ref: "Company", required: true },
  },
  { timestamps: true },
);

export default models.Item || model("Item", ItemSchema);
