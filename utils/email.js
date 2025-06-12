const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = `HotelEase <no-reply@hotelease.com>`;
  }

  async send(subject, html) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
    };
    await transporter.sendMail(mailOptions);
  }

  async sendPasswordReset() {
    await this.send(
      "Your password reset token (valid for 10 min)",
      `<p>Hello ${this.firstName},</p>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${this.url}">${this.url}</a>
      <p>If you did not request this, please ignore this email.</p>`
    );
  }

  async sendBookingConfirmation(booking) {
    const html = `<h2>Booking Confirmation</h2>
      <p>Dear ${this.to.split("@")[0]},</p>
      <p>Your booking is confirmed!</p>
      <ul>
        <li><b>Room:</b> ${booking.room}</li>
        <li><b>Check-in:</b> ${new Date(
          booking.startDate
        ).toLocaleDateString()}</li>
        <li><b>Check-out:</b> ${new Date(
          booking.endDate
        ).toLocaleDateString()}</li>
        <li><b>Total Price:</b> $${booking.price}</li>
      </ul>
      <p>Thank you for choosing HotelEase!</p>`;
    await this.send("Your Booking is Confirmed!", html);
  }
}

module.exports = Email;
