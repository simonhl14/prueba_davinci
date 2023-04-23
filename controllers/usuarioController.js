import { check, validationResult } from 'express-validator'
import { Area, Usuario } from '../models/index.js';


const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesion'
    });
}

const autenticar = async (req, res) => {
    await check('email').isEmail().withMessage('El email es incorrecto').run(req);
    await check('password').notEmpty().withMessage('La contraseña es obligatoria').run(req);

    let resultado = validationResult(req);

    const { nombre, email, password } = req.body;

    // Verificar si esta vacio
    if (!resultado.isEmpty()) {
        return res.render('auth/login', {
            pagina: 'iniciar Sesion',
            errores: resultado.array(),
        });
    }

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
        return res.render('auth/login', {
            pagina: 'iniciar Sesion',
            errores: [{ msg: 'El usuario no existe' }],
        });
    }

    if (!usuario.verificarPassword(password)) {
        return res.render('auth/login', {
            pagina: 'iniciar Sesion',
            errores: [{ msg: 'La contraseña es incorrecta' }],
        });
    }

    return res.cookie('usuario', email, {
        httpOnly: true
    }).redirect('/subir-archivos/');
}

const formularioRegistro = async (req, res) => {
    const [areas] = await Promise.all([
        Area.findAll()
    ]);

    res.render('auth/registro', {
        pagina: 'Crear Cuenta',
        areas,
        datos: {}
    });
}

const registrar = async (req, res) => {
    const [areas] = await Promise.all([
        Area.findAll()
    ]);

    // Validacion
    await check('nombre').notEmpty().withMessage('El nombre es obligatorio').run(req);
    await check('email').isEmail().withMessage('El email es incorrecto').run(req);
    await check('password').isLength({ min: 6 }).withMessage('La contraseña debe ser de al menos 6 caracteres').run(req);
    await check('repetir_password').equals(req.body.password).withMessage('Las contraseñas no son iguales').run(req);

    let resultado = validationResult(req);

    const { nombre, email, password, area } = req.body;

    // Verificar si esta vacio
    if (!resultado.isEmpty()) {
        return res.render('auth/registro', {
            pagina: 'Crear cuenta',
            errores: resultado.array(),
            usuario: {
                nombre,
                email,
            },
            areas,
            datos: req.body
        });
    }
    // Verificar si existe el usuario
    const existeUsuario = await Usuario.findOne({ where: { email } });

    if (existeUsuario) {
        return res.render('auth/registro', {
            pagina: 'Crear cuenta',
            errores: [{ msg: 'El correo ya esta registrado' }],
            usuario: {
                nombre,
                email,
            }
        });
    }

    await Usuario.create({
        nombre,
        email,
        password,
        areaId: area,
        token: 123
    });

    res.cookie('area', area, {
        httpOnly: true
    });

    return res.render('auth/registro', {
        pagina: 'Crear cuenta',
        msg: [{ msg: 'Usuario registrado' }],
        areas,
        datos: {}
    });


}

const formularioOlvidePassword = (req, res) => {
    res.render('auth/olvidePassword', {
        pagina: 'Recupera tu acceso'
    });
}

export { formularioLogin, autenticar, formularioRegistro, registrar, formularioOlvidePassword }