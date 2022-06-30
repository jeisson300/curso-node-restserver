const { response } = require("express");
const Usuario = require("../models/usuario");
const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/generar-jwt");
const { verify } = require("../helpers/google-verify");


const login = async (req, res = response) => {
    const { correo, password } = req.body;
    try {


        //verificar si el email existe
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / password no son correctos - correo'
            });
        }
        // si el users esta activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / password no son correctos - estado: false'
            });
        }

        //verificar contraseña
        const validarPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validarPassword) {
            return res.status(400).json({
                msg: 'Usuario / password no son correctos - password '
            });
        }

        //genear el jwt

        const token = await generarJWT(usuario.id)

        res.json({
            msg: 'Login ok',
            token,
            usuario
        });
    } catch (error) {
        res.json(
            {
                msg: 'Hable con el admin',
                error
            })
    }
}

const googleSignIn = async (req, res = response) => {
    const { id_token } = req.body;

    try {
        const googleUser = await verify(id_token);
        console.log(googleUser)
        res.json(id_token);
    } catch (err) {
        res.json({
            err
        })
    }
}

module.exports = {
    login,
    googleSignIn
}