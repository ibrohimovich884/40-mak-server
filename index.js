import express from "express";
import gradeRoutes from "./routes/gradeRoutes.js";

const app = express();
const PORT = 5000;

app.use(express.json());

app.use("/grades", gradeRoutes);

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