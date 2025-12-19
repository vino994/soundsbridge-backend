import express from "express";
import { createLead, getAllLeads , exportLeadsExcel ,deleteLead} from "../controllers/leadController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Public – user form
router.post("/", createLead);

// Protected – admin
router.get("/", auth, getAllLeads);
router.delete("/:id", auth, deleteLead);

router.get("/export/excel", auth, exportLeadsExcel);
export default router;
