import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import leadRoutes from "./routes/leadRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();

/* =========================
   ✅ CORS CONFIG (FIXED)
========================= */
const allowedOrigins = [
  "http://localhost:5173",
  "https://soundsbridge.netlify.app", // ❌ no trailing slash
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// 🔑 Handle preflight requests
app.options("*", cors());

/* =========================
   MIDDLEWARE
========================= */
app.use(express.json());

/* =========================
   ROUTES
========================= */
app.use("/api/leads", leadRoutes);
app.use("/api/admin", adminRoutes);

/* =========================
   DB CONNECTION
========================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

/* =========================
   SERVER
========================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
