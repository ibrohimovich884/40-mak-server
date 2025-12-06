import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

const filePath = path.join(process.cwd(), "data", "UpdatePass.json");


// POST — yangi yozish
// router.post("/", (req, res) => {
//   const { username, password, adminname, adminpassword } = req.body;

//   if (!username || !password || !adminname || !adminpassword) {
//     return res.status(400).json({
//       error: "Hamma ma'lumotlarni to‘liq yubor!",
//     });
//   }

//   const userData = {
//     username,
//     password,
//     adminname,
//     adminpassword,
//     time: new Date().toISOString(),
//   };

//   fs.writeFileSync(filePath, JSON.stringify(userData, null, 2), "utf-8");

//   res.json({
//     message: "User ma'lumotlari yaratildi!",
//     data: userData,
//   });
// });

router.patch("/", (req, res) => {
	if (!fs.existsSync(filePath)) {
		return res.status(404).json({ error: "Ma'lumot topilmadi" });
	}

	const oldData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
	const newData = req.body;

	const updatedData = { ...oldData, ...newData, time: new Date().toISOString() };

	fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2), "utf-8");

	res.json({
		message: "Ma'lumotlar yangilandi!",
		data: updatedData,
	});
});

// GET — hozirgi ma'lumotni olish
router.get("/", (req, res) => {
	if (!fs.existsSync(filePath)) {
		return res.json({ message: "Ma'lumot hali mavjud emas" });
	}

	const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
	res.json(data);
});

export default router;
