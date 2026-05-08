const nodemailer = require("nodemailer");
require("dotenv").config();

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS?.replace(/\s/g, ""); // strip spaces from app password

if (!emailUser || !emailPass) {
  console.error("❌ EMAIL_USER or EMAIL_PASS is missing from environment variables");
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error("❌ Email transporter error:", error.message);
  } else {
    console.log(`✅ Email transporter ready (sending as ${emailUser})`);
  }
});

exports.sendShareEmail = async (recipient, link) => {
  const mailOptions = {
    from: `"PDF Collaborator" <${emailUser}>`,
    to: recipient,
    subject: "You have been invited to view a PDF",
    html: `
      <p>You have been invited to view a shared PDF.</p>
      <p><a href="${link}">Click here to view the PDF</a></p>
      <p>Or copy this link: ${link}</p>
    `,
    text: `You have been invited to view a shared PDF.\n\nClick the link to view it: ${link}`,
  };

  console.log(`📤 Attempting to send email to: ${recipient}`);
  const info = await transporter.sendMail(mailOptions);
  console.log(`✅ Email sent to ${recipient}: ${info.response}`);
};
