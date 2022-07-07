
const express = require('express');
var cors = require('cors');
const { dbConnection } = require('../db/config');
const fileUpload = require('express-fileupload');
class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth: '/api/auth',
            usuarios: '/api/usuarios',
            categorias: '/api/categoria',
            productos: '/api/producto',
            buscar: '/api/buscar',
            uploads: '/api/uploads',

        }
        //Conectar a base de datos
        this.database();
        //middlewares   
        this.middleware();


        this.routes();
    }


    async database() {
        await dbConnection();
    }

    middleware() {

        //CORS
        this.app.use(cors());

        //Parseo y lectura del body
        this.app.use(express.json());

        //directorio publico
        this.app.use(express.static('public'));

        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));
    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.usuarios, require('../routes/user'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.productos, require('../routes/productos'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));
    }

    listen() {
        this.app.listen(this.port);
    }


}
module.exports = Server;