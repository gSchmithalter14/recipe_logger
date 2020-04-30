const nodemailer = require('nodemailer');

const sendEmail = async options => {
  //create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  //define email options
  const mailOptions = {
    from: 'Recipe Logger App <recipe-logger@mail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
    // html:
  };

  //send the email with nodemailer
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
