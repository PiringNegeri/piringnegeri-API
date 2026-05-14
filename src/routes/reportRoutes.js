import express from "express";

import { createReport, getReports, getReportBySlug, deleteReport, requestHumanSupport } from "../controllers/reportController.js";
import { verifyToken } from "../middleware/auth.middleware.js";
const router = express.Router();

router.get("/", getReports);
router.get("/:slug", getReportBySlug);

router.post("/", verifyToken, createReport);

router.delete("/:id", verifyToken, deleteReport);

router.patch(
  "/:id/request-human",
  verifyToken,
  requestHumanSupport
);

export default router;