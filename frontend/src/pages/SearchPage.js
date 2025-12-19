import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventCard from '../components/EventCard';

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

    useEffect(() => {
        fetchFiltersData();
        searchEvents();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedSport, selectedStatus, page]);

    const fetchFiltersData = async () => {
        try {
            const [sportsRes, teamsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/search/sports/all'),
                axios.get('http://localhost:5000/api/search/teams/all')
            ]);
            setSports(sportsRes.data.sports);
            setTeams(teamsRes.data.teams);
        } catch (err) {
            console.error('Error fetching filters:', err);
        }
    };

    const searchEvents = async () => {
        try {
            setLoading(true);
            const params = {
                search: search || undefined,
                sport: selectedSport || undefined,
                status: selectedStatus || undefined,
                page,
                limit: 12
            };

            const response = await axios.get('http://localhost:5000/api/search', { params });
            setEvents(response.data.data);
            setTotalPages(response.data.pagination.pages);
        } catch (err) {
            console.error('Error searching events:', err);
        } finally {
            setLoading(false);
        }
    };

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
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <h1 className="text-4xl font-bold text-white mb-8">🔍 Search Events</h1>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="mb-8">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Search teams, events, venues..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1 px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-orange-500 focus:outline-none"
                        />
                        <button
                            type="submit"
                            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg transition"
                        >
                            Search
                        </button>
                    </div>
                </form>

                {/* Filters */}
                <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Sport Filter */}
                        <div>
                            <label className="block text-gray-300 font-semibold mb-2">
                                Sport
                            </label>
                            <select
                                value={selectedSport}
                                onChange={(e) => {
                                    setSelectedSport(e.target.value);
                                    setPage(1);
                                }}
                                className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-orange-500"
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
                            <label className="block text-gray-300 font-semibold mb-2">
                                Status
                            </label>
                            <select
                                value={selectedStatus}
                                onChange={(e) => {
                                    setSelectedStatus(e.target.value);
                                    setPage(1);
                                }}
                                className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-orange-500"
                            >
                                <option value="">All Status</option>
                                <option value="upcoming">Upcoming</option>
                                <option value="live">Live</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        {/* Team Filter */}
                        <div>
                            <label className="block text-gray-300 font-semibold mb-2">
                                Team
                            </label>
                            <select
                                value={selectedTeam}
                                onChange={(e) => setSelectedTeam(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-orange-500"
                            >
                                <option value="">All Teams</option>
                                {teams.map((team) => (
                                    <option key={team} value={team}>
                                        {team}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Clear Button */}
                        <div className="flex items-end">
                            <button
                                onClick={clearFilters}
                                className="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition font-semibold"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin text-4xl">⚙️</div>
                        <p className="text-gray-400 mt-4">Searching events...</p>
                    </div>
                ) : events.length === 0 ? (
                    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-12 text-center">
                        <p className="text-gray-400 text-lg">No events found. Try adjusting your filters.</p>
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
                            <div className="flex justify-center gap-2 mt-8">
                                <button
                                    onClick={() => setPage(Math.max(1, page - 1))}
                                    disabled={page === 1}
                                    className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => setPage(p)}
                                        className={`px-4 py-2 rounded-lg ${
                                            p === page
                                                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                                    disabled={page === totalPages}
                                    className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50"
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
