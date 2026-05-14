import "dotenv/config";

import express from "express";
import cors from "cors";

import authRoutes from "./src/routes/authRoutes.js";
import categoryRoutes from "./src/routes/categoryRoutes.js";
import messageRoute from "./src/routes/messageRoutes.js";
import reportRoutes from "./src/routes/reportRoutes.js";

const app = express();

app.use(cors({
  origin: 'http://localhost:4321',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Selamat datang di API",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/messages", messageRoute);
app.use("/api/reports", reportRoutes);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});