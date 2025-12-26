import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    preferredDate: {
      type: String,
      default: "",
    },

    notes: {
      type: String,
      default: "",
    },

    qualification: {
      ageGroup: {
        type: String,
        default: "",
      },
      hasHearingAid: {
        type: String,
        default: "",
      },
      issue: {
        type: String,
        default: "",
      },
      urgency: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);

// 🔹 Index for admin sorting (latest first)
leadSchema.index({ createdAt: -1 });

export default mongoose.model("Lead", leadSchema);
