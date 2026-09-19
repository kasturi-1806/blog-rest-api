const express = require("express");
const path = require("path");

const postRoutes = require("./routes/postRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

// Middleware for reading JSON request bodies
app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, "public")));

// API routes
app.use("/posts", postRoutes);

// Handle unknown API routes
app.use((req, res, next) => {
  if (req.path.startsWith("/posts")) {
    return res.status(404).json({
      message: "Route not found"
    });
  }

  res.status(404).send("Page not found");
});

// Error-handling middleware
app.use(errorMiddleware);

module.exports = app;