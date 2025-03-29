'use strict';

const mongoose = require('mongoose');
require('dotenv').config(); // Carga las variables de entorno desde el archivo .env

const uri = process.env.MONGO_URI;

mongoose.connect(uri)
    .then(() => console.log('Conectado a MongoDB Atlas'))
    .catch(error => console.log('Error de conexión a MongoDB:', error));

module.exports = mongoose;
