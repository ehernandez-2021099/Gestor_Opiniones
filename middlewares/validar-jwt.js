const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/Usuario');

const validarJWT = async (req = request, res = response, next) => {

    const token = req.header('x-token');

    //Si no viene el token
    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        })
    }


    try {

        const { uid, name} = jwt.verify(token, process.env.SECRET_JWT_SED);
        req.uid = uid;
        req.name = name;

        // leer al usuario que corresponda el uid
        const usuario = await Usuario.findById(uid);

        //Verificar si el uid del usuario no existe
        if (!usuario) {
            return res.status(401).json({
                msg: 'Token no valido - usuario no existe en la Base de Datos'
            })
        }


        req.usuario = usuario;
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        })
    }
}

module.exports = {
    validarJWT
}
