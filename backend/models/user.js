const mongoose = require('mongoose')

const user_data = mongoose.Schema({
    userName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],
    favoriteTeams: [String],
    favoritesSports: [String],
    notifications: [{
        eventId: mongoose.Schema.Types.ObjectId,
        message: String,
        read: Boolean,
        createdAt: {type: Date, default: Date.now}
    }],
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
})

const User = mongoose.model("User", user_data)

module.exports = User