import { DataTypes } from 'sequelize';
import db from '../config/db.js'

const Area = db.define('areas', {
    nombre: {
        type: DataTypes.STRING(30),
        allowNUll: false
    },
});

export default Area;