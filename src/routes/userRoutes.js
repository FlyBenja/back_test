'use strict';

const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/', (req, res) => {
	res.status(200).send({ info: 'Welcome to our RESTful API, DAC.' });
});

router.post('/user', userController.createUser);

router.put('/user/:_id', userController.updateUserController);

router.delete('/user/:_id', userController.deleteUserController);

module.exports = router;
