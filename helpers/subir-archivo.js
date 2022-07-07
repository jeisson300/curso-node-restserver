
const path = require('path')
const {v4} = require('uuid');

const subirArchivo = async(files, extensionesValidas =  ['png', 'jpg', 'jpeg', 'gif'], carpeta = '')=>
{
    return new Promise ((resolve, reject)=>
    {
    const { archivo } = files;
    const nombreCortado = archivo.name.split('.');
    const extension = nombreCortado[nombreCortado.length - 1];

    // validar la extension
    if (!extensionesValidas.includes(extension)) {
        return reject(`la extension ${extension} no es permitida`);
    }

    const nombreTemporal = v4()+ '.'+ extension;

    const uploadPath = path.join(__dirname, '../uploads/',carpeta,  nombreTemporal);

    archivo.mv(uploadPath, (err) => {
        if (err) {
            console.log(err)
            return reject( err);
        }
        resolve(nombreTemporal);
    })
});

}



module.exports = {
    subirArchivo
}