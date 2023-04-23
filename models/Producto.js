import { DataTypes } from 'sequelize';
import db from '../config/db.js'

const Producto = db.define('productos', {
    nombre: {
        type: DataTypes.STRING,
        allowNUll: false
    },
});

export default Producto;