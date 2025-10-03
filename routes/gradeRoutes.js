import { Router } from "express";
import { getGradeData } from "../controllers/gradeController.js";

const router = Router();

// Masalan: /api/grades/8a
router.get("/:grade", getGradeData);

export default router;
