const nodemailer = require('nodemailer');
const pug = require('pug');
const { htmlToText } = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = process.env.EMAIL_FROM;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Sendgrid transporter
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }
    return nodemailer.createTransport({
      //1) Create a transporter
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    //Send the actual email
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      }
    );
    //2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(html),
      // html:
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes'
    );
  }
};

/*
//1) Create a transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
    //Activate in gmail "less secure app" option
  });
  
  //2) Define the email options
  //3) Send the email
};
*/

const sendEmail = async (options) => {
  //2) Define the email options

  //Send the email
  await transporter.sendMail(mailOptions);
};
