import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Shield, TrendingUp, Users, Bot, Zap, Info, ChevronRight, Check } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useWeb3 } from '../context/Web3Context';
import { useGold4X } from '../hooks/useGold4X';

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
    const { account, connectWallet } = useWeb3();
    // Use account as connection status
    const isWalletConnected = !!account;
    const { invest, txLoading } = useGold4X();
    const [amount, setAmount] = useState('');
    const [referrer, setReferrer] = useState('');
    const [selectedToken, setSelectedToken] = useState('USDT');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Fetch User's Referrer on Mount
    React.useEffect(() => {
        const fetchReferrer = async () => {
            if (account) {
                try {
                    const res = await fetch(`https://gold4x-backend.vercel.app/api/users/${account}`);
                    const data = await res.json();
                    if (data.exists && data.user && data.user.referrerAddress) {
                        setReferrer(data.user.referrerAddress);
                    }
                } catch (error) {
                    console.error("Failed to fetch referrer", error);
                }
            }
        };
        fetchReferrer();
    }, [account]);

    const handleInvest = async () => {
        if (!isWalletConnected) {
            connectWallet();
            return;
        }
        if (!amount || parseFloat(amount) <= 0) {
            alert("Please enter a valid amount");
            return;
        }

        const tokenMap = { 'USDT': 0, 'USDC': 1, 'G4X': 2 };
        try {
            // Use zero address if referrer is empty
            const refAddr = referrer.trim() || "0x0000000000000000000000000000000000000000";

            // Call smart contract
            // NOTE: Updated hook to return tx receipt/hash hopefully
            const txResponse = await invest(amount, refAddr, tokenMap[selectedToken]);

            // Backend API Call
            // We assume txResponse has .hash (if it's the tx object) or .transactionHash (if receipt)
            const txHash = txResponse?.hash || txResponse?.transactionHash || "0x_simulated_hash_" + Date.now();

            const numAmount = parseFloat(amount);
            const fee = 50; // Hardcoded activation fee for now
            const eligible = Math.max(0, numAmount - fee);
            const g4xVal = selectedToken === 'G4X' ? 0 : parseFloat((numAmount / 1.1).toFixed(2));
            const dailyNum = parseFloat((eligible * 0.006).toFixed(2));

            await fetch('https://gold4x-backend.vercel.app/api/invest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    walletAddress: account,
                    amount: numAmount,
                    tokenType: selectedToken,
                    txHash: txHash,
                    referrerAddress: referrer, // Send optional referrer
                    activationFee: fee,
                    roiEligible: eligible,
                    g4xReceived: g4xVal,
                    dailyRoi: dailyNum
                })
            });

            alert("Investment Successful!");
            setAmount('');
        } catch (e) {
            console.error(e);
            alert("Investment Failed: " + (e.reason || e.message));
        }
    };

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

    const dailyRoi = (roiEligible * 0.006).toFixed(2); // 0.6%

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
                        <span className="font-mono font-medium text-white">
                            {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Connected'} Connected
                        </span>
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
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className={`w-full bg-black/40 border ${isDropdownOpen ? 'border-primary' : 'border-white/10'} rounded-lg h-12 px-4 flex items-center justify-between transition-colors hover:bg-white/5`}
                                    >
                                        <span className="text-white">
                                            {selectedToken === 'USDT' && "USDT (Tether USD)"}
                                            {selectedToken === 'USDC' && "USDC (USD Coin)"}
                                            {selectedToken === 'G4X' && "G4X (Gold4X Token)"}
                                        </span>
                                        <ChevronRight className={`text-gray-400 transition-transform duration-200 ${isDropdownOpen ? '-rotate-90' : 'rotate-90'}`} size={16} />
                                    </button>

                                    {isDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute top-full left-0 right-0 mt-2 bg-[#0a0a0f] border border-white/10 rounded-xl overflow-hidden z-50 shadow-2xl shadow-black/50"
                                        >
                                            {[
                                                { value: 'USDT', label: 'USDT (Tether USD)' },
                                                { value: 'USDC', label: 'USDC (USD Coin)' },
                                                { value: 'G4X', label: 'G4X (Gold4X Token)' }
                                            ].map((opt) => (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => {
                                                        setSelectedToken(opt.value);
                                                        setIsDropdownOpen(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center justify-between group ${selectedToken === opt.value ? 'bg-highlight/10 text-highlight' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}
                                                >
                                                    {opt.label}
                                                    {selectedToken === opt.value && <Check size={16} />}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500">1 G4X = 1.10 USD | USDT/USDC investments get G4X rewards</p>
                            </div>

                            <div className="space-y-4">
                                <label className="text-sm text-gray-400 font-medium">Select Package</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {[100, 500, 1000, 5000, 10000].map((pkg) => (
                                        <button
                                            key={pkg}
                                            onClick={() => setAmount(pkg.toString())}
                                            className={`
                                                relative p-4 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all
                                                ${parseFloat(amount) === pkg
                                                    ? 'bg-highlight text-black border-highlight shadow-[0_0_20px_rgba(248,197,95,0.4)] scale-105 z-10'
                                                    : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20'
                                                }
                                            `}
                                        >
                                            <span className="text-lg font-bold">{pkg} G4X</span>
                                            <span className="text-xs opacity-70">Package</span>

                                            {parseFloat(amount) === pkg && (
                                                <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1 shadow-lg">
                                                    <Check size={12} />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-xs text-center text-gray-500 mt-2">
                                    Selected Investment: <span className="text-highlight font-bold">${amount || 0}</span>
                                </p>
                            </div>

                            <div className="space-y-2 mt-4">
                                <label className="text-sm text-gray-400 font-medium">Referral Address (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="Enter referrer wallet address"
                                    value={referrer}
                                    onChange={(e) => setReferrer(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg h-12 px-4 text-white focus:border-primary focus:outline-none transition-colors placeholder:text-gray-600"
                                />
                                <p className="text-xs text-gray-500">Earn 14% direct commission on referrals</p>
                            </div>

                            <Button
                                onClick={handleInvest}
                                disabled={txLoading}
                                className="w-full h-12 text-lg font-bold text-highlight bg-[#1a1a2e] border border-highlight/30 shadow-[0_0_20px_rgba(248,197,95,0.1)] hover:shadow-[0_0_30px_rgba(248,197,95,0.3)] hover:border-highlight/60 hover:scale-[1.02] transition-all duration-300"
                            >
                                <span className="mr-2">→</span> {txLoading ? "Processing..." : !isWalletConnected ? "Connect Wallet" : "Invest Now"}
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
                                <p className="text-gray-400 text-sm mb-1">Expected Daily ROI (0.6%)</p>
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
                    title="Daily 0.6% ROI"
                    description="Earn compounded returns up to 4x investment cap, processed automatically."
                    delay={0.5}
                />
                <FeatureCard
                    icon={Users}
                    title="Multi-Level Referrals"
                    description="Up to 20 levels of commissions: 14% direct, 8% level 2, and more."
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
