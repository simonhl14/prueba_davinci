import { validationResult } from 'express-validator';
import multer from "multer";
import { Op } from 'sequelize';
import { Producto, Registro, Usuario } from '../models/index.js';
import csv from 'csvtojson'
import moment from 'moment-timezone';

const datosRegistros = async (req, res) => {
    const { fechaInicio, fechaFin, search } = req.query

    let registros = await Registro.findAndCountAll();

    if (fechaInicio && fechaFin && search) {
        const registros_fecha = await buscarRegistros(fechaInicio, fechaFin, search);
        registros = registros_fecha
    }
    if (fechaInicio && fechaFin || search) {
        const registros_fecha = await buscarRegistros(fechaInicio, fechaFin, search);
        registros = registros_fecha
    }

    res.render('templates/index', {
        pagina: 'Datos registros',
        barra: true,
        registros: registros.rows,
        totalRegistros: registros.count,
        fechaInicio,
        fechaFin,
        search
    });
}

const buscarRegistros = async (fechaInicio, fechaFin, search) => {
    let registros;

    if (fechaInicio && fechaFin && search) {
        registros = await Registro.findAndCountAll({
            where: {
                [Op.and]: [{
                    createdAt: {
                        [Op.gte]: `${fechaInicio} 00:00:00`,
                        [Op.lte]: `${fechaFin} 23:59:59`
                    }
                },
                {
                    nombre: {
                        [Op.like]: `${search}`,
                    }
                }
                ]
            }
        });
    }

    if (fechaInicio && fechaFin && !search) {
        registros = await Registro.findAndCountAll({
            where: {
                createdAt: {
                    [Op.gte]: `${fechaInicio} 00:00:00`,
                    [Op.lte]: `${fechaFin} 23:59:59`
                }
            }
        });
    }

    if (!fechaInicio && !fechaFin && search) {
        registros = await Registro.findAndCountAll({
            where: {
                nombre: {
                    [Op.like]: `${search}`,
                }
            }
        });
    }

    return { count: registros.count, rows: registros.rows };
};

const formularioRegistros = (req, res) => {
    res.render('templates/admin', {
        pagina: 'Realizar registro',
        barra: true,
        datos: {}
    });
}

var storage = multer.diskStorage({
    // destination: (req, file, cb) => {
    //     cb(null, './public/uploads');
    // },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer({ storage });


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
        const opcionesSeleccionadas = req.body.options;

        if (!opcionesSeleccionadas) {
            return res.render('templates/admin', {
                pagina: 'Realizar registro',
                barra: true,
                errores: [{ msg: 'Debe seleccionar por lo menos un campo' }],
                datos: req.body
            });
        }

        const regex = new RegExp(opcionesSeleccionadas.join('|'));

        csv({
            delimiter: [',', ' ', '$', '|', '%'],
            includeColumns: regex
        }).fromFile(req.file.path).then(async (response) => {

            response.forEach(async (element) => {

                let idProducto;

                moment.tz.setDefault('America/Bogota');

                const fechaActual = moment();
                const fechaActualFormateada = fechaActual.format('YYYY-MM-DD HH:mm:ss');

                if (element.producto) {
                    const existeProducto = await Producto.findOne({ where: { nombre: element.producto } });
                    if (!existeProducto || existeProducto == null) {
                        await Producto.create({
                            nombre: element.producto
                        });
                    }
                    idProducto = await Producto.findOne({ where: { nombre: element.producto } });
                }
                const idUsuario = await Usuario.findOne({ where: { email: req.cookies.usuario } });

                await Registro.create({
                    nombre: element.nombre,
                    apellido: element.apellido,
                    telefono: element.telefono,
                    direccion: element.direccion,
                    createdAt: fechaActualFormateada,
                    updatedAt: fechaActualFormateada,
                    usuarioId: idUsuario.id,
                    productoId: idProducto ? idProducto.id : null
                });
            });

            return res.redirect('/subir-archivos/save')
        });
    } catch (error) {
        res.send({ status: 400, success: false, msg: error.message })
    }
}

export { datosRegistros, validarArchivo, formularioRegistros, upload, guardar, subirArchivo }