const mongoose = require("mongoose");

const schema = mongoose.Schema({
  orderCode: { type: String, required: true },
  orderDate: { type: Date, default: Date.now() },
  address: { type: String, required: true },
  status: { type: String, default: "Rejected" },
  boughtBy: {
    type: mongoose.Schema({
      email: { type: String, required: true },
    }),
  },
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
      shippingFee: { type: Number },
    }),
  },
});

const Rejected = mongoose.model("Reject", schema);

module.exports.Rejected = Rejected;
