import { validationResult } from 'express-validator'
import { Producto, Registro, Usuario } from '../models/index.js';
import { Op } from 'sequelize';
import csv from 'csvtojson'

const datosRegistros = async (req, res) => {

    const registros = await Registro.findAll();
    const total_registros = await Registro.count();

    res.render('templates/index', {
        pagina: 'Datos registros',
        barra: true,
        registros,
        total_registros
    });
}

const formularioRegistros = async (req, res) => {
    res.render('templates/admin', {
        pagina: 'Realizar registro',
        barra: true,
        datos: {}
    });
}

function validarArchivo(archivo) {
    const tiposValidos = ['txt', 'csv'];

    if (tiposValidos.includes(archivo)) {
        return true;
    } else {
        return false;
    }
}

const guardar = async (req, res) => {
    let resultado = validationResult(req);
    const archivo = req.file.path.split('.');

    const esValidoArchivo = await validarArchivo(archivo[1]);

    if (!resultado.isEmpty()) {
        return res.render('templates/admin', {
            pagina: 'Realizar registro',
            barra: true,
            errores: resultado.array(),
            datos: req.body
        });
    }

    if (!esValidoArchivo) {
        return res.render('templates/admin', {
            pagina: 'Realizar registro',
            barra: true,
            errores: [{ msg: 'El archivo debe ser .txt o .csv' }],
            datos: req.body
        });
    }

    await subirArchivo(req, res)
}

const subirArchivo = async (req, res) => {

    try {
        csv({
            delimiter: [',', ' ', '$', '|', '%']
        }).fromFile(req.file.path).then(async (response) => {

            response.forEach(async (element) => {

                const fecha = new Date();
                const fechaActualFormateada = fecha.toISOString().slice(0, 19).replace('T', ' ');

                const existeProducto = await Producto.findOne({ where: { nombre: element.producto } });
                if (!existeProducto) {
                    await Producto.create({
                        nombre: element.producto
                    });
                }
                const idProducto = await Producto.findOne({ where: { nombre: element.producto } });
                const idUsuario = await Usuario.findOne({ where: { email: req.cookies.usuario } });

                await Registro.create({
                    nombre: element.nombre,
                    apellido: element.apellido,
                    telefono: element.telefono,
                    direccion: element.direccion,
                    createdAt: fechaActualFormateada,
                    updatedAt: fechaActualFormateada,
                    usuarioId: idUsuario.id,
                    productoId: idProducto.id
                });
            });

            return res.redirect('/subir-archivos/save')
        });
    } catch (error) {
        res.send({ status: 400, success: false, msg: error.message })
    }
}

export { datosRegistros,validarArchivo, formularioRegistros, guardar, subirArchivo }