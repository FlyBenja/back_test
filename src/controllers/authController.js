'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../db/models/user.model');

const login = async (req, res) => {
	try {
		const { name, password } = req.body;

		const user = await User.findOne({ name });
		if(!user)
			return res.status(404).json({ error: 'User not found' });

		const isMatch = await bcrypt.compare(password, user.password);
		if(!isMatch)
			return res.status(400).json({ error: 'Invalid credentials' });

		const token = jwt.sign(
			{ userId: user.id, name: user.name },
			process.env.JWT_SECRET,
			{ expiresIn: '1h' }
		);

		res.status(200).json({ token });
	} catch(error) {
		res.status(500).json({ error: error.message });
	}
};

const verifyToken = async (req, res) => {
	try {
		const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
		if(!token)
			return res.status(400).json({ error: 'Token is required' });

		jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
			if(err)
				return res.status(401).json({ error: 'Token is not valid or has expired' });

			return res.status(200).json({ message: 'Token is active', user: decoded });
		});
	} catch(error) {
		res.status(500).json({ error: error.message });
	}
};

module.exports = { login, verifyToken };
