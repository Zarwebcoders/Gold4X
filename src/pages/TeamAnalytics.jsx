import React from 'react';
import { motion } from 'framer-motion';
import {
    PieChart,
    Users,
    Coins,
    Trophy,
    Info,
    Layers,
    Activity
} from 'lucide-react';
import Card from '../components/ui/Card';

const TeamStatsCard = ({ title, value, subtext, icon: Icon, secondaryValue, secondaryLabel }) => (
    <Card className="h-full">
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
                <p className="text-xs text-gray-500">{subtext}</p>
            </div>
            <div className="p-3 rounded-lg bg-white/5 text-yellow-500">
                <Icon size={24} />
            </div>
        </div>
        {secondaryValue && (
            <div className="mt-4 pt-4 border-t border-white/5">
                <p className="text-gray-400 text-xs mb-1">{secondaryLabel}</p>
                <h4 className="text-xl font-bold text-white">{secondaryValue}</h4>
                <p className="text-xs text-gray-500">Your Share: —</p>
            </div>
        )}
    </Card>
);

const RankCard = ({ rank, criteria, count, isActive }) => (
    <div className={`p-4 rounded-xl border ${isActive ? 'border-highlight bg-highlight/5' : 'border-white/10 bg-black/40'} flex flex-col items-center text-center`}>
        <div className="mb-2 text-white">
            <Trophy size={24} className={isActive ? 'text-highlight' : 'text-gray-400'} />
        </div>
        <h4 className="font-bold text-white text-sm mb-1">{rank}</h4>
        <p className="text-[10px] text-gray-400 mb-2">{criteria}</p>
        <h3 className="text-2xl font-bold text-white">{count}</h3>
    </div>
);

const TeamAnalytics = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            {/* Team Performance Overview Header */}
            <Card className="bg-gradient-to-r from-black/60 to-black/40 border-highlight/20">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                        <PieChart className="text-highlight" size={32} />
                        <h2 className="text-2xl font-bold text-highlight">Team Performance Overview</h2>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center justify-end gap-2 text-gray-400 text-xs mb-1">
                            <span>Team Performance Overview</span>
                            <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                            <span>Live on-chain values</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex flex-col items-end">
                                <span className="text-highlight font-bold">Total Team Size: —</span>
                            </div>
                            <div className="h-8 w-px bg-white/10" />
                            <div className="flex flex-col items-end">
                                <span className="text-gray-400">Network BV: —</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Team Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TeamStatsCard
                    title="Active Team Members"
                    value="—"
                    subtext="Out of —"
                    icon={Users}
                />
                <TeamStatsCard
                    title="Total Team Investment"
                    value="—"
                    subtext="Average: —"
                    icon={Coins}
                    secondaryValue="—"
                    secondaryLabel="Team Earnings Generated"
                />
            </div>

            {/* Rank Distribution */}
            <Card>
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Trophy size={18} className="text-highlight" /> Rank Distribution
                    </h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <RankCard
                        rank="STAR"
                        criteria="BV: 75K | Directs: 12"
                        count="8"
                    />
                    <RankCard
                        rank="GOLD"
                        criteria="Directs: 15"
                        count="12"
                        isActive={true}
                    />
                    <RankCard
                        rank="DIAMOND"
                        criteria="Directs: 18"
                        count="5"
                    />
                    <RankCard
                        rank="RUBY"
                        criteria="Directs: 20"
                        count="2"
                    />
                </div>
            </Card>

            {/* Live Team Snapshot Banner */}
            <div className="bg-black/40 border border-white/10 rounded-xl p-6 flex items-start gap-4">
                <Info className="text-highlight shrink-0 mt-1" size={20} />
                <div>
                    <h4 className="text-white font-bold mb-1">Live Team Snapshot</h4>
                    <p className="text-gray-400 text-sm">Data updates every 30s. Connect wallet to load your team data from chain.</p>
                </div>
            </div>

            {/* Downline Analytics Table */}
            <Card>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Layers size={18} className="text-highlight" /> Downline Analytics by Level (22 Levels)
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs uppercase text-gray-500 border-b border-white/10 bg-white/5">
                                <th className="py-4 pl-4 rounded-l-lg">Level</th>
                                <th className="py-4">Members</th>
                                <th className="py-4">Investment</th>
                                <th className="py-4">BV</th>
                                <th className="py-4">Earnings Generated</th>
                                <th className="py-4">Your Commission</th>
                                <th className="py-4 pr-4 rounded-r-lg text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <tr className="text-center py-12">
                                <td colSpan="7" className="py-8 text-gray-500">
                                    Loading downline analytics...
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Card>
        </motion.div>
    );
};

export default TeamAnalytics;
