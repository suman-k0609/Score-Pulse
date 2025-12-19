const mongoose = require('mongoose');

const followedEventSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    followedAt: {
        type: Date,
        default: Date.now
    }
});

// Create a unique compound index to prevent duplicate follows
followedEventSchema.index({ userId: 1, eventId: 1 }, { unique: true });

module.exports = mongoose.model('FollowedEvent', followedEventSchema);
