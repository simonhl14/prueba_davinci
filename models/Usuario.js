import { DataTypes } from 'sequelize';
import db from '../config/db.js'

const Usuario = db.define('usuarios', {
    nombre: {
        type: DataTypes.STRING,
        allowNUll: false
    },
    email: {
        type: DataTypes.STRING,
        allowNUll: false
    },
    password: {
        type: DataTypes.STRING,
        allowNUll: false
    },
    token: DataTypes.STRING,
    confirmado: DataTypes.BOOLEAN
});

export default Usuario;