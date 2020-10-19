const nodemailer = require('nodemailer');
const emailSchema = require('../models/email-schema');
const fetch = require("node-fetch");

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
    emailSchema.find({daily: true}, (err, users) => {
        if(err) throw new Error(err);

        users.map(user => {
            console.log(user);
            fetch(user.url).then(res => res.json())
                .then(res => fetch(res.properties.forecastHourly)
                    .then(res => res.json()).then(res => {
                        let i;
                        let max = res.properties.periods[0].temperature;
                        let min = res.properties.periods[0].temperature;
                        let dict = new Map();
                        let shortForecast = '';
                        for (i = 1; i < 24; i++) {
                            max = Math.max(max, res.properties.periods[i].temperature);
                            min = Math.min(max, res.properties.periods[i].temperature);
                            if(dict.has(res.properties.periods[i].shortForecast)) {
                                dict[res.properties.periods[i].shortForecast]+=1;
                            }
                            else {
                                dict.set(res.properties.periods[i].shortForecast, 1);
                            }
                        }
                        let prevMax = 0;
                        for (let [k, v] of dict) {
                            if(v>prevMax) {
                                shortForecast = k;
                                prevMax = v;
                            }
                        }
                        const template =
                            'Today will have a high of ' + max + ' °F and a low of ' + min + ' °F. <br/>' +
                            'Temperature Trend: ' + shortForecast + '. <br/><br/>' +
                            '12AM: ' + res.properties.periods[0].temperature + '°F <br/>' +
                            '1AM: ' + res.properties.periods[1].temperature + ' °F <br/>' +
                            '2AM: ' + res.properties.periods[2].temperature + ' °F <br/>' +
                            '3AM: ' + res.properties.periods[3].temperature + ' °F <br/>' +
                            '4AM: ' + res.properties.periods[4].temperature + ' °F <br/>' +
                            '5AM: ' + res.properties.periods[5].temperature + ' °F <br/>' +
                            '6AM: ' + res.properties.periods[6].temperature + ' °F <br/>' +
                            '7AM: ' + res.properties.periods[7].temperature + ' °F <br/>' +
                            '8AM: ' + res.properties.periods[8].temperature + ' °F <br/>' +
                            '9AM: ' + res.properties.periods[9].temperature + ' °F <br/>' +
                            '10AM: ' + res.properties.periods[10].temperature + ' °F <br/>' +
                            '11AM: ' + res.properties.periods[11].temperature + ' °F <br/>' +
                            '12AM: ' + res.properties.periods[12].temperature + ' °F <br/>' +
                            '1PM: ' + res.properties.periods[13].temperature + ' °F <br/>' +
                            '2PM: ' + res.properties.periods[14].temperature + ' °F <br/>' +
                            '3PM: ' + res.properties.periods[15].temperature + ' °F <br/>' +
                            '4PM: ' + res.properties.periods[16].temperature + ' °F <br/>' +
                            '5PM: ' + res.properties.periods[17].temperature + ' °F <br/>' +
                            '6PM: ' + res.properties.periods[18].temperature + ' °F <br/>' +
                            '7PM: ' + res.properties.periods[19].temperature + ' °F <br/>' +
                            '8PM: ' + res.properties.periods[20].temperature + ' °F <br/>' +
                            '9PM: ' + res.properties.periods[21].temperature + ' °F <br/>' +
                            '10PM: ' + res.properties.periods[22].temperature + ' °F <br/>' +
                            '11PM: ' + res.properties.periods[23].temperature + ' °F <br/>'

                        ;

                        const dailyMailOptions = {
                            from: 'dailypixelweather@gmail.com',
                            to: user.email,
                            subject: 'Daily Weather Report',
                            html: template
                        }

                        dailyTransporter.sendMail(dailyMailOptions, (error, info) => {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log('Email sent: ' + info.response);
                            }
                        });
                    }));
        });
    });
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


