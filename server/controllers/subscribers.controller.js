const subscriberService = require("../services/subscribers.service");
const emailSchema = require("../models/email-schema")
module.exports = {
    addEmail,
    getEmails,
    removeEmail
}

function addEmail(req, res, next) {
    const d = req.body.daily;
    const w = req.body.weekly;
    subscriberService.validateEmail(req.body.email).then(result => {
        emailSchema.findOneAndUpdate({email: result},
            {email: result, daily: d, weekly: w},
            {upsert: true},
            (err, result) => {
            if(err) {
                const e = new emailSchema({email: result, daily: d, weekly: w});
                e.save();
            }
            res.json(result);
        });
    }).catch(err => console.log(err));
}

function removeEmail(req, res, next) {
    emailSchema.deleteOne({email: req.body.email}, err => {
        if(err) res.send(err);
        else res.send('success');
    });
}

function getEmails(req, res, next) {
    res.send('not implemented yet');
}
