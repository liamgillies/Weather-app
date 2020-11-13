const userService = require('../services/user.service');

module.exports = {
    authenticate,
    register,
    addLocation,
    removeLocation
}

async function authenticate(req, res, next) {
    userService.authenticate({username: req.body.username, password: req.body.password})
        .then(user => {
            if(user) {
                console.log(`user  ${req.body.username} logged in`);
                res.json(user);
            }else {
                res.status(400).json({message: 'Incorrect username/password'})
            }
        })
        .catch(err => console.log(err))
}

async function register(req, res, next){
    userService.addUser(req.body).then((user) => res.send(user))
}

async function addLocation(req, res, next) {
    userService.addLocation(req)
        .then(() => res.json())
        .catch(err => console.log(err));
}

async function removeLocation(req, res, next) {
    userService.removeLocation(req)
        .then(() => res.json())
        .catch(err => console.log(err));
}
