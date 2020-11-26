const userService = require('../services/user.service');

module.exports = {
    authenticate,
    register,
    addLocation,
    removeLocation,
    addComment,
    getBaseComments,
    getUserComments,
    deleteComment,
    like,
    dislike,
    addReply,
    deleteReply,
    getAllComments
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

async function addComment(req, res, next) {
    userService.addComment(req)
        .then(() => res.send())
        .catch(err => console.log(err));
}

async function getBaseComments(req, res, next) {
    userService.getBaseComments()
        .then(comments => res.json(comments))
        .catch(err => console.log(err));
}

async function getUserComments(req, res, next) {
    userService.getUserComments(req)
        .then(comments => res.send(comments))
        .catch(err => console.log(err));
}

async function getAllComments(req, res, next) {
    userService.getAllComments()
        .then(comments => res.send(comments))
        .catch(err => console.log(err));
}

async function deleteComment(req, res, next) {
    userService.deleteComment(req)
        .then(() => res.send())
        .catch(err => console.log(err));
}

async function like(req, res, next) {
    userService.like(req)
        .then(() => res.send())
        .catch(err => console.log(err));
}

async function dislike(req, res, next) {
    userService.dislike(req)
        .then(() => res.send())
        .catch(err => console.log(err));
}

async function addReply(req, res, next) {
    userService.addReply(req)
        .then(comment => res.json(comment))
        .catch(err => console.log(err));
}

async function deleteReply(req, res, next) {
    userService.deleteReply(req)
        .then(() => res.send())
        .catch(err => console.log(err));
}
