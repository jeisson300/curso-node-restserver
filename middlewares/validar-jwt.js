const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/usuario');

const validarJwt = async(req = request, res = response, next) => {
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        });
    }
    try {

        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const userAuth = await User.findById(uid);  
        req.uid = uid;
        req.userauth= userAuth;
        next();
    } catch (error) {

        console.log(error);
        return res.status(401).json({
            msg: 'Token no autorizado'
        });
    }
}



module.exports = {
    validarJwt
}