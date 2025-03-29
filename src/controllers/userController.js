'use strict';

const bcrypt = require('bcryptjs');
const User = require('../db/models/user.model');

const createUser = async (req, res) => {
	try {
		const { name, password } = req.body;

		const existingUser = await User.findOne({ name: { $regex: `^${name}$`, $options: 'i' } });

		if(existingUser)
			return res.status(400).json({ error: 'El nombre de usuario ya está en uso.' });

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = new User({
			name,
			password: hashedPassword
		});

		await newUser.save();
		res.status(201).json(newUser);
	} catch(error) {
		res.status(400).json({ error: error.message });
	}
};

const updateUserController = async (req, res) => {
	try {
		const { _id } = req.params;
		const { name, password } = req.body;

		const updatedUser = await User.findOneAndUpdate(
			{ _id },
			{ name, password },
			{ new: true }
		);

		if(!updatedUser)
			return res.status(404).json({ message: 'Usuario no encontrado' });

		res.status(200).json(updatedUser);
	} catch(error) {
		console.error(error);
		res.status(400).json({ error: error.message });
	}
};

const deleteUserController = async (req, res) => {
	try {
		const { _id } = req.params;

		const deletedUser = await User.findOneAndDelete({ _id });

		if(!deletedUser)
			return res.status(404).json({ error: 'Usuario no encontrado' });

		res.status(200).json({ message: 'Usuario eliminado correctamente' });
	} catch(error) {
		console.error(error);
		res.status(400).json({ error: error.message });
	}
};

module.exports = {
	createUser,
	updateUserController,
	deleteUserController
};
