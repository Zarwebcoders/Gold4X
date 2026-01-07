import React from 'react';
import { motion } from 'framer-motion';
import {
    DollarSign,
    Wallet,
    CreditCard,
    Handshake,
    TrendingUp,
    Users,
    Bot,
    Crown,
    ChevronRight,
    Star,
    Gem,
    Trophy
} from 'lucide-react';
import Card from '../components/ui/Card';

const StatCard = ({ title, value, subtext, icon: Icon, colorClass = "text-highlight" }) => (
    <Card className="h-full">
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
                <h3 className={`text-3xl font-bold ${colorClass}`}>{value}</h3>
            </div>
            <div className={`p-3 rounded-lg bg-white/5 ${colorClass}`}>
                <Icon size={24} />
            </div>
        </div>
        <p className="text-xs text-gray-500">{subtext}</p>
    </Card>
);

const DetailedIncomeCard = ({ title, amount, icon: Icon, details }) => (
    <Card className="h-full">
        <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-yellow-500/20 text-yellow-500 rounded-lg">
                <Icon size={20} />
            </div>
            <h3 className="font-bold text-white">{title}</h3>
        </div>

        <div className="mb-6">
            <h2 className="text-3xl font-bold text-highlight">{amount}</h2>
        </div>

        <div className="space-y-3 pt-4 border-t border-white/5">
            {details.map((detail, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">{detail.label}</span>
                    <span className="font-medium text-white">{detail.value}</span>
                </div>
            ))}
        </div>
    </Card>
);

const RankCard = ({ rank, salary, requirements, isHighlight }) => (
    <div className={`p-6 rounded-xl border ${isHighlight ? 'bg-yellow-500/10 border-yellow-500/50' : 'bg-black/40 border-white/10'} flex flex-col items-center text-center relative`}>
        {isHighlight && (
            <div className="absolute -top-3 px-3 py-1 bg-yellow-500 text-black text-xs font-bold rounded-full uppercase">
                Current Goal
            </div>
        )}
        <div className="mb-4 text-highlight">
            <Crown size={32} strokeWidth={1.5} />
        </div>
        <h3 className={`text-lg font-bold mb-2 ${isHighlight ? 'text-white' : 'text-gray-300'}`}>{rank}</h3>
        <p className="text-xs text-gray-500 mb-4 h-8">{requirements}</p>
        <div className="text-xl font-bold text-highlight">{salary}</div>
    </div>
);

