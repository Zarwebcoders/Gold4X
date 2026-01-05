import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, DollarSign, Bot, Calendar, PieChart, Wallet, Zap, ArrowRight, Trophy, Coins } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const StatCard = ({ title, value, icon: Icon, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
    >
        <Card className="h-full flex flex-col justify-between group">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
                    <p className="text-2xl lg:text-3xl font-bold text-white group-hover:text-highlight transition-colors">
                        {value}
                    </p>
                </div>
                <div className="p-3 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                    <Icon size={24} />
                </div>
            </div>
            <div className="w-full bg-gray-700 h-1 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1.5, delay: delay + 0.2 }}
                    className="h-full bg-gradient-to-r from-primary to-highlight"
                />
            </div>
        </Card>
    </motion.div>
);

const Dashboard = () => {
    return (
        <div className="space-y-8">
            {/* Top Row Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Invested" value="$0.00" icon={DollarSign} delay={0.1} />
                <StatCard title="Total Earnings" value="$0.00" icon={TrendingUp} delay={0.2} />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <Card className="h-full flex flex-col justify-between group">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-gray-400 text-sm font-medium mb-1">Active Bots</h3>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-2xl lg:text-3xl font-bold text-white group-hover:text-highlight transition-colors">0</p>
                                    <span className="text-sm text-gray-500">Total bots</span>
                                </div>
                            </div>
                            <div className="p-3 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                                <Bot size={24} />
                            </div>
                        </div>
                        <div className="w-full bg-gray-700 h-1 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 1.5, delay: 0.5 }}
                                className="h-full bg-gradient-to-r from-primary to-highlight"
                            />
                        </div>
                    </Card>
                </motion.div>
            </div>

            {/* Bottom Row - Detailed Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Daily ROI Income */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card className="h-full">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-gray-400 text-sm font-medium mb-1">Daily ROI Income</h3>
                                <p className="text-3xl font-bold text-white">$0.00</p>
                            </div>
                            <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500">
                                <Calendar size={24} />
                            </div>
                        </div>

                        <div className="bg-black/40 rounded-xl p-4 border border-white/5 space-y-2">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Calculation</p>
                            <p className="text-sm text-gray-300">0.7% daily on eligible</p>
                            <p className="text-base font-bold text-highlight">$2,000 × 0.7% = $14.00</p>
                        </div>
                    </Card>
                </motion.div>

                {/* Total Referrals */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <Card className="h-full">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-gray-400 text-sm font-medium mb-1">Total Referrals</h3>
                                <p className="text-3xl font-bold text-white">0</p>
                            </div>
                            <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
                                <Users size={24} />
                            </div>
                        </div>

                        <div className="bg-black/40 rounded-xl p-4 border border-white/5 space-y-2">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Referral Earnings</p>
                            <p className="text-sm text-gray-300">15% L1 + 10% L2 + levels</p>
                            <p className="text-base font-bold text-orange-400">Total: $0.00</p>
                        </div>
                    </Card>
                </motion.div>
            </div>

            {/* Earnings & Actions Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Earnings Breakdown */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="lg:col-span-2"
                >
                    <Card className="h-full">
                        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            <PieChart className="text-highlight" size={20} />
                            Earnings Breakdown
                        </h3>
                        <div className="space-y-4">
                            <div className="bg-black/40 p-4 rounded-xl border border-white/5 flex justify-between items-center group hover:border-primary/30 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-primary/20 text-primary rounded-lg">
                                        <TrendingUp size={20} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">ROI Earnings</p>
                                        <p className="text-xs text-gray-400">Daily/Monthly returns (0.7%)</p>
                                    </div>
                                </div>
                                <p className="text-lg font-bold text-primary">$0.00</p>
                            </div>

                            <div className="bg-black/40 p-4 rounded-xl border border-white/5 flex justify-between items-center group hover:border-highlight/30 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-highlight/20 text-highlight rounded-lg">
                                        <Users size={20} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">Referral Earnings</p>
                                        <p className="text-xs text-gray-400">Direct (3x$40) & 22 levels</p>
                                    </div>
                                </div>
                                <p className="text-lg font-bold text-highlight">$0.00</p>
                            </div>

                            <div className="bg-black/40 p-4 rounded-xl border border-white/5 flex justify-between items-center group hover:border-orange-500/30 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-orange-500/20 text-orange-500 rounded-lg">
                                        <Wallet size={20} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">Withdrawable Balance</p>
                                        <p className="text-xs text-gray-400">Available (10% fee)</p>
                                    </div>
                                </div>
                                <p className="text-lg font-bold text-orange-500">$0.00</p>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 }}
                >
                    <Card className="h-full">
                        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            <Zap className="text-highlight" size={20} />
                            Quick Actions
                        </h3>
                        <div className="space-y-4">
                            <Button className="w-full justify-between group" variant="primary">
                                <span className="flex items-center gap-2"><TrendingUp size={18} /> Invest Now</span>
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                            </Button>
                            <Button className="w-full justify-between group" variant="outline">
                                <span className="flex items-center gap-2"><Users size={18} /> View Network</span>
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                            </Button>
                        </div>
                    </Card>
                </motion.div>
            </div>

            {/* Bottom Section Group 1: Autopool & Token */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Autopool Status */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="lg:col-span-2"
                >
                    <Card>
                        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            <Bot className="text-highlight" size={20} />
                            Autopool Status
                        </h3>
                        <div className="bg-black/30 rounded-xl p-6 border border-white/5">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-highlight to-orange-600 flex items-center justify-center text-black shadow-lg shadow-orange-500/20">
                                        <Bot size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">Regular Bot Pool 1</h4>
                                        <p className="text-sm text-gray-400">Position: -</p>
                                    </div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-6">
                                <div className="flex justify-between text-xs text-gray-400 mb-2">
                                    <span>Progress</span>
                                    <span>0%</span>
                                </div>
                                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                                    <div className="w-[0%] h-full bg-gradient-to-r from-highlight to-primary"></div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                                <div>
                                    <p className="text-sm text-gray-400">Payout per User</p>
                                    <p className="text-2xl font-bold text-highlight">$0.00 USDT</p>
                                    <p className="text-xs text-gray-500 mt-1">Rebirth Fee: $100 (Auto-Place Next Pool)</p>
                                </div>
                                <div className="md:text-right">
                                    <p className="text-xs text-gray-400">Est. Payout</p>
                                    <p className="font-mono text-primary">Dec 15, 2025</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* G4X Token Balance */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 }}
                >
                    <Card className="h-full">
                        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            <Coins className="text-highlight" size={20} />
                            G4X Token Balance
                        </h3>
                        <div className="h-full flex flex-col items-center justify-center py-8">
                            <p className="text-4xl font-bold text-highlight mb-2">0 G4X</p>
                            <p className="text-sm text-gray-400">Rate: G4X/USDT | Sell Anytime</p>
                        </div>
                    </Card>
                </motion.div>
            </div>

            {/* Bottom Section Group 2: Rank & Upgrade */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Star Rank */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                >
                    <Card className="h-full text-center">
                        <div className="inline-block px-4 py-1 rounded-full bg-highlight/20 text-highlight text-xs font-bold uppercase tracking-wider mb-4 border border-highlight/20">
                            Star Rank
                        </div>
                        <h4 className="text-gray-400 mb-2">Business Volume: <span className="text-white font-bold">$0</span></h4>
                        <p className="text-gray-400 mb-6">Directs: <span className="text-white">12/12</span></p>

                        <div className="py-4 border-t border-white/5">
                            <p className="text-2xl font-bold text-highlight">$0 Monthly Salary</p>
                        </div>
                    </Card>
                </motion.div>

                {/* Upgrade Path */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                >
                    <Card className="h-full relative overflow-hidden">
                        <div className="relative z-10 text-center">
                            <div className="inline-flex justify-center mb-4 text-highlight">
                                <Trophy size={48} />
                            </div>
                            <h3 className="text-xl font-bold mb-1">Upgrade Path</h3>
                            <p className="text-sm text-gray-400 mb-6">Next: Gold (15 Directs)</p>

                            <div className="relative h-12 bg-gradient-to-r from-highlight to-orange-500 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20 overflow-hidden group cursor-pointer">
                                <span className="relative z-10 font-bold text-black group-hover:scale-105 transition-transform">Achieve Gold</span>
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>
            {/* Referral Information Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
            >
                <Card>
                    <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <Users className="text-highlight" />
                        Referral Information
                    </h3>

                    <div className="bg-black/20 rounded-lg p-4 flex flex-col md:flex-row gap-4 items-center justify-between border border-white/5">
                        <div className="text-center md:text-left">
                            <p className="text-sm text-gray-400 mb-1">Your Referral Link</p>
                            <code className="bg-black/40 px-3 py-1 rounded text-primary text-sm break-all">
                                https://gold4x.in/register?ref=YOUR_ID
                            </code>
                        </div>
                        <Button variant="outline" size="sm">Copy Link</Button>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
};

export default Dashboard;
