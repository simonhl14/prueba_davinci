import express from "express";
import multer from "multer";
import { validarArchivo } from '../controllers/registroController.js'
import { body } from 'express-validator';
import { datosRegistros, formularioRegistros, guardar, subirArchivo } from "../controllers/registroController.js";

// Crear app
const app = express();
const router = express.Router();

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer({ storage });


// Routing
router.get('/', datosRegistros);
router.get('/save', formularioRegistros);
router.post('/save-file', upload.single('file'),
    // body('area').isNumeric().withMessage('El area es obligatoria'),
    guardar
);

export default router;