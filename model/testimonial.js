const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const testimonialSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema({
      email: { type: String, required: true },
      name: { type: String, required: true },
      profile: { type: String, required: true }
    })
  },
  message: { type: String, required: true }
});

const Testimonial = mongoose.model("Testimonial", testimonialSchema);

function validate(body) {
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .required(),
    message: Joi.string()
      .max(100)
      .required()
  });
  return schema.validate(body);
}

module.exports.Testimonial = Testimonial;
module.exports.validate = validate;
