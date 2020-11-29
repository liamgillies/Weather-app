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

module.exports = {
    getEmails,
    sendDailyEmails,
    sendWeeklyEmails
}

function sendDailyEmails() {
    emailSchema.find({daily: true}, (err, users) => {
        if(err) throw new Error(err);
        users.map(user => {
            // send email if it's 12AM in users timezone
            let d = new Date(new Date().toLocaleString("en-US", {timeZone: user.timeZone}));
            if(d.getHours().toString() === '00') {
                fetch(user.url)
                    .then(res => res.json())
                    .then(res => {
                        const userCity = res.properties.relativeLocation.properties.city;
                        const userState = res.properties.relativeLocation.properties.state;
                        fetch(res.properties.forecastHourly)
                            .then(res => res.json())
                            .then(res => {
                                let max = res.properties.periods[0].temperature;
                                let min = res.properties.periods[0].temperature;
                                let dict = new Map();
                                let shortForecast = '';
                                const t = res.properties.periods;
                                // get high and low temps and data for common short forecast
                                for (let i = 1; i < 24; i++) {
                                    max = Math.max(max, t[i].temperature);
                                    min = Math.min(min, t[i].temperature);
                                    if (dict.has(t[i].shortForecast)) {
                                        dict[t[i].shortForecast] += 1;
                                    } else {
                                        dict.set(t[i].shortForecast, 1);
                                    }
                                }
                                // get most commonly appearing short forecast
                                let prevMax = 0;
                                for (let [k, v] of dict) {
                                    if (v > prevMax) {
                                        shortForecast = k;
                                        prevMax = v;
                                    }
                                }
                                const link = `http://localhost:4200/unsubscribe/${user._id}`;
                                const template =
                                    `<h3>Your Location: ${userCity}, ${userState} </h3>` +
                                    'Today will have a high of ' + max + ' °F and a low of ' + min + ' °F. <br/>' +
                                    'Temperature Trend: ' + shortForecast + '. <br/><br/>' +
                                    '12AM: ' + t[0].temperature + ' °F, ' + t[0].shortForecast + '<br/>' +
                                    '1AM: ' + t[1].temperature + ' °F, ' + t[1].shortForecast + '<br/>' +
                                    '2AM: ' + t[2].temperature + ' °F, ' + t[2].shortForecast + '<br/>' +
                                    '3AM: ' + t[3].temperature + ' °F, ' + t[3].shortForecast + '<br/>' +
                                    '4AM: ' + t[4].temperature + ' °F, ' + t[4].shortForecast + '<br/>' +
                                    '5AM: ' + t[5].temperature + ' °F, ' + t[5].shortForecast + '<br/>' +
                                    '6AM: ' + t[6].temperature + ' °F, ' + t[6].shortForecast + '<br/>' +
                                    '7AM: ' + t[7].temperature + ' °F, ' + t[7].shortForecast + '<br/>' +
                                    '8AM: ' + t[8].temperature + ' °F, ' + t[8].shortForecast + '<br/>' +
                                    '9AM: ' + t[9].temperature + ' °F, ' + t[9].shortForecast + '<br/>' +
                                    '10AM: ' + t[10].temperature + ' °F, ' + t[10].shortForecast + '<br/>' +
                                    '11AM: ' + t[11].temperature + ' °F, ' + t[11].shortForecast + '<br/>' +
                                    '12PM: ' + t[12].temperature + ' °F, ' + t[12].shortForecast + '<br/>' +
                                    '1PM: ' + t[13].temperature + ' °F, ' + t[13].shortForecast + '<br/>' +
                                    '2PM: ' + t[14].temperature + ' °F, ' + t[14].shortForecast + '<br/>' +
                                    '3PM: ' + t[15].temperature + ' °F, ' + t[15].shortForecast + '<br/>' +
                                    '4PM: ' + t[16].temperature + ' °F, ' + t[16].shortForecast + '<br/>' +
                                    '5PM: ' + t[17].temperature + ' °F, ' + t[17].shortForecast + '<br/>' +
                                    '6PM: ' + t[18].temperature + ' °F, ' + t[18].shortForecast + '<br/>' +
                                    '7PM: ' + t[19].temperature + ' °F, ' + t[19].shortForecast + '<br/>' +
                                    '8PM: ' + t[20].temperature + ' °F, ' + t[20].shortForecast + '<br/>' +
                                    '9PM: ' + t[21].temperature + ' °F, ' + t[21].shortForecast + '<br/>' +
                                    '10PM: ' + t[22].temperature + ' °F, ' + t[22].shortForecast + '<br/>' +
                                    '11PM: ' + t[23].temperature + ' °F, ' + t[23].shortForecast + '<br/><br/>' +
                                    '<a href="'+ link +'" target="_blank">Unsubscribe</a>';

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
                                        console.log('Sent to : ' + user.email + ', ' + info.response);
                                    }
                                });
                        }).catch(err => console.log(err));
                    });
            }
        });
    });
}

