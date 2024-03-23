import { Router } from "express";
import { config } from "dotenv";
import multer from "multer";
import { saveImage } from "../controllers/controller.create.js";

config();
const upload = multer({ limits: { fieldSize: 10 * 1024 * 1024 } });
const router = Router();
router.get('/');
router.post('/api', upload.array('imagen', 10), saveImage);

export default router;