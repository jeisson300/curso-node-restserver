const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivos, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads');
const { coleccionesP } = require('../helpers/db-validators');
const { validarArchivo } = require('../middlewares/validar-archivo');
const { validarCampos } = require('../middlewares/validar-campos');



const router = Router();


router.post('/', validarArchivo, cargarArchivos);
router.put('/:coleccion/:id',[
    validarArchivo,
    check('id', 'id invalido').isMongoId(),
    check('coleccion').custom(c=> coleccionesP(c, ['users', 'productos'])),
    validarCampos
], actualizarImagenCloudinary);
//actualizarImagen
router.get('/:coleccion/:id', [
    check('id', 'id invalido').isMongoId(),
    check('coleccion').custom(c=> coleccionesP(c, ['users', 'productos'])),
    validarCampos
],mostrarImagen);

module.exports = router;