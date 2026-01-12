import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Loader } from 'lucide-react';
import Card from '../components/ui/Card';
import { useWeb3 } from '../context/Web3Context';
import { ethers } from 'ethers';

const Transactions = () => {
    const { account, contract } = useWeb3();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchTransactions = async () => {
            if (!account) return;

            try {
                setLoading(true);

                // Fetch from Backend Database
                const response = await fetch(`https://gold4x-backend.vercel.app/api/transactions/${account}`);
                const data = await response.json();

                if (data.success) {
                    const formattedTx = data.transactions.map(tx => ({
                        hash: tx.txHash,
                        date: new Date(tx.timestamp).toLocaleString(),
                        rawDate: new Date(tx.timestamp).getTime(),
                        type: "Investment",
                        from: tx.walletAddress,
                        to: "Contract",
                        token: tx.tokenType || "USD",
                        amount: tx.amount, // Amount is already number in DB
                        isIncoming: false, // Investments are outgoing from user wallet
                        status: "Completed"
                    }));
                    setTransactions(formattedTx);
                }
            } catch (error) {
                console.error("Error fetching transactions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [account]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <Card>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <FileText size={18} className="text-highlight" /> Transaction History
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs uppercase text-highlight border-b border-white/10 bg-white/5">
                                <th className="py-4 pl-4 rounded-l-lg">Date</th>
                                <th className="py-4">Type</th>
                                <th className="py-4">From/To</th>
                                <th className="py-4">Token</th>
                                <th className="py-4">Amount</th>
                                <th className="py-4 pr-4 rounded-r-lg text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {!account ? (
                                <tr className="text-center py-12">
                                    <td colSpan="6" className="py-12 text-gray-500">
                                        Connect wallet to load transactions.
                                    </td>
                                </tr>
                            ) : loading ? (
                                <tr className="text-center py-12">
                                    <td colSpan="6" className="py-12 text-gray-500">
                                        <div className="flex justify-center items-center gap-2">
                                            <Loader className="animate-spin" size={16} /> Loading transactions...
                                        </div>
                                    </td>
                                </tr>
                            ) : transactions.length === 0 ? (
                                <tr className="text-center py-12">
                                    <td colSpan="6" className="py-12 text-gray-500">
                                        No transactions found.
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((tx) => (
                                    <tr key={tx.hash + tx.type} className="hover:bg-white/5 transition-colors">
                                        <td className="py-4 pl-4 text-gray-300 whitespace-nowrap">
                                            {tx.date}
                                        </td>
                                        <td className="py-4 text-white font-medium">
                                            {tx.type}
                                        </td>
                                        <td className="py-4 text-gray-400 font-mono text-xs">
                                            {tx.isIncoming ? (
                                                <span className="text-green-400">From: {tx.from.slice(0, 6)}...{tx.from.slice(-4)}</span>
                                            ) : (
                                                <span className="text-red-400">To: {tx.to.slice(0, 6)}...{tx.to.slice(-4)}</span>
                                            )}
                                        </td>
                                        <td className="py-4 text-highlight font-bold">
                                            {tx.token}
                                        </td>
                                        <td className={`py-4 font-bold ${tx.isIncoming ? 'text-green-400' : 'text-red-400'}`}>
                                            {tx.isIncoming ? '+' : '-'}{parseFloat(tx.amount).toFixed(2)}
                                        </td>
                                        <td className="py-4 pr-4 text-right">
                                            <span className="px-2 py-1 rounded bg-green-500/20 text-green-400 text-xs">
                                                {tx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </motion.div>
    );
};

export default Transactions;
