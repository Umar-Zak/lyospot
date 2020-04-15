const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const orderSchema = mongoose.Schema({
  orderCode: { type: String, required: true },
  orderDate: { type: Date, default: Date.now() },
  address: { type: String, required: true },
  boughtBy: {
    type: mongoose.Schema({
      email: { type: String, required: true },
      name: { type: String },
    }),
  },
  status: { type: String, default: "Order received" },
  tracking: { type: String, default: "" },
  product: {
    type: mongoose.Schema({
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      store: {
        type: mongoose.Schema({
          name: { type: String, required: true },
        }),
      },
      category: {
        type: mongoose.Schema({
          title: { type: String },
        }),
      },
      shipping: {
        type: mongoose.Schema({
          type: { type: String },
        }),
      },
      description: { type: String },
      specs: { type: String },
      sold: { type: Number },
      profile1: { type: String, required: true },
      profile2: { type: String, required: true },
      profile3: { type: String, required: true },
      profile4: { type: String },
      amount: { type: Number },
      shippingFee: { type: Number, default: 0 },
    }),
  },
});

const Order = mongoose.model("Order", orderSchema);

function validate(body) {
  const schema = Joi.object({
    orderCode: Joi.string().required(),
    orderBy: Joi.string().email().required(),
    address: Joi.string().required(),
    products: Joi.array().required(),
  });
  return schema.validate(body);
}

module.exports.Order = Order;
module.exports.validate = validate;
