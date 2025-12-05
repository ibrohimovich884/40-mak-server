import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

const dirPath = path.join(process.cwd(), "data");
const filePath = path.join(dirPath, "studentsData.json");

// Folder bo‘lmasa — yaratish
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

// File bo‘lmasa — default yozish
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, JSON.stringify({ students_data: true }, null, 2));
}

// JSON o‘qish
function readData() {
  return JSON.parse(fs.readFileSync(filePath, "utf-8") || "{}");
}

// JSON yozish
function writeData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

// === SET STATUS (true/false) ===
router.post("/hide", (req, res) => {
  const current = readData();
  const updated = { ...current, ...req.body }; // { students_data: true/false }

  writeData(updated);

  res.json({
    success: true,
    message: "Status yangilandi",
    data: updated,
  });
});

// === GET STATUS ===
router.get("/hide", (req, res) => {
  res.json({
    success: true,
    data: readData(),
  });
});

export default router;
