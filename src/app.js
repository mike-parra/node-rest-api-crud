const express = require('express')// importando express
const morgan = require('morgan');// improtando morgan para ser el logger
const mongoose = require('mongoose')//improtamos mongoose para la conexion a la bd en mongo
const userRoutes = require('./routes/usersroutes')// rutas del rest


//+-+-+-+-+-+- MULTER -+-+-+-+-+-+-+-+
const multer = require('multer'); // biblioteca que nos permite recibir y enviar archivos meiante los servicios
const path = require('path');// biblioteca para el destino interno de proyecto
const { v4: uuidv4 } = require('uuid');// generador aleatorio de id unicos universales para los nombres de los archivos a subir

const storage = multer.diskStorage({// configuraciones de multer usando la constante storage
    destination: path.join(__dirname, 'public/documents'),
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


const app = express()//inicializando express

// Estableciondo conexion a la BD en mongo db
const dbUri = 'mongodb://127.0.0.1:27017/restapitexample';//direccion de la base de datos a la que nos conectaremos, no es necesario haberla creado previamente

const dbEvents = mongoose.connection;

mongoose.connect(dbUri, {// establcesmos la bd a la que nos vamos a conectar,y establecemos las propiedades recomendadas para la conexion
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
    .catch(err => console.log(err)) // escuchamos un error directamente al ejecutar la funcion connect de mongoose

// Escuchando eventos en la conexion a la base de datos -+-+-+-+-+-+-+-+

dbEvents.once('open', _ => {    // Cuando la conexion ha sido establecida exitosamente
    console.log('Database is connected to ', dbUri);
});

dbEvents.on('error', err => {    // Cuando orcurre un error en la conexion
    console.log(err);
})

// settings (configuracionde del servidor o aplicacion)
app.set('port', process.env.PORT || 3000) // Establecionedo puerto, primero verifica si el os tiene un puerto designado para app, si no usa el 3000

// middlewares - pseudo aplicaciones para express
app.use(morgan('dev')); //es un logger para ver las peticiones que se realizan al api rest
app.use(express.urlencoded({ extended: false }));// soportando los datos JSON a recibir se usa en lugar de body-parser
app.use(express.json());// soprtando los datos JSON a recibir se usa en lugar de body-parser

// MULTER
app.use(multer({storage}).single('file'));//.any());// Improtant, the key on postman must be de same as 'image' or what ever you put in single, you can use array if you are uploading more that 1 file

// Rutas de la pp
app.use('/user', userRoutes)

app.post('/upload', (req, res) => {
    console.log(req.file);//muestrar las propiedades del archivo en consola
    res.send('Uploaded');
})


//statics files, para acceder a la carpeta public
app.use(express.static(path.join(__dirname, 'public')))

// Starting server
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});

