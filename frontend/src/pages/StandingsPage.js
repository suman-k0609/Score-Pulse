import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import { searchAPI, standingsAPI } from '../services/api';
import { FiAward, FiTrendingUp, FiActivity, FiShield, FiCheckCircle } from 'react-icons/fi';

export default function StandingsPage() {
    const [standingsData, setStandingsData] = useState([]);
    const [selectedSport, setSelectedSport] = useState('football');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sports, setSports] = useState(['football', 'basketball', 'cricket', 'tennis']);

    const sportIcons = {
        football: '⚽',
        basketball: '🏀',
        cricket: '🏏',
        tennis: '🎾'
    };

    const sportColors = {
        football: 'from-emerald-500 to-teal-600',
        basketball: 'from-amber-500 to-orange-600',
        cricket: 'from-sky-500 to-blue-600',
        tennis: 'from-lime-500 to-emerald-600'
    };

    const fetchSports = async () => {
        try {
            const response = await searchAPI.getAllSports();
            if (response.data.sports && response.data.sports.length > 0) {
                setSports(response.data.sports);
            }
        } catch (err) {
            console.error('Error fetching sports:', err);
        }
    };

    const fetchStandings = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const response = await standingsAPI.getStandings(selectedSport);
            setStandingsData(response.data.standings || []);
        } catch (err) {
            setError('Failed to load standings');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [selectedSport]);

    useEffect(() => {
        fetchSports();
    }, []);

    useEffect(() => {
        fetchStandings();
    }, [selectedSport, fetchStandings]);

    const getRankBadge = (rank) => {
        if (rank === 1) return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm flex items-center gap-1 w-max">🥇 #1</span>;
        if (rank === 2) return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-300/20 text-slate-200 border border-slate-400/40 shadow-sm flex items-center gap-1 w-max">🥈 #2</span>;
        if (rank === 3) return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-600/20 text-orange-300 border border-orange-500/40 shadow-sm flex items-center gap-1 w-max">🥉 #3</span>;
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-800 text-gray-400 border border-gray-700 w-max inline-block text-center">#{rank}</span>;
    };

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 bg-ambient-glow">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Banner */}
                <div className="mb-8 p-6 sm:p-8 rounded-3xl glass-card border border-gray-800 relative overflow-hidden">
                    <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-3">
                                <FiActivity className="w-3.5 h-3.5 animate-pulse" />
                                <span>Official League Rankings</span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
                                <span>League Standings</span>
                                <span className="text-2xl">{sportIcons[selectedSport] || '🏆'}</span>
                            </h1>
                            <p className="text-sm text-gray-400 mt-2 max-w-xl">
                                Real-time competitive leaderboard, points breakdown, goal difference, and head-to-head metrics.
                            </p>
                        </div>

                        {/* Sport Selector Pills */}
                        <div className="flex items-center gap-2 flex-wrap bg-gray-900/90 p-2 rounded-2xl border border-gray-800/80">
                            {sports.map((sport) => {
                                const isSelected = selectedSport === sport;
                                const icon = sportIcons[sport] || '🏆';
                                return (
                                    <button
                                        key={sport}
                                        onClick={() => setSelectedSport(sport)}
                                        className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 ${
                                            isSelected
                                                ? `bg-gradient-to-r ${sportColors[sport] || 'from-cyan-500 to-sky-500'} text-white shadow-lg shadow-cyan-500/20 scale-105`
                                                : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                                        }`}
                                    >
                                        <span>{icon}</span>
                                        <span>{sport.charAt(0).toUpperCase() + sport.slice(1)}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Standings Table Card */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 glass-card rounded-2xl border border-gray-800">
                        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-400 text-sm mt-4 font-medium">Fetching real standings...</p>
                    </div>
                ) : error ? (
                    <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-6 text-rose-300 text-center font-medium">
                        {error}
                    </div>
                ) : (
                    <div className="glass-card rounded-3xl border border-gray-800/80 overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-900/90 border-b border-gray-800 text-gray-400 text-[11px] font-bold uppercase tracking-wider">
                                        <th className="px-6 py-4">Rank</th>
                                        <th className="px-6 py-4">Team</th>
                                        <th className="px-4 py-4 text-center">Played</th>
                                        <th className="px-4 py-4 text-center">Won</th>
                                        <th className="px-4 py-4 text-center">Drawn</th>
                                        <th className="px-4 py-4 text-center">Lost</th>
                                        <th className="px-4 py-4 text-center">GF</th>
                                        <th className="px-4 py-4 text-center">GA</th>
                                        <th className="px-4 py-4 text-center">GD</th>
                                        <th className="px-6 py-4 text-center text-cyan-400 font-extrabold">Points</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800/50 text-sm">
                                    {standingsData.map((team, idx) => {
                                        const isTop3 = idx < 3;
                                        return (
                                            <tr
                                                key={team.name}
                                                className={`transition-all duration-200 hover:bg-gray-800/50 ${
                                                    isTop3 ? 'bg-cyan-500/[0.02]' : ''
                                                }`}
                                            >
                                                <td className="px-6 py-4 font-bold whitespace-nowrap">
                                                    {getRankBadge(team.rank)}
                                                </td>
                                                <td className="px-6 py-4 font-bold text-white whitespace-nowrap flex items-center space-x-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-800 to-gray-700 border border-gray-600 flex items-center justify-center text-xs text-cyan-400 font-extrabold shadow-inner">
                                                        {team.name.charAt(0)}
                                                    </div>
                                                    <span className="hover:text-cyan-400 transition">{team.name}</span>
                                                </td>
                                                <td className="px-4 py-4 text-center font-medium text-gray-300">
                                                    {team.played}
                                                </td>
                                                <td className="px-4 py-4 text-center font-extrabold text-emerald-400">
                                                    {team.won}
                                                </td>
                                                <td className="px-4 py-4 text-center font-bold text-amber-400">
                                                    {team.drawn}
                                                </td>
                                                <td className="px-4 py-4 text-center font-bold text-rose-400">
                                                    {team.lost}
                                                </td>
                                                <td className="px-4 py-4 text-center font-semibold text-slate-300">
                                                    {team.pointsFor}
                                                </td>
                                                <td className="px-4 py-4 text-center font-semibold text-slate-400">
                                                    {team.pointsAgainst}
                                                </td>
                                                <td className={`px-4 py-4 text-center font-extrabold ${
                                                    team.goalDifference >= 0 ? 'text-emerald-400' : 'text-rose-400'
                                                }`}>
                                                    {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
                                                </td>
                                                <td className="px-6 py-4 text-center font-extrabold text-base whitespace-nowrap">
                                                    <span className="inline-block px-3 py-1 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-sm">
                                                        {team.points} pts
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Modern Metrics Key Cards */}
                <div className="mt-8">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center space-x-2">
                        <FiShield className="w-4 h-4 text-cyan-400" />
                        <span>Metrics & Scoring Rules</span>
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                        <div className="glass-card p-4 rounded-2xl border border-gray-800/80 hover:border-cyan-500/30 transition">
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">GF</div>
                            <div className="text-sm font-extrabold text-white mt-1">Goals For</div>
                            <div className="text-[11px] text-gray-500 mt-1">Total goals scored</div>
                        </div>
                        <div className="glass-card p-4 rounded-2xl border border-gray-800/80 hover:border-cyan-500/30 transition">
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">GA</div>
                            <div className="text-sm font-extrabold text-white mt-1">Goals Against</div>
                            <div className="text-[11px] text-gray-500 mt-1">Total goals conceded</div>
                        </div>
                        <div className="glass-card p-4 rounded-2xl border border-gray-800/80 hover:border-cyan-500/30 transition">
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">GD</div>
                            <div className="text-sm font-extrabold text-white mt-1">Goal Diff</div>
                            <div className="text-[11px] text-gray-500 mt-1">GF minus GA</div>
                        </div>
                        <div className="glass-card p-4 rounded-2xl border border-gray-800/80 hover:border-cyan-500/30 transition">
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">W-D-L</div>
                            <div className="text-sm font-extrabold text-white mt-1">Record</div>
                            <div className="text-[11px] text-gray-500 mt-1">Wins, Draws, Losses</div>
                        </div>
                        <div className="glass-card p-4 rounded-2xl border border-gray-800/80 hover:border-cyan-500/30 transition">
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Points</div>
                            <div className="text-sm font-extrabold text-cyan-400 mt-1">3 - 1 - 0 Rule</div>
                            <div className="text-[11px] text-gray-500 mt-1">Win: 3pts | Draw: 1pt</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
