// add-id.js (ESM)

import fs from "fs";

const filePath = "./data/Grade8b.json"; // 👉 fayl pathni shu yerda o'zgartirasan

// --- SOZLAMALAR ---
const idKey = "id";              // qo'shiladigan kalit nomi
const overwriteExisting = false; // true bo'lsa, mavjud id ham qayta generatsiya qilinadi
// ------------------

/**
 * 6 xonali (100000-999999) unikal random raqamni STRING ko'rinishida generatsiya qiladi
 */
function generateUniqueId(usedIds) {
  let id;
  do {
    id = String(Math.floor(100000 + Math.random() * 900000)); // "100000" - "999999"
  } while (usedIds.has(id));
  usedIds.add(id);
  return id;
}

/**
 * Obyektga id ni ENG BIRINCHI o'ringa qo'yib, qayta quradi
 */
function putIdFirst(item, idValue) {
  if (overwriteExisting || !(idKey in item)) {
    const { [idKey]: _old, ...rest } = item;
    return { [idKey]: idValue, ...rest };
  }
  return item;
}

/**
 * Array ichidagi har bir obyektga unikal id qo'shadi
 */
function addIdsToArray(arr, usedIds) {
  if (!Array.isArray(arr)) return 0;
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (item && typeof item === "object" && !Array.isArray(item)) {
      // Mavjud id'larni to'plamga qo'shib qo'yamiz (takrorlanmasligi uchun)
      if (idKey in item && (typeof item[idKey] === "string" || typeof item[idKey] === "number")) {
        usedIds.add(String(item[idKey]));
      }
      const idValue = generateUniqueId(usedIds);
      arr[i] = putIdFirst(item, idValue);
      count++;
    }
  }
  return count;
}

try {
  const raw = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(raw);

  const usedIds = new Set();
  let modified = false;

  if (Array.isArray(data)) {
    // Fayl to'g'ridan-to'g'ri array
    if (addIdsToArray(data, usedIds) > 0) modified = true;
  } else if (data && typeof data === "object") {
    // Fayl object ichida array bor
    const keys = Object.keys(data);
    for (const k of keys) {
      if (Array.isArray(data[k])) {
        if (addIdsToArray(data[k], usedIds) > 0) modified = true;
        break; // faqat birinchi topilgan arrayga ishlov beradi
      }
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    console.log(`✅ ${filePath} yangilandi: har bir obyektga 6 xonali unikal "${idKey}" qo'shildi.`);
  } else {
    console.log(`ℹ️ ${filePath} ichida array topilmadi.`);
  }
} catch (err) {
  console.error("❌ Xato:", err.message);
}