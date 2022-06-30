const { response } = require("express");
const Producto = require("../models/producto");



const productoGet = (req, res = response) => {
    res.json({
        msg: 'producto EN LINEA'
    });
}

// obtenerproductos - paginado - total -populate
const listarProducto = async (req, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }
    // const usuarios = await Usuario.find(query)
    //     .skip(desde)
    //     .limit(limite);

    // const total = await Usuario.countDocuments(query);

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query).populate('usuario')
            .skip(desde)
            .limit(limite)
    ])
    res.json({
        productos, total
    });
}

//obtenerproducto - populate()

const obtenerProducto = async (req, res = response) => {
    const { id } = req.params;
    const producto = await Producto.findById(id).populate('usuario');
    
    res.status(201).json({
        msg: 'producto eliminado',
        producto
    });
}

const productoPost = async (req, res = response) => {

    const {nombre, precio, disponible, descripcion, categoria} = req.body;
    try {

        const productodb = await Producto.findOne({ nombre });
        if (productodb) {
            res.status(400).json({
                msg: `la producto ${productodb.nombre}, ya existe`
            });
        }
        const data = { nombre, precio, disponible, descripcion,categoria, usuario: req.userauth._id }

        const producto = new Producto(data);

        await producto.save();

        res.status(201).json({
            msg: 'producto EN creado',
            producto
        });
    } catch (err) {
        console.log(err);
    }
}

//actualizarproducto 
const actualizarProducto = async (req, res = response) => {
    const { id } = req.params;
    const {estado, usuario, ...resto} = req.body;

    const producto = await Producto.findByIdAndUpdate(id, resto, {new:true} );
    res.status(201).json({
        msg: 'producto  actualizado',
        producto
    });
}


//borrarproducto- borrado logico
const borrarProducto = async (req, res = response) => {
    const { id } = req.params;

    const producto = await Producto.findByIdAndUpdate(id, { estado: false }, {new:true});
    res.status(201).json({
        msg: 'producto eliminado',
        producto
    });
}


module.exports = {
    productoGet,
    productoPost,
    actualizarProducto,
    borrarProducto,
    obtenerProducto,
    listarProducto
}