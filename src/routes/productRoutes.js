'use strict';

const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

router.get('/', (req, res) => {
	res.status(200).send({ info: 'Welcome to the Fizz-Burger API' });
});

router.post('/product', productController.createProduct);
router.get('/product', productController.getAllProducts);
router.get('/product/:_id', productController.getProductById);
router.put('/product/:_id', productController.updateProduct);
router.delete('/product/:_id', productController.deleteProduct);

module.exports = router;
