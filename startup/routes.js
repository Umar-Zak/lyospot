const cors = require("cors");
const helmet = require("helmet");
const express = require("express");
const error = require("../middleware/error");
const user = require("../routes/user");
const store = require("../routes/store");
const category = require("../routes/category");
const shipping = require("../routes/shipping");
const product = require("../routes/product");
const order = require("../routes/order");
const wishlist = require("../routes/wishlist");
const testimonial = require("../routes/testimonial");

module.exports = (app) => {
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use("/assets", express.static("asset"));
  app.use("/api/user", user);
  app.use("/api/store", store);
  app.use("/api/categories", category);
  app.use("/api/shipping", shipping);
  app.use("/api/products", product);
  app.use("/api/orders", order);
  app.use("/api/wishlists", wishlist);
  app.use("/api/testimonials", testimonial);

  app.use(error);
};
