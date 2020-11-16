const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');


router.post('/authenticate', userController.authenticate);
router.post('/register', userController.register);
router.post('/addLocation', userController.addLocation);
router.post('/removeLocation', userController.removeLocation);

router.post('/addComment', userController.addComment);
router.get('/getComments', userController.getBaseComments);
router.post('/getUserComments', userController.getUserComments);
router.delete('/deleteComment/:id', userController.deleteComment);
module.exports = router;
