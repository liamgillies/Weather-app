const userSchema = require('../models/user-schema')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
module.exports = {
    getById,
    addUser,
    authenticate,
    addLocation,
    removeLocation
}
async function authenticate({username, password}) {
    const user = await userSchema.findOne({username: username});
    if(user && bcrypt.compareSync(password, user.hash)) {
        const {hash, ...userWithoutHash} = user.toObject();

        const token = jwt.sign({abc: user._id}, 'hehe xd');
        return {
            ...userWithoutHash,
            token
        }
    }
}

async function getById(id) {
    return userSchema.findOne({_id: id});
}

async function addUser(user) {
    if(await userSchema.findOne({username: user.username})) {
        return false
    }

    const newUser = new userSchema(user);

    newUser.hash = bcrypt.hashSync(user.password, 10);

    return newUser.save();
}

async function addLocation(req) {
    const user = await getById(req.body._id);

    user.savedLocations.push(req.body.location);

    return user.save();
}

async function removeLocation(req) {
    const user = await getById(req.body._id);

    user.savedLocations.splice(req.body.index, 1);

    return user.save();
}
