import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ethers } from 'ethers';
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
import { useWeb3 } from '../context/Web3Context';

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
        <p className="text-xs text-gray-500 mb-2">{criteria}</p>
        <h3 className="text-2xl font-bold text-white">{count}</h3>
    </div>
);

const TeamAnalytics = () => {
    const { userData, contract, account } = useWeb3();
    const [apiLevelData, setApiLevelData] = useState({});
    const [contractLevelData, setContractLevelData] = useState({});

    // Fetch API Data (Database)
    useEffect(() => {
        const fetchApiData = async () => {
            if (account) {
                try {
                    const res = await fetch(`https://gold4x-backend.vercel.app/api/downline/${account}`);
                    const data = await res.json();
                    if (data.success) {
                        setApiLevelData(data.levels);
                    }
                } catch (e) {
                    console.error("Error fetching downline API:", e);
                }
            }
        };
        fetchApiData();
    }, [account]);

    // Fetch Contract Data (Commission)
    useEffect(() => {
        const fetchContractData = async () => {
            if (contract && account) {
                const data = {};
                for (let i = 1; i <= 20; i++) {
                    try {
                        const result = await contract.getUserLevelIncome(account, i);
                        data[i] = {
                            totalEarned: ethers.formatEther(result[0])
                        };
                    } catch (e) {
                        // console.error(`Error fetching level ${i} contract data:`, e);
                    }
                }
                setContractLevelData(data);
            }
        };
        fetchContractData();
    }, [contract, account]);

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
                                <span className="text-highlight font-bold">Total Team Size: {userData?.totalTeam || '0'}</span>
                            </div>
                            <div className="h-8 w-px bg-white/10" />
                            <div className="flex flex-col items-end">
                                <span className="text-gray-400">Network BV: {userData?.businessVolume ? `$${parseFloat(userData.businessVolume).toLocaleString()}` : '—'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Team Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TeamStatsCard
                    title="Active Team Members"
                    value={userData?.directs || '0'}
                    subtext="Direct Active Members"
                    icon={Users}
                />
                <TeamStatsCard
                    title="Total Team Investment"
                    value={userData?.businessVolume ? `$${parseFloat(userData.businessVolume).toLocaleString()}` : '—'}
                    subtext="Based on Network BV"
                    icon={Coins}
                    secondaryValue={userData?.sponsorIncome ? `$${parseFloat(userData.sponsorIncome).toFixed(2)}` : '—'}
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
                        count="-"
                        isActive={userData?.currentRank === "STAR"}
                    />
                    <RankCard
                        rank="GOLD"
                        criteria="Directs: 15"
                        count="-"
                        isActive={userData?.currentRank === "GOLD"}
                    />
                    <RankCard
                        rank="DIAMOND"
                        criteria="Directs: 18"
                        count="-"
                        isActive={userData?.currentRank === "DIAMOND"}
                    />
                    <RankCard
                        rank="RUBY"
                        criteria="Directs: 20"
                        count="-"
                        isActive={userData?.currentRank === "RUBY"}
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
                        <Layers size={18} className="text-highlight" /> Downline Analytics by Level (20 Levels)
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
                            {Array.from({ length: 20 }, (_, i) => i + 1).map((level) => {
                                const apiData = apiLevelData[level] || { members: 0, investment: 0, bv: 0, earningsGenerated: 0 };
                                const contractData = contractLevelData[level] || { totalEarned: '0' };
                                const isUnlocked = userData?.directs >= (level <= 5 ? level : level <= 10 ? 7 : level <= 15 ? 10 : 12); // Approximate rule or import REFERRAL_LEVELS

                                return (
                                    <tr key={level} className="hover:bg-white/5 transition-colors">
                                        <td className="py-3 pl-4">
                                            <span className="inline-flex items-center justify-center w-8 h-6 rounded-full bg-gray-800 text-gray-400 text-xs font-bold">
                                                {level}
                                            </span>
                                        </td>
                                        <td className="py-3 text-white">{apiData.members}</td>
                                        <td className="py-3 text-gray-300">${apiData.investment.toLocaleString()}</td>
                                        <td className="py-3 text-highlight font-medium">${apiData.bv.toLocaleString()}</td>
                                        <td className="py-3 text-gray-300">${apiData.earningsGenerated.toFixed(2)}</td>
                                        <td className="py-3 text-highlight font-bold">${parseFloat(contractData.totalEarned).toFixed(2)}</td>
                                        <td className="py-3 pr-4 text-right">
                                            <span className={`text-xs px-2 py-1 rounded border ${isUnlocked ? 'text-green-500 border-green-500/30' : 'text-red-500 border-red-500/30'}`}>
                                                {isUnlocked ? 'Active' : 'Locked'}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>
        </motion.div>
    );
};

export default TeamAnalytics;
