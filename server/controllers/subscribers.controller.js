const subscriberService = require("../services/subscribers.service");
module.exports = {
    addEmail,
    getEmails
}

function addEmail(req, res, next) {
    subscriberService.validateEmail(req.body.email).then(email => {
        res.send(email);
    })
}

function getEmails(req, res, next) {
    res.send('not implemented yet');
}
