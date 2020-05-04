//const express = require ('express')// improtamos express

const router = require('express-promise-router')();//este router es mas eficiente para manejar los errores, eliminamos la necesida de utilizar callback promesas o try catch

//const router = express.Router()// Router es el objeto que nos permitira manejar las rutas de nuestra api.

const userController = require('../controllers/userController')

router.get('/', userController.listUsers)//listar usuarios
router.get('/:userId', userController.getUser);//Buscar un unico usuario, recibiendo el id mediante el endpoint como parametro para eso es el :userIDd
router.get('/:userId/cars',userController.getUserCars)// obteniendo los carros por usuario
router.post('/', userController.createUser)//crear un usuario
router.post('/:userId/cars', userController.newUserCar)//insertando carros a un usuario
router.put('/:userId', userController.updateUserPut)//actualiar usuario
router.delete('/:userId',userController.deleteUser)//eliminar un usuario

router.post('/document',userController.documents)//servicio para subir archivos

module.exports = router;