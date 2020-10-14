const express = require('express');
const subscriberController= require("../controllers/subscribers.controller");
const router = express.Router();

/* GET users listing. */
router.post('/addemail', subscriberController.addEmail);
router.post('/unsubscribe', subscriberController.removeEmail);
router.get('/getemails', subscriberController.getEmails);

module.exports = router;
