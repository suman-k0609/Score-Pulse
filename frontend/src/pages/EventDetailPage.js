import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiHeart, FiUsers } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import { eventAPI } from '../services/api';
import {
  initSocket,
  joinEvent,
  leaveEvent,
  onScoreUpdate,
  onEventHistoryUpdate,
  onFollowersUpdate,
  removeScoreUpdateListener,
  removeEventHistoryListener,
  removeFollowersListener
} from '../services/socket';

const EventDetailPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initSocket();
    fetchEvent();
    checkFollowStatus();
    joinEvent(eventId);

    // WebSocket listeners
    const handleScoreUpdate = (data) => {
      setEvent(prev => ({
        ...prev,
        team1: data.team1,
        team2: data.team2,
        eventHistory: data.eventHistory
      }));
    };

    const handleHistoryUpdate = (data) => {
      setEvent(prev => ({
        ...prev,
        eventHistory: data.eventHistory
      }));
    };

    const handleFollowersUpdate = (data) => {
      setEvent(prev => ({
        ...prev,
        followersCount: data.followersCount
      }));
    };

    onScoreUpdate(handleScoreUpdate);
    onEventHistoryUpdate(handleHistoryUpdate);
    onFollowersUpdate(handleFollowersUpdate);

    return () => {
      leaveEvent(eventId);
      removeScoreUpdateListener();
      removeEventHistoryListener();
      removeFollowersListener();
    };
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await eventAPI.getEventById(eventId);
      setEvent(response.data.event);
    } catch (error) {
      console.error('Error fetching event:', error);
      toast.error('Failed to fetch event details');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const checkFollowStatus = async () => {
    try {
      const response = await eventAPI.isFollowingEvent(eventId);
      setIsFollowing(response.data.isFollowing);
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  };

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await eventAPI.unfollowEvent(eventId);
        setIsFollowing(false);
        toast.success('Event unfollowed');
      } else {
        await eventAPI.followEvent(eventId);
        setIsFollowing(true);
        toast.success('Event followed!');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Action failed';
      toast.error(errorMessage);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'live':
        return 'bg-red-500';
      case 'upcoming':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-gray-500';
      default:
        return 'bg-slate-500';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <div className="animate-spin">
            <div className="h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <p className="text-2xl text-slate-400">Event not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 mb-6 transition"
        >
          <FiArrowLeft size={20} />
          <span>Back to Events</span>
        </button>

        {/* Header Section */}
        <div className="bg-slate-700 bg-opacity-50 backdrop-blur-sm border border-slate-600 rounded-2xl p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                {event.eventName}
              </h1>
              <p className="text-slate-400 text-lg">{event.sport.toUpperCase()}</p>
            </div>
            <div className={`${getStatusBadgeColor(event.status)} text-white px-4 py-2 rounded-full font-bold ${event.status === 'live' ? 'animate-pulse' : ''}`}>
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </div>
          </div>

          {/* Event Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-300 mb-6">
            <div>
              <p className="text-sm text-slate-500 mb-1">Date & Time</p>
              <p>{formatDate(event.startTime)}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Venue</p>
              <p>{event.venue || 'TBD'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Followers</p>
              <div className="flex items-center space-x-2">
                <FiUsers size={18} className="text-blue-400" />
                <span>{event.followersCount}</span>
              </div>
            </div>
          </div>

          {/* Follow Button */}
          <button
            onClick={handleFollowToggle}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition ${
              isFollowing
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <FiHeart size={20} fill={isFollowing ? 'currentColor' : 'none'} />
            <span>{isFollowing ? 'Following' : 'Follow Event'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Scoreboard */}
          <div className="lg:col-span-2">
            {/* Live Score */}
            <div className="bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 rounded-2xl p-8 mb-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-8 text-center">Live Score</h2>

              <div className="flex items-center justify-around">
                {/* Team 1 */}
                <div className="text-center flex-1">
                  <div className="bg-slate-600 bg-opacity-50 rounded-xl p-6 mb-4">
                    <p className="text-5xl sm:text-6xl font-bold text-blue-400 mb-2">
                      {event.team1.score}
                    </p>
                  </div>
                  <h3 className="text-2xl font-bold text-white">{event.team1.name}</h3>
                </div>

                {/* VS */}
                <div className="px-4 sm:px-8 text-center">
                  <p className="text-2xl font-bold text-slate-500">VS</p>
                </div>

                {/* Team 2 */}
                <div className="text-center flex-1">
                  <div className="bg-slate-600 bg-opacity-50 rounded-xl p-6 mb-4">
                    <p className="text-5xl sm:text-6xl font-bold text-purple-400 mb-2">
                      {event.team2.score}
                    </p>
                  </div>
                  <h3 className="text-2xl font-bold text-white">{event.team2.name}</h3>
                </div>
              </div>
            </div>

            {/* Description */}
            {event.description && (
              <div className="bg-slate-700 bg-opacity-50 backdrop-blur-sm border border-slate-600 rounded-2xl p-6 mb-8">
                <h3 className="text-xl font-bold text-white mb-3">About</h3>
                <p className="text-slate-300">{event.description}</p>
              </div>
            )}

            {/* Event History */}
            <div className="bg-slate-700 bg-opacity-50 backdrop-blur-sm border border-slate-600 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Event Timeline</h3>

              {event.eventHistory && event.eventHistory.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {[...event.eventHistory].reverse().map((item, index) => (
                    <div
                      key={index}
                      className="bg-slate-600 bg-opacity-30 border border-slate-600 rounded-lg p-4 hover:border-blue-500 transition"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="inline-block w-2 h-2 bg-blue-400 rounded-full"></span>
                          <span className="font-semibold text-white">{item.action}</span>
                        </div>
                        <span className="text-xs text-slate-500">
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-slate-300 ml-4">
                        <span className="text-blue-400 font-semibold">{item.team}</span>
                        {item.details && ` - ${item.details}`}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-center py-8">No events recorded yet</p>
              )}
            </div>
          </div>

          {/* Sidebar - Event Stats */}
          <div className="lg:col-span-1">
            <div className="bg-slate-700 bg-opacity-50 backdrop-blur-sm border border-slate-600 rounded-2xl p-6 sticky top-20">
              <h3 className="text-xl font-bold text-white mb-6">Event Details</h3>

              <div className="space-y-6">
                {/* Status */}
                <div>
                  <p className="text-sm text-slate-500 mb-2">Status</p>
                  <div className={`${getStatusBadgeColor(event.status)} text-white px-3 py-1 rounded-full text-sm font-semibold w-fit`}>
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </div>
                </div>

                {/* Sport */}
                <div>
                  <p className="text-sm text-slate-500 mb-2">Sport</p>
                  <p className="text-white font-semibold">
                    {event.sport.charAt(0).toUpperCase() + event.sport.slice(1)}
                  </p>
                </div>

                {/* Created By */}
                <div>
                  <p className="text-sm text-slate-500 mb-2">Created By</p>
                  <p className="text-white font-semibold">
                    {event.createdBy?.userName || 'Admin'}
                  </p>
                </div>

                {/* Updated At */}
                <div>
                  <p className="text-sm text-slate-500 mb-2">Last Updated</p>
                  <p className="text-white text-sm">
                    {new Date(event.updatedAt).toLocaleString()}
                  </p>
                </div>

                {/* Followers */}
                <div className="border-t border-slate-600 pt-6">
                  <div className="flex items-center space-x-2">
                    <FiUsers className="text-blue-400" size={20} />
                    <span className="text-white font-bold">{event.followersCount} followers</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
