'use strict';

const mongoose = require('mongoose');

const userschema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true,
		unique: true
	}
});

const User = mongoose.model('User', userschema);

module.exports = User;
