import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

export async function saveLeadToGoogleSheet(lead) {
  try {
    const sheets = google.sheets({
      version: "v4",
      auth: await auth.getClient(),
    });

    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    const headers = [
      "Name",
      "Email",
      "Phone",
      "Preferred Date",
      "Age Group",
      "Has Hearing Aid",
      "Issue",
      "Urgency",
      "Created At",
    ];

    // 🔹 Check if header already exists
    const headerCheck = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Sheet1!A1:I1",
    });

    if (!headerCheck.data.values || headerCheck.data.values.length === 0) {
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: "Sheet1!A1",
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [headers],
        },
      });
    }

    // 🔹 Insert Lead Row
    await sheets.spreadsheets.values.append({
      spreadsheetId,
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
          new Date().toLocaleString("en-IN"),
        ]],
      },
    });

    console.log("✅ Google Sheet updated successfully");
  } catch (err) {
    console.error("❌ Google Sheet save failed:", err.message);
  }
}
