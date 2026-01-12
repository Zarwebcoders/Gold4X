import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ethers } from 'ethers';
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
import { useWeb3 } from '../context/Web3Context';
import { REFERRAL_LEVELS } from '../utils/referralRules';

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
    const { userData, contract, account } = useWeb3();
    const directs = userData?.directs || 0;
    const [levelData, setLevelData] = useState({});

    useEffect(() => {
        const fetchLevelData = async () => {
            if (contract && account) {
                const data = {};
                // Fetch for all 20 levels
                for (let i = 1; i <= 20; i++) {
                    try {
                        const result = await contract.getUserLevelIncome(account, i);
                        data[i] = {
                            totalEarned: ethers.formatEther(result[0]),
                            lastPayout: ethers.formatEther(result[1]),
                            totalPayouts: Number(result[2])
                        };
                    } catch (e) {
                        console.error(`Error fetching level ${i} data:`, e);
                    }
                }
                setLevelData(data);
            }
        };
        fetchLevelData();
    }, [contract, account]);

    // Calculations
    const totalInvested = userData?.totalInvested ? parseFloat(userData.totalInvested) : 0;
    const maxEarnings = totalInvested * 4;
    const totalEarned = userData?.totalEarned ? parseFloat(userData.totalEarned) : 0;
    const remainingCap = Math.max(0, maxEarnings - totalEarned);
    const progressPercent = maxEarnings > 0 ? (totalEarned / maxEarnings) * 100 : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard
                    title="Total Earned"
                    value={`$${totalEarned.toFixed(2)}`}
                    subtext="From all income sources"
                    icon={DollarSign}
                />
                <StatCard
                    title="Withdrawable Balance"
                    value={`${userData?.g4xBalance ? parseFloat(userData.g4xBalance).toFixed(2) : '0.00'} G4X`}
                    subtext="Available to withdraw"
                    icon={Wallet}
                />
            </div>

            {/* Income Breakdown Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <DetailedIncomeCard
                    title="Direct Income"
                    amount={`$${userData?.directIncome ? parseFloat(userData.directIncome).toFixed(2) : '0.00'}`}
                    icon={Handshake}
                    details={[
                        { label: 'Direct Referrals', value: userData?.directs || '0' },
                        { label: 'Per Direct', value: '$40' },
                        { label: 'Reward Earned', value: `$${userData?.directIncome ? parseFloat(userData.directIncome).toFixed(2) : '0.00'}` }
                    ]}
                />
                <DetailedIncomeCard
                    title="ROI Income"
                    amount={`$${userData?.roiIncome ? parseFloat(userData.roiIncome).toFixed(2) : '0.00'}`}
                    icon={TrendingUp}
                    details={[
                        { label: 'Daily Rate', value: '0.6%' },
                        { label: 'Investment', value: `$${totalInvested.toFixed(2)}` },
                        { label: 'Last Payout', value: userData?.lastROITimestamp ? new Date(parseInt(userData.lastROITimestamp) * 1000).toLocaleDateString() : '-' }
                    ]}
                />
                <DetailedIncomeCard
                    title="Sponsor Income"
                    amount={`$${userData?.sponsorIncome ? parseFloat(userData.sponsorIncome).toFixed(2) : '0.00'}`}
                    icon={Users}
                    details={[
                        { label: 'Active Levels', value: '20' },
                        { label: 'Downline ROI', value: '14% L1 + levels' },
                        { label: 'Network Volume', value: `$${userData?.businessVolume ? parseFloat(userData.businessVolume).toLocaleString() : '0'}` }
                    ]}
                />
                <DetailedIncomeCard
                    title="Autopool Income"
                    amount={`$${userData?.autopoolIncome ? parseFloat(userData.autopoolIncome).toFixed(2) : '0.00'}`}
                    icon={Bot}
                    details={[
                        { label: 'Bot Pools', value: userData?.autopoolPosition > 0 ? 'Active' : 'Inactive' },
                        { label: 'Pool Status', value: userData?.autopoolPosition > 0 ? `Pool ${userData.autopoolPosition}` : '-' },
                        { label: 'Next Payout', value: userData?.poolInfo?.payoutAmount ? `$${parseFloat(userData.poolInfo.payoutAmount).toFixed(2)}` : '$0' }
                    ]}
                />
                <DetailedIncomeCard
                    title="Rank Income"
                    amount={`$${userData?.rankIncome ? parseFloat(userData.rankIncome).toFixed(2) : '0.00'}`}
                    icon={Crown}
                    details={[
                        { label: 'Current Rank', value: userData?.currentRank || '-' },
                        { label: 'Monthly Salary', value: `$${userData?.rankSalary || '0'}` },
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
                        <p className="text-xl font-bold text-highlight">${totalInvested.toFixed(2)}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-black/20 border border-white/5 border-l-4 border-l-yellow-500">
                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Earnings Cap (4X)</p>
                        <p className="text-xl font-bold text-highlight">${maxEarnings.toFixed(2)}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-black/20 border border-white/5 border-l-4 border-l-yellow-500">
                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Total Earned</p>
                        <p className="text-xl font-bold text-highlight">${totalEarned.toFixed(2)}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-black/20 border border-white/5 border-l-4 border-l-yellow-500">
                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Remaining to Cap</p>
                        <p className="text-xl font-bold text-highlight">${remainingCap.toFixed(2)}</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <p className="text-center text-sm text-gray-400">
                        You've earned <span className="text-white font-bold">${totalEarned.toFixed(2)}</span> out of <span className="text-white font-bold">${maxEarnings.toFixed(2)}</span> maximum earnings from your ${totalInvested.toFixed(2)} investment ({progressPercent.toFixed(1)}%)
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
                            {REFERRAL_LEVELS.map((row) => {
                                const isUnlocked = directs >= row.requiredDirects;
                                const data = levelData[row.level] || { totalEarned: '0', lastPayout: '0', totalPayouts: 0 };

                                return (
                                    <tr key={row.level} className="hover:bg-white/5 transition-colors">
                                        <td className="py-3 pl-4">
                                            <span className={`inline-flex items-center justify-center w-8 h-6 rounded-full text-xs font-bold ${isUnlocked ? 'bg-highlight text-black' : 'bg-gray-700 text-gray-400'}`}>
                                                {row.level}
                                            </span>
                                        </td>
                                        <td className="py-3 text-white font-medium">{row.percent}</td>
                                        <td className={`py-3 font-bold ${isUnlocked ? 'text-highlight' : 'text-gray-600'}`}>
                                            ${parseFloat(data.totalEarned).toFixed(2)}
                                        </td>
                                        <td className={`py-3 ${isUnlocked ? 'text-highlight' : 'text-gray-600'}`}>
                                            ${parseFloat(data.lastPayout).toFixed(2)}
                                        </td>
                                        <td className="py-3 text-gray-300">{data.totalPayouts}</td>
                                        <td className="py-3 pr-4 text-right">
                                            <span className={`text-xs border px-2 py-1 rounded ${isUnlocked ? 'text-green-500 border-green-500/30 bg-green-500/10' : 'text-red-500 border-red-500/30 bg-red-500/10'}`}>
                                                {isUnlocked ? 'Active' : `Locked (${row.requiredDirects} Directs)`}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
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