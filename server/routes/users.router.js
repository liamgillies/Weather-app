const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// user login stuff
router.post('/authenticate', userController.authenticate);
router.post('/register', userController.register);

//saved location stuff
router.post('/addLocation', userController.addLocation);
router.post('/removeLocation', userController.removeLocation);


// comment stuff
router.post('/addComment', userController.addComment);
router.post('/getUserComments', userController.getUserComments);
router.post('/like', userController.like);
router.post('/dislike', userController.dislike);
router.post('/addReply', userController.addReply)

router.delete('/deleteComment/:id', userController.deleteComment);
router.delete('/deleteReply/:id', userController.deleteReply);

router.get('/getAllComments', userController.getAllComments)
router.get('/getBaseComments', userController.getBaseComments);

module.exports = router;
