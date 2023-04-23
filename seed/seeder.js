import areas from "./areas.js";
import { Area } from '../models/index.js'
import db from "../config/db.js";

const importarDatos = async () => {
    try {
        await db.authenticate()

        await db.sync()

        await Area.bulkCreate(areas);
        console.log('Datos importados correctamente');
        process.exit() // Finaliza correctamente
    } catch (error) {
        console.log(error);
        process.exit(1) // Termina el proceso con error
    }
}

const eliminarDatos = async () => {
    try {
        await db.sync({ force: true });
        console.log('Datos eliminados correctamente');
        process.exit() // Finaliza correctamente
    } catch (error) {
        console.log(error);
        process.exit(1) // Termina el proceso con error
    }
}

if (process.argv[2] === "-i") {
    importarDatos();
}

if (process.argv[2] === "-e") {
    eliminarDatos();
}