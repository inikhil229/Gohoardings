const { createPool } = require("mysql2");
const ErrorHandle = require("../utils/Errorhandler");

// Database configurations for multiple countries
const dbConfig = {
  IN: {
    user: "root",
    // host: "80.209.238.62",
    host: "localhost",
    password: process.env.DbPass,
    database: "gohoardi_goh",
    connectionLimit: 20,
    waitForConnections: true,
    queueLimit: 100,
    multipleStatements: true,
  },
  AE: {
    user: "root",
    // host: "80.209.238.62",
    host: "localhost",
    password: process.env.DbPass,
    database: "goh_dubai",
    connectionLimit: 20,
    waitForConnections: true,
    queueLimit: 100,
    multipleStatements: true,
  },
  // ZA: { user: "root", host: "127.0.0.1", password: process.env.DbPass, database: "goh_south_africa", connectionLimit: 20, waitForConnections: true, queueLimit: 100, multipleStatements: true },
  CRM: {
    user: "root",
    // host: "80.209.238.62",
    host: "localhost",
    password: process.env.DbPass,
    database: "gohoardi_crmapp",
    connectionLimit: 20,
    waitForConnections: true,
    queueLimit: 100,
    multipleStatements: true,
  },
};

// Create database pools
const dbPools = Object.fromEntries(
  Object.entries(dbConfig).map(([key, config]) => [key, createPool(config)]),
);

// Get the correct database pool
const getDatabasePool = (countryCode) => {
  if (!countryCode) {
    console.warn("No countryCode provided. Defaulting to 'IN'.");
    return dbPools["IN"];
  }

  const selectedCountry = countryCode.toUpperCase();
  if (!dbPools[selectedCountry]) {
    throw new Error(
      `Invalid countryCode: '${countryCode}'. Valid options: ${Object.keys(dbPools).join(", ")}`,
    );
  }

  return dbPools[selectedCountry];
};

// Execute SQL queries
const executeQuery = (query, params = [], countryCode, next) => {
  return new Promise((resolve, reject) => {
    const dbPool = getDatabasePool(countryCode);
    dbPool.getConnection((err, connection) => {
      if (err) {
        console.error("Database connection error:", err);
        return reject(new ErrorHandle(err, "Database connection error", 500));
      }

      connection.query(query, params, (err, results) => {
        connection.release();
        if (err) {
          console.error("Database query error:", err);
          if (typeof next === "function") {
            next(new ErrorHandle(err, "Database query execution error", 500));
          }
          return reject(
            new ErrorHandle(err, "Database query execution error", 500),
          );
        }
        resolve(results);
      });
    });
  });
};

// Graceful shutdown
const closeConnections = async () => {
  console.log("Closing database connections...");
  Object.values(dbPools).forEach((pool) =>
    pool.end((err) => {
      if (err) console.error("Error closing pool:", err);
    }),
  );
  process.exit();
};

process.on("SIGINT", closeConnections);
process.on("uncaughtException", async (err) => {
  console.error("Uncaught Exception:", err);
  await closeConnections();
});

process.on("unhandledRejection", async (reason) => {
  console.error("Unhandled Promise Rejection:", reason);
  await closeConnections();
});

module.exports = { executeQuery };
