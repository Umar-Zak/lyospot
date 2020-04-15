const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
  let token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Unauthorised");
  try {
    token = jwt.verify(token, config.get("secretKey"));
    req.user = token;
    next();
  } catch (err) {
    res.status(403).send("Access denied");
  }
};

//