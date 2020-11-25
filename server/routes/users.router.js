const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');


router.post('/authenticate', userController.authenticate);
router.post('/register', userController.register);
router.post('/addLocation', userController.addLocation);
router.post('/removeLocation', userController.removeLocation);


// comment stuff
router.post('/addComment', userController.addComment);
router.get('/getComments', userController.getBaseComments);
router.post('/getUserComments', userController.getUserComments);
router.delete('/deleteComment/:id', userController.deleteComment);
router.post('/like', userController.like);
router.post('/dislike', userController.dislike);
router.post('/addReply', userController.addReply)
router.delete('/deleteReply/:id', userController.deleteReply)


module.exports = router;
