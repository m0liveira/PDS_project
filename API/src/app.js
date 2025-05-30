/* eslint-disable no-undef */
require("dotenv").config();
const app = require("express")();
const consign = require("consign");
const knex = require("knex");
const knexfile = require("../knexfile");
const cors = require("cors");

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.db = knex(knexfile.test);

consign({ cwd: "src", verbose: false })
  .include("./config/passport.js")
  .then("./config/authorization.js")
  .then("./config/middlewares.js")
  .then("./services")
  .then("./routes")
  .then("./config/routes.js")
  .into(app);

app.get("/", (req, res) => {
  res.status(200).send("Server is running!");
});

app.use((err, req, res, next) => {
  const { name, message, stack } = err;
  if (name === "ValidationError") res.status(400).json({ error: message });
  else res.status(500).json({ name, message, stack });
  next(err);
});

module.exports = app;

require("dotenv").config();
