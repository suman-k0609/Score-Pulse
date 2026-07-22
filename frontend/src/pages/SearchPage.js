import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard';
import { searchAPI } from '../services/api';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';

export default function SearchPage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sports, setSports] = useState([]);
    const [teams, setTeams] = useState([]);
    
    // Filters
    const [search, setSearch] = useState('');
    const [selectedSport, setSelectedSport] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedTeam, setSelectedTeam] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchFiltersData = async () => {
        try {
            const [sportsRes, teamsRes] = await Promise.all([
                searchAPI.getAllSports(),
                searchAPI.getAllTeams()
            ]);
            setSports(sportsRes.data.sports || []);
            setTeams(teamsRes.data.teams || []);
        } catch (err) {
            console.error('Error fetching filters:', err);
        }
    };

    const searchEvents = useCallback(async () => {
        try {
            setLoading(true);
            const params = {
                search: search || undefined,
                sport: selectedSport || undefined,
                status: selectedStatus || undefined,
                team: selectedTeam || undefined,
                page,
                limit: 12
            };

            const response = await searchAPI.searchEvents(params);
            setEvents(response.data.data || []);
            setTotalPages(response.data.pagination?.pages || 1);
        } catch (err) {
            console.error('Error searching events:', err);
        } finally {
            setLoading(false);
        }
    }, [search, selectedSport, selectedStatus, selectedTeam, page]);

    useEffect(() => {
        fetchFiltersData();
    }, []);

    useEffect(() => {
        searchEvents();
    }, [selectedSport, selectedStatus, selectedTeam, page, searchEvents]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        searchEvents();
    };

    const clearFilters = () => {
        setSearch('');
        setSelectedSport('');
        setSelectedStatus('');
        setSelectedTeam('');
        setPage(1);
    };

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 bg-ambient-glow">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Banner */}
                <div className="mb-8 p-6 sm:p-8 rounded-3xl glass-card border border-gray-800 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 flex items-center space-x-3">
                        <span>Search & Discover Matches</span>
                        <span className="text-cyan-400">🔍</span>
                    </h1>
                    <p className="text-sm text-gray-400 max-w-xl mb-6">
                        Filter live games by sport, status, team name, or venue location.
                    </p>

                    {/* Search Input Bar */}
                    <form onSubmit={handleSearch} className="relative max-w-3xl">
                        <div className="relative flex items-center">
                            <FiSearch className="absolute left-4 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search teams, tournaments, venues..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-12 pr-32 py-3.5 rounded-2xl bg-gray-900/90 text-white placeholder-gray-500 border border-gray-800 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-sm transition font-medium"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 px-5 py-2 bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-white rounded-xl text-xs font-bold shadow-lg shadow-cyan-500/20 transition"
                            >
                                Search
                            </button>
                        </div>
                    </form>
                </div>

                {/* Filter Controls Grid */}
                <div className="glass-card rounded-3xl p-6 border border-gray-800 mb-8">
                    <div className="flex items-center space-x-2 mb-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        <FiFilter className="w-4 h-4 text-cyan-400" />
                        <span>Filter Options</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Sport Filter */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 mb-1.5">Sport</label>
                            <select
                                value={selectedSport}
                                onChange={(e) => { setSelectedSport(e.target.value); setPage(1); }}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-sm text-gray-200 focus:border-cyan-500 focus:outline-none"
                            >
                                <option value="">All Sports</option>
                                {sports.map((sport) => (
                                    <option key={sport} value={sport}>
                                        {sport.charAt(0).toUpperCase() + sport.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 mb-1.5">Status</label>
                            <select
                                value={selectedStatus}
                                onChange={(e) => { setSelectedStatus(e.target.value); setPage(1); }}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-sm text-gray-200 focus:border-cyan-500 focus:outline-none"
                            >
                                <option value="">All Statuses</option>
                                <option value="live">Live Matches</option>
                                <option value="upcoming">Upcoming</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        {/* Team Filter */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 mb-1.5">Team</label>
                            <select
                                value={selectedTeam}
                                onChange={(e) => setSelectedTeam(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-sm text-gray-200 focus:border-cyan-500 focus:outline-none"
                            >
                                <option value="">All Teams</option>
                                {teams.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>

                        {/* Clear Action */}
                        <div className="flex items-end">
                            <button
                                onClick={clearFilters}
                                className="w-full px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 rounded-xl transition text-xs font-bold flex items-center justify-center space-x-1.5"
                            >
                                <FiX className="w-4 h-4 text-rose-400" />
                                <span>Reset Filters</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="glass-card rounded-3xl p-6 h-56 animate-pulse">
                                <div className="h-4 bg-gray-800 rounded w-1/3 mb-4"></div>
                                <div className="h-16 bg-gray-800/80 rounded-2xl mb-4"></div>
                            </div>
                        ))}
                    </div>
                ) : events.length === 0 ? (
                    <div className="glass-card rounded-3xl p-12 text-center border border-gray-800 max-w-lg mx-auto">
                        <p className="text-gray-400 text-sm font-medium">No matching events found. Try adjusting your query or filters.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {events.map((event) => (
                                <EventCard key={event._id} event={event} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-8">
                                <button
                                    onClick={() => setPage(Math.max(1, page - 1))}
                                    disabled={page === 1}
                                    className="px-4 py-2 bg-gray-900 border border-gray-800 text-xs font-bold text-gray-300 rounded-xl disabled:opacity-50 hover:bg-gray-800"
                                >
                                    Previous
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => setPage(p)}
                                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                                            p === page
                                                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                                                : 'bg-gray-900 text-gray-400 border border-gray-800 hover:text-white'
                                        }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                                    disabled={page === totalPages}
                                    className="px-4 py-2 bg-gray-900 border border-gray-800 text-xs font-bold text-gray-300 rounded-xl disabled:opacity-50 hover:bg-gray-800"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
