/* 
  Seed for the Inventory Warehouse application.
  This script will populate the Mongo database with dummy data for users, companies, and items.

  to run this type in terminal: npx tsx src/seed.ts 
*/

import "dotenv/config";
import mongoose from "mongoose";
import Company from "./models/Company";
import Item from "./models/Item";
import User from "./models/User";

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI!);

  // Clear existing data so the seed is repeatable
  await Promise.all([
    User.deleteMany({}),
    Company.deleteMany({}),
    Item.deleteMany({}),
  ]);

  const user = await User.create({
    name: "Jane Doe",
    email: "jane.doe@example.com",
    username: "janedoe",
    password: "password123",
  });

  const company = await Company.create({
    name: "Acme Warehousing",
    slug: "acme-warehousing",
    admins: [user._id],
    employees: [],
  });

  const items = Array.from({ length: 1000 }, (_, i) => ({
    name: `Item ${i + 1}`,
    sku: `SKU${i + 1}`,
    quantity: Math.floor(Math.random() * 50) + 1,
    company: company._id,
  }));

  await Item.insertMany(items);

  console.log(`Seeded 1 user, 1 company, and ${items.length} items`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
