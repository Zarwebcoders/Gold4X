import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Shield, TrendingUp, Users, Bot, Zap, Info, ChevronRight, Check } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
    >
        <Card className="h-full text-center hover:border-primary/50 transition-colors">
            <div className="inline-flex p-3 rounded-xl bg-highlight/10 text-highlight mb-4">
                <Icon size={24} />
            </div>
            <h3 className="font-bold text-lg mb-2">{title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
        </Card>
    </motion.div>
);

const Investment = () => {
    const [isWalletConnected, setIsWalletConnected] = useState(false); // Default to false as requested
    const [amount, setAmount] = useState('');

    const [selectedToken, setSelectedToken] = useState('USDT');

    // Derived values for preview
    const numAmount = parseFloat(amount) || 0;
    const activationFee = 50;
    const roiEligible = Math.max(0, numAmount - activationFee);

    // Logic for G4X
    const isG4X = selectedToken === 'G4X';

    const g4xReceivedDisplay = isG4X
        ? "No Reward (Paid with G4X)"
        : `${(numAmount / 1.1).toFixed(2)} G4X`;

    const formattedAmount = numAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const amountDisplay = isG4X
        ? `$${formattedAmount} USD Value`
        : `$${formattedAmount} ${selectedToken}`;

    const dailyRoi = (roiEligible * 0.007).toFixed(2); // 0.7%

    return (
        <div className="space-y-8">
            {/* Header Section Removed (Moved to Layout) */}

            {/* Wallet Address Bar */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {!isWalletConnected ? (
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 flex items-center gap-4">
                        <div className="bg-orange-500 text-black p-2 rounded-lg shadow-lg shadow-orange-500/20">
                            <Wallet size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-lg">Wallet Not Connected</h3>
                            <p className="text-sm text-gray-400">Connect your wallet to start investing in USDT</p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 flex items-center gap-3">
                        <div className="bg-primary text-white p-1.5 rounded">
                            <Wallet size={16} />
                        </div>
                        <span className="font-mono font-medium text-white">0xA887...8854 Connected</span>
                    </div>
                )}
            </motion.div>

            {/* Promo Section */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <Card className="text-center py-12 px-6 border-highlight/20 bg-gradient-to-b from-yellow-500/5 to-transparent">
                    <div className="inline-flex justify-center items-center mb-6">
                        <Zap size={48} className="text-highlight drop-shadow-[0_0_10px_rgba(248,197,95,0.5)]" fill="currentColor" />
                    </div>
                    <h2 className="text-3xl font-bold text-highlight mb-4">Invest in Gold4X</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Join thousands of investors earning daily ROI through our advanced AI trading
                        bots. Your investment is secure, with automatic G4X token rewards and referral
                        bonuses.
                    </p>
                </Card>
            </motion.div>

            {/* Invest & Preview Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Investment Form */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="h-full">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                            <span className="text-highlight">$</span> Investment Amount
                        </h3>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400 font-medium">Select Token</label>
                                <div className="relative">
                                    <select
                                        className="w-full bg-black/40 border border-white/10 rounded-lg h-12 px-4 text-white appearance-none focus:border-primary focus:outline-none transition-colors"
                                        onChange={(e) => setSelectedToken(e.target.value)}
                                        value={selectedToken}
                                    >
                                        <option value="USDT">USDT (Tether USD)</option>
                                        <option value="USDC">USDC (USD Coin)</option>
                                        <option value="G4X">G4X (Gold4X Token)</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                        <ChevronRight className="rotate-90" size={16} />
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500">1 G4X = 1.10 USD | USDT/USDC investments get G4X rewards</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400 font-medium">Amount (Min: $100)</label>
                                <input
                                    type="number"
                                    placeholder="Enter amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg h-12 px-4 text-white focus:border-primary focus:outline-none transition-colors placeholder:text-gray-600"
                                />
                                <p className="text-xs text-gray-500">Minimum: 100 USDT</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400 font-medium">Referral Address (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="Enter referrer wallet address"
                                    className="w-full bg-black/40 border border-white/10 rounded-lg h-12 px-4 text-white focus:border-primary focus:outline-none transition-colors placeholder:text-gray-600"
                                />
                                <p className="text-xs text-gray-500">Earn 15% direct commission on referrals</p>
                            </div>

                            <div className="pt-2">
                                <div className="flex justify-between text-xs text-gray-400 mb-2">
                                    <span>Quick Invest: $100</span>
                                    <span>$5000</span>
                                </div>
                                <input
                                    type="range"
                                    min="100"
                                    max="5000"
                                    step="100"
                                    value={amount || 100}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-highlight"
                                />
                            </div>

                            <Button
                                className="w-full h-12 text-lg font-bold text-highlight bg-[#1a1a2e] border border-highlight/30 shadow-[0_0_20px_rgba(248,197,95,0.1)] hover:shadow-[0_0_30px_rgba(248,197,95,0.3)] hover:border-highlight/60 hover:scale-[1.02] transition-all duration-300"
                            >
                                <span className="mr-2">→</span> Invest Now
                            </Button>
                        </div>
                    </Card>
                </motion.div>

                {/* Investment Preview */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="h-full">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                            <Info className="text-highlight" size={20} /> Investment Preview
                        </h3>

                        <div className="space-y-6">
                            <div className="space-y-4 pb-6 border-b border-white/5">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-400">Investment Amount</span>
                                    <span className="font-bold text-highlight">{amountDisplay}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-400">Bot Activation Fee (First Invest)</span>
                                    <span className="font-bold text-orange-500">${activationFee.toFixed(2)} USD</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-400">G4X Tokens Received</span>
                                    <span className={`font-bold ${isG4X ? 'text-highlight' : 'text-white'}`}>{g4xReceivedDisplay}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-400">ROI Eligible Amount</span>
                                    <span className="font-bold text-highlight">${roiEligible.toFixed(2)} USD</span>
                                </div>
                            </div>

                            <div className="bg-highlight/10 border border-highlight/20 rounded-xl p-6 text-center">
                                <p className="text-gray-400 text-sm mb-1">Expected Daily ROI (0.7%)</p>
                                <p className="text-3xl font-bold text-highlight">${dailyRoi}</p>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <FeatureCard
                    icon={Shield}
                    title="Secure & Audited"
                    description="All funds transferred via admin wallet with OpenZeppelin security standards."
                    delay={0.4}
                />
                <FeatureCard
                    icon={TrendingUp}
                    title="Daily 0.7% ROI"
                    description="Earn compounded returns up to 4x investment cap, processed automatically."
                    delay={0.5}
                />
                <FeatureCard
                    icon={Users}
                    title="Multi-Level Referrals"
                    description="Up to 22 levels of commissions: 15% direct, 10% level 2, and more."
                    delay={0.6}
                />
                <FeatureCard
                    icon={Bot}
                    title="AI Trading Bots"
                    description="Activate bots with $50 fee on first invest, auto-place in autopools for bonuses."
                    delay={0.7}
                />
            </div>
        </div>
    );
};

export default Investment;
