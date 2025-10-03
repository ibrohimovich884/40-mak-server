import fs from "fs";
import path from "path";

// data papkani olish
const dataDir = path.join(process.cwd(), "data");

// Controller: sinf faylini olish
export const getGradeData = (req, res) => {
  const grade = req.params.grade.toLowerCase(); // masalan: 8a
  const filePath = path.join(dataDir, `Grade${grade.toUpperCase()}.json`);

  // Fayl mavjudligini tekshirish
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "❌ Bunday sinf topilmadi" });
  }

  // Faylni o‘qish
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "⚠️ Faylni o‘qishda xatolik" });
    }

    try {
      const jsonData = JSON.parse(data);
      res.json(jsonData);
    } catch (parseError) {
      res.status(500).json({ error: "⚠️ JSON formatida xato" });
    }
  });
};
