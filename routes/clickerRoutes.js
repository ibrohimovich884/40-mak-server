import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const dataPath = path.resolve("data/clicker.json");

const readData = () => {
  const raw = fs.readFileSync(dataPath, "utf-8");
  return JSON.parse(raw);
};

const writeData = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf-8");
};

router.get("/", (req, res) => {
  const data = readData();
  res.json(data);
});

router.post("/update", (req, res) => {
  const data = readData();
  const { required, dailyBonus, maxBonus } = req.body;

  if (required !== undefined) data.required = required;
  if (dailyBonus !== undefined) data.dailyBonus = dailyBonus;
  if (maxBonus !== undefined) data.maxBonus = maxBonus;

  writeData(data);
  res.json({ message: "Clicker ma'lumotlari yangilandi!", data });
});

export default router;
