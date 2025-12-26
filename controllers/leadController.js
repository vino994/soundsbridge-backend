import Lead from "../models/Lead.js";
import XLSX from "xlsx";
import sendEmail from "../utils/sendEmail.js";
import { saveLeadToGoogleSheet } from "../utils/googleSheet.js";

/* =========================
   CREATE LEAD
========================= */
export const createLead = async (req, res) => {
  try {
    const lead = await Lead.create(req.body);

    // 📧 Send notification email (non-blocking)
    sendEmail({
      to: process.env.CLIENT_NOTIFICATION_EMAIL,
      subject: "New Consultation Request - SoundBridge",
      html: `
        <h3>New Lead Received</h3>
        <p><strong>Name:</strong> ${lead.name}</p>
        <p><strong>Email:</strong> ${lead.email}</p>
        <p><strong>Phone:</strong> ${lead.phone}</p>
        <p><strong>Preferred Date:</strong> ${lead.preferredDate || "-"}</p>

        ${
          lead.qualification
            ? `
          <h4>Qualification</h4>
          <p>Age Group: ${lead.qualification.ageGroup || "-"}</p>
          <p>Uses Hearing Aid: ${lead.qualification.hasHearingAid || "-"}</p>
          <p>Issue: ${lead.qualification.issue || "-"}</p>
          <p>Urgency: ${lead.qualification.urgency || "-"}</p>
        `
            : ""
        }

        <p>Please login to admin panel for full details.</p>
      `,
    });

    // 📊 Google Sheets CRM (DO NOT BLOCK RESPONSE)
   console.log("👉 calling saveLeadToGoogleSheet with:", lead.email);
await saveLeadToGoogleSheet(lead);
console.log("👉 saveLeadToGoogleSheet finished");


    res.status(201).json({ msg: "Lead saved successfully" });
  } catch (err) {
    console.error("❌ Save error:", err);
    res.status(500).json({ msg: "Failed to save lead" });
  }
};

/* =========================
   GET ALL LEADS (ADMIN)
========================= */
export const getAllLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    console.error("❌ Fetch error:", err);
    res.status(500).json({ msg: "Failed to fetch leads" });
  }
};

/* =========================
   DELETE LEAD (ADMIN)
========================= */
export const deleteLead = async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ msg: "Lead deleted" });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ msg: "Delete failed" });
  }
};

/* =========================
   EXPORT LEADS TO EXCEL
========================= */
export const exportLeadsExcel = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 }).lean();

    const data = leads.map((l) => ({
      Name: l.name,
      Email: l.email,
      Phone: l.phone,
      PreferredDate: l.preferredDate,
      Notes: l.notes,
      AgeGroup: l.qualification?.ageGroup || "",
      HearingAid: l.qualification?.hasHearingAid || "",
      Issue: l.qualification?.issue || "",
      Urgency: l.qualification?.urgency || "",
      CreatedAt: l.createdAt,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");

    const buffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=leads.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(buffer);
  } catch (err) {
    console.error("❌ Excel export error:", err);
    res.status(500).json({ msg: "Excel export failed" });
  }
};
