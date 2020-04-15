const express = require("express");
const { Shipping, validate } = require("../model/shipping");
const validateId = require("../middleware/validateid");
const validateBody = require("../middleware/validatebody");
const router = express.Router();

router.get("/", async (req, res) => {
  const shippings = await Shipping.find();
  res.send(shippings);
});

router.get("/:id", validateId, async (req, res) => {
  const shipping = await Shipping.findById(req.params.id);
  if (!shipping) return res.status(404).send("shipping not available");

  res.send(shipping);
});

router.post("/", validateBody(validate), async (req, res) => {
  const shipping = new Shipping({ type: req.body.type });
  await shipping.save();
  res.send(shipping);
});

router.put("/:id", [validateId, validateBody(validate)], async (req, res) => {
  const shipping = await Shipping.findById(req.params.id);
  if (!shipping) return res.status(404).send("shipping not available");

  shipping.type = req.body.type;
  await shipping.save();
  res.send(shipping);
});

router.delete("/:id", validateId, async (req, res) => {
  const shipping = await Shipping.findById(req.params.id);
  if (!shipping) return res.status(404).send("shipping not available");

  const result = await Shipping.deleteOne({ _id: req.params.id });
  res.send(result);
});

module.exports = router;
