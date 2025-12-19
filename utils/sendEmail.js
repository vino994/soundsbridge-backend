import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"SoundBridge CRM" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html,
    });

    console.log("📧 Client notification email sent");
  } catch (err) {
    console.error("❌ Email send failed:", err.message);
  }
};

export default sendEmail;
