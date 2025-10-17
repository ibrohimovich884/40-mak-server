import express from "express";
import gradeRoutes from "./routes/gradeRoutes.js";
import clickerRoutes from "./routes/clickerRoutes.js";
import logsRoutes from "./routes/logs.js";
import logs from "./routes/logs.js";
import cors from "cors";
import morgan from "morgan";
import fs from "fs";


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

import path from "path";

const logPath = path.join(process.cwd(), "data", "logs.json");

// Agar data papkasi yo‘q bo‘lsa — yaratib qo‘yamiz
if (!fs.existsSync(path.dirname(logPath))) {
  fs.mkdirSync(path.dirname(logPath), { recursive: true });
}

app.use(
  morgan(":method :url :status, :remote-addr :remote-user :user-agent :date[web]", {
    stream: {
      write: (message) => {
        try {
          // Eski loglarni o‘qib olamiz
          const logs = fs.existsSync(logPath)
            ? JSON.parse(fs.readFileSync(logPath, "utf-8") || "[]")
            : [];

          // Morgan tomonidan yuborilgan stringni tahlil qilamiz
          const parts = message.trim().split(" ");
          const method = parts[0];
          const url = parts[1];
          const status = parts[2].replace(",", "");
          const ip = parts[3];
          const user = parts[4] !== "-" ? parts[4] : "Anonim";
          const userAgent = parts.slice(5, parts.length - 6).join(" ");
          const date = parts.slice(-6).join(" ");

          // Logni obyekt shaklida qo‘shamiz
          logs.push({
            type: "request",
            method,
            url,
            status: Number(status),
            ip,
            user,
            userAgent,
            date,
            time: new Date().toISOString(),
          });

          // Juda ko‘p log bo‘lsa, eski 1000 tasini tozalaymiz
          if (logs.length > 1000) logs.splice(0, logs.length - 1000);

          // Yangi log faylga yoziladi
          fs.writeFileSync(logPath, JSON.stringify(logs, null, 2), "utf-8");
        } catch (err) {
          console.error("Morgan log yozishda xatolik:", err.message);
        }
      },
    },
  })
);




app.get("/", (req, res) => {
  res.send("Server ishga tushdi");
});


app.get("/health", async (req, res) => {
  const healthData = {
    status: "ok",
    message: "Xush kelibsiz! Bu Health sahifasi",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  };

  res.json(healthData);

  try {
    await fetch("https://auto-server-hvk3.onrender.com/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Health endpoint ishga tushdi!",
        time: new Date().toISOString(),
      }),
    });
    console.log("[Health] Auto-serverga signal yuborildi ✅");
  } catch (err) {
    console.error("[Health] Auto-serverga signal yuborishda xatolik:", err.message);
  }
});

app.post("/notify", (req, res) => {
  console.log("📩 Signal qabul qilindi:", req.body);
  res.json({ status: "ok", received: true });
});


app.use("/grades", gradeRoutes);
app.use("/clicker", clickerRoutes);
app.use("/logs", logs);


app.listen(PORT, () => {
  console.log(`Server ishga tushdi: http://localhost:${PORT}`);
});










/* dataga qoshib qoyishing kerak

{
  "Full name": "Bekmirzayev Oybek Ibrohim o'g'li",
    "Name": "Oybek",
      "Grade": "9b",
        "Image": "",
          "Gender": "Male",
            "Birthday": "2010-07-17",
              "Instagram": "ibrohimovich_o1",
                "Talked": "Hech kim :)"
},
*/