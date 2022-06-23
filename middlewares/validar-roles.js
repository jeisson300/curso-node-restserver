const { request, response } = require("express")

const esAdminRole = (req = request, res = response, next) => {
    if (!req.userauth) {
        return res.status(500).json({
            msg: 'Se quiere verificar el role sin validar el token primero'
        });
    }
    const { rol, nombre } = req.userauth;
    if (rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${nombre} no es administrador`
        });
    }

    next();
}

const isRole = (...roles) => {
    return (req, res = response, next) => {
        if (!req.userauth) {
            return res.status(500).json({
                msg: 'Se quiere verificar el role sin validar el token primero'
            });
        }

        if(!roles.includes(req.userauth.rol))
        {
            res.status(401).json({
                msg:`El servicio require uno de estos roles ${roles}`
            });
        }
        next();
    }
}


module.exports = {
    esAdminRole,
    isRole
}