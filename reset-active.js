// reset-active.js (ESM)

import fs from "fs";

const filePath = "./data/Grade8b.json"; // 👉 fayl pathni shu yerda o'zgartirasan

// --- SOZLAMALAR ---
const statusFields = {
  Status: "Active",
  StatusReason: "",
  TransferredTo: "",
  StatusChangedAt: new Date().toISOString().slice(0, 10), // bugungi sana YYYY-MM-DD
};
// ------------------

/**
 * Array ichidagi HAR BIR obyektga status maydonlarini yangilaydi
 */
function resetAllToActive(arr) {
  if (!Array.isArray(arr)) return 0;
  let count = 0;
  arr.forEach(item => {
    if (item && typeof item === "object") {
      Object.assign(item, statusFields);
      count++;
    }
  });
  return count;
}

try {
  const raw = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(raw);

  let updatedCount = 0;

  if (Array.isArray(data)) {
    updatedCount = resetAllToActive(data);
  } else if (data && typeof data === "object") {
    for (const k of Object.keys(data)) {
      if (Array.isArray(data[k])) {
        updatedCount = resetAllToActive(data[k]);
        break;
      }
    }
  }

  if (updatedCount > 0) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    console.log(`✅ ${filePath}: ${updatedCount} ta o'quvchi statusi "Active" qilib yangilandi.`);
  } else {
    console.log(`ℹ️ ${filePath} ichida array topilmadi.`);
  }
} catch (err) {
  console.error("❌ Xato:", err.message);
}