import React from 'react';
import { motion } from 'framer-motion';
import {
    Bot,
    Coins,
    ArrowRight,
    List,
    History,
    Activity,
    Layers
} from 'lucide-react';
import Card from '../components/ui/Card';

const AutopoolStatCard = ({ title, value, subtext, icon: Icon, colorClass = "text-highlight", bgClass = "bg-white/5" }) => (
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

const AutopoolBots = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            {/* Autopool Overview Header */}
            <Card className="bg-gradient-to-r from-black/60 to-black/40 border-highlight/20">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                        <Bot className="text-highlight" size={32} />
                        <h2 className="text-2xl font-bold text-highlight">Autopool Overview</h2>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-white font-medium">Active Positions: 0</span>
                        <span className="text-highlight font-bold">Next Payout: —</span>
                    </div>
                </div>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AutopoolStatCard
                    title="Active Bots"
                    value="0"
                    subtext="In Progress"
                    icon={Bot}
                    colorClass="text-yellow-500"
                />
                <AutopoolStatCard
                    title="Total Payouts Earned"
                    value="$0"
                    subtext="From Completed Pools"
                    icon={Coins}
                    colorClass="text-yellow-500"
                />
                <AutopoolStatCard
                    title="Rebirth Fees Paid"
                    value="$0"
                    subtext="Auto-Placed in Next"
                    icon={ArrowRight}
                    colorClass="text-blue-400"
                    bgClass="bg-blue-500/10"
                />
            </div>

            {/* Your Active Bot Positions */}
            <Card>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <List size={18} className="text-highlight" /> Your Active Bot Positions
                    </h3>
                </div>
                <div className="py-12 text-center text-gray-400">
                    <p>Connect wallet to view your active bot positions.</p>
                </div>
            </Card>

            {/* All Autopool Status */}
            <Card>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Layers size={18} className="text-highlight" /> All Autopool Status
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs uppercase text-gray-500 border-b border-white/10 bg-white/5">
                                <th className="py-4 pl-4 rounded-l-lg">Pool</th>
                                <th className="py-4">Status</th>
                                <th className="py-4">Active Bots</th>
                                <th className="py-4 pr-4 rounded-r-lg text-right">Progress</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <tr className="text-center py-12">
                                <td colSpan="4" className="py-8 text-gray-500">
                                    Loading pool status...
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Autopool Payout History */}
            <Card>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <History size={18} className="text-highlight" /> Autopool Payout History
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs uppercase text-gray-500 border-b border-white/10 bg-white/5">
                                <th className="py-4 pl-4 rounded-l-lg">Date</th>
                                <th className="py-4">Pool</th>
                                <th className="py-4">User Position</th>
                                <th className="py-4">Payout Amount</th>
                                <th className="py-4 pr-4 rounded-r-lg text-right">Tx Hash</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <tr className="text-center py-12">
                                <td colSpan="5" className="py-8 text-gray-400">
                                    Connect wallet to view your autopool payout history.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Card>
        </motion.div>
    );
};

export default AutopoolBots;
