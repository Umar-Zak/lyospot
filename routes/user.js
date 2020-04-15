const express = require("express");
const bcrypt = require("bcrypt");
const {
  User,
  validate,
  upload,
  login,
  confirm,
  password,
} = require("../model/user");
const validateBody = require("../middleware/validatebody");
const auth = require("../middleware/auth");
const validateId = require("../middleware/validateid");
const admin = require("../middleware/admin");
const validateUpload = require("../middleware/validateuploads");
const email = require("../services/mail");
const router = express.Router();

router.get("/", [auth, admin], async (req, res) => {
  const users = await User.find();
  res.send(users);
});
//if some of your test fail in future it's because the admin middleare is been removed
router.get("/:id", [auth, validateId], async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).send("User not available");

  delete user.password;
  res.send(user);
});

router.get("/profile/me", auth, async (req, res) => {
  const user = await User.findOne({ email: req.user.email });
  res.send(user);
});

router.post("/login", validateBody(login), async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("email or password incorrect");

  const isValid = await bcrypt.compare(req.body.password, user.password);
  if (!isValid) return res.status(400).send("email or password incorrect");

  res.send(user.genAuthToken());
});

router.post("/confirm", validateBody(confirm), async (req, res) => {
  email(res, req.body.email, req.body.html);
});

router.post(
  "/confirm/password",
  [auth, validateBody(password)],
  async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("user not available");

    const isValid = await bcrypt.compare(req.body.password, user.password);
    if (!isValid) return res.status(400).send("password incorrect");

    res.send(user.genAuthToken());
  }
);

router.post(
  "/change/password",
  [auth, validateBody(password)],
  async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("user unavailable");

    const salt = await bcrypt.genSalt(15);
    user.password = await bcrypt.hash(req.body.password, salt);
    await user.save();
    res.send(user);
  }
);

router.post("/", validateBody(validate), async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered");

  const users = await User.find();

  user = new User({
    email: req.body.email,
    password: req.body.password,
    name: `User${users.length + 1}`,
  });
  const salt = await bcrypt.genSalt(15);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  res
    .header("x-auth-token", user.genAuthToken())
    .header("access-control-expose-headers", "x-auth-token")
    .send(user);
});

router.put(
  "/:id",
  [auth, validateId, validateUpload(upload)],
  async (req, res) => {
    let user = await User.findById(req.params.id);
    if (!user) return res.status(404).send("User not available");
    const { email, phone, address, gender, dob, name } = req.body;
    user = await User.findByIdAndUpdate(req.params.id, {
      $set: {
        email,
        name,
        phone: phone ? phone : "",
        address: address ? address : "",
        gender: gender ? gender : "",
        dob: dob ? dob : "",
        profile: req.file
          ? `/assets/user/${req.file.filename}`
          : "/assets/user/avatar.svg",
      },
    });
    res.send(user);
  }
);

router.delete("/:id", [auth, admin, validateId], async (req, res) => {
  let user = await User.findById(req.params.id);
  if (!user) return res.status(404).send("User not available");

  user = await User.deleteOne({ _id: req.params.id });
  res.send(user);
});

module.exports = router;
