const express = require("express");
const { Testimonial, validate } = require("../model/testimonial");
const { User } = require("../model/user");
const auth = require("../middleware/auth");
const validateId = require("../middleware/validateid");
const validateBody = require("../middleware/validatebody");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  const testimonials = await Testimonial.find();
  res.send(testimonials);
});

router.get("/:id", [auth, validateId], async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);
  if (!testimonial) return res.status(404).send("testimonial not available");

  res.send(testimonial);
});

router.post("/", [auth, validateBody(validate)], async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).send("user not available");

  const testimonial = new Testimonial({
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
      profile: user.profile
    },
    message: req.body.message
  });
  await testimonial.save();
  res.send(testimonial);
});

router.delete("/:id", [auth, validateId], async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);
  if (!testimonial) return res.status(404).send("testimonial not available");

  const result = await Testimonial.deleteOne({ _id: req.params.id });
  res.send(result);
});

module.exports = router;
