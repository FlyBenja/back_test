'use strict';

const mongoose = require('mongoose');

const productoschema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	type: {
		type: String,
		required: true,
		enum: ['burger', 'condiments', 'snacks', 'drinks']
	},
	price: {
		type: Number,
		required: true
	},
	image: {
		type: String
	},
	isPromotion: {
		type: Boolean,
		default: false
	},
	discount: {
		type: Number,
		validate: {
			validator(value) {
				return this.isPromotion ? value >= 0 && value <= 100 : true;
			},
			message: 'Discount can only be set if the product is in promotion.'
		}
	},
	ingredients: {
		type: [String],
		required: true,
		validate: {
			validator(value) {
				return new Set(value).size === value.length;
			},
			message: 'Ingredients must be unique.'
		}
	},
	dateCreated: {
		type: Date,
		default: Date.now
	},
	status: {
		type: String,
		default: 'active'
	}
});

const Product = mongoose.model('Product', productoschema);

module.exports = Product;
