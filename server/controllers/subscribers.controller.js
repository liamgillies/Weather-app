const subscriberService = require("../services/subscribers.service");
const emailSchema = require("../models/email-schema")
module.exports = {
    addEmail,
    getEmails
}

function addEmail(req, res, next) {
    const d = req.body.daily;
    const w = req.body.weekly;
    subscriberService.validateEmail(req.body.email).then(result => {
        const e = new emailSchema({email: result, daily: d, weekly: w});
        console.log(e);
        e.save(err => res.send(err));
    }).catch(err => console.log(err));
}

function getEmails(req, res, next) {
    res.send('not implemented yet');
}
