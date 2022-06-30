const { response } = require("express");
const Categoria = require("../models/categoria.");
const Producto = require("../models/producto");
const Usuario = require("../models/usuario");
const {ObjectId} = require('mongoose').Types;
const coleccionesPermitidas = [
    'usuarios',
    'categoria',
    'productos',
    'roles',
]

const buscarUsuarios = async(termino = '', res=response)=>
{
    const esMongoId = ObjectId.isValid(termino);
    if(esMongoId)
    {
        const usuario = await Usuario.findById(termino);
         res.json({
            results: usuario?[usuario]:[]
         })
    }
    const regex = new RegExp(termino, 'i');
    const usuarios = await Usuario.find({
        $or: [{nombre : regex}, {correo:regex}],
        $and:[{estado : true}]
    });
    res.json({
        results: usuarios
     })
}
const buscarCategorias = async(termino = '', res=response)=>
{
    const esMongoId = ObjectId.isValid(termino);
    if(esMongoId)
    {
        const categoria = await Categoria.findById(termino);
         res.json({
            results: categoria?[categoria]:[]
         })
    }
    const regex = new RegExp(termino, 'i');
    const categorias = await Categoria.find({nombre : regex });
    res.json({
        results: categorias
     })
}
const buscarProductos = async(termino = '', res=response)=>
{
    const esMongoId = ObjectId.isValid(termino);
    if(esMongoId)
    {
        const producto = await Producto.findById(termino).populate('categoria', 'nombre');
         res.json({
            results: producto?[producto]:[]
         })
    }
    const regex = new RegExp(termino, 'i');
    const productos = await Producto.find({nombre : regex}).populate('categoria', 'nombre');
    res.json({
        results: productos
     })
}

const buscar =(req, res = response)=>
{
    const {coleccion, termino }= req.params

    if(!coleccionesPermitidas.includes(coleccion))
    {
        res.status(400).json({
            msg:`las colecciones permitidas son: ${coleccionesPermitidas}`
        });
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
        case 'categoria':
            buscarCategorias(termino, res);
            break;
        case 'productos':
            buscarProductos(termino, res);
            break;
    
        default:
            res.status(500).json({
                smg:`se me olvido hacer esta busqueda`
            });
    }


    
}



module.exports = {
    buscar
}