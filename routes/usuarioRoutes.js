import express from "express"; 
import { formularioLogin, autenticar, formularioOlvidePassword, registrar, formularioRegistro } from "../controllers/usuarioController.js";
// Crear app
const router = express.Router();

// Routing
router.get('/login', formularioLogin);
router.post('/login', autenticar);
router.get('/registro', formularioRegistro);
router.post('/registro', registrar);
router.get('/olvide-password', formularioOlvidePassword);

export default router;