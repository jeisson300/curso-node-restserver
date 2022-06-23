const { Router } = require('express');
const { check } = require('express-validator');
const { usuariosGet, usuariosPut, usuariosPost, usuariosPatch, usuariosDelete } = require('../controllers/user');
const { isRoleValidate, isEmailsExists, isExistUserId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJwt } = require('../middlewares/validar-jwt');
const { esAdminRole, isRole } = require('../middlewares/validar-roles');


const router = Router();


router.get('/', usuariosGet);

router.put('/:id', [
    check('id', 'No es un ID  válido').isMongoId(),
    check('id').custom(isExistUserId),
    check('rol').custom(isRoleValidate),
    validarCampos
], usuariosPut);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('correo', 'El correo no es valido').isEmail(),
    check('password', 'El password debe de ser mas de 6 letras').isLength({ min: 6 }),
    // check('rol', 'No es un rol valido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('rol').custom(isRoleValidate),
    check('email').custom(isEmailsExists),
    validarCampos,
], usuariosPost);

router.patch('/', usuariosPatch);

router.delete('/:id', [
    validarJwt,
    // esAdminRole,
    isRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id').custom(isExistUserId),
    validarCampos
], usuariosDelete);



module.exports = router;