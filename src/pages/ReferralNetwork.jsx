import React from 'react';
import { motion } from 'framer-motion';
import { ethers } from 'ethers';
import {
    Users,
    TrendingUp,
    Coins,
    Link as LinkIcon,
    Copy,
    Share2,
    UserPlus,
    PieChart,
    Download,
    Layers
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useWeb3 } from '../context/Web3Context';
import { REFERRAL_LEVELS } from '../utils/referralRules';

const StatCard = ({ title, value, subtext, icon: Icon, colorClass = "text-highlight" }) => (
    <Card className="h-full">
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-white">{value}</h3>
            </div>
            <div className={`p-3 rounded-lg bg-white/5 ${colorClass}`}>
                <Icon size={24} />
            </div>
        </div>
        <p className="text-xs text-gray-500">{subtext}</p>
    </Card>
);

const ReferralNetwork = () => {
    const { userData, account, contract } = useWeb3();
    const directs = userData?.directs || 0;
    const [levelData, setLevelData] = React.useState({});

    React.useEffect(() => {
        const fetchLevelData = async () => {
            console.log("Fetching level data...", { account, contract: !!contract });
            if (account && contract) {
                try {
                    const data = {};
                    // Loop through levels 1 to 20
                    for (let i = 1; i <= 20; i++) {
                        const levelInfo = await contract.getUserLevelIncome(account, i);
                        console.log(`Level ${i} raw:`, levelInfo);
                        if (levelInfo.totalEarned > 0n) {
                            console.log(`Level ${i} has earnings!`);
                        }
                        data[i] = {
                            totalEarned: ethers.formatEther(levelInfo.totalEarned),
                            // lastPayout is an amount, not a date, based on user feedback
                            lastPayout: ethers.formatEther(levelInfo.lastPayout),
                            totalPayouts: Number(levelInfo.totalPayouts)
                        };
                    }
                    console.log("Final Level Data:", data);
                    setLevelData(data);
                } catch (error) {
                    console.error("Error fetching level data:", error);
                }
            }
        };
        fetchLevelData();
    }, [account, contract]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            {/* Network Overview Header */}
            <Card className="bg-gradient-to-r from-black/60 to-black/40 border-highlight/20">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                        <Users className="text-highlight" size={32} />
                        <h2 className="text-2xl font-bold text-highlight">Network Overview</h2>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                        <div className="flex flex-col items-end">
                            <span className="text-gray-400">Upline</span>
                            <span className="font-bold text-white">
                                {userData?.referrer && userData.referrer !== ethers.ZeroAddress
                                    ? `${userData.referrer.slice(0, 6)}...${userData.referrer.slice(-4)}`
                                    : 'None'}
                            </span>
                        </div>
                        <div className="h-8 w-px bg-white/10" />
                        <div className="flex flex-col items-end">
                            <span className="text-gray-400 text-highlight">Total Downline</span>
                            <span className="font-bold text-white">{userData?.totalTeam || '0'}</span>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Direct Referrals"
                    value={directs}
                    subtext="Active Members"
                    icon={UserPlus}
                    colorClass="text-yellow-500"
                />
                <StatCard
                    title="Business Volume"
                    value={userData?.businessVolume ? `$${parseFloat(userData.businessVolume).toLocaleString()}` : "$0.00"}
                    subtext="Total Network BV"
                    icon={TrendingUp}
                    colorClass="text-yellow-500"
                />
                <StatCard
                    title="Referral Earnings"
                    value={userData?.totalEarned ? `$${parseFloat(userData.totalEarned).toFixed(2)}` : "$0.00"}
                    subtext="Direct + Sponsor"
                    icon={Coins}
                    colorClass="text-blue-400"
                />
            </div>

            {/* Referral Link Section */}
            <Card>
                <div className="flex items-center gap-2 mb-6 text-white font-bold text-lg">
                    <LinkIcon className="text-highlight" size={20} /> Your Referral Link
                </div>
                <div className="bg-black/40 rounded-xl p-6 border border-white/5">
                    <p className="text-gray-400 text-sm mb-3">Share to Earn Commissions</p>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 bg-black/60 border border-white/10 rounded-lg px-4 py-3 text-gray-300 font-mono text-sm truncate">
                            {account ? `${window.location.origin}/register?ref=${account}` : 'Connect Wallet to see link'}
                        </div>
                        <Button
                            className="shrink-0 bg-highlight/10 text-highlight border-highlight/20 hover:bg-highlight hover:text-black"
                            onClick={() => {
                                if (account) {
                                    navigator.clipboard.writeText(`${window.location.origin}/register?ref=${account}`);
                                    alert("Referral link copied!");
                                } else {
                                    alert("Please connect wallet first");
                                }
                            }}
                        >
                            <Copy size={18} className="mr-2" /> Copy
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Direct Referrals Table */}
            <Card>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Users size={18} className="text-highlight" /> Direct Referrals
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs uppercase text-gray-500 border-b border-white/10 bg-white/5">
                                <th className="py-4 pl-4 rounded-l-lg">Member</th>
                                <th className="py-4">Joined</th>
                                <th className="py-4">Investment</th>
                                <th className="py-4">Status</th>
                                <th className="py-4 pr-4 rounded-r-lg text-right">Directs</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <tr className="text-center py-12">
                                <td colSpan="5" className="py-8 text-gray-500">
                                    Direct referral list not exposed on contract
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Sponsor Earnings Grid (20 Levels) */}
            <Card>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Layers size={18} className="text-highlight" /> Sponsor Earnings by Level (20 Levels)
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs uppercase text-gray-500 border-b border-white/10 bg-white/5">
                                <th className="py-4 pl-4 rounded-l-lg">Level</th>
                                <th className="py-4">Commission %</th>
                                <th className="py-4">Total Earned</th>
                                <th className="py-4">Last Payout</th>
                                <th className="py-4">Total Payouts</th>
                                <th className="py-4 pr-4 rounded-r-lg text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {REFERRAL_LEVELS.map((row) => {
                                const isUnlocked = directs >= row.requiredDirects;
                                return (
                                    <tr key={row.level} className="hover:bg-white/5 transition-colors">
                                        <td className="py-3 pl-4">
                                            <span className={`inline-flex items-center justify-center w-8 h-6 rounded-full text-xs font-bold ${isUnlocked ? 'bg-highlight text-black' : 'bg-gray-700 text-gray-400'}`}>
                                                {row.level}
                                            </span>
                                        </td>
                                        <td className="py-3 text-white font-medium">{row.percent}</td>
                                        <td className={`py-3 font-bold ${isUnlocked ? 'text-highlight' : 'text-gray-600'}`}>
                                            ${levelData[row.level]?.totalEarned || '0.00'}
                                        </td>
                                        <td className={`py-3 ${isUnlocked ? 'text-highlight' : 'text-gray-600'}`}>
                                            ${levelData[row.level]?.lastPayout || '0.00'}
                                        </td>
                                        <td className="py-3 text-gray-300">
                                            {levelData[row.level]?.totalPayouts || 0}
                                        </td>
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

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-4 pt-4">
                <Button className="flex-1 py-4 text-base font-bold bg-highlight text-black hover:bg-yellow-400">
                    <Share2 size={20} className="mr-2" /> PROMOTE NETWORK
                </Button>
                <Button variant="outline" className="flex-1 py-4 text-base border-highlight/20 text-highlight hover:bg-highlight/10">
                    <PieChart size={20} className="mr-2" /> TEAM ANALYTICS
                </Button>
                <Button variant="outline" className="flex-1 py-4 text-base border-highlight/20 text-highlight hover:bg-highlight/10">
                    <Download size={20} className="mr-2" /> EXPORT REPORT
                </Button>
            </div>
        </motion.div>
    );
};

export default ReferralNetwork;
