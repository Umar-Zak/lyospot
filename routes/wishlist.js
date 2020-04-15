const express = require("express");
const { Wishlist } = require("../model/wishlist");
const { User } = require("../model/user");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateId = require("../middleware/validateid");

const router = express.Router();

router.get("/", [auth, admin], async (req, res) => {
  const wishlists = await Wishlist.find();
  res.send(wishlists);
});

router.get("/:id", [auth, validateId], async (req, res) => {
  const wishlist = await Wishlist.findById(req.params.id);
  if (!wishlist) return res.status(404).send("wishlist not available");

  res.send(wishlist);
});

router.get("/user/:id", [auth, validateId], async (req, res) => {
  const wishlist = await Wishlist.find({ "user._id": req.params.id });
  res.send(wishlist);
});

router.post("/", [auth], async (req, res) => {
  const user = await User.findOne({ email: req.body.useremail });
  if (!user) return res.status(404).send("User not available");
  const { product, id } = req.body;
  const wishlist = new Wishlist({
    user: {
      _id: user._id,
      email: user.email,
    },
    product: {
      _id: id,
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      category: {
        _id: product.category._id,
        title: product.category.title,
      },
      shipping: {
        _id: product.shipping._id,
        type: product.shipping.type,
      },
      store: {
        _id: product.store._id,
        name: product.store.name,
      },
      description: product.description,
      profile1: product.profile1,
      profile2: product.profile2,
      profile3: product.profile3,
      shippingFee: product.shippingFee,
    },
  });
  await wishlist.save();
  res.send(wishlist);
});

router.delete("/:id", [auth, validateId], async (req, res) => {
  const wishlist = await Wishlist.findById(req.params.id);
  if (!wishlist) return res.status(404).send("wishlist not available");

  const result = await Wishlist.deleteOne({ _id: req.params.id });
  res.send(result);
});

router.delete("/user/:id", [auth, validateId], async (req, res) => {
  const wishlist = await Wishlist.find({ "product._id": req.params.id });
  if (wishlist.length === 0)
    return res.status(404).send("wishlist not available");

  const result = await Wishlist.deleteOne({ "product._id": req.params.id });
  res.send(result);
});

module.exports = router;
