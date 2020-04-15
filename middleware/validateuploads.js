module.exports = validator => {
  return (req, res, next) => {
    validator(req, res, err => {
      if (err) return res.status(400).send(err);
      next();
    });
  };
};
