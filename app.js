'use strict';

const express = require('express');
const cors = require('cors');
const productRoutes = require('./src/routes/productRoutes');
const userRoutes = require('./src/routes/userRoutes');
const authRoutes = require('./src/routes/authRoutes');
require('dotenv').config();

const app = express();

app.use(cors({
	origin: 'http://localhost:8080'
}));

app.use(express.json());

require('./src/db');

app.use('/api', productRoutes);
app.use('/api', userRoutes);
app.use('/api', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
