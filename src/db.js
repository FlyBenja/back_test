'use strict';

const mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017/fizz_burger';

mongoose.connect(uri)
	.then(() => console.log('Conectado a MongoDB'))
	.catch(error => console.log('Error de conexión a MongoDB:', error));

module.exports = mongoose;
