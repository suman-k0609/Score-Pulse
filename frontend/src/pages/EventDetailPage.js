import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiHeart, FiUsers, FiMapPin, FiClock, FiActivity } from 'react-icons/fi';
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

  const fetchEvent = useCallback(async () => {
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
  }, [eventId, navigate]);

  const checkFollowStatus = useCallback(async () => {
    try {
      const response = await eventAPI.isFollowingEvent(eventId);
      setIsFollowing(response.data.isFollowing);
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  }, [eventId]);

  useEffect(() => {
    initSocket();
    fetchEvent();
    checkFollowStatus();
    joinEvent(eventId);

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
  }, [eventId, fetchEvent, checkFollowStatus]);

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

  const getDynamicStatus = (evt) => {
    if (!evt) return 'upcoming';
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
          <span className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-extrabold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-live-dot"></span>
            <span>LIVE IN MATCH</span>
          </span>
        );
      case 'upcoming':
        return (
          <span className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <span>UPCOMING MATCH</span>
          </span>
        );
      case 'completed':
      default:
        return (
          <span className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-gray-800 text-gray-400 border border-gray-700">
            <span>FULL TIME</span>
          </span>
        );
    }
  };

  const formatDate = (date) => {
    if (!date) return 'TBD';
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 bg-ambient-glow">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 text-sm mt-4">Loading scoreboard...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 bg-ambient-glow">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32">
          <p className="text-xl font-bold text-gray-400">Event not found</p>
          <button onClick={() => navigate('/dashboard')} className="mt-4 px-4 py-2 bg-cyan-500 text-white rounded-xl text-xs font-bold">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 bg-ambient-glow">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Link */}
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center space-x-2 text-xs font-bold text-gray-400 hover:text-cyan-400 transition mb-6"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        {/* Main Event Header Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-gray-800 mb-8 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                {event.sport} Championship
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                {event.eventName}
              </h1>
            </div>
            <div>{getStatusBadge(getDynamicStatus(event))}</div>
          </div>

          {/* Details Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-300 pt-4 border-t border-gray-800">
            <div className="flex items-center space-x-2">
              <FiClock className="w-4 h-4 text-cyan-400" />
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold">Date & Time</p>
                <p className="font-semibold">{formatDate(event.startTime)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <FiMapPin className="w-4 h-4 text-cyan-400" />
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold">Venue</p>
                <p className="font-semibold">{event.venue || 'International Stadium'}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FiUsers className="w-4 h-4 text-cyan-400" />
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Followers</p>
                  <p className="font-semibold">{event.followersCount || 0} Fans</p>
                </div>
              </div>

              <button
                onClick={handleFollowToggle}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                  isFollowing
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                }`}
              >
                <FiHeart className={`w-3.5 h-3.5 ${isFollowing ? 'fill-rose-400' : ''}`} />
                <span>{isFollowing ? 'Following' : 'Follow Match'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Live Score Board */}
            <div className="glass-card rounded-3xl p-8 border border-gray-800 relative overflow-hidden shadow-2xl">
              <div className="text-center mb-6">
                <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                  Live Scoreboard
                </span>
              </div>

              <div className="flex items-center justify-around text-center">
                {/* Team 1 */}
                <div className="flex-1">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-tr from-gray-800 to-gray-700 border border-gray-700 flex items-center justify-center text-2xl font-extrabold text-cyan-400 shadow-inner">
                    {event.team1?.name?.charAt(0) || '1'}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{event.team1?.name}</h3>
                  <div className="text-4xl sm:text-5xl font-extrabold text-cyan-400">
                    {event.team1?.score ?? 0}
                  </div>
                </div>

                {/* VS */}
                <div className="px-4">
                  <div className="w-10 h-10 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-xs font-extrabold text-gray-500">
                    VS
                  </div>
                </div>

                {/* Team 2 */}
                <div className="flex-1">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-tr from-gray-800 to-gray-700 border border-gray-700 flex items-center justify-center text-2xl font-extrabold text-indigo-400 shadow-inner">
                    {event.team2?.name?.charAt(0) || '2'}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{event.team2?.name}</h3>
                  <div className="text-4xl sm:text-5xl font-extrabold text-indigo-400">
                    {event.team2?.score ?? 0}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {event.description && (
              <div className="glass-card rounded-3xl p-6 border border-gray-800">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Match Context & League
                </h3>
                <p className="text-sm text-gray-300 font-medium leading-relaxed">
                  {event.description}
                </p>
              </div>
            )}

            {/* Event History / Timeline */}
            <div className="glass-card rounded-3xl p-6 border border-gray-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center space-x-2">
                <FiActivity className="w-4 h-4 text-cyan-400" />
                <span>Match Timeline</span>
              </h3>

              {event.eventHistory && event.eventHistory.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {[...event.eventHistory].reverse().map((item, index) => (
                    <div
                      key={index}
                      className="bg-gray-900/80 border border-gray-800/80 rounded-2xl p-3.5 text-xs flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                        <div>
                          <p className="font-bold text-white">{item.action}</p>
                          <p className="text-gray-400 mt-0.5">
                            <span className="text-cyan-400 font-semibold">{item.team}</span> {item.details && `- ${item.details}`}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-500 font-mono">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-xs text-gray-500">
                  No live events logged for this match yet.
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-3xl p-6 border border-gray-800 space-y-6 sticky top-24">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 border-b border-gray-800 pb-3">
                Match Info Summary
              </h3>

              <div>
                <p className="text-[10px] uppercase font-bold text-gray-500 mb-1">Sport Category</p>
                <p className="text-sm font-bold text-white capitalize">{event.sport}</p>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold text-gray-500 mb-1">Match Status</p>
                <p className="text-sm font-bold text-cyan-400 capitalize">{getDynamicStatus(event)}</p>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold text-gray-500 mb-1">Data Provider</p>
                <p className="text-xs text-gray-300">Live API Sports Engine</p>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold text-gray-500 mb-1">Last Updated</p>
                <p className="text-xs text-gray-400">{new Date(event.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
