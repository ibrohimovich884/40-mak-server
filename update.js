// update-one.js (ESM)
import fs from "fs";
import path from "path";

const filePath = "./data/Grade7a.json"; 

// --- SOZLAMALAR ---
const targetKey = "Status";        // 👉 O'zgartirmoqchi bo'lgan kalit nomi (masalan: "status", "category", "updateTime")
const targetValue = "Active";      // 👉 Qoymoqchi bo'lgan qiymatingiz
// ------------------

/**
 * Array ichidagi har bir obyektga ixtiyoriy kalit va qiymat qo'shadi
 */
function addCustomFieldToArray(arr, key, value) {
  if (!Array.isArray(arr)) return false;
  arr.forEach(item => {
    if (item && typeof item === "object") {
      item[key] = value; // Dinamik kalit qo'shish
    }
  });
  return true;
}

try {
  const raw = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(raw);

  let modified = false;

  // 1) Agar fayl to'g'ridan-to'g'ri array bo'lsa
  if (Array.isArray(data)) {
    modified = addCustomFieldToArray(data, targetKey, targetValue);
  } 
  // 2) Agar obyekt bo'lsa (ichida array bo'lsa)
  else if (data && typeof data === "object") {
    const keys = Object.keys(data);
    const baseName = path.basename(filePath, ".json");

    if (keys.includes(baseName) && addCustomFieldToArray(data[baseName], targetKey, targetValue)) {
      modified = true;
    } else {
      for (const k of keys) {
        if (Array.isArray(data[k])) {
          addCustomFieldToArray(data[k], targetKey, targetValue);
          modified = true;
          break;
        }
      }
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    console.log(`✅ ${filePath} yangilandi: ["${targetKey}": "${targetValue}"] qo'shildi.`);
  } else {
    console.log(`ℹ️ ${filePath} ichida array topilmadi.`);
  }
} catch (err) {
  console.error("❌ Xato:", err.message);
}