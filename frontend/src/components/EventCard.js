import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHeart, FiUsers } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { eventAPI } from '../services/api';

const EventCard = ({ event, onFollowChange }) => {
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkFollowStatus();
  }, [event._id]);

  const checkFollowStatus = async () => {
    try {
      const response = await eventAPI.isFollowingEvent(event._id);
      setIsFollowing(response.data.isFollowing);
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  };

  const handleFollowToggle = async (e) => {
    e.stopPropagation();
    setLoading(true);

    try {
      if (isFollowing) {
        await eventAPI.unfollowEvent(event._id);
        setIsFollowing(false);
        toast.success('Event unfollowed');
      } else {
        await eventAPI.followEvent(event._id);
        setIsFollowing(true);
        toast.success('Event followed!');
      }
      onFollowChange?.();
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Action failed';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'live':
        return 'bg-red-500 animate-pulse';
      case 'upcoming':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-gray-500';
      default:
        return 'bg-slate-500';
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div
      onClick={() => navigate(`/event/${event._id}`)}
      className="bg-slate-700 bg-opacity-50 backdrop-blur-sm border border-slate-600 hover:border-blue-500 rounded-xl p-6 hover:shadow-2xl hover:shadow-blue-500/20 transition duration-300 cursor-pointer transform hover:scale-105 fade-in"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-1">{event.eventName}</h3>
          <p className="text-sm text-slate-400">{event.sport.toUpperCase()}</p>
        </div>
        <div className={`${getStatusColor(event.status)} text-white text-xs font-bold px-3 py-1 rounded-full`}>
          {getStatusText(event.status)}
        </div>
      </div>

      {/* Score Section */}
      <div className="bg-slate-600 bg-opacity-50 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-around text-center">
          <div className="flex-1">
            <p className="text-xl font-bold text-white">{event.team1.score}</p>
            <p className="text-sm text-slate-300 truncate">{event.team1.name}</p>
          </div>
          <div className="text-slate-400 font-bold mx-4">vs</div>
          <div className="flex-1">
            <p className="text-xl font-bold text-white">{event.team2.score}</p>
            <p className="text-sm text-slate-300 truncate">{event.team2.name}</p>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 text-sm text-slate-400 mb-4">
        <p>📍 {event.venue || 'TBD'}</p>
        <p>🕐 {formatDate(event.startTime)}</p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-slate-600 pt-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-slate-400 hover:text-blue-400 transition">
            <FiUsers size={16} />
            <span className="text-sm">{event.followersCount}</span>
          </div>
        </div>
        <button
          onClick={handleFollowToggle}
          disabled={loading}
          className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition ${
            isFollowing
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          } disabled:opacity-50`}
        >
          <FiHeart size={16} fill={isFollowing ? 'currentColor' : 'none'} />
          <span className="text-sm">{isFollowing ? 'Following' : 'Follow'}</span>
        </button>
      </div>
    </div>
  );
};

export default EventCard;
