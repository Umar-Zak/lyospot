const express = require("express");
const { Category, validate } = require("../model/category");
const validateId = require("../middleware/validateid");
const validateBody = require("../middleware/validatebody");

const router = express.Router();

router.get("/", async (req, res) => {
  const categories = await Category.find();
  res.send(categories);
});

router.get("/:id", validateId, async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).send("category not available");

  res.send(category);
});

router.post("/", validateBody(validate), async (req, res) => {
  const category = new Category({ title: req.body.title });
  await category.save();
  res.send(category);
});

router.put("/:id", validateId, validateBody(validate), async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).send("category unavailable");

  category.title = req.body.title;
  await category.save();
  res.send(category);
});

router.delete("/:id", validateId, async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).send("category not available");

  const result = await Category.deleteOne({ _id: req.params.id });
  res.send(result);
});
module.exports = router;
