const User = require('../models/User') //improtamos el modelo de user
const Car = require('../models/Car') // importamos el modelo de car

module.exports = { //exportamos directamente las funciones
    listUsers: async (req, res, next) => {// traemos todos los usuarios 
        const users = await User.find()
        //throw new Error('probando errores') //probamos como captura los errores manualmente o con Express promise router
        res.json(users);
    },

    createUser: async (req, res, next) => { //insertamos un usuario en la bd
        const newUser = new User(req.body); //recuperamos los datos de usuario que es enviado en req
        const user = await newUser.save(); //guardamos el usuario en la bd
        res.json(user)
    },

    getUser: async (req, res, next) => { // buscamos un ussario por su id de la bd
        const { userId } = req.params;// recuperamos el id de los parametros de req
        const user = await User.findById(userId)// mandamos el id del usuario para la busqueda
        res.json(user);//regresamos el usuario
    },

    updateUserPut: async (req, res, next) => { //actualizamos un usuario por su id
        const { userId } = req.params;
        const newUser = req.body;// recuperamos el body (JSON) con los nuevos datos del usuario
        const oldUser = await User.findByIdAndUpdate(userId, newUser);// mandamos el id del usuario jundo con los datos nuevos
        res.json({ success: true })// regresamos un estado success
    },

    updateUserPatch: async (req, res, next) => { // actualizamos un usuario por su id
        const { userId } = req.params;
        const newUser = req.body;
        const oldUser = await User.findByIdAndUpdate(userId, newUser);
        res.json({ success: true })
    },

    deleteUser: async (req, res, next) => { //eliminamos un usuario por su id
        const { userId } = req.params;
        const oldUser = await User.findByIdAndDelete(userId);// enivamos el id del usuario a eliminar
        res.json({ success: true })
    },

    getUserCars: async (req, res, next) => {// traemos los usuarios junto con sus carros
        const { userId } = req.params;
        const user = await User.findById(userId).populate('cars')// treaemos un usuario junto con el JSON completo de los carros
        res.json(user)
    },

    newUserCar: async (req, res, next) => { // creamos y asignamos un carro a un usuario
        const { userId } = req.params;
        const newCar = new Car(req.body)// recuperamos el body del nuevo carros
        const user = await User.findById(userId)// traemos el usuario usando su id
        newCar.seller = user// le asignamos al carro cual es su vendedor
        await newCar.save()// guardamos el carro en la bd
        user.cars.push(newCar)// hacemos push del array a ala propiedad de user ,como cars es una propiedad array en users, es necesario hacer push y no solo asignarlo
        await user.save()// guardamos el usuario
        res.status(201).json(newCar)// respondemos con el nuevo carro
    },

    documents: async (req, res, next) => {
        console.log(req.file);//muestrar las propiedades del archivo en consola
        res.send('Uploaded');
    }

}