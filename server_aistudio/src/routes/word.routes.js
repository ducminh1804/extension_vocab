import express from "express";
import { WordController } from "../controllers/word.controller.js"; // Thêm .js

const router = express.Router();

router.post("/", WordController.create);
router.get("/", WordController.getAll);
router.get("/:id", WordController.getById);
router.put("/:id", WordController.update);
router.delete("/:id", WordController.delete);

export default router; // ✅ Giữ nguyên export