const Income = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Earned"
                    value="$0.00"
                    subtext="From all income sources"
                    icon={DollarSign}
                />
                <StatCard
                    title="Withdrawable Balance"
                    value="$0.00"
                    subtext="Available to withdraw"
                    icon={Wallet}
                />
                <StatCard
                    title="Total Withdrawn"
                    value="$0.00"
                    subtext="Already withdrawn"
                    icon={CreditCard}
                    colorClass="text-blue-400"
                />
            </div>

            {/* Income Breakdown Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <DetailedIncomeCard
                    title="Direct Income"
                    amount="$0.00"
                    icon={Handshake}
                    details={[
                        { label: 'Direct Referrals', value: '0' },
                        { label: 'Per Direct', value: '$40' },
                        { label: 'Reward Earned', value: '$0.00' }
                    ]}
                />
                <DetailedIncomeCard
                    title="ROI Income"
                    amount="$0.00"
                    icon={TrendingUp}
                    details={[
                        { label: 'Daily Rate', value: '0.6%' },
                        { label: 'Investment', value: '$0' },
                        { label: 'Last Payout', value: '-' }
                    ]}
                />
                <DetailedIncomeCard
                    title="Sponsor Income"
                    amount="$0.00"
                    icon={Users}
                    details={[
                        { label: 'Active Levels', value: '0' },
                        { label: 'Downline ROI', value: '15% Avg' },
                        { label: 'Network Volume', value: '$0' }
                    ]}
                />
                <DetailedIncomeCard
                    title="Autopool Income"
                    amount="$0.00"
                    icon={Bot}
                    details={[
                        { label: 'Bot Pools', value: '0 Active' },
                        { label: 'Pool 1 Status', value: '-' },
                        { label: 'Next Payout', value: '$0' }
                    ]}
                />
                <DetailedIncomeCard
                    title="Rank Income"
                    amount="$0.00"
                    icon={Crown}
                    details={[
                        { label: 'Current Rank', value: '-' },
                        { label: 'Monthly Salary', value: '$0' },
                        { label: 'Next Rank', value: '-' }
                    ]}
                />
            </div>

            {/* Earnings Cap Progress */}
            <Card>
                <h3 className="text-lg font-bold text-white mb-6 border-b border-white/5 pb-4">Earnings Cap Progress</h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="p-4 rounded-lg bg-black/20 border border-white/5 border-l-4 border-l-yellow-500">
                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Total Investment</p>
                        <p className="text-xl font-bold text-highlight">$0.00</p>
                    </div>
                    <div className="p-4 rounded-lg bg-black/20 border border-white/5 border-l-4 border-l-yellow-500">
                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Earnings Cap (4X)</p>
                        <p className="text-xl font-bold text-highlight">$0.00</p>
                    </div>
                    <div className="p-4 rounded-lg bg-black/20 border border-white/5 border-l-4 border-l-yellow-500">
                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Total Earned</p>
                        <p className="text-xl font-bold text-highlight">$0.00</p>
                    </div>
                    <div className="p-4 rounded-lg bg-black/20 border border-white/5 border-l-4 border-l-yellow-500">
                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Remaining to Cap</p>
                        <p className="text-xl font-bold text-highlight">$0.00</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <p className="text-center text-sm text-gray-400">
                        You've earned <span className="text-white font-bold">$0.00</span> out of <span className="text-white font-bold">$0.00</span> maximum earnings from your $0.00 investment (0%)
                    </p>
                </div>
            </Card>

            {/* Sponsor Income Table */}
            <Card>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Users size={18} className="text-yellow-500" /> Sponsor Income by Level
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs uppercase text-gray-500 border-b border-white/10">
                                <th className="pb-3 pl-4">Level</th>
                                <th className="pb-3">Commission %</th>
                                <th className="pb-3">Total Earned</th>
                                <th className="pb-3">Last Payout</th>
                                <th className="pb-3">Total Payouts</th>
                                <th className="pb-3 pr-4 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {[
                                { level: 1, percent: '15%' },
                                { level: 2, percent: '10%' },
                                { level: 3, percent: '5%' },
                                ...Array.from({ length: 7 }, (_, i) => ({ level: i + 4, percent: '4%' })), // Levels 4-10
                                ...Array.from({ length: 12 }, (_, i) => ({ level: i + 11, percent: '3.5%' })) // Levels 11-22
                            ].map((row) => (
                                <tr key={row.level} className="hover:bg-white/5 transition-colors">
                                    <td className="py-3 pl-4">
                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-highlight text-black text-xs font-bold">
                                            {row.level}
                                        </span>
                                    </td>
                                    <td className="py-3 text-white font-medium">{row.percent}</td>
                                    <td className="py-3 text-highlight font-bold">$0.00</td>
                                    <td className="py-3 text-highlight">$0.00</td>
                                    <td className="py-3 text-gray-300">0</td>
                                    <td className="py-3 pr-4 text-right">
                                        <span className="text-xs text-gray-500 border border-gray-500/30 px-2 py-1 rounded">
                                            Inactive
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Rank System */}
            <Card>
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Crown size={18} className="text-highlight" /> Rank System & Monthly Salaries
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    <RankCard
                        rank="STAR"
                        salary="$500/mo"
                        requirements="75K BV, 12 Directs"
                    />
                    <RankCard
                        rank="GOLD"
                        salary="$1,000/mo"
                        requirements="15 Directs"
                        isHighlight={true}
                    />
                    <RankCard
                        rank="PLATINUM"
                        salary="$2,500/mo"
                        requirements="300K BV, 50 Directs"
                    />
                    <RankCard
                        rank="EMERALD"
                        salary="$5,000/mo"
                        requirements="750K BV, 100 Directs"
                    />
                    <RankCard
                        rank="DIAMOND"
                        salary="$10,000/mo"
                        requirements="2M BV, 250 Directs"
                    />
                </div>
            </Card>
            {/* Income Transaction History */}
            <Card>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <CreditCard size={18} className="text-yellow-500" /> Income Transaction History
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs uppercase text-gray-500 border-b border-white/10 bg-white/5">
                                <th className="py-4 pl-4 rounded-l-lg">Date</th>
                                <th className="py-4">Type</th>
                                <th className="py-4">Details</th>
                                <th className="py-4">Amount</th>
                                <th className="py-4 pr-4 text-right rounded-r-lg">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <tr className="text-center py-8">
                                <td colSpan="5" className="py-8 text-gray-500 italic">No transaction history available</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Card>
        </motion.div>
    );
};

export default Income;
