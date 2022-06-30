const { response } = require("express");
const Categoria = require("../models/categoria.");

const categoriaGet = (req, res = response) => {
    res.json({
        msg: 'CATEGORIA EN LINEA'
    });
}

// obtenerCategorias - paginado - total -populate
const listarCategoria = async (req, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }
    // const usuarios = await Usuario.find(query)
    //     .skip(desde)
    //     .limit(limite);

    // const total = await Usuario.countDocuments(query);

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query).populate('usuario')
            .skip(desde)
            .limit(limite)
    ])
    res.json({
        categorias, total
    });
}

//obtenerCategoria - populate()

const obtenerCategoria = async (req, res = response) => {
    const { id } = req.params;
    const category = await Categoria.findById(id).populate('usuario');
    
    res.status(201).json({
        msg: 'CATEGORIA eliminado',
        category
    });
}

const categoriaPost = async (req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();
    try {

        const categoriadb = await Categoria.findOne({ nombre });
        if (categoriadb) {
            res.status(400).json({
                msg: `la categoria ${categoriadb.nombre}, ya existe`
            });
        }
        const data = { nombre, usuario: req.userauth._id }

        const categoria = new Categoria(data);

        await categoria.save();

        res.status(201).json({
            msg: 'CATEGORIA EN creado',
            categoria
        });
    } catch (err) {
        console.log(err);
    }
}

//actualizarCategoria 
const actualizarCategoria = async (req, res = response) => {
    const { id } = req.params;
    const nombre = req.body.nombre.toUpperCase();

    const categoria = await Categoria.findByIdAndUpdate(id, { nombre });
    res.status(201).json({
        msg: 'CATEGORIA  actualizado',
        categoria
    });
}


//borrarCategoria- borrado logico
const borrarCategoria = async (req, res = response) => {
    const { id } = req.params;

    const categoria = await Categoria.findByIdAndUpdate(id, { estado: false });
    res.status(201).json({
        msg: 'CATEGORIA eliminado',
        categoria
    });
}


module.exports = {
    categoriaGet,
    categoriaPost,
    actualizarCategoria,
    borrarCategoria,
    obtenerCategoria,
    listarCategoria
}