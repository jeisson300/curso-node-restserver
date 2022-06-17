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


module.exports = {
    isRoleValidate,
    isEmailsExists,
    isExistUserId
}