import express from "express";
const router = express.Router();

// Fake DB (agar real Mongo bo'lsa, shu yerga model qo'yasan)
let settings = {
  students_data: true, // default holat
};

// === HIDE ===
// POST /hide
router.post("/hide", (req, res) => {
  settings.students_data = false;

  return res.json({
    success: true,
    message: "Ma'lumotlar berkitildi",
    data: settings,
  });
});

// === SHOW ===
// POST /show
router.post("/show", (req, res) => {
  settings.students_data = true;

  return res.json({
    success: true,
    message: "Ma'lumotlar ochildi",
    data: settings,
  });
});

// === GET STATUS ===
// /status — front-end holatni bilishi uchun
router.get("/status", (req, res) => {
  return res.json({
    success: true,
    data: settings,
  });
});

export default router;
