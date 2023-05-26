const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const app = express();
require("dotenv").config();
const heroRouter = require("./routes/heroRoute");

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api", heroRouter);

app.use((__, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, __, res, next) => {
  console.log(err);
  const message = err.message;
  const code = err.status || 500;
  res.status(code).json({ message });
});

module.exports = app;
