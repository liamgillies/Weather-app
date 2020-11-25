const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = new Schema ({
    text: {
        type: String,
    },
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    replyIDs: {
        type: [Schema.Types.ObjectId],
        default: []
    },
    replies: {
        type: [Schema.Types.Mixed],
        default: [],
    },
    username: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now()
    },
    base: {
        type: Boolean,
        default: true
    },
    usersLiked: {
        type: [Schema.Types.ObjectId],
        default: []
    },
    usersDisliked: {
        type: [Schema.Types.ObjectId],
        default: []
    }
})

module.exports = mongoose.model("commentSchema", commentSchema)
