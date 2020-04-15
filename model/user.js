const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const config = require("config");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "./asset/user/",
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

const userSchema = mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String },
  password: { type: String, required: true },
  dob: { type: String, default: "" },
  profile: { type: String, default: "/assets/user/avatar.svg" },
  gender: { type: String, default: "" },
  phone: { type: String, default: "" },
  isAdmin: { type: Boolean, default: false },
  following: { type: Array },
  address: { type: String, default: "" },
  hasStore: { type: Boolean, default: false },
  storeName: { type: String },
});

userSchema.methods.genAuthToken = function () {
  return jwt.sign(
    {
      email: this.email,
      name: this.name,
      isAdmin: this.isAdmin,
      hasStore: this.hasStore,
      storeName: this.storeName,
      _id: this._id,
    },
    config.get("secretKey")
  );
};

const User = mongoose.model("User", userSchema);

function validate(body) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string(),
    dob: Joi.string(),
    gender: Joi.string(),
    phone: Joi.string().min(10).max(15),
    address: Joi.string(),
  });
  return schema.validate(body);
}

function validateLogin(body) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  return schema.validate(body);
}

function validateConfirm(body) {
  const schema = Joi.object({
    html: Joi.string().required(),
    email: Joi.string().email().required(),
  });
  return schema.validate(body);
}

function validateConfirmPassword(body) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  return schema.validate(body);
}

module.exports.User = User;
module.exports.validate = validate;
module.exports.upload = upload;
module.exports.login = validateLogin;
module.exports.confirm = validateConfirm;
module.exports.password = validateConfirmPassword;
