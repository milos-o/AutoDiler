require("dotenv").config();
const nodemailer = require("nodemailer");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const user = process.env.USER;
const pass = process.env.PASSWORD;


process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: user,
    pass: pass,
  },
});

module.exports.sendConfirmationEmail = (name, email, confirmationCode) => {
  transport.sendMail({
    from: user,
    to: email,
    subject: "Please confirm your account",
    html: `<h1>Email Confirmation</h1>
        <h2>Hello ${name}</h2>
        <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
        <a href=${process.env.API_URL}/confirm/${confirmationCode}> Click here</a>
        </div>`,
  }).catch(err => console.log(err));
};

module.exports.passwordResetLink = (email, resetCode) => {
  transport.sendMail({
    from: user,
    to: email,
    subject: "Password reset",
    html: `
    <p>You requested a password reset</p>
    <p>Click this <a href="${process.env.API_URL}/reset/${resetCode}">link</a> to set a new password.</p>
  `,
  }).catch(err => console.log(err));
};