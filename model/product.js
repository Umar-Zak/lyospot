const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "./asset/product/",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

function checkFile(req, file, cb) {
  const fileType = /jpeg|jpg|png|gif|jfif/;
  const test = fileType.test(path.extname(file.originalname).toLowerCase());
  if (test) cb(null, true);
  else cb("Error:file must be Image");
}
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    checkFile(req, file, cb);
  },
}).fields([
  { name: "image1", maxCount: 1 },
  { name: "image2", maxCount: 1 },
  { name: "image3", maxCount: 1 },
  { name: "image4", maxCount: 1 },
]);

const productSchema = mongoose.Schema({
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
  sold: { type: Number, default: 0 },
  profile1: { type: String, required: true },
  profile2: { type: String, required: true },
  profile3: { type: String, required: true },
  profile4: { type: String },
  shippingFee: { type: Number, default: true },
});

const Product = mongoose.model("Product", productSchema);

function validate(body) {
  const schema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    quantity: Joi.number().required(),
    store: Joi.string().email().required(),
    categoryId: Joi.objectId().required(),
    shippingId: Joi.objectId().required(),
    description: Joi.string(),
    specs: Joi.string(),
    shippingFee: Joi.number(),
  });
  return schema.validate(body);
}

module.exports.Product = Product;
module.exports.validate = validate;
module.exports.upload = upload;
