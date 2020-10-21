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
    emailSchema.findOneAndUpdate({email: result},
        {email: result, daily: d, weekly: w, url: u, timeZone: t},
        {upsert: true},
        (err, result) => {
        if(err) {
            const e = new emailSchema({email: result, daily: d, weekly: w, url: u, timeZone: t});
            console.log(e);
            e.save();
        }
        res.json(result);
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
    res.send(subscriberService.sendDailyEmails());
}

function sendWeeklyEmails(req, res, next) {
    res.send(subscriberService.sendWeeklyEmails())
}
