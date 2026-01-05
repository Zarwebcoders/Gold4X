import React from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import Card from '../components/ui/Card';

const Transactions = () => {
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
                            <tr className="text-center py-12">
                                <td colSpan="6" className="py-12 text-gray-500">
                                    Connect wallet to load transactions.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Card>
        </motion.div>
    );
};

export default Transactions;
