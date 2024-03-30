import { Router } from "express";
import { config } from "dotenv";
import multer from "multer";
import { saveImage } from "../controllers/controller.create.js";
import { getAllImages, getAllPerfils } from "../controllers/controller.get.all.js";
import { getOneImage } from "../controllers/controller.get.one.js   ";
import cors from 'cors';
import { deleteImage } from "../controllers/controller.delete.js";
import { updateImage } from "../controllers/controller.update.js";
import { registerUser } from "../controllers/controller.create.acount.js";
import { auth, authenticateToken, verifyToken } from "../middelware/middel.js";
import { addFavorites, saveProfileToDatabase, updateProfileToDatabase } from "../controllers/controller.perfil.js";
import { getOnePerfil } from "../controllers/controller.getPerfil.js";
cors();
config();
const upload = multer({ limits: { fieldSize: 10 * 1024 * 1024 } });
const router = Router();

router.post('/perfil', upload.array('imagen_perfil', 10), authenticateToken, verifyToken, saveProfileToDatabase);
router.get('/perfil', getAllPerfils);
router.put('/perfil/:id', upload.array('imagen_perfil', 10), authenticateToken, verifyToken, updateProfileToDatabase);
router.post('/fav/:id', upload.array('imagen_perfil', 10), authenticateToken, verifyToken, addFavorites);
router.get('/perfil/:id', getOnePerfil);


router.post('/register', registerUser);
router.post('/login', auth);

router.get('/api', getAllImages);
router.get('/api/:id', getOneImage);
router.put('/api', upload.array('imagen', 10), authenticateToken, verifyToken, updateImage);
router.post('/api', authenticateToken, verifyToken, upload.array('imagen', 10), saveImage);
router.delete('/api/:id', authenticateToken, verifyToken, deleteImage);
export default router;