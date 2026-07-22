import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHeart, FiUsers, FiMapPin, FiClock } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { eventAPI } from '../services/api';

const EventCard = ({ event, onFollowChange }) => {
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkFollowStatus = useCallback(async () => {
    try {
      const response = await eventAPI.isFollowingEvent(event._id);
      setIsFollowing(response.data.isFollowing);
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  }, [event._id]);

  useEffect(() => {
    checkFollowStatus();
  }, [checkFollowStatus]);

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

  const sportIcons = {
    football: '⚽',
    basketball: '🏀',
    cricket: '🏏',
    tennis: '🎾'
  };

  const getDynamicStatus = (evt) => {
    const now = new Date();
    const startTime = new Date(evt.startTime);
    if (isNaN(startTime.getTime())) return evt.status || 'upcoming';

    const diffMins = (now.getTime() - startTime.getTime()) / (1000 * 60);
    const durations = { football: 120, basketball: 130, tennis: 150, cricket: 240 };
    const maxDuration = durations[evt.sport] || 130;

    if (diffMins < 0) return 'upcoming';
    if (diffMins >= 0 && diffMins <= maxDuration) return 'live';
    return 'completed';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'live':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-live-dot"></span>
            <span>LIVE</span>
          </span>
        );
      case 'upcoming':
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <span>UPCOMING</span>
          </span>
        );
      case 'completed':
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-gray-800 text-gray-400 border border-gray-700">
            <span>FT</span>
          </span>
        );
    }
  };

  const formatDate = (date) => {
    if (!date) return 'TBD';
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
      className="glass-card glass-card-hover rounded-3xl p-6 relative overflow-hidden cursor-pointer group flex flex-col justify-between"
    >
      {/* Background Accent Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition"></div>

      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-base">{sportIcons[event.sport] || '🏆'}</span>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              {event.sport}
            </span>
          </div>
          {getStatusBadge(getDynamicStatus(event))}
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-white mb-4 line-clamp-1 group-hover:text-cyan-400 transition">
          {event.eventName}
        </h3>

        {/* Score Board Container */}
        <div className="bg-gray-900/80 rounded-2xl p-4 border border-gray-800/90 mb-4">
          <div className="flex items-center justify-between">
            {/* Team 1 */}
            <div className="flex-1 text-center px-1">
              <div className="w-10 h-10 mx-auto mb-1.5 rounded-full bg-gradient-to-tr from-gray-800 to-gray-700 border border-gray-700 flex items-center justify-center text-sm font-extrabold text-cyan-400 shadow-inner">
                {event.team1?.name?.charAt(0) || '1'}
              </div>
              <p className="text-xs font-bold text-white truncate max-w-[100px] mx-auto">
                {event.team1?.name}
              </p>
              <p className="text-lg font-extrabold text-cyan-400 mt-1">
                {event.team1?.score ?? 0}
              </p>
            </div>

            {/* VS Divider */}
            <div className="flex flex-col items-center justify-center px-2">
              <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest bg-gray-800 px-2 py-0.5 rounded-full">
                VS
              </span>
            </div>

            {/* Team 2 */}
            <div className="flex-1 text-center px-1">
              <div className="w-10 h-10 mx-auto mb-1.5 rounded-full bg-gradient-to-tr from-gray-800 to-gray-700 border border-gray-700 flex items-center justify-center text-sm font-extrabold text-indigo-400 shadow-inner">
                {event.team2?.name?.charAt(0) || '2'}
              </div>
              <p className="text-xs font-bold text-white truncate max-w-[100px] mx-auto">
                {event.team2?.name}
              </p>
              <p className="text-lg font-extrabold text-indigo-400 mt-1">
                {event.team2?.score ?? 0}
              </p>
            </div>
          </div>
        </div>

        {/* Details List */}
        <div className="space-y-1.5 text-xs text-gray-400 mb-4">
          <div className="flex items-center space-x-2">
            <FiMapPin className="w-3.5 h-3.5 text-gray-500 shrink-0" />
            <span className="truncate">{event.venue || 'International Arena'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FiClock className="w-3.5 h-3.5 text-gray-500 shrink-0" />
            <span>{formatDate(event.startTime)}</span>
          </div>
        </div>
      </div>

      {/* Footer / Follow */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-800/80">
        <div className="flex items-center space-x-1.5 text-xs text-gray-400">
          <FiUsers className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold text-gray-300">{event.followersCount || 0}</span>
          <span className="text-[11px] text-gray-500">fans</span>
        </div>

        <button
          onClick={handleFollowToggle}
          disabled={loading}
          className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
            isFollowing
              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20'
              : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20'
          } disabled:opacity-50`}
        >
          <FiHeart className={`w-3.5 h-3.5 ${isFollowing ? 'fill-rose-400' : ''}`} />
          <span>{isFollowing ? 'Following' : 'Follow'}</span>
        </button>
      </div>
    </div>
  );
};

export default EventCard;
