import express from "express";
import gradeRoutes from "./routes/gradeRoutes.js";
import clickerRoutes from "./routes/clickerRoutes.js";
import logs from "./routes/logs.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

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