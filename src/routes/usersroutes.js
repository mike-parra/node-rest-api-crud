//const express = require ('express')// improtamos express

const router = require('express-promise-router')();//este router es mas eficiente para manejar los errores, eliminamos la necesida de utilizar callback promesas o try catch

//const router = express.Router()// Router es el objeto que nos permitira manejar las rutas de nuestra api.

const userController = require('../controllers/userController')

//+-+-+-+-+-+- MULTER -+-+-+-+-+-+-+-+
const multer = require('multer'); // biblioteca que nos permite recibir y enviar archivos meiante los servicios
const path = require('path');// biblioteca para el destino interno de proyecto
const { v4: uuidv4 } = require('uuid');// generador aleatorio de id unicos universales para los nombres de los archivos a subir

const storage = multer.diskStorage({// configuraciones de multer usando la constante storage
    destination: path.join(__dirname, '../public/documents'),
    filename: (req, file, next) => {
        //cb(null,file.originalname) //establece propiedades de guardado, en particlar, guardar con el nombre original
        next(null, uuidv4() + path.extname(file.originalname)) //concatenamos el id generaro con uuid con la extencion del archivo
    },
    limits: { fileSize: 1000000 }, // limites para la subida de los archivos
    fileFilter: (req, file, next) => { // filtarndo el tipo de archivo
        const filterTypes = /jpg|jpeg|png|gif|pdf/;
        const filetype = filterTypes.test(file.mimetype)// comprobando el tipo de archivo
        const extname = filterTypes.test(path.extname(file.originalname))// comprovando la extencion del archivo
        if (filetype && extname) {
            return next(null, true);
        } else {
            next('error: File type not supported')
        }
    }
});

const upload = multer({storage});

router.get('/', userController.listUsers)//listar usuarios
router.get('/:userId', userController.getUser);//Buscar un unico usuario, recibiendo el id mediante el endpoint como parametro para eso es el :userIDd
router.get('/:userId/cars',userController.getUserCars)// obteniendo los carros por usuario
router.post('/', userController.createUser)//crear un usuario
router.post('/:userId/cars', userController.newUserCar)//insertando carros a un usuario
router.put('/:userId', userController.updateUserPut)//actualiar usuario
router.delete('/:userId',userController.deleteUser)//eliminar un usuario

router.post('/document',upload.array('documents',10),userController.documents)//servicio para subir archivos

module.exports = router;