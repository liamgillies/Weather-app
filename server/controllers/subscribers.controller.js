const subscriberService = require("../services/subscribers.service");
const emailSchema = require("../models/email-schema")
module.exports = {
    addEmail,
    getEmails,
    removeEmail,
    sendDailyEmails,
    sendWeeklyEmails
}

function addEmail(req, res, next) {
    const d = req.body.daily;
    const w = req.body.weekly;
    const u = req.body.url;
    const t = req.body.timeZone;
    const e = req.body.email;
    emailSchema.findOneAndUpdate({email: e},
        {email: e, daily: d, weekly: w, url: u, timeZone: t},
        {upsert: true},
        (err) => {
        if(err) {
            const newEmail = new emailSchema({email: result, daily: d, weekly: w, url: u, timeZone: t});
            console.log(e);
            newEmail.save();
        }
        res.send();
    });
}

function removeEmail(req, res, next) {
    emailSchema.deleteOne({_id: req.params.id}, err => {
        if(err) res.send(err);
        else res.send('success');
    });
}

function getEmails(req, res, next) {
    res.send('not implemented yet');
}

function sendDailyEmails(req, res, next) {
    subscriberService.sendDailyEmails();
}

function sendWeeklyEmails(req, res, next) {
    subscriberService.sendWeeklyEmails();
}
