const userSchema = require('../models/user-schema');
const commentSchema = require('../models/comments-schema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

module.exports = {
    getById,
    addUser,
    authenticate,
    addLocation,
    removeLocation,
    addComment,
    getBaseComments,
    getUserComments,
    deleteComment,
    like,
    dislike
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

async function addComment(req) {
    const user = await getById(req.body._id);
    const comment = new commentSchema();
    comment.text = req.body.comment;
    comment.username = user.username;
    const newComment = new commentSchema(comment);
    user.comments.push(comment._id)
    await user.save();
    return newComment.save();
}

async function getBaseComments() {
    return await commentSchema.find({base: true});
}

async function getUserComments(req) {
    const user = await getById(req.body._id);
    return user.comments;
}
    
async function deleteComment(req) {
    const user = await userSchema.findOne({comments: mongoose.Types.ObjectId(req.params.id)});
    // delete from user's list of comments
    user.comments = user.comments.filter(commentID => commentID.toString() !== req.params.id.toString());
    user.save();
    //delete comment
    return await commentSchema.deleteOne({_id: req.params.id});
}

async function getCommentByID(commentID) {
    return commentSchema.findOne({_id: commentID});
}

async function like(req) {
    // if click like again, will remove original like
    const comment = await getCommentByID(req.body.commentID);
    if (comment.usersLiked && comment.usersLiked.includes(req.body.userID)) {
        comment.usersLiked = comment.usersLiked.filter(id => id.toString() !== req.body.userID.toString());
        comment.likes--;
        return comment.save();
    }
    // if user disliked, will remove dislike
    else if (comment.usersDisliked && comment.usersDisliked.includes(req.body.userID)) {
        comment.usersDisliked = comment.usersDisliked.filter(id => id.toString() !== req.body.userID.toString());
        comment.dislikes--;
    }
    // like comment
    comment.likes++;
    comment.usersLiked.push(req.body.userID.toString());
    return comment.save();
}

async function dislike(req) {
    // if click dislike again, will remove original dislike
    const comment = await getCommentByID(req.body.commentID);
    if (comment.usersDisliked && comment.usersDisliked.includes(req.body.userID)) {
        comment.usersDisliked = comment.usersDisliked.filter(id => id.toString() !== req.body.userID.toString());
        comment.dislikes--;
        return comment.save();
    }
    // if user liked, will remove like
    else if (comment.usersLiked && comment.usersLiked.includes(req.body.userID)) {
        comment.usersLiked = comment.usersLiked.filter(id => id.toString() !== req.body.userID.toString());
        comment.likes--;
    }
    // dislike comment
    comment.dislikes++;
    comment.usersDisliked.push(req.body.userID.toString())
    return comment.save();
}
