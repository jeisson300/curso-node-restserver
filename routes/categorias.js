const { Router } = require('express');
const { check } = require('express-validator');
const { categoriaGet, categoriaPost, actualizarCategoria, borrarCategoria, obtenerCategoria, listarCategoria } = require('../controllers/categoria');
const { existeCategoria } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJwt } = require('../middlewares/validar-jwt');
const {  isRole } = require('../middlewares/validar-roles');

const router = Router();

// get all
router.get('/', listarCategoria);

//categoria por id - como un buscar
router.get('/:id', [
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
],obtenerCategoria);

// crear categoria  privado, - cualquier persona con token valido
router.post('/',[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarJwt,
    validarCampos
], categoriaPost);

//actualizar  la categoria por id - privado- token valido
router.put('/:id',[
    check('id', 'El id no es valido').isMongoId(),
    validarJwt,
    check('id').custom(existeCategoria),
    check('nombre', 'el nombre es obligatorio').not().isEmpty(),
    validarCampos
], actualizarCategoria);

//borrar - privado- con token valido -- splo admin
router.delete('/:id',[
    check('id', 'El id no es valido').isMongoId(),
    validarJwt,
    isRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id').custom(existeCategoria),
    validarCampos
], borrarCategoria);



module.exports = router;