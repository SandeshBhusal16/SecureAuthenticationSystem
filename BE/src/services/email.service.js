const nodemailer = require("nodemailer");

const SendMail = async (to, subject, html) => {
  try {
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOption = {
      from: "sman33927@gmail.com",
      subject,
      to,
      html,
    };
    const info = await transport.sendMail(mailOption);
  } catch (error) {
    console.log(error);

    next({
      msg: error,
    });
  }
};

module.exports = SendMail;
