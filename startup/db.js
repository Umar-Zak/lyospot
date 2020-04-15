const config = require("config");
const mongoose = require("mongoose");

module.exports = () => {
  mongoose
    .connect(config.get("db"))
    .then((r) => console.log(`Connected to ${config.get("db")}`))
    .catch((e) => console.log("failed to connect"));
};
