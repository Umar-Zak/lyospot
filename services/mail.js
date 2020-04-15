const nodemailer = require("nodemailer");

module.exports = (res, email, link) => {
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "umarabanga78@gmail.com",
      pass: "0556681693",
    },
  });
  const mailOptions = {
    from: "umarabanga78@gmail.com",
    to: email,
    subject: "Thanks for choosing us",
    text: "Click on the link below to confirm your signup",
    html: `<a href=${link} >Click here to confirm your email</a>`,
  };

  transport.sendMail(mailOptions, (err, info) => {
    if (err) return res.status(400).send(err);
    res.send("Success");
  });
};
