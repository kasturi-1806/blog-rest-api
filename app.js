const express = require("express");
const path = require("path");
const postRoutes = require("./routes/postRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/posts", postRoutes);
app.use((req, res, next) => {
  if (req.path.startsWith("/posts")) {
    return res.status(404).json({
      message: "Route not found"
    });
  }
  res.status(404).send("Page not found");
});
app.use(errorMiddleware);
module.exports = app;
