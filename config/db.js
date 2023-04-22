import Sequelize from 'sequelize';
import dotenv from 'dotenv';
dotenv.config({path: '.env'})

const db = new Sequelize(process.env.BD_NAME, process.env.BD_USER, process.env.BD_PASSWORD, {
    host: process.env.BD_HOST,
    port: 3306,
    dialect: 'mysql',
    define: {
        timestamps: true
    },
    pool: { // Conf el comportamiento para conexiones nuevas o existentes
        max: 5,
        min: 0,
        acquire: 30000, // tiempo para marcar error
        idle: 10000 // Para liberar memoria si no esta siendo usado
    },
    operatorAliases: false
});

export default db;