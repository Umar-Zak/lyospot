const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const categorySchema = mongoose.Schema({
  title: { type: String, required: true }
});

const Category = mongoose.model("Category", categorySchema);

function validate(body) {
  const schema = Joi.object({
    title: Joi.string().required()
  });
  return schema.validate(body);
}

module.exports.Category = Category;
module.exports.validate = validate;
