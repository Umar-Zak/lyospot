const config = require("config");
const accountSid = config.get("accountSid");
const auth = config.get("auth");
const twilio = require("twilio")(accountSid, auth);
module.exports = (receiver, res, message) => {
  twilio.messages
    .create({
      body: message,
      from: "+12017621753",
      to: receiver,
    })
    .then((result) => res.send("success"))
    .catch((ex) => res.status(400).send(ex));
};
