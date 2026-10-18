#!/usr/bin/env node
// Usage: npm run setup-env [-- --force] [-- --uri=<mongodb-uri>]
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const envPath = path.join(__dirname, "..", ".env"); // Path to the .env file
const force = process.argv.includes("--force"); // Check if the --force flag is used to overwrite the existing .env file
const uriArg = process.argv.find((a) => a.startsWith("--uri=")); // Find the --uri argument if used
const mongoUri = uriArg
  ? uriArg.slice("--uri=".length) // Extract the URI value from the argument
  : "mongodb://127.0.0.1:27017/InventoryWarehouse"; // Use the provided URI or default to the local MongoDB instance

// Check if the .env file already exists and if the --force flag is not used,
// exit the script to prevent overwriting.
if (fs.existsSync(envPath) && !force) {
  console.log(".env already exists. Use --force to overwrite it.");
  process.exit(0);
}

const content = `# Variables in this file are only used by the server application and not the client application.

# MongoDB connection URI for the server application.
# MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority
MONGODB_URI=${mongoUri}

# Randomly generated secret for JWT authentication
JWT_SECRET=${crypto.randomBytes(64).toString("hex")} 
JWT_EXPIRES_IN=1d
`;

// Write the .env file with the generated content and
// set its permissions to be readable and writable only by the owner. (mode 0o600)
fs.writeFileSync(envPath, content, { mode: 0o600 });
console.log(".env created with a new JWT_SECRET.");
