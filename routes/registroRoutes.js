import express from "express";
import { upload } from "../controllers/registroController.js";
import { datosRegistros, formularioRegistros, guardar, subirArchivo } from "../controllers/registroController.js";

// Crear app
const router = express.Router();

// Routing
router.get('/', datosRegistros);
router.get('/save', formularioRegistros);
router.post('/save', upload.single('file'), guardar);

export default router;