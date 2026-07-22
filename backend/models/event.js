const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    apiGameId: {
        type: String,
        unique: true,
        sparse: true
    },
    eventName: {
        type: String,
        required: true
    },
    sport: {
        type: String,
        required: true,
        enum: ['cricket', 'basketball', 'football', 'tennis']
    },
    team1: {
        name: String,
        score: { type: mongoose.Schema.Types.Mixed, default: 0 }
    },
    team2: {
        name: String,
        score: { type: mongoose.Schema.Types.Mixed, default: 0 }
    },
    status: {
        type: String,
        enum: ['upcoming', 'live', 'completed'],
        default: 'upcoming'
    },
    startTime: {
        type: Date,
        required: true
    },
    venue: String,
    description: String,
    eventHistory: [{
        timestamp: { type: Date, default: Date.now },
        action: String,
        team: String,
        details: String
    }],
    followersCount: { type: Number, default: 0 },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', eventSchema);
