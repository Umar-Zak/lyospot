const express = require("express");
const { Product, validate, upload } = require("../model/product");
const validateId = require("../middleware/validateid");
const validateBody = require("../middleware/validatebody");
const validateUpload = require("../middleware/validateuploads");
const auth = require("../middleware/auth");
const { Shipping } = require("../model/shipping");
const { Category } = require("../model/category");
const { Store } = require("../model/store");

const router = express.Router();

router.get("/", async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

router.get("/:id", validateId, async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).send("Product unavailable");

  res.send(product);
});

router.get("/product/:id", [auth, validateId], async (req, res) => {
  const products = await Product.find({ "store._id": req.params.id });
  res.send(products);
});

router.post(
  "/",
  [auth, validateUpload(upload), validateBody(validate)],
  async (req, res) => {
    const shipping = await Shipping.findById(req.body.shippingId);
    if (!shipping) return res.status(404).send("Shipping type not available");

    const category = await Category.findById(req.body.categoryId);
    if (!category) return res.status(404).send("Category unavailable");

    const store = await Store.findOne({ "owner.email": req.body.store });
    if (!store) return res.status(404).send("Store unavailable");

    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      quantity: req.body.quantity,
      description: req.body.description,
      shippingFee: req.body.shippingFee,
      store: {
        _id: store._id,
        name: store.name,
      },
      category: {
        _id: category._id,
        title: category.title,
      },
      shipping: {
        _id: shipping._id,
        type: shipping.type,
      },
      profile1: `/assets/product/${req.files["image1"][0].filename}`,
      profile2: `/assets/product/${req.files["image2"][0].filename}`,
      profile3: `/assets/product/${req.files["image3"][0].filename}`,
    });
    //
    //
    //
    //
    await product.save();
    res.send(product);
  }
);

router.put(
  "/:id",
  [auth, validateId, validateUpload(upload), validateBody(validate)],
  async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send("Product not available");

    const shipping = await Shipping.findById(req.body.shippingId);
    if (!shipping) return res.status(404).send("shipping type not available");

    const category = await Category.findById(req.body.categoryId);
    if (!category) return res.status(404).send("category not available");

    const store = await Store.findOne({ "owner.email": req.body.store });
    if (!store) return res.status(404).send("store not available");

    const result = await Product.findByIdAndUpdate(req.params.id, {
      $set: {
        name: req.body.name,
        price: req.body.price,
        quantity: req.body.quantity,
        description: req.body.description,
        shippingFee: req.body.shippingFee,
        store: {
          _id: store._id,
          name: store.name,
        },
        category: {
          _id: category._id,
          title: category.title,
        },
        shipping: {
          _id: shipping._id,
          type: shipping.type,
        },
        profile1: `/assets/product/${req.files["image1"][0].filename}`,
        profile2: `/assets/product/${req.files["image2"][0].filename}`,
        profile3: `/assets/product/${req.files["image3"][0].filename}`,
      },
    });
    //
    //
    //
    //

    res.send(result);
  }
);

router.delete("/:id", validateId, async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).send("Product unavailable");
  const result = await Product.deleteOne({ _id: req.params.id });
  res.send(result);
});

module.exports = router;
