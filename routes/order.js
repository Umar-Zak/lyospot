const express = require("express");
const { Order, validate } = require("../model/order");
const { Rejected } = require("../model/rejectedOrder");
const { User } = require("../model/user");
const { Product } = require("../model/product");
const auth = require("../middleware/auth");
const validateBody = require("../middleware/validatebody");
const validateId = require("../middleware/validateid");
const processPayment = require("../services/payment");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  const orders = await Order.find();
  res.send(orders);
});

router.get("/:id", [auth, validateId], async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).send("Order not available");

  res.send(order);
});

router.get("/sellers/rejects", auth, async (req, res) => {
  const rejects = await Rejected.find();
  res.send(rejects);
});

router.get("/customer/:id", auth, async (req, res) => {
  const orders = await Order.find({ "boughtBy._id": req.params.id });
  res.send(orders);
});

router.get("/sales/:id", [auth, validateId], async (req, res) => {
  const orders = await Order.find({ "product.store._id": req.params.id });
  res.send(orders);
});

router.get("/sellers/rejects/:id", [auth, validateId], async (req, res) => {
  const reject = await Rejected.findById(req.params.id);
  if (!reject) res.status(404).send("This history is no longer available");
  res.send(reject);
});

// router.post("/sellers/rejects", async (req, res) => {
//   const reject = new Rejected(req.body.order);
//   await reject.save();
//   res.send("Done");
// });

router.post("/", [auth, validateBody(validate)], async (req, res) => {
  let order;
  const { orderCode, address, orderBy, products } = req.body;
  const user = await User.findOne({ email: orderBy });
  if (!user) return res.status(404).send("user not available");

  for (var i = 0; i < products.length; i++) {
    order = new Order({
      orderCode,
      address,
      boughtBy: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
      product: products[i],
    });
    await order.save();
    const product = await Product.findById(products[i]._id);
    product.sold += products[i].quantity;
    product.quantity -= products[i].quantity;
    await product.save();
  }
  res.send(order);
});

router.put("/shipping/:id", async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, {
    $set: {
      status: "In Transit",
      tracking: "none",
    },
  });
  if (!order) return res.status(404).send("Order not available");

  res.send(order);
});

router.put("/received/:id", async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, {
    $set: {
      status: "Delivered",
    },
  });
  if (!order) return res.status(404).send("Order not available");

  res.send(order);
});

router.delete("/:id", [auth, validateId], async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).send("order not available");

  const reject = new Rejected({
    orderCode: order.orderCode,
    address: order.address,
    orderBy: order.orderBy,
    status: order.status,
    boughtBy: order.boughtBy,
    product: order.product,
  });
  await reject.save();
  const result = await Order.deleteOne({ _id: req.params.id });
  res.send(result);
});

module.exports = router;
