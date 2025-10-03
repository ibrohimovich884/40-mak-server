import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// __dirname o‘rniga kerakli narsa
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// data papkani olish (server bilan bir joyda bo‘lishi kerak)
const dataDir = path.join(__dirname, "../data");

// Controller: sinf faylini olish
export const getGradeData = (req, res) => {
  const grade = req.params.grade.toLowerCase(); // masalan: 7a
  const fileName = `Grade${grade.charAt(0).toUpperCase()}${grade.slice(1)}.json`;
  const filePath = path.join(dataDir, fileName);

  // Fayl mavjudligini tekshirish
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `❌ ${fileName} topilmadi` });
  }

  try {
    const rawData = fs.readFileSync(filePath, "utf8");
    const jsonData = JSON.parse(rawData);
    res.json(jsonData);
  } catch (err) {
    res.status(500).json({ error: "⚠️ Faylni o‘qishda yoki JSONda xato" });
  }
};
