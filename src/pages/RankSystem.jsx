import React from 'react';
import { motion } from 'framer-motion';
import {
    Trophy,
    TrendingUp,
    Users,
    Crown,
    List,
    History,
    Award,
    Star
} from 'lucide-react';
import Card from '../components/ui/Card';

const RankStatCard = ({ title, value, subtext, icon: Icon, colorClass = "text-highlight", bgClass = "bg-white/5" }) => (
    <Card className="h-full">
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
                <p className="text-xs text-gray-500">{subtext}</p>
            </div>
            <div className={`p-3 rounded-lg ${bgClass} ${colorClass}`}>
                <Icon size={24} />
            </div>
        </div>
    </Card>
);

const RankSystem = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            {/* Rank Progress Header */}
            <Card className="bg-gradient-to-r from-black/60 to-black/40 border-highlight/20">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                        <Trophy className="text-highlight" size={32} />
                        <h2 className="text-2xl font-bold text-highlight">Your Rank Progress</h2>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        <span className="text-white font-medium">Current Rank: —</span>
                        <span className="text-highlight font-bold">Monthly Salary: —</span>
                    </div>
                </div>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <RankStatCard
                    title="Current Rank"
                    value="—"
                    subtext="Achieved: —"
                    icon={Award}
                    colorClass="text-yellow-500"
                />
                <RankStatCard
                    title="Business Volume"
                    value="—"
                    subtext="Required for Next: —"
                    icon={TrendingUp}
                    colorClass="text-yellow-500"
                />
                <RankStatCard
                    title="Direct Referrals"
                    value="—"
                    subtext="Required for Next: —"
                    icon={Users}
                    colorClass="text-blue-400"
                    bgClass="bg-blue-500/10"
                />
            </div>

            {/* Current Rank Progress Section */}
            <Card className="border-highlight/30 bg-gradient-to-b from-highlight/5 to-transparent">
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Crown size={18} className="text-highlight" /> Your Current Rank: —
                    </h3>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-highlight/20 flex items-center justify-center border border-highlight/50 text-highlight font-bold text-xl">
                            -
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-gray-400 text-sm">Monthly Salary: —</span>
                                <span className="text-gray-600">|</span>
                                <span className="text-gray-400 text-sm">Requires: —</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-400">
                            <span>Progress</span>
                            <span>0%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-highlight w-0"></div>
                        </div>
                        <p className="text-xs text-gray-500">—</p>
                    </div>
                </div>
            </Card>

            {/* Rank Benefits & Requirements */}
            <Card>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <List size={18} className="text-highlight" /> Rank Benefits & Requirements
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs uppercase text-highlight border-b border-white/10 bg-white/5">
                                <th className="py-4 pl-4 rounded-l-lg">Rank</th>
                                <th className="py-4">Required BV</th>
                                <th className="py-4">Required Directs</th>
                                <th className="py-4">Monthly Salary</th>
                                <th className="py-4 pr-4 rounded-r-lg text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <tr className="hover:bg-white/5 transition-colors">
                                <td className="py-4 pl-4 text-white font-medium flex items-center gap-2">
                                    <Star size={16} className="text-gray-400 fill-gray-400" /> STAR
                                </td>
                                <td className="py-4 text-gray-400">$75,000</td>
                                <td className="py-4 text-gray-400">12</td>
                                <td className="py-4 text-white font-medium">$500</td>
                                <td className="py-4 pr-4 text-right text-gray-500">Locked</td>
                            </tr>
                            <tr className="hover:bg-white/5 transition-colors">
                                <td className="py-4 pl-4 text-white font-medium flex items-center gap-2">
                                    <Star size={16} className="text-gray-400 fill-gray-400" /> GOLD
                                </td>
                                <td className="py-4 text-gray-400">N/A</td>
                                <td className="py-4 text-gray-400">15</td>
                                <td className="py-4 text-white font-medium">$1000</td>
                                <td className="py-4 pr-4 text-right text-gray-500">Locked</td>
                            </tr>
                            <tr className="hover:bg-white/5 transition-colors">
                                <td className="py-4 pl-4 text-white font-medium flex items-center gap-2">
                                    <Star size={16} className="text-gray-400 fill-gray-400" /> DIAMOND
                                </td>
                                <td className="py-4 text-gray-400">N/A</td>
                                <td className="py-4 text-gray-400">18</td>
                                <td className="py-4 text-white font-medium">$2000</td>
                                <td className="py-4 pr-4 text-right text-gray-500">Locked</td>
                            </tr>
                            <tr className="hover:bg-white/5 transition-colors">
                                <td className="py-4 pl-4 text-white font-medium flex items-center gap-2">
                                    <Star size={16} className="text-gray-400 fill-gray-400" /> RUBY
                                </td>
                                <td className="py-4 text-gray-400">N/A</td>
                                <td className="py-4 text-gray-400">20</td>
                                <td className="py-4 text-white font-medium">$4000</td>
                                <td className="py-4 pr-4 text-right text-gray-500">Locked</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* All Ranks Overview */}
            <Card>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Award size={18} className="text-highlight" /> All Ranks Overview
                    </h3>
                </div>
                <div className="py-8 text-center text-gray-500">
                    {/* Placeholder for whatever content goes here, maybe visual rank badges */}
                    No active ranks to display.
                </div>
            </Card>

            {/* Salary History */}
            <Card>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <History size={18} className="text-highlight" /> Salary History
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs uppercase text-gray-500 border-b border-white/10 bg-white/5">
                                <th className="py-4 pl-4 rounded-l-lg">Date</th>
                                <th className="py-4">Rank</th>
                                <th className="py-4">Amount</th>
                                <th className="py-4 pr-4 rounded-r-lg text-right">Tx Hash</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <tr className="text-center py-12">
                                <td colSpan="4" className="py-8 text-gray-500">
                                    No salary history available.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Card>
        </motion.div>
    );
};

export default RankSystem;
