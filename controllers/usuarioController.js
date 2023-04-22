import { check, validationResult } from 'express-validator'
import Usuario from '../models/Usuario.js'

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesion'
    });
}

const formularioRegistro = (req, res) => {
    res.render('auth/registro', {
        pagina: 'Crear Cuenta'
    });
}

const registrar = async (req, res) => {
    // Validacion
    await check('nombre').notEmpty().withMessage('El nombre es obligatorio').run(req);
    await check('email').isEmail().withMessage('El email es incorrecto').run(req);
    await check('password').isLength({ min: 6 }).withMessage('La contraseña debe ser de al menos 6 caracteres').run(req);
    await check('repetir_password').equals(req.body.password).withMessage('Las contraseñas no son iguales').run(req);

    let resultado = validationResult(req);

    // Verificar si esta vacio
    if (!resultado.isEmpty()) {
        return res.render('auth/registro', { 
            pagina: 'Crear cuenta',
            errores: resultado.array(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email,
            }
        });
    }

    const usuario = await Usuario.create(req.body);
    res.json(usuario);
}

const formularioOlvidePassword = (req, res) => {
    res.render('auth/olvidePassword', {
        pagina: 'Recupera tu acceso'
    });
}

export { formularioLogin, formularioRegistro, registrar, formularioOlvidePassword }