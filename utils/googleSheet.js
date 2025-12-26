import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

export async function saveLeadToGoogleSheet(lead) {
  try {
    console.log("📄 Google Sheet save started");

    const sheets = google.sheets({
      version: "v4",
      auth: await auth.getClient(),
    });

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Sheet1!A:I",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          lead.name || "",
          lead.email || "",
          lead.phone || "",
          lead.preferredDate || "",
          lead.qualification?.ageGroup || "",
          lead.qualification?.hasHearingAid || "",
          lead.qualification?.issue || "",
          lead.qualification?.urgency || "",
          new Date().toISOString(),
        ]],
      },
    });

    console.log("✅ Google Sheet updated successfully");
  } catch (err) {
    console.error(
      "❌ Google Sheet save failed:",
      err.response?.data || err.message
    );
  }
}
