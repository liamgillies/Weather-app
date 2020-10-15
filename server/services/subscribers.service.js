const nodemailer = require('nodemailer');
const dailyTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'dailypixelweather@gmail.com',
        pass: 'dailypixelweather155'
    }
});
const weeklyTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'weeklypixelweather@gmail.com',
        pass: 'weeklypixelweather135'
    }
});
const dailyMailOptions = {
    from: 'dailypixelweather@gmail.com',
    to: 'lwgillies@gmail.com',
    subject: 'Daily Weather Report',
    text: 'this is a daily email'
}
const weeklyMailOptions = {
    from: 'weeklypixelweather@gmail.com',
    to: 'lwgillies@gmail.com',
    subject: 'Weekly Weather Report',
    text: 'this is a weekly email'
}
module.exports = {
    validateEmail,
    getEmails,
    sendDailyEmails,
    sendWeeklyEmails
}

function validateEmail(email) {
    return new Promise((resolve, reject) => {
        const re = /\S+@\S+\.\S+/;
        if(re.test(email)){
            resolve(email);
        }
        else {
            reject('invalid email')
        }
    });
}

function sendDailyEmails() {
    dailyTransporter.sendMail(dailyMailOptions, (error, info) => {
        if(error){
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    })
}

function sendWeeklyEmails() {
    weeklyTransporter.sendMail(weeklyMailOptions, (error, info) => {
        if(error){
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    })
}

function getEmails() {

}


