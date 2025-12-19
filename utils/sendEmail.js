import SibApiV3Sdk from "sib-api-v3-sdk";

const sendEmail = async ({ to, subject, html }) => {
  try {
    const client = SibApiV3Sdk.ApiClient.instance;
    const apiKey = client.authentications["api-key"];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    await apiInstance.sendTransacEmail({
      sender: {
        email: process.env.EMAIL_FROM,
        name: "SoundBridge CRM",
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    });

    console.log("📧 Email sent via Brevo API");
  } catch (err) {
    console.error("❌ Brevo API email failed:", err.message);
  }
};

export default sendEmail;
