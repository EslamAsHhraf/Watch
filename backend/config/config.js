require("dotenv").config();
const path = require("path");

module.exports = {
  development: {
    dialect: "sqlite",
    storage: path.join(__dirname, "../database_dev.sqlite"), // Store SQLite file in backend root
  },
  test: {
    dialect: "sqlite",
    storage: ":memory:", // Use in-memory DB for tests
  },
  production: {
    dialect: "sqlite",
    storage: process.env.DATABASE_URL || path.join(__dirname, "../database_dev.sqlite"), // Use env var or file for prod
    // Add any production-specific SQLite options here if needed
  },
};

