import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="border border-white/5 rounded-lg bg-black/20 overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 text-left hover:bg-white/5 transition-colors"
            >
                <span className="text-highlight font-bold">{question}</span>
                {/* {isOpen ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />} */}
            </button>
            {isOpen && (
                <div className="p-4 pt-0 text-sm text-gray-400 border-t border-transparent">
                    {answer}
                </div>
            )}
        </div>
    );
};

const Support = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            {/* Submit a Ticket */}
            <Card>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Send size={18} className="text-white" /> Submit a Ticket
                    </h3>
                </div>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs text-gray-500 uppercase font-bold">Full Name</label>
                            <input
                                type="text"
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-highlight/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs text-gray-500 uppercase font-bold">Email</label>
                            <input
                                type="email"
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-highlight/50"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs text-gray-500 uppercase font-bold">Subject</label>
                        <input
                            type="text"
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-highlight/50"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs text-gray-500 uppercase font-bold">Describe your issue...</label>
                        <textarea
                            rows="4"
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-highlight/50 resize-none"
                        ></textarea>
                    </div>
                    <Button className="w-full bg-highlight/10 hover:bg-highlight hover:text-black border border-highlight/30 text-highlight font-bold py-3 rounded-lg transition-all flex justify-center items-center gap-2">
                        <Send size={18} /> Send
                    </Button>
                </div>
            </Card>

            {/* Frequently Asked Questions */}
            <Card>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <HelpCircle size={18} className="text-white" /> Frequently Asked Questions
                    </h3>
                </div>
                <div className="space-y-4">
                    <FAQItem
                        question="How long do withdrawals take?"
                        answer="Withdrawals are typically processed within 24 hours after approval."
                    />
                    <FAQItem
                        question="What is the withdrawal fee?"
                        answer="A standard 10% fee applies to withdrawals. The net amount is shown on the Withdrawal page."
                    />
                    <FAQItem
                        question="I didn't receive my ROI today."
                        answer="ROI processing may vary. Please check the Income page and try refreshing. If the issue persists, contact support."
                    />
                </div>
            </Card>
        </motion.div>
    );
};

export default Support;
