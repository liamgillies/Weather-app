const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');


router.post('/authenticate', userController.authenticate);
router.post('/register', userController.register);
router.post('/addLocation', userController.addLocation)
router.post('/removeLocation', userController.removeLocation)
module.exports = router;
