import { DataTypes } from 'sequelize';
import db from '../config/db.js'

const Registro = db.define('registros', {
    nombre: {
        type: DataTypes.STRING,
        allowNUll: true
    },
    apellido: {
        type: DataTypes.STRING,
        allowNUll: true
    },
    telefono: {
        type: DataTypes.STRING,
        allowNUll: true
    },
    direccion: {
        type: DataTypes.STRING,
        allowNUll: true
    },
});

export default Registro;