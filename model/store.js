const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "./asset/store/",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

function checkFile(req, file, cb) {
  fileTypes = /jpeg|jpg|gif|png|jfif/;
  const test = fileTypes.test(path.extname(file.originalname).toLowerCase());
  if (test) cb(null, true);
  else cb("Error:Only images can be uploaded");
}

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    checkFile(req, file, cb);
  },
}).single("profile");

const storeSchema = mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  contact: { type: String, required: true },
  account: { type: String, required: true },
  country: { type: String, required: true },
  owner: {
    type: mongoose.Schema({
      email: { type: String, required: true },
      name: { type: String },
      profile: { type: String, required: true },
    }),
  },
  follows: { type: [String] },
  feedbacks: {
    type: [
      mongoose.Schema({
        name: { type: String },
        email: { type: String },
        profile: { type: String },
      }),
    ],
  },
  description: { type: String, required: true },
  profile: { type: String },
});

const Store = mongoose.model("Store", storeSchema);

function validate(body) {
  const schema = Joi.object({
    name: Joi.string().required(),
    address: Joi.string().required(),
    contact: Joi.string().required(),
    account: Joi.string().required(),
    country: Joi.string().required(),
    owner: Joi.string().email().required(),
    description: Joi.string().required(),
  });
  return schema.validate(body);
}

function validateFollows(body) {
  const schema = Joi.object({
    store: Joi.objectId().required(),
    user: Joi.string().email().required(),
  });
  return schema.validate(body);
}

function validateProfile(body) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });
  return schema.validate(body);
}

module.exports.Store = Store;
module.exports.validate = validate;
module.exports.upload = upload;
module.exports.follows = validateFollows;
module.exports.profile = validateProfile;
