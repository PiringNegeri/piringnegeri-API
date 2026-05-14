import express from "express";
import { getMessages, createMessage } from "../controllers/messageController.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();
router.get("/reports/:reportId/messages", getMessages);
router.post("/reports/:reportId/messages", verifyToken, createMessage );

export default router;