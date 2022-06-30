const { Router } = require('express');
const { check } = require('express-validator');
const { productoPost, actualizarProducto, borrarProducto, obtenerProducto, listarProducto } = require('../controllers/productos');
const { existeCategoria, existeProducto } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJwt } = require('../middlewares/validar-jwt');
const {  isRole } = require('../middlewares/validar-roles');

const router = Router();

// get all
router.get('/', listarProducto);

//categoria por id - como un buscar
router.get('/:id', [
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
],obtenerProducto);

// crear categoria  privado, - cualquier persona con token valido
router.post('/',[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'id categoria invalido').isMongoId(),
    check('categoria').custom(existeCategoria),
    validarJwt,
    validarCampos
], productoPost);

//actualizar  la categoria por id - privado- token valido
router.put('/:id',[
    check('id', 'El id no es valido').isMongoId(),
    validarJwt,
    check('categoria', 'id categoria invalido').isEmpty(),
    check('id').custom(existeProducto),
    validarCampos
], actualizarProducto);

//borrar - privado- con token valido -- splo admin
router.delete('/:id',[
    check('id', 'El id no es valido').isMongoId(),
    validarJwt,
    isRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id').custom(existeProducto),
    validarCampos
], borrarProducto);




module.exports = router;