const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');
const catchAsync = require('./catchAsync');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Anuj Sharma <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDPLATEFORM_USER,
          pass: process.env.SENDPLATEFORM_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
      host: 'smtp.mailtrap.io',
      port: 587, // 587 is commonly used for STARTTLS
      secure: false, // For STARTTLS, this should be false
      auth: {
        user: process.env.MAILTRAP_USER, // Ensure this is correctly set in your .env file
        pass: process.env.MAILTRAP_PASS,
      },
    });
  }

  async send(template, subject) {
    //Send the actual email
    //1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    //2) Define the email options
    const mailOptions = {
      from: this.from, // Invalid sender email
      to: this.to,
      subject,
      html,
      text: htmlToText.convert(html),
    };

    //3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)',
    );
  }
};
