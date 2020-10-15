const express = require('express');
const subscriberController= require("../controllers/subscribers.controller");
const router = express.Router();

// POST requests
router.post('/addemail', subscriberController.addEmail);
router.post('/unsubscribe', subscriberController.removeEmail);
router.post('/senddaily', subscriberController.sendDailyEmails)
router.post('/sendweekly', subscriberController.sendWeeklyEmails)

// GET requests
router.get('/getemails', subscriberController.getEmails);

module.exports = router;
