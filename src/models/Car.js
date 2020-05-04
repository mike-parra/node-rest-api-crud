const { Schema, model } = require('mongoose');// importamos lo unico que necesitamos, Schema para crear un esquema,y model para poder exportar

const carSchema = new Schema({
    make:String,
    model:String,
    year: Number,
    seller: {
        type: Schema.Types.ObjectId,// establecemos que esta propiedad es de un objeto que proviene de otra coleccion
        ref: 'user'// la refrencia a la coleccion
    }
})

module.exports = model('Car', carSchema)