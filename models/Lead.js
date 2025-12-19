import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    preferredDate: String,
    notes: String,

    qualification: {
      ageGroup: String,
      hasHearingAid: String,
      issue: String,
      urgency: String,
    },
  },
  { timestamps: true }
);


export default mongoose.model("Lead", leadSchema);
