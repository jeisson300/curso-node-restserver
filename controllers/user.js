const { response } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { validarCampos } = require('../middlewares/validar-campos');
const { findById } = require('../models/usuario');


const usuariosGet = async (req, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }
    // const usuarios = await Usuario.find(query)
    //     .skip(desde)
    //     .limit(limite);

    // const total = await Usuario.countDocuments(query);

    const [usuarios, total] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(desde)
            .limit(limite)
    ])
    res.json({
        usuarios, total
    });
};

const usuariosPost = async (req, res = response) => {

    //validarCampos(req, res);
    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({
        nombre, correo, password, rol
    });

    //Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo });
    if (existeEmail) {
        return res.status(400).json({
            msg: 'El correo ya esta registrador'
        });
    }
    //encriptar la constraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    //guardar en bd

    await usuario.save();
    res.status(201).json({
        msg: 'post API - controlador',
        usuario

    });
};
const usuariosPut = async (req, res = response) => {

    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    if (password) {
        //encriptar la constraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);
    res.status(400).json(usuario);
};
const usuariosDelete = async(req, res = response) => {

    const {id} =req.params;
    const {uid} = req.uid;
    const userAuth = req.userauth;
    //borrar fisicamente
    //const usuario = await Usuario.findByIdAndDelete(id);

    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false});
   
    if(!usuario)
    {
        return res.status(401).json({
            msg:'Token no valido- usuario no existe en bd'
        })
    }


    //verificar si el  uid tiene estado true
    if(!usuario.estado)
    {
        return res.status(400).json({
            msg:'Token no valido- usuario con estado: false'
            });
    }
    
    
    res.json({
        usuario,
        uid,
        userAuth
    });
};
const usuariosPatch = (req, res = response) => {
    res.status(201).json({
        msg: 'patch API - controlador'
    });
};



module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosPatch,
    usuariosDelete
}