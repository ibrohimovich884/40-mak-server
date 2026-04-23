import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

// Ma'lumotlar joylashgan papka yo'li (o'zingizni loyihangizga qarab moslang)
const dataPath = path.join(process.cwd(), "data", "grades.json");

router.get("/", (req, res) => {
    try {
        if (!fs.existsSync(dataPath)) {
            return res.status(404).json({ message: "Ma'lumotlar topilmadi" });
        }

        const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
        let allStudents = [];

        // Barcha sinflar ichidagi o'quvchilarni bitta massivga yig'amiz
        // grades.json strukturangiz { "Grade7a": [...], "Grade7b": [...] } ko'rinishida deb hisoblaymiz
        Object.keys(data).forEach(gradeKey => {
            const students = data[gradeKey].map(student => ({
                ...student,
                gradeId: gradeKey.replace("Grade", "").toLowerCase() // "Grade7a" -> "7a"
            }));
            allStudents = allStudents.concat(students);
        });

        res.json(allStudents);
    } catch (err) {
        res.status(500).json({ error: "Serverda xatolik yuz berdi" });
    }
});

export default router;