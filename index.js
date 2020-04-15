const express = require("express");
const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);
require("express-async-errors");

const app = express();
require("./startup/db")();
require("./startup/routes")(app);

app.get("/", (req, res) => {
  res.send("Hello World");
});
const Port = process.env.PORT || 5000;
const server = app.listen(Port, () =>
  console.log(`Now listening to port ${Port}`)
);

module.exports = server;
