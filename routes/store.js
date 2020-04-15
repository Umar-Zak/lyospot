const express = require("express");
const { Store, validate, upload, follows, profile } = require("../model/store");
const { User } = require("../model/user");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateId = require("../middleware/validateid");
const validateBody = require("../middleware/validatebody");
const validateUpload = require("../middleware/validateuploads");
const sms = require("../services/sms");
const router = express.Router();

router.get("/", [auth, admin], async (req, res) => {
  const stores = await Store.find();
  res.send(stores);
});

router.get("/:id", validateId, async (req, res) => {
  const store = await Store.findById(req.params.id);
  if (!store) return res.status(404).send("store not available");

  res.send(store);
});

router.get("/user/:id", [auth, validateId], async (req, res) => {
  const store = await Store.findOne({ "owner._id": req.params.id });
  res.send(store);
});

router.post("/confirm", auth, async (req, res) => {
  sms(req.body.receiver, res, req.body.message);
});

router.post(
  "/",
  [auth, validateUpload(upload), validateBody(validate)],
  async (req, res) => {
    const user = await User.findOne({ email: req.body.owner });
    if (!user) return res.status(404).send("User not available");
    const { name, address, contact, account, country, description } = req.body;
    const store = new Store({
      name,
      contact,
      address,
      account,
      country,
      description,
      owner: {
        _id: user._id,
        email: user.email,
        name: user.name,
        profile: user.profile,
      },
      profile: req.file
        ? `/assets/store/${req.file.filename}`
        : "/assets/store/store.svg",
    });
    await store.save();
    user.hasStore = true;
    user.storeName = store.name;
    await user.save();
    res
      .header("x-auth-token", user.genAuthToken())
      .header("access-control-expose-headers", "x-auth-token")
      .send(store);
  }
);

router.post("/profile", [auth, validateBody(profile)], async (req, res) => {
  const store = await Store.findOne({ "owner.email": req.body.email });
  if (!store) return res.status(404).send("Store not available");

  res.send(store);
});

router.post("/follow", [auth, validateBody(follows)], async (req, res) => {
  const store = await Store.findById(req.body.store);
  if (!store) return res.status(404).send("store not available");

  store.follows.push(req.body.user);
  await store.save();
  res.send(store);
});

router.put(
  "/:id",
  [auth, validateId, validateBody(validate)],
  async (req, res) => {
    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).send("store unavailable");

    const user = await User.findOne({ email: req.body.owner });
    if (!user) return res.status(404).send("User not available");
    const { name, contact, country, address, description, account } = req.body;
    const result = await Store.findByIdAndUpdate(req.params.id, {
      $set: {
        name,
        contact,
        address,
        country,
        account,
        description,
        owner: {
          _id: user._id,
          email: user.email,
          name: user.name,
          profile: user.profile,
        },
      },
    });
    res.send(result);
  }
);

router.delete("/:id", [auth, validateId], async (req, res) => {
  const store = await Store.findById(req.params.id);
  if (!store) return res.status(404).send("store not available");

  const result = await Store.deleteOne({ _id: req.params.id });
  res.send(result);
});

module.exports = router;
