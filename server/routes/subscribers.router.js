const express = require('express');
const subscriberController= require("../controllers/subscribers.controller");
const router = express.Router();
const schedule = require('node-schedule');
const axios = require('axios');

// POST requests
router.post('/addemail', subscriberController.addEmail);
router.post('/senddaily', subscriberController.sendDailyEmails);
router.post('/sendweekly', subscriberController.sendWeeklyEmails);

// GET requests
router.get('/getemails', subscriberController.getEmails);

// DELETE requests
router.delete('/unsubscribe/:id', subscriberController.removeEmail);

// timing stuff
const dayJob = schedule.scheduleJob('0 0 */1 * * ', () => {
    console.log('sending daily');
    axios.post('http://localhost:4000/subscribers/senddaily')
        .then(res => console.log('success'))
        .catch(err => console.log(err))
});
dayJob.schedule();

module.exports = router;
