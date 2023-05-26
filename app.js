const express = require("express");
const cors = require("cors");
const logger = require("logger");
const app = express();
const heroRouter = require("./routes/Hero");

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/hero", heroRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  console.log(err);
  const message = err.message;
  const code = err.status || 500;
  res.status(code).json({ message });
});
