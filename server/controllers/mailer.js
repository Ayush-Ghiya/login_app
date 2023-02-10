import nodemailer from "nodemailer";
import Mailgen from "mailgen";

import ENV from "../config.js";

let nodeConfig = {
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: ENV.EMAIL, // generated ethereal user
    pass: ENV.PASSWORD, // generated ethereal password
  },
};

let transporter = nodemailer.createTransport(nodeConfig);

let MailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Mailgen",
    link: "https://mailgen.js/",
  },
});

export const registerMail = async (req, res) => {
  const { username, userEmail, text, subject } = req.body;
  //body of the email
  var email = {
    body: {
      name: username,
      intro:
        text ||
        "Welcome to Code Blooded! We're very excited to have you on board.",
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };

  var emailBody = MailGenerator.generate(email);
  let message = {
    from: ENV.EMAIL, // sender address
    to: userEmail, // list of receivers
    subject: subject || "SignUp Successful", // Subject line
    html: emailBody,
  };
  //send mail
  await transporter
    .sendMail(message)
    .then(() => {
      return res
        .status(200)
        .send({ msg: "An email has been sent to your email id" });
    })
    .catch((error) => res.status(500).send({ error }));
};
