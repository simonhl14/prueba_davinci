import express from "express";
import db from './config/db.js';
import usuarioRoutes from "./routes/usuarioRoutes.js";

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

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))

// parse application/json
app.use(express.json())

// Habilita Pug
app.set('view engine', 'pug'); // Agrega configuracion
app.set('views', './views');

// Carpeta publica
app.use(express.static('public'));

// Routing
app.use('/auth', usuarioRoutes); // Busca todas las rutas que inicie con /auth

// Definir puerto y arrancar proyecto
const port = 3000;
app.listen(port, () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`);
});