function sendWeeklyEmails() {
    emailSchema.find({weekly: true}, (err, users) => {
        if(err) throw new Error(err);
        users.map(user => {
            // send email if it is 12AM in the user's timezone
            let d = new Date(new Date().toLocaleString("en-US", {timeZone: user.timeZone}));
            if(d.getHours().toString() === '00') {
                fetch(user.url)
                    .then(res => res.json())
                    .then(res => {
                        const userCity = res.properties.relativeLocation.properties.city;
                        const userState = res.properties.relativeLocation.properties.state;
                        fetch(res.properties.forecastHourly)
                            .then(res => res.json())
                            .then(res => {
                                let shortForecast = '';
                                let max = res.properties.periods[0].temperature;
                                let min = res.properties.periods[0].temperature;
                                const t = res.properties.periods;

                                // set days to last hour every day
                                let days = new Map();
                                days.set(23, "Monday");
                                days.set(47, "Tuesday");
                                days.set(71, "Wednesday");
                                days.set(95, "Thursday");
                                days.set(119, "Friday");
                                days.set(143, "Saturday");

                                let arr = [];

                                let dict = new Map();

                                // get data for next six days (6 * 24 = 144)
                                for (let i = 0; i < 144; i++) {
                                    max = Math.max(max, t[i].temperature);
                                    min = Math.min(min, t[i].temperature);
                                    if (dict.has(t[i].shortForecast)) {
                                        dict[t[i].shortForecast] += 1;
                                    } else {
                                        dict.set(t[i].shortForecast, 1);
                                    }
                                    if (days.has(i)) {
                                        // gets most common short forecast
                                        let prevMax = 0;
                                        for (let [k, v] of dict) {
                                            if (v > prevMax) {
                                                shortForecast = k;
                                                prevMax = v;
                                            }
                                        }
                                        arr.push({day: days.get(i), high: max, low: min, trend: shortForecast});
                                        // reset variables
                                        max = t[i+1].temperature;
                                        min = t[i+1].temperature;
                                        dict.clear();
                                        shortForecast = '';
                                    }
                                }

                                const link = `http://localhost:4200/unsubscribe/${user._id}`;
                                const template =
                                    `<h3>Your Location: ${userCity}, ${userState} </h3>` + '<br/>' +
                                    arr[0].day + ': ' + 'High: ' + arr[0].high + ', ' + 'Low: ' + arr[0].low + '<br/>' +
                                    'Trend: ' + arr[0].trend + '<br/><br/>' +
                                    arr[1].day + ': ' + 'High: ' + arr[1].high + ', ' + 'Low: ' + arr[1].low + '<br/>' +
                                    'Trend: ' + arr[1].trend + '<br/><br/>' +
                                    arr[2].day + ': ' + 'High: ' + arr[2].high + ', ' + 'Low: ' + arr[2].low + '<br/>' +
                                    'Trend: ' + arr[2].trend + '<br/><br/>' +
                                    arr[3].day + ': ' + 'High: ' + arr[3].high + ', ' + 'Low: ' + arr[3].low + '<br/>' +
                                    'Trend: ' + arr[3].trend + '<br/><br/>' +
                                    arr[4].day + ': ' + 'High: ' + arr[4].high + ', ' + 'Low: ' + arr[4].low + '<br/>' +
                                    'Trend: ' + arr[4].trend + '<br/><br/>' +
                                    arr[5].day + ': ' + 'High: ' + arr[5].high + ', ' + 'Low: ' + arr[5].low + '<br/>' +
                                    'Trend: ' + arr[5].trend + '<br/><br/>' +
                                    '<a href="'+ link +'" target="_blank">Unsubscribe</a>';

                                const weeklyMailOptions = {
                                    from: 'weeklypixelweather@gmail.com',
                                    to: user.email,
                                    subject: 'Weekly Weather Report',
                                    html: template
                                }
                                weeklyTransporter.sendMail(weeklyMailOptions, (error, info) => {
                                    if (error) {
                                        console.log(error);
                                    } else {
                                        console.log('Sent to : ' + user.email + ', ' + info.response);
                                    }
                                });
                            }).catch(err => console.log(err));
                    });
            }
        });
    });
}

function getEmails() {

}


