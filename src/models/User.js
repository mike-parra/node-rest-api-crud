// Esquema para la creacion de usuarios
const { Schema, model } = require('mongoose');// importamos lo unico que necesitamos, Schema para crear un esquema,y model para poder exportar

const userSchema = new Schema({// creando esquema
    username: {
        type: String, //indica el tipo de dato de la propiedad
        unique: true, // es para indicar que el nombre de usuario va ser unico
        require: true //indica que esta propiedad es obligatoria
    },
    name: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: new Date()
    },
    email: {
        type: String
    },
    cars: [{
        type: Schema.Types.ObjectId,// establecemos que esta propiedad es de un objeto que proviene de otra coleccion
        ref: 'Car' // la refrencia a la coleccion
    }]

})

module.exports = model('User', userSchema);// exportamos el modelo