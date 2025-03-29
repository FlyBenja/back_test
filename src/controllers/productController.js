'use strict';

const mongoose = require('mongoose');
const Product = require('../db/models/product.model');

const createProduct = async (req, res) => {
	try {
		const {
			name,
			type,
			price,
			image,
			isPromotion,
			discount,
			ingredients,
			status
		} = req.body;

		if(isPromotion && (discount < 0 || discount > 100))
			return res.status(400).json({ error: 'Discount must be between 0 and 100 when the product is in promotion.' });

		const newProduct = new Product({
			name,
			type,
			price,
			image,
			isPromotion,
			discount,
			ingredients,
			status: status || 'active'
		});

		await newProduct.save();
		res.status(201).json(newProduct);
	} catch(error) {
		res.status(400).json({ error: error.message });
	}
};

const getAllProducts = async (req, res) => {
	try {
		const {
			name, type, priceFrom, priceTo, isPromotion, orderBy, orderDirection
		} = req.query;

		const filters = {};

		if(name)
			filters.name = { $regex: name, $options: 'i' };
		if(type)
			filters.type = type;
		if(priceFrom && priceTo)
			filters.price = { $gte: parseFloat(priceFrom), $lte: parseFloat(priceTo) };
		else if(priceFrom)
			filters.price = { $gte: parseFloat(priceFrom) };
		else if(priceTo)
			filters.price = { $lte: parseFloat(priceTo) };
		if(isPromotion !== undefined)
			filters.isPromotion = isPromotion === '1';

		const validOrderBy = ['name', 'price', 'type', 'discount'];
		const validOrderDirection = ['asc', 'desc'];

		if(orderBy && !validOrderBy.includes(orderBy))
			return res.status(400).json({ error: 'Invalid orderBy field' });

		if(orderDirection && !validOrderDirection.includes(orderDirection))
			return res.status(400).json({ error: 'Invalid orderDirection value' });

		const order = orderBy && orderDirection ? { [orderBy]: orderDirection === 'asc' ? 1 : -1 } : {};

		const products = await Product.find(filters).sort(order);

		res.json(products);
	} catch(error) {
		res.status(500).json({ error: error.message });
	}
};

const getProductById = async (req, res) => {
	try {
		const { _id } = req.params;

		if(!mongoose.Types.ObjectId.isValid(_id))
			return res.status(400).json({ error: 'ID no válido' });

		const product = await Product.findOne({ _id });

		if(!product)
			return res.status(404).json({ message: `Producto con ID ${_id} no encontrado` });

		res.json(product);
	} catch(error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
};

const updateProduct = async (req, res) => {
	try {
		const { _id } = req.params;
		const {
			name,
			type,
			price,
			image,
			isPromotion,
			discount,
			ingredients,
			status
		} = req.body;

		const uniqueIngredients = [...new Set(ingredients)];
		if(uniqueIngredients.length !== ingredients.length)
			return res.status(400).json({ error: 'Los ingredientes deben ser únicos.' });

		if(isPromotion && (discount < 0 || discount > 100))
			return res.status(400).json({ error: 'El descuento debe estar entre 0 y 100 cuando el producto está en promoción.' });

		const updatedProduct = await Product.findOneAndUpdate(
			{ _id },
			{
				name,
				type,
				price,
				image,
				isPromotion,
				discount,
				ingredients,
				status: status || undefined,
				dateModified: Date.now()
			},
			{ new: true }
		);

		if(!updatedProduct)
			return res.status(404).json({ message: `Producto con ID ${_id} no encontrado` });

		res.status(200).json(updatedProduct);
	} catch(error) {
		console.error(error);
		res.status(400).json({ error: error.message });
	}
};

const deleteProduct = async (req, res) => {
	try {
		const { _id } = req.params;

		if(!mongoose.Types.ObjectId.isValid(_id))
			return res.status(400).json({ error: 'ID no válido' });

		const deletedProduct = await Product.findOneAndDelete({ _id });

		if(!deletedProduct)
			return res.status(404).json({ error: `Producto con ID ${_id} no encontrado` });

		res.status(200).json(deletedProduct);
	} catch(error) {
		console.error(error);
		res.status(400).json({ error: error.message });
	}
};
module.exports = {
	createProduct,
	getAllProducts,
	getProductById,
	updateProduct,
	deleteProduct
};
