
const categoria = require('../models/categoria.');
const Producto = require('../models/producto');
const Role = require('../models/role');
const Usuario = require('../models/usuario');
const isRoleValidate = async (rol = '') => {
    const existRol = await Role.findOne({ rol });
    if (!existRol) {
        throw new Error('No existe ese rol')
    }
}


const isEmailsExists = async(correo = '')=>
{
    const existeEmail = await Usuario.findOne({correo});
    if(existeEmail){
        throw new Error('El Email ya existe');
    }
}


const isExistUserId = async(id)=>
{
    const existUser = await Usuario.findById(id);
    if(!existUser){
        throw new Error(`El id ${id} no  existe`);
    }
}

const existeCategoria = async(id)=>
{
    const existCategoria = await categoria.findById(id);
    if(!existCategoria){
        throw new Error(`El id ${id} no  existe`);
    }
}
const existeProducto = async(id)=>
{
    const existProducto = await Producto.findById(id);
    if(!existProducto){
        throw new Error(`El id ${id} no  existe`);
    }
}


module.exports = {
    isRoleValidate,
    isEmailsExists,
    isExistUserId,
    existeCategoria,
    existeProducto
}