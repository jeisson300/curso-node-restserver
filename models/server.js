
const express = require('express');
var cors = require('cors');
const { dbConnection } = require('../db/config');
class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';
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
    }

    routes() {
        this.app.use(this.usuariosPath, require('../routes/user'));
    }

    listen() {
        this.app.listen(this.port);
    }


}
module.exports = Server;