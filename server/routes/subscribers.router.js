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

// timing stuff, second - minute - hour (*/1 is every 1 hour) - day - month - day of week
// attempt to send every hour every day
const dayJob = schedule.scheduleJob('0 0 */1 * * *', () => {
    console.log('sending daily');
    axios.post('http://localhost:4000/subscribers/senddaily')
        .then(() => {})
        .catch(err => console.log(err))
});
dayJob.schedule();

// attempt to send every hour on sundays 0 0 */1 * * 7
const weekJob = schedule.scheduleJob('0 0 */1 * * 7', () => {
    console.log('sending weekly');
    axios.post('http://localhost:4000/subscribers/sendweekly')
        .then(() => {})
        .catch(err => console.log(err));
})
weekJob.schedule();

module.exports = router;
