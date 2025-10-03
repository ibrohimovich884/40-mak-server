import fs from "fs";
import path from "path";

// data papkani olish
const dataDir = path.join(process.cwd(), "data");

// Controller: sinf faylini olish
export const getGradeData = (req, res) => {
  const grade = req.params.grade.toLowerCase(); // masalan: 8a
  const filePath = path.join(dataDir, `Grade${grade}.json`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "❌ Bunday sinf topilmadi" });
  }

  try {
    const rawData = fs.readFileSync(filePath, "utf8");
    const jsonData = JSON.parse(rawData);
    res.json(jsonData);
  } catch (err) {
    res.status(500).json({ error: "⚠️ Faylni o‘qishda yoki JSONda xato" });
  }
};
