import React from 'react';
import { motion } from 'framer-motion';
import {
    Wallet,
    ArrowRightLeft,
    History,
    Send,
    QrCode,
    FileText,
    DollarSign
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useWeb3 } from '../context/Web3Context';

const ActionButton = ({ icon: Icon, label }) => (
    <button className="flex items-center gap-2 px-6 py-3 rounded-full border border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10 transition-colors bg-black/40">
        <Icon size={18} />
        <span className="font-medium text-sm">{label}</span>
    </button>
);

const G4XWallet = () => {
    const { userData, account } = useWeb3();
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            {/* G4X Balance Header */}
            <Card className="border-highlight/30 bg-black/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-highlight/5 blur-[100px] rounded-full pointer-events-none"></div>
                <div className="relative z-10 flex flex-col items-center justify-center py-10 text-center">
                    <h2 className="text-xl font-bold text-highlight mb-6">Your G4X Balance</h2>
                    <div className="w-16 h-1 bg-highlight/50 rounded-full mb-6"></div>
                    <div className="mb-8">
                        {/* Placeholder for balance, e.g. 5,000 G4X */}
                        <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">{userData?.g4xBalance || '0.0'} G4X</h1>
                        <p className="text-gray-400 text-sm">Equivalent to — at current rate</p>
                    </div>
                    <Button className="bg-highlight hover:bg-highlight/90 text-black font-bold px-8 py-6 rounded-full flex items-center gap-2">
                        <DollarSign size={20} /> Convert to USDT
                    </Button>
                </div>
            </Card>

            {/* Rate & Address Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="text-center py-8">
                    <div className="flex flex-col items-center gap-3 mb-4">
                        <ArrowRightLeft className="text-highlight" size={32} />
                        <h3 className="text-gray-400 font-bold text-sm uppercase tracking-wider">Current Rate</h3>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-6">—</h2>
                    <div className="bg-white/5 mx-auto max-w-[200px] py-2 rounded text-xs text-gray-500 cursor-pointer hover:bg-white/10 transition-colors">
                        Copy Rate
                    </div>
                </Card>

                <Card className="text-center py-8">
                    <div className="flex flex-col items-center gap-3 mb-4">
                        <Wallet className="text-highlight" size={32} />
                        <h3 className="text-gray-400 font-bold text-sm uppercase tracking-wider">Wallet Address</h3>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-6 text-sm md:text-xl truncate px-4">{account || 'Not Connected'}</h2>
                    <div className="bg-white/5 mx-auto max-w-[200px] py-2 rounded text-xs text-gray-500 cursor-pointer hover:bg-white/10 transition-colors">
                        Copy Address
                    </div>
                </Card>
            </div>

            {/* Sell G4X Tokens Form */}
            <Card>
                <div className="mb-6">
                    <h3 className="text-highlight font-bold">Sell G4X Tokens</h3>
                </div>
                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">G4X Amount</label>
                        <input
                            type="text"
                            placeholder="Enter amount"
                            className="w-full bg-black/40 border border-white/10 rounded-lg p-4 text-white placeholder-gray-600 focus:outline-none focus:border-highlight/50 transition-colors"
                        />
                    </div>
                    <div>
                        <div className="w-full bg-white/5 border border-white/5 rounded-lg p-4 flex justify-between items-center">
                            <span className="text-gray-400 text-sm">USDT Received (after 10% fee)</span>
                            <span className="text-highlight font-bold">—</span>
                        </div>
                    </div>
                    <Button className="w-full bg-highlight hover:bg-highlight/90 text-black font-bold py-4 rounded-full flex items-center justify-center gap-2">
                        <ArrowRightLeft size={20} /> CONFIRM SELL
                    </Button>
                    <p className="text-center text-xs text-gray-500">Instant conversion | No minimum</p>
                </div>
            </Card>

            {/* Recent Activity */}
            <Card>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <History size={18} className="text-white" /> Recent Activity
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs uppercase text-highlight border-b border-white/10 bg-white/5">
                                <th className="py-4 pl-4 rounded-l-lg">Date</th>
                                <th className="py-4">Type</th>
                                <th className="py-4">Details</th>
                                <th className="py-4">Amount</th>
                                <th className="py-4 pr-4 rounded-r-lg text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <tr className="text-center py-12">
                                <td colSpan="5" className="py-8 text-gray-500">
                                    No recent activity found.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Bottom Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
                <ActionButton icon={Send} label="Send G4X" />
                <ActionButton icon={QrCode} label="Wallet QR" />
                <ActionButton icon={FileText} label="Full History" />
            </div>
        </motion.div>
    );
};

export default G4XWallet;
