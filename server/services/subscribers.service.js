module.exports = {
    validateEmail,
    getEmails
}

function validateEmail(email) {
    return new Promise((resolve, reject) => {
        const re = /\S+@\S+\.\S+/;
        resolve(re.test(email) ? email : 'invalid email')
    });
}

function getEmails() {

}
