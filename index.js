import express from "express";
import db from './config/db.js';
import cookieParser from "cookie-parser";
import { registroRoutes, usuarioRoutes } from "./routes/index.js";

// Crear app
const app = express();

// Conexion a la base de datos
try {
    await db.authenticate();
    db.sync();

    console.log('Conexion correcta a la base de datos');
} catch (error) {
    console.log(error);
}

app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());
// parse application/json
app.use(express.json())

// Habilita Pug
app.set('view engine', 'pug'); // Agrega configuracion
app.set('views', './views');

// Carpeta publica
app.use(express.static('public'));

// Routing
app.use('/auth', usuarioRoutes); // Busca todas las rutas que inicie con /auth
app.use('/subir-archivos', registroRoutes);

// Definir puerto y arrancar proyecto
const port = 3000;
app.listen(port, () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`);
});