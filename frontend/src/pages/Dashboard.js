import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard';
import { eventAPI } from '../services/api';
import { initSocket, onNewEvent, removeNewEventListener } from '../services/socket';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [followedEvents, setFollowedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [sportFilter, setSportFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const sports = ['cricket', 'basketball', 'football', 'tennis'];
  const statuses = ['upcoming', 'live', 'completed'];

  useEffect(() => {
    console.log('🚀 Dashboard mounted, initializing...');
    initSocket();
    
    // Fetch events immediately
    (async () => {
      try {
        setLoading(true);
        const response = await eventAPI.getAllEvents({});
        console.log('✅ Initial events loaded:', response.data.events?.length || 0);
        setEvents(response.data.events || []);
      } catch (error) {
        console.error('❌ Failed to load initial events:', error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    })();

    // Fetch followed events
    (async () => {
      try {
        const response = await eventAPI.getUserFollowedEvents();
        setFollowedEvents(response.data.events || []);
      } catch (error) {
        console.error('Failed to load followed events:', error);
        setFollowedEvents([]);
      }
    })();

    // Listen for new events
    const handleNewEvent = (newEvent) => {
      setEvents(prev => [newEvent, ...prev]);
      if (activeTab === 'all') {
        toast.info(`New event: ${newEvent.eventName}`);
      }
    };

    onNewEvent(handleNewEvent);

    return () => {
      removeNewEventListener();
    };
  }, []);

  // Apply filters when they change
  useEffect(() => {
    if (sportFilter || statusFilter) {
      handleFilterChange();
    }
  }, [sportFilter, statusFilter]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (sportFilter) filters.sport = sportFilter;
      if (statusFilter) filters.status = statusFilter;

      console.log('📡 Fetching events with filters:', filters);
      const response = await eventAPI.getAllEvents(filters);
      console.log('✅ Received events:', response.data.events?.length || 0);
      setEvents(response.data.events || []);
    } catch (error) {
      console.error('❌ Error fetching events:', error);
      toast.error('Failed to fetch events');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFollowedEvents = async () => {
    try {
      const response = await eventAPI.getUserFollowedEvents();
      setFollowedEvents(response.data.events);
    } catch (error) {
      console.error('Error fetching followed events:', error);
    }
  };

  const handleFilterChange = () => {
    console.log('🔄 Applying filters - Sport:', sportFilter, 'Status:', statusFilter);
    fetchEvents();
  };

  const handleFollowChange = () => {
    fetchFollowedEvents();
  };

  const displayedEvents = activeTab === 'followed' ? followedEvents : events;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <Navbar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-2">
            <span className="gradient-text">Live Events</span>
          </h2>
          <p className="text-slate-400">Follow your favorite sports and stay updated</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8 border-b border-slate-700 pb-4">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-2 font-semibold transition ${
              activeTab === 'all'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Events ({events.length})
          </button>
          <button
            onClick={() => setActiveTab('followed')}
            className={`px-6 py-2 font-semibold transition ${
              activeTab === 'followed'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Following ({followedEvents.length})
          </button>
        </div>

        {/* Filters */}
        {activeTab === 'all' && (
          <div className="mb-8 flex flex-wrap gap-4 bg-slate-700 bg-opacity-30 p-4 rounded-lg">
            {/* Sport Filter */}
            <div className="flex-1 min-w-48">
              <label className="block text-sm font-medium text-slate-300 mb-2">Sport</label>
              <select
                value={sportFilter}
                onChange={(e) => setSportFilter(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition"
              >
                <option value="">All Sports</option>
                {sports.map(sport => (
                  <option key={sport} value={sport}>
                    {sport.charAt(0).toUpperCase() + sport.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex-1 min-w-48">
              <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition"
              >
                <option value="">All Status</option>
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            {(sportFilter || statusFilter) && (
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSportFilter('');
                    setStatusFilter('');
                    setTimeout(handleFilterChange, 0);
                  }}
                  className="bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded-lg transition"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* Events Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin">
              <div className="h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent"></div>
            </div>
          </div>
        ) : displayedEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedEvents.map(event => (
              <EventCard
                key={event._id}
                event={event}
                onFollowChange={handleFollowChange}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-2xl font-bold text-slate-400 mb-2">
              {activeTab === 'followed' ? 'No followed events' : 'No events found'}
            </p>
            <p className="text-slate-500">
              {activeTab === 'followed'
                ? 'Start following events to see them here'
                : 'Check back later for upcoming events'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
