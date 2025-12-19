const Event = require('../models/event');
const FollowedEvent = require('../models/followedEvent');
const User = require('../models/user');

// Create a new event
const createEvent = async (req, res) => {
    try {
        const { eventName, sport, team1, team2, startTime, venue, description } = req.body;
        const userId = req.user.userId;

        const event = new Event({
            eventName,
            sport,
            team1: { name: team1, score: 0 },
            team2: { name: team2, score: 0 },
            startTime,
            venue,
            description,
            createdBy: userId
        });

        const savedEvent = await event.save();

        // Broadcast new event to all connected clients
        const io = req.app.get('io');
        io.emit('new_event', savedEvent);

        res.status(201).json({
            message: "Event created successfully",
            event: savedEvent
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Event creation failed" });
    }
};

// Get all events
const getAllEvents = async (req, res) => {
    try {
        const { status, sport } = req.query;
        let filter = {};

        if (status) filter.status = status;
        if (sport) filter.sport = sport;

        const events = await Event.find(filter)
            .populate('createdBy', 'userName')
            .sort({ startTime: -1 });

        res.status(200).json({
            message: "Events fetched successfully",
            events
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch events" });
    }
};

// Get event by ID
const getEventById = async (req, res) => {
    try {
        const { eventId } = req.params;

        const event = await Event.findById(eventId)
            .populate('createdBy', 'userName email');

        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        res.status(200).json({
            message: "Event fetched successfully",
            event
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch event" });
    }
};

// Update event score
const updateScore = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { team, points, action } = req.body;

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        if (team === 'team1') {
            event.team1.score += points;
        } else if (team === 'team2') {
            event.team2.score += points;
        }

        // Add to event history
        event.eventHistory.push({
            timestamp: new Date(),
            action,
            team: team === 'team1' ? event.team1.name : event.team2.name,
            details: `${points} points added`
        });

        event.updatedAt = new Date();
        const updatedEvent = await event.save();

        // Broadcast score update via WebSocket
        const io = req.app.get('io');
        io.to(`event_${eventId}`).emit('score_update', {
            eventId,
            team1: updatedEvent.team1,
            team2: updatedEvent.team2,
            eventHistory: updatedEvent.eventHistory
        });

        res.status(200).json({
            message: "Score updated successfully",
            event: updatedEvent
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to update score" });
    }
};

// Update event status
const updateEventStatus = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { status } = req.body;

        const event = await Event.findByIdAndUpdate(
            eventId,
            { status, updatedAt: new Date() },
            { new: true }
        );

        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        // Broadcast status update
        const io = req.app.get('io');
        io.to(`event_${eventId}`).emit('event_status_update', {
            eventId,
            status: event.status
        });

        res.status(200).json({
            message: "Event status updated successfully",
            event
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to update event status" });
    }
};

// Add event history/commentary
const addEventHistory = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { action, team, details } = req.body;

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        event.eventHistory.push({
            timestamp: new Date(),
            action,
            team,
            details
        });

        const updatedEvent = await event.save();

        // Broadcast history update
        const io = req.app.get('io');
        io.to(`event_${eventId}`).emit('event_history_update', {
            eventId,
            eventHistory: updatedEvent.eventHistory
        });

        res.status(200).json({
            message: "Event history added successfully",
            event: updatedEvent
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to add event history" });
    }
};

// Follow an event
const followEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const userId = req.user.userId;

        // Check if event exists
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        // Check if already following
        const existingFollow = await FollowedEvent.findOne({ userId, eventId });
        if (existingFollow) {
            return res.status(400).json({ error: "Already following this event" });
        }

        const followedEvent = new FollowedEvent({
            userId,
            eventId
        });

        await followedEvent.save();

        // Update follower count
        event.followersCount += 1;
        await event.save();

        // Broadcast follower count update
        const io = req.app.get('io');
        io.to(`event_${eventId}`).emit('followers_update', {
            eventId,
            followersCount: event.followersCount
        });

        res.status(201).json({
            message: "Event followed successfully",
            followedEvent
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to follow event" });
    }
};

// Unfollow an event
const unfollowEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const userId = req.user.userId;

        const followedEvent = await FollowedEvent.findOneAndDelete({ userId, eventId });

        if (!followedEvent) {
            return res.status(404).json({ error: "Not following this event" });
        }

        // Update follower count
        const event = await Event.findById(eventId);
        if (event) {
            event.followersCount = Math.max(0, event.followersCount - 1);
            await event.save();

            // Broadcast follower count update
            const io = req.app.get('io');
            io.to(`event_${eventId}`).emit('followers_update', {
                eventId,
                followersCount: event.followersCount
            });
        }

        res.status(200).json({
            message: "Event unfollowed successfully"
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to unfollow event" });
    }
};

// Get user's followed events
const getUserFollowedEvents = async (req, res) => {
    try {
        const userId = req.user.userId;

        const followedEvents = await FollowedEvent.find({ userId })
            .populate('eventId')
            .sort({ followedAt: -1 });

        const events = followedEvents.map(fe => fe.eventId);

        res.status(200).json({
            message: "Followed events fetched successfully",
            events
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch followed events" });
    }
};

// Check if user is following an event
const isFollowingEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const userId = req.user.userId;

        const followedEvent = await FollowedEvent.findOne({ userId, eventId });

        res.status(200).json({
            isFollowing: !!followedEvent
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to check follow status" });
    }
};

module.exports = {
    createEvent,
    getAllEvents,
    getEventById,
    updateScore,
    updateEventStatus,
    addEventHistory,
    followEvent,
    unfollowEvent,
    getUserFollowedEvents,
    isFollowingEvent
};
