const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const wishlistSchema = mongoose.Schema({
  user: {
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
      shippingFee: { type: Number },
    }),
  },
});

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

function validate(body) {
  const schema = Joi.object({
    useremail: Joi.string().email().required(),
    product: Joi.object(),
  });
  return schema.validate(body);
}

module.exports.Wishlist = Wishlist;
module.exports.validate = validate;
