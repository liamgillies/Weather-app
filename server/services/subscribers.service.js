module.exports = {
    validateEmail,
    getEmails
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

function getEmails() {

}


