const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const shippingSchema = mongoose.Schema({
  type: { type: String, required: true }
});

const Shipping = mongoose.model("Shipping", shippingSchema);

function validate(body) {
  const schema = Joi.object({
    type: Joi.string().required()
  });
  return schema.validate(body);
}

module.exports.Shipping = Shipping;
module.exports.validate = validate;
