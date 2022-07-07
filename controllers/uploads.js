const { response } = require("express");
const { subirArchivo } = require("../helpers/subir-archivo");
const Producto = require("../models/producto");
const Usuario = require("../models/usuario");
const path = require('path');
const fs  = require("fs");
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);
const cargarArchivos = async (req, res = response) => {
    try {
        const path = await subirArchivo(req.files, ['txt', 'jpg'], 'data');
        res.json(path);
    } catch (err) {
        res.status(400).json(err)
    }
}


const actualizarImagen = async (req, res = response) => {
    const { id, coleccion } = req.params;
    let modelo;

    switch (coleccion) {
        case 'users':
            modelo =  await Usuario.findById(id);
            if(!modelo )
            {
               return res.status(400).json({
                msg: `No existe un usuario con el id ${id}`
                });  
            }       
            break;
        case 'productos':
            modelo =  await Producto.findById(id);
            if(!modelo )
            {
               return res.status(400).json({
                msg: `No existe un producto con el id ${id}`
                });  
            }       
            break;
        default:
            return res.status(200).json({ mg: 'se me olvido validar esto' });
    }

    //limpiar imagenes previas
    if(modelo.img)
    {
        // hay que borrar la imagen del server
        const pathImagen = path.join(__dirname, '../uploads',coleccion, modelo.img);
        if(fs.existsSync(pathImagen))
        {
            fs.unlinkSync(pathImagen);
        }
    }
    

    modelo.img = await subirArchivo(req.files, undefined, coleccion);
    await modelo.save();
    res.json({
        id, coleccion
    })
}

const actualizarImagenCloudinary = async (req, res = response) => {
    const { id, coleccion } = req.params;
    let modelo;

    switch (coleccion) {
        case 'users':
            modelo =  await Usuario.findById(id);
            if(!modelo )
            {
               return res.status(400).json({
                msg: `No existe un usuario con el id ${id}`
                });  
            }       
            break;
        case 'productos':
            modelo =  await Producto.findById(id);
            if(!modelo )
            {
               return res.status(400).json({
                msg: `No existe un producto con el id ${id}`
                });  
            }       
            break;
        default:
            return res.status(200).json({ mg: 'se me olvido validar esto' });
    }

    //limpiar imagenes previas
    if(modelo.img)
    {
        const nombreArr = modelo.img.split('/');
        const nombre =  nombreArr[nombreArr.length-1];
        const [public_id] = nombre.split('.');
        cloudinary.uploader.destroy(public_id);
    }
    const {tempFilePath} = req.files.archivo
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath);
    modelo.img = secure_url

    // modelo.img = await subirArchivo(req.files, undefined, coleccion);
     await modelo.save();
    res.json({
        modelo
    })
}


const mostrarImagen = async(req, res)=>
{

    const {id, coleccion} = req.params 
    let modelo;

    switch (coleccion) {
        case 'users':
            modelo =  await Usuario.findById(id);
            if(!modelo )
            {
               return res.status(400).json({
                msg: `No existe un usuario con el id ${id}`
                });  
            }       
            break;
        case 'productos':
            modelo =  await Producto.findById(id);
            if(!modelo )
            {
               return res.status(400).json({
                msg: `No existe un producto con el id ${id}`
                });  
            }       
            break;
        default:
            return res.status(200).json({ mg: 'se me olvido validar esto' });
    }

    //limpiar imagenes previas
    if(modelo.img)
    {
        // hay que borrar la imagen del server
        const pathImagen = path.join(__dirname, '../uploads',coleccion, modelo.img);
        if(fs.existsSync(pathImagen))
        {
            return res.sendFile(pathImagen)
        }
    }
    const pathDefault = path.join(__dirname, '../assets','no-image.jpg')
    res.sendFile(pathDefault);
    
}


module.exports = {
    cargarArchivos,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}