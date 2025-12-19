import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function StandingsPage() {
    const [standingsData, setStandingsData] = useState([]);
    const [selectedSport, setSelectedSport] = useState('basketball');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sports, setSports] = useState([]);

    useEffect(() => {
        fetchSports();
        fetchStandings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedSport]);

    const fetchSports = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/search/sports/all');
            setSports(response.data.sports);
        } catch (err) {
            console.error('Error fetching sports:', err);
        }
    };

    const fetchStandings = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:5000/api/standings/${selectedSport}`);
            setStandingsData(response.data.standings);
        } catch (err) {
            setError('Failed to load standings');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-6">
                        🏆 League Standings
                    </h1>

                    {/* Sport Selector */}
                    <div className="flex gap-2 flex-wrap">
                        {sports.map((sport) => (
                            <button
                                key={sport}
                                onClick={() => setSelectedSport(sport)}
                                className={`px-6 py-2 rounded-lg font-semibold transition ${
                                    selectedSport === sport
                                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                            >
                                {sport.charAt(0).toUpperCase() + sport.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Standings Table */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin">
                            <div className="text-4xl">⚙️</div>
                        </div>
                        <p className="text-gray-400 mt-4">Loading standings...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 text-red-300">
                        {error}
                    </div>
                ) : (
                    <div className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
                                    <th className="px-4 py-3 text-left">Rank</th>
                                    <th className="px-4 py-3 text-left">Team</th>
                                    <th className="px-4 py-3 text-center">Played</th>
                                    <th className="px-4 py-3 text-center">Won</th>
                                    <th className="px-4 py-3 text-center">Drawn</th>
                                    <th className="px-4 py-3 text-center">Lost</th>
                                    <th className="px-4 py-3 text-center">GF</th>
                                    <th className="px-4 py-3 text-center">GA</th>
                                    <th className="px-4 py-3 text-center">GD</th>
                                    <th className="px-4 py-3 text-center">Points</th>
                                </tr>
                            </thead>
                            <tbody>
                                {standingsData.map((team, idx) => (
                                    <tr
                                        key={team.name}
                                        className={`border-t border-gray-700 transition hover:bg-gray-700/50 ${
                                            idx === 0 ? 'bg-green-900/20' : ''
                                        }`}
                                    >
                                        <td className="px-4 py-3 font-bold">
                                            <span className="inline-block w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white flex items-center justify-center text-sm">
                                                {team.rank}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 font-semibold text-white">
                                            {team.name}
                                        </td>
                                        <td className="px-4 py-3 text-center text-gray-300">
                                            {team.played}
                                        </td>
                                        <td className="px-4 py-3 text-center text-green-400 font-semibold">
                                            {team.won}
                                        </td>
                                        <td className="px-4 py-3 text-center text-yellow-400 font-semibold">
                                            {team.drawn}
                                        </td>
                                        <td className="px-4 py-3 text-center text-red-400 font-semibold">
                                            {team.lost}
                                        </td>
                                        <td className="px-4 py-3 text-center text-blue-400">
                                            {team.pointsFor}
                                        </td>
                                        <td className="px-4 py-3 text-center text-blue-400">
                                            {team.pointsAgainst}
                                        </td>
                                        <td className={`px-4 py-3 text-center font-semibold ${
                                            team.goalDifference >= 0 ? 'text-green-400' : 'text-red-400'
                                        }`}>
                                            {team.goalDifference > 0 ? '+' : ''}{team.goalDifference}
                                        </td>
                                        <td className="px-4 py-3 text-center font-bold text-lg">
                                            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                                                {team.points}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Legend */}
                <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                        <p className="text-gray-400 text-sm">GF</p>
                        <p className="text-white font-semibold">Goals For</p>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                        <p className="text-gray-400 text-sm">GA</p>
                        <p className="text-white font-semibold">Goals Against</p>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                        <p className="text-gray-400 text-sm">GD</p>
                        <p className="text-white font-semibold">Goal Difference</p>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                        <p className="text-gray-400 text-sm">W-D-L</p>
                        <p className="text-white font-semibold">Win-Draw-Loss</p>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                        <p className="text-gray-400 text-sm">3-1-0</p>
                        <p className="text-white font-semibold">Points System</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
