require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");
const authRoutes = require("./routes/auth");

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes (adjust origins in production)
app.use(express.json()); // Parse JSON request bodies

// Basic Route
app.get("/", (req, res) => {
  res.send("Secure Video Viewer Backend API");
});

// Auth Routes
app.use("/api/auth", authRoutes);



// Global Error Handler (Basic Example)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const PORT = process.env.PORT || 5001;

// Sync database and start server
async function startServer() {
  try {
    // Use authenticate() for connection check, sync() is not needed if using migrations
    await sequelize.authenticate();
    console.log("Database connection established successfully.");

    // Optional: Run migrations programmatically if needed (usually done via CLI)
    // const { Umzug, SequelizeStorage } = require("umzug");
    // const umzug = new Umzug({
    //   migrations: { glob: "migrations/*.js" },
    //   context: sequelize.getQueryInterface(),
    //   storage: new SequelizeStorage({ sequelize }),
    //   logger: console,
    // });
    // await umzug.up();
    // console.log("Migrations applied successfully.");

    // Start the server after successful DB connection
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Unable to start server:", error);
    process.exit(1); // Exit if DB connection or migration fails
  }
}

startServer();

