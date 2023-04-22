import express from "express"; // ECSmodule
import { formularioLogin, formularioOlvidePassword, registrar, formularioRegistro } from "../controllers/usuarioController.js";
// Crear app
const router = express.Router();

// Routing
router.get('/login', formularioLogin);// Ruta especifica
router.get('/registro', formularioRegistro);
router.post('/registro', registrar);
router.get('/olvide-password', formularioOlvidePassword);

export default router;