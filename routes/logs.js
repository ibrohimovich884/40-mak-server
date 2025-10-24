import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

// Fayl manzili
const dataPath = path.join(process.cwd(), "data", "logs.json");

// ✅ JSON o‘qish
const readLogs = () => {
  if (!fs.existsSync(dataPath)) return [];
  try {
    const rawData = fs.readFileSync(dataPath, "utf-8");
    return JSON.parse(rawData || "[]");
  } catch {
    return [];
  }
};

// ✅ JSON yozish
const writeLogs = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf-8");
};

// 🔹 GET /logs → barcha ulangan qurilmalar
router.get("/", (req, res) => {
  try {
    const devices = readLogs();

    const logs = devices.map((device) => ({
      model: device.model || "Model noma'lum",
      url: device.url || "URL noma'lum",
      connectedAt: device.date || "Vaqt ko‘rsatilmagan",
      userAgent: device.userAgent || "User agent ko‘rsatilmagan",
      count: device.status || 404, // count ham ko‘rsatamiz
    }));

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    console.error("GET xatolik:", error);
    res.status(500).json({
      success: false,
      message: "Loglarni olishda xatolik yuz berdi.",
    });
  }
});

// 🔹 POST /logs/device → yangi qurilma ma'lumotini qo‘shish
router.post("/device", (req, res) => {
  try {
    const { ip, model, image, connectedAt } = req.body;

    if (!ip || !model) {
      return res.status(400).json({
        success: false,
        message: "ip va model kiritilishi shart!",
      });
    }

    const logs = readLogs();

    const existing = logs.find((log) => log.ip === ip);
    if (existing) {
      existing.model = model;
      existing.image = image;
      existing.connectedAt = connectedAt;

      // 🔁 Agar count 50 bo‘lsa, 1 dan boshlab yozamiz
      if (existing.count >= 50) {
        existing.count = 1;
      } else {
        existing.count = (existing.count || 0) + 1;
      }
    } else {
      logs.push({ ip, model, image, connectedAt, count: 1 });
    }

    writeLogs(logs);

    res.status(200).json({
      success: true,
      message: "Qurilma ma'lumot saqlandi ✅",
    });
  } catch (error) {
    console.error("POST xatolik:", error);
    res.status(500).json({
      success: false,
      message: "Server xatoligi!",
    });
  }
});

export default router;
