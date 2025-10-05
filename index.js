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


app.get("/hez", (req, res) => {
  res.send("Xush kelibsiz! Bu Hez sahifasi");
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