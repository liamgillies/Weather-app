const userSchema = require('../models/user-schema');
const commentSchema = require('../models/comments-schema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

module.exports = {
    addUser,
    authenticate,
    addLocation,
    removeLocation,
    addComment,
    getBaseComments,
    getUserComments,
    deleteComment,
    like,
    dislike,
    addReply,
    deleteReply
}

// authenticates user
async function authenticate({username, password}) {
    const user = await userSchema.findOne({username: username});
    if(user && bcrypt.compareSync(password, user.hash)) {
        const {hash, ...userWithoutHash} = user.toObject();

        const token = jwt.sign({abc: user._id}, 'hehe heh hehe hehh hehe');
        return {
            ...userWithoutHash,
            token
        }
    }
}

// getter for users
async function getById(id) {
    return userSchema.findOne({_id: id});
}

// registers a user
async function addUser(user) {
    if(await userSchema.findOne({username: user.username})) {
        return false
    }

    const newUser = new userSchema(user);

    newUser.hash = bcrypt.hashSync(user.password, 10);

    return newUser.save();
}

// adds a saved location
async function addLocation(req) {
    const user = await getById(req.body._id);

    user.savedLocations.push(req.body.location);

    return user.save();
}

// removes a saved location
async function removeLocation(req) {
    const user = await getById(req.body._id);

    user.savedLocations.splice(req.body.index, 1);

    return user.save();
}

// adds a base comment
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

// getter for base comments
async function getBaseComments() {
    return await commentSchema.find({base: true});
}

// getter for the user's own comments
async function getUserComments(req) {
    const user = await getById(req.body._id);
    return user.comments;
}

// delete a base comment
async function deleteComment(req) {
    const user = await userSchema.findOne({comments: mongoose.Types.ObjectId(req.params.id)});
    // delete from user's list of comments
    user.comments = user.comments.filter(commentID => commentID.toString() !== req.params.id.toString());
    user.save();
    //delete comment
    return await commentSchema.deleteOne({_id: req.params.id});
}

// getter for comments
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
    comment.save();

    //if the comment liked is a reply, need to update parent
    const parentComment = await commentSchema.findOne({replies: {$elemMatch: {_id: mongoose.Types.ObjectId(req.body.commentID)}}});
    if(parentComment) {
        parentComment.replies = await updateReplies(parentComment);
        parentComment.save();
    }
    return;
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
    comment.save();

    //if the comment disliked is a reply, need to update parent
    const parentComment = await commentSchema.findOne({replies: {$elemMatch: {_id: mongoose.Types.ObjectId(req.body.commentID)}}});
    if(parentComment) {
        parentComment.replies = await updateReplies(parentComment);
        parentComment.save();
    }
    return;
}

// update the parent comment's list of replies
async function updateReplies(parentComment) {
    let temp = []
    for (let id of parentComment.replyIDs) {
        temp.push(await getCommentByID(id));
    }
    return temp;
}

// add a reply to a base comment
async function addReply(req) {
    const parentComment = await getCommentByID(req.body.commentID);
    const user = await getById(req.body.userID);
    const comment = new commentSchema();
    comment.text = req.body.comment;
    comment.username = user.username;
    comment.base = false;

    const newComment = new commentSchema(comment);
    await newComment.save();

    // add comment to the base comment's replies list
    user.comments.push(comment._id);
    parentComment.replyIDs.push(comment._id);

    parentComment.replies = await updateReplies(parentComment);

    await parentComment.save();
    await user.save();
    return newComment;
}

async function deleteReply(req) {
    const parentComment = await commentSchema.findOne({replies: {$elemMatch: {_id: mongoose.Types.ObjectId(req.params.id)}}});
    // delete from parent's list of replies
    parentComment.replies = parentComment.replies.filter(comment => comment._id.toString() !== req.params.id.toString());
    parentComment.replyIDs = parentComment.replyIDs.filter(id => id.toString() !== req.params.id.toString());
    parentComment.save();
    //delete comment
    return await commentSchema.deleteOne({_id: req.params.id});
}
