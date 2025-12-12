// update-one.js (ESM)
import fs from "fs";
import path from "path";

const filePath = "./data/Grade7a.json"; // 👉 kerak bo'lsa shu yo'lni o'zgartir

function addUpdateTimeToArray(arr, value) {
  if (!Array.isArray(arr)) return false;
  arr.forEach(item => {
    if (item && typeof item === "object") {
      item.updateTime = value;
    }
  });
  return true;
}

try {
  const raw = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(raw);
  const updateValue = "2025-10-03";

  let modified = false;

  // 1) Agar to'g'ridan-to'g'ri array bo'lsa
  if (Array.isArray(data)) {
    modified = addUpdateTimeToArray(data, updateValue);
  } else if (data && typeof data === "object") {
    // 2) Agar obyekt bo'lsa — asosiy array kalitini topamiz
    // Misol: { "Grade9a": [ ... ] }
    const keys = Object.keys(data);
    // Avvalo aniq filename bilan mos keladigan kalitni tekshirib ko'ramiz (Grade9a)
    const baseName = path.basename(filePath, ".json"); // "Grade9a"
    if (keys.includes(baseName) && addUpdateTimeToArray(data[baseName], updateValue)) {
      modified = true;
    } else {
      // Aks holda birinchi array topilguncha qidiramiz
      for (const k of keys) {
        if (Array.isArray(data[k])) {
          addUpdateTimeToArray(data[k], updateValue);
          modified = true;
          break;
        }
      }
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    console.log(`✅ ${filePath} yangilandi — updateTime qo'shildi.`);
  } else {
    console.log(`ℹ️ ${filePath} ichida array topilmadi. Hech narsa o'zgarmadi.`);
  }
} catch (err) {
  console.error("❌ Xato:", err.message);
}
