import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard';
import { eventAPI } from '../services/api';
import { initSocket, onNewEvent, removeNewEventListener } from '../services/socket';
import { FiActivity } from 'react-icons/fi';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [followedEvents, setFollowedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [sportFilter, setSportFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const sports = ['football', 'basketball', 'cricket', 'tennis'];
  const statuses = ['live', 'upcoming', 'completed'];

  const sportIcons = {
    football: '⚽',
    basketball: '🏀',
    cricket: '🏏',
    tennis: '🎾'
  };

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);

      const filters = {};
      if (sportFilter) filters.sport = sportFilter;
      if (statusFilter) filters.status = statusFilter;

      const response = await eventAPI.getAllEvents(filters);
      setEvents(response.data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to fetch events');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [sportFilter, statusFilter]);

  const fetchFollowedEvents = useCallback(async () => {
    try {
      const response = await eventAPI.getUserFollowedEvents();
      setFollowedEvents(response.data.events || []);
    } catch (error) {
      console.error('Failed to load followed events:', error);
      setFollowedEvents([]);
    }
  }, []);

  useEffect(() => {
    initSocket();

    (async () => {
      try {
        setLoading(true);
        const response = await eventAPI.getAllEvents({});
        setEvents(response.data.events || []);
      } catch (error) {
        console.error('Failed to load initial events:', error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    })();

    fetchFollowedEvents();

    const handleNewEvent = (newEvent) => {
      setEvents((prev) => [newEvent, ...prev]);

      if (activeTab === 'all') {
        toast.info(`New event: ${newEvent.eventName}`);
      }
    };

    onNewEvent(handleNewEvent);

    return () => {
      removeNewEventListener();
    };
  }, [activeTab, fetchFollowedEvents]);

  useEffect(() => {
    fetchEvents();
  }, [sportFilter, statusFilter, fetchEvents]);

  const handleFollowChange = () => {
    fetchFollowedEvents();
  };

  const displayedEvents = activeTab === 'followed' ? followedEvents : events;

  // Calculate live stats
  const liveCount = events.filter(e => e.status === 'live').length;
  const upcomingCount = events.filter(e => e.status === 'upcoming').length;
  const completedCount = events.filter(e => e.status === 'completed').length;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 bg-ambient-glow">
      <Navbar />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
        {/* Hero Section */}
        <div className="mb-8 p-6 sm:p-8 rounded-3xl glass-card border border-gray-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-3">
                <FiActivity className="w-3.5 h-3.5 animate-pulse" />
                <span>Live Real-Time Feeds Connected</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Live Sports Scoreboard <span className="text-cyan-400">⚡</span>
              </h1>
              <p className="text-sm text-gray-400 mt-2 max-w-xl">
                Stay updated with real-time scores, match schedules, live updates, and team statistics across Football, Basketball, Tennis & Cricket.
              </p>
            </div>

            {/* Quick Stats Bar */}
            <div className="grid grid-cols-3 gap-3 bg-gray-900/90 p-3 rounded-2xl border border-gray-800">
              <div className="text-center px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <div className="text-lg font-extrabold text-rose-400 flex items-center justify-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-live-dot"></span>
                  {liveCount}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-rose-300">Live</div>
              </div>
              <div className="text-center px-3 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                <div className="text-lg font-extrabold text-cyan-400">{upcomingCount}</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">Upcoming</div>
              </div>
              <div className="text-center px-3 py-2 rounded-xl bg-gray-800 border border-gray-700">
                <div className="text-lg font-extrabold text-gray-300">{completedCount}</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Finished</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab & Filters Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          {/* Main Tabs */}
          <div className="flex items-center space-x-2 bg-gray-900/90 p-1.5 rounded-2xl border border-gray-800 w-max">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 ${
                activeTab === 'all'
                  ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-white shadow-lg shadow-cyan-500/20 scale-105'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
              }`}
            >
              All Matches ({events.length})
            </button>

            <button
              onClick={() => setActiveTab('followed')}
              className={`px-5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 ${
                activeTab === 'followed'
                  ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-white shadow-lg shadow-cyan-500/20 scale-105'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
              }`}
            >
              Following ({followedEvents.length})
            </button>
          </div>

          {/* Sport Filter Pills */}
          {activeTab === 'all' && (
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setSportFilter('')}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition ${
                  sportFilter === ''
                    ? 'bg-gray-800 text-cyan-400 border border-cyan-500/40 shadow-sm'
                    : 'bg-gray-900/80 text-gray-400 hover:text-white border border-gray-800'
                }`}
              >
                All Sports
              </button>
              {sports.map((sport) => (
                <button
                  key={sport}
                  onClick={() => setSportFilter(sportFilter === sport ? '' : sport)}
                  className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs transition ${
                    sportFilter === sport
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
                      : 'bg-gray-900/80 text-gray-400 hover:text-white border border-gray-800'
                  }`}
                >
                  <span>{sportIcons[sport]}</span>
                  <span>{sport.charAt(0).toUpperCase() + sport.slice(1)}</span>
                </button>
              ))}

              {/* Status Dropdown/Pills */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-gray-900/80 border border-gray-800 rounded-xl px-3 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-cyan-500 font-semibold"
              >
                <option value="">All Statuses</option>
                {statuses.map(st => (
                  <option key={st} value={st}>
                    {st.charAt(0).toUpperCase() + st.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Matches Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="glass-card rounded-3xl p-6 h-56 animate-pulse">
                <div className="h-4 bg-gray-800 rounded w-1/3 mb-4"></div>
                <div className="h-16 bg-gray-800/80 rounded-2xl mb-4"></div>
                <div className="h-4 bg-gray-800 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : displayedEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedEvents.map(event => (
              <EventCard
                key={event._id}
                event={event}
                onFollowChange={handleFollowChange}
              />
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-3xl p-12 text-center border border-gray-800 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center mx-auto mb-4 text-2xl">
              🔍
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              {activeTab === 'followed' ? 'No followed matches yet' : 'No matches found'}
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              {activeTab === 'followed'
                ? 'Follow your favorite matches to track live updates here.'
                : 'Try clearing your sport or status filters.'}
            </p>
            {(sportFilter || statusFilter) && (
              <button
                onClick={() => { setSportFilter(''); setStatusFilter(''); }}
                className="px-4 py-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-xl text-xs font-bold hover:bg-cyan-500/20 transition"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
