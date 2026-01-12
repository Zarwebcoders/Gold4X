import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Trophy,
    TrendingUp,
    Users,
    Crown,
    List,
    History,
    Award,
    Star,
    CheckCircle
} from 'lucide-react';
import Card from '../components/ui/Card';
import { useWeb3 } from '../context/Web3Context';
import { ethers } from 'ethers';

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
    const { userData, contract, account } = useWeb3();
    const [salaryHistory, setSalaryHistory] = useState([]);
    const [rankHistory, setRankHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    useEffect(() => {
        const fetchHistory = async () => {
            if (contract && account) {
                setLoadingHistory(true);
                try {
                    // Fetch Salary History (RankIncomeCredited)
                    // event RankIncomeCredited(address indexed user, bytes32 rank, uint256 amount);
                    const salaryFilter = contract.filters.RankIncomeCredited(account);
                    const salaryEvents = await contract.queryFilter(salaryFilter);
                    const processedSalary = await Promise.all(salaryEvents.map(async (event) => {
                        const block = await event.getBlock();
                        return {
                            rank: ethers.decodeBytes32String(event.args[1]),
                            amount: ethers.formatEther(event.args[2]),
                            hash: event.transactionHash,
                            date: new Date(block.timestamp * 1000).toLocaleDateString()
                        };
                    }));
                    setSalaryHistory(processedSalary.reverse()); // Newest first

                    // Fetch Rank Achievement History (RankAchieved)
                    // event RankAchieved(address indexed user, bytes32 rank);
                    const rankFilter = contract.filters.RankAchieved(account);
                    const rankEvents = await contract.queryFilter(rankFilter);
                    const processedRanks = await Promise.all(rankEvents.map(async (event) => {
                        const block = await event.getBlock();
                        return {
                            rank: ethers.decodeBytes32String(event.args[1]),
                            hash: event.transactionHash,
                            date: new Date(block.timestamp * 1000).toLocaleDateString()
                        }
                    }));
                    setRankHistory(processedRanks.reverse());

                } catch (e) {
                    console.error("Error fetching rank history:", e);
                } finally {
                    setLoadingHistory(false);
                }
            }
        };

        fetchHistory();
    }, [contract, account]);


    const getNextRankRequirements = (currentRank) => {
        if (!currentRank || currentRank === "No Rank") return { next: "STAR", bv: 75000, directs: 12 };
        if (currentRank === "STAR") return { next: "GOLD", bv: 0, directs: 15 };
        if (currentRank === "GOLD") return { next: "DIAMOND", bv: 0, directs: 18 };
        if (currentRank === "DIAMOND") return { next: "RUBY", bv: 0, directs: 20 };
        return { next: "MAX", bv: 0, directs: 0 };
    };

    const nextReqs = getNextRankRequirements(userData?.currentRank);
    const currentBV = userData?.businessVolume ? parseFloat(userData.businessVolume) : 0;
    const currentDirects = userData?.directs || 0;

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
                        <span className="text-white font-medium">Current Rank: <span className="text-highlight">{userData?.currentRank || 'No Rank'}</span></span>
                        <span className="text-highlight font-bold">Monthly Salary: {userData?.rankSalary ? `$${userData.rankSalary}` : '$0'}</span>
                    </div>
                </div>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <RankStatCard
                    title="Current Rank"
                    value={userData?.currentRank || 'No Rank'}
                    subtext={`Next: ${nextReqs.next}`}
                    icon={Award}
                    colorClass="text-yellow-500"
                />
                <RankStatCard
                    title="Business Volume"
                    value={`$${currentBV.toLocaleString()}`}
                    subtext={nextReqs.bv > 0 ? `Required: $${nextReqs.bv.toLocaleString()}` : 'BV Requirement Met'}
                    icon={TrendingUp}
                    colorClass="text-yellow-500"
                />
                <RankStatCard
                    title="Direct Referrals"
                    value={currentDirects}
                    subtext={`Required: ${nextReqs.directs}`}
                    icon={Users}
                    colorClass="text-blue-400"
                    bgClass="bg-blue-500/10"
                />
            </div>

            {/* Current Rank Progress Section */}
            <Card className="border-highlight/30 bg-gradient-to-b from-highlight/5 to-transparent">
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Crown size={18} className="text-highlight" /> Your Current Rank: {userData?.currentRank || 'No Rank'}
                    </h3>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-highlight/20 flex items-center justify-center border border-highlight/50 text-highlight font-bold text-xl">
                            {userData?.currentRank ? userData.currentRank.charAt(0) : '-'}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-gray-400 text-sm">Monthly Salary: {userData?.rankSalary ? `$${userData.rankSalary}` : '$0'}</span>
                                <span className="text-gray-600">|</span>
                                <span className="text-gray-400 text-sm">Next Rank Needs: {nextReqs.directs - currentDirects > 0 ? `${nextReqs.directs - currentDirects} more directs` : 'Directs requirement met'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-400">
                            <span>Directs Progress</span>
                            <span>{Math.min(100, Math.round((currentDirects / nextReqs.directs) * 100))}%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-highlight"
                                style={{ width: `${Math.min(100, (currentDirects / nextReqs.directs) * 100)}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-gray-500">Keep growing your team to achieve {nextReqs.next} rank!</p>
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
                            <tr className={`hover:bg-white/5 transition-colors ${userData?.currentRank === 'STAR' ? 'bg-highlight/10' : ''}`}>
                                <td className="py-4 pl-4 text-white font-medium flex items-center gap-2">
                                    <Star size={16} className={`${userData?.currentRank === 'STAR' ? 'text-highlight fill-highlight' : 'text-gray-400 fill-gray-400'}`} /> STAR
                                </td>
                                <td className="py-4 text-gray-400">$75,000</td>
                                <td className="py-4 text-gray-400">12</td>
                                <td className="py-4 text-white font-medium">$500</td>
                                <td className="py-4 pr-4 text-right">
                                    <span className={`text-xs px-2 py-1 rounded border ${userData?.currentRank === 'STAR' ? 'text-green-500 border-green-500/30' : 'text-gray-500 border-gray-500/30'}`}>
                                        {userData?.currentRank === 'STAR' ? 'Active' : 'Locked'}
                                    </span>
                                </td>
                            </tr>
                            <tr className={`hover:bg-white/5 transition-colors ${userData?.currentRank === 'GOLD' ? 'bg-highlight/10' : ''}`}>
                                <td className="py-4 pl-4 text-white font-medium flex items-center gap-2">
                                    <Star size={16} className={`${userData?.currentRank === 'GOLD' ? 'text-highlight fill-highlight' : 'text-gray-400 fill-gray-400'}`} /> GOLD
                                </td>
                                <td className="py-4 text-gray-400">N/A</td>
                                <td className="py-4 text-gray-400">15</td>
                                <td className="py-4 text-white font-medium">$1000</td>
                                <td className="py-4 pr-4 text-right">
                                    <span className={`text-xs px-2 py-1 rounded border ${userData?.currentRank === 'GOLD' ? 'text-green-500 border-green-500/30' : 'text-gray-500 border-gray-500/30'}`}>
                                        {userData?.currentRank === 'GOLD' ? 'Active' : 'Locked'}
                                    </span>
                                </td>
                            </tr>
                            <tr className={`hover:bg-white/5 transition-colors ${userData?.currentRank === 'DIAMOND' ? 'bg-highlight/10' : ''}`}>
                                <td className="py-4 pl-4 text-white font-medium flex items-center gap-2">
                                    <Star size={16} className={`${userData?.currentRank === 'DIAMOND' ? 'text-highlight fill-highlight' : 'text-gray-400 fill-gray-400'}`} /> DIAMOND
                                </td>
                                <td className="py-4 text-gray-400">N/A</td>
                                <td className="py-4 text-gray-400">18</td>
                                <td className="py-4 text-white font-medium">$2000</td>
                                <td className="py-4 pr-4 text-right">
                                    <span className={`text-xs px-2 py-1 rounded border ${userData?.currentRank === 'DIAMOND' ? 'text-green-500 border-green-500/30' : 'text-gray-500 border-gray-500/30'}`}>
                                        {userData?.currentRank === 'DIAMOND' ? 'Active' : 'Locked'}
                                    </span>
                                </td>
                            </tr>
                            <tr className={`hover:bg-white/5 transition-colors ${userData?.currentRank === 'RUBY' ? 'bg-highlight/10' : ''}`}>
                                <td className="py-4 pl-4 text-white font-medium flex items-center gap-2">
                                    <Star size={16} className={`${userData?.currentRank === 'RUBY' ? 'text-highlight fill-highlight' : 'text-gray-400 fill-gray-400'}`} /> RUBY
                                </td>
                                <td className="py-4 text-gray-400">N/A</td>
                                <td className="py-4 text-gray-400">20</td>
                                <td className="py-4 text-white font-medium">$4000</td>
                                <td className="py-4 pr-4 text-right">
                                    <span className={`text-xs px-2 py-1 rounded border ${userData?.currentRank === 'RUBY' ? 'text-green-500 border-green-500/30' : 'text-gray-500 border-gray-500/30'}`}>
                                        {userData?.currentRank === 'RUBY' ? 'Active' : 'Locked'}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Rank Achievement History */}
            <Card>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Award size={18} className="text-highlight" /> Rank Achievement History
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs uppercase text-gray-500 border-b border-white/10 bg-white/5">
                                <th className="py-4 pl-4 rounded-l-lg">Date</th>
                                <th className="py-4">Rank Achieved</th>
                                <th className="py-4 pr-4 rounded-r-lg text-right">Tx Hash</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loadingHistory ? (
                                <tr><td colSpan="3" className="py-8 text-center text-gray-500">Loading details...</td></tr>
                            ) : rankHistory.length > 0 ? (
                                rankHistory.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                                        <td className="py-3 pl-4 text-white">{item.date}</td>
                                        <td className="py-3 text-highlight font-bold flex items-center gap-2">
                                            <CheckCircle size={14} /> {item.rank}
                                        </td>
                                        <td className="py-3 pr-4 text-right font-mono text-xs text-blue-400 truncate max-w-[100px]">
                                            {item.hash.substring(0, 10)}...
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="text-center py-12">
                                    <td colSpan="3" className="py-8 text-gray-500">
                                        No rank achievements recorded yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
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
                            {loadingHistory ? (
                                <tr><td colSpan="4" className="py-8 text-center text-gray-500">Loading details...</td></tr>
                            ) : salaryHistory.length > 0 ? (
                                salaryHistory.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                                        <td className="py-3 pl-4 text-white">{item.date}</td>
                                        <td className="py-3 text-gray-300">{item.rank}</td>
                                        <td className="py-3 text-green-400 font-medium">+${item.amount}</td>
                                        <td className="py-3 pr-4 text-right font-mono text-xs text-blue-400 truncate max-w-[100px]">
                                            {item.hash.substring(0, 10)}...
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="text-center py-12">
                                    <td colSpan="4" className="py-8 text-gray-500">
                                        No salary history available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </motion.div>
    );
};


export default RankSystem;
