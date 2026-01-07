import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import Button from '../components/ui/Button';
import { Wallet, Key, Loader2, ArrowRight, Zap, CheckCircle2, AlertCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import logo from '../../public/logo.jpeg';

const Welcome = () => {
    const { account, connectWallet, disconnectWallet, contract, loading: walletLoading } = useWeb3();
    const navigate = useNavigate();

    // States: 'connect' | 'checking' | 'referral' | 'login'
    const [step, setStep] = useState('connect');
    const [referralCode, setReferralCode] = useState('');
    const [validationError, setValidationError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [checkingUser, setCheckingUser] = useState(false);

    // Backend URL
    const API_URL = 'https://gold4x-backend.vercel.app/api';

    useEffect(() => {
        if (account) {
            checkUserStatus(account);
        }
    }, [account]);

    const checkUserStatus = async (address) => {
        setCheckingUser(true);
        setStep('checking');
        try {
            const res = await fetch(`${API_URL}/users/${address}`);
            const data = await res.json();

            if (data.exists) {
                // User exists, go to login flow (or auto redirect)
                // We'll show a "Enter Dashboard" button or simple auto-redirect
                // For better UX, let's show success state then redirect
                setStep('login');
            } else {
                // New user, ask for referral
                setStep('referral');
            }
        } catch (error) {
            console.error("Backend error:", error);
            // Fallback or error state
            setValidationError("Could not connect to server. Please try again.");
            setStep('connect');
        } finally {
            setCheckingUser(false);
        }
    };

    const handleReferralSubmit = async () => {
        if (!referralCode.trim()) {
            setValidationError("Please enter a referral code");
            return;
        }

        setIsSubmitting(true);
        setValidationError('');

        try {
            // 1. Validate Referral Code
            const validateRes = await fetch(`${API_URL}/referral/${referralCode}`);
            const validateData = await validateRes.json();

            if (!validateData.isValid) {
                setValidationError("Invalid User");
                setIsSubmitting(false);
                return;
            }

            // 1.5 Check if Referrer is Active (Has Investment)
            // Skip check for Genesis address (returned by backend or hardcoded)
            // Note: Backend returns { isValid: true, isGenesis: true }
            if (!validateData.isGenesis) {
                if (contract) {
                    try {
                        const referrerData = await contract.users(referralCode);
                        // totalInvested is the first field, or accessed by name if struct
                        // Solidity struct: uint256 totalInvested; ...
                        // In ethers v6, we can usually access by property name or index.
                        // Since I don't have exact ABI struct definition handy in my head, I assume property name based on previous viewings.
                        // checking "totalInvested" > 0
                        const totalInvested = referrerData.totalInvested;

                        if (totalInvested <= 0) {
                            setValidationError("Inactive User");
                            setIsSubmitting(false);
                            return;
                        }
                    } catch (err) {
                        console.error("Contract check failed", err);
                        // If contract check fails, should we block? Ideally yes.
                        setValidationError("Could not verify referrer status on blockchain.");
                        setIsSubmitting(false);
                        return;
                    }
                }
            }

            // 2. Register User
            const registerRes = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    walletAddress: account,
                    referrerAddress: referralCode
                })
            });

            const registerData = await registerRes.json();

            if (registerData.success) {
                // Success! Redirect to dashboard
                // We could show a success animation first
                navigate('/');
            } else {
                setValidationError(registerData.error || "Registration failed");
            }

        } catch (error) {
            console.error("Error:", error);
            setValidationError("Network error. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDashboardRedirect = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-highlight/10 via-background to-background pointer-events-none"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-highlight/5 rounded-full blur-[120px] pointer-events-none"></div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-md w-full relative z-10"
                >
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center mb-6">
                            {/* Logo Icon */}
                            <img src={logo} alt="Gold4X Logo" className="w-48 h-48 object-contain" />
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">GOLD4X</h1>
                        <h2 className="text-xl text-highlight font-medium">Welcome Back</h2>
                        <p className="text-gray-400 mt-2 text-sm">
                            {step === 'connect' && "Connect your wallet to access the dashboard"}
                            {step === 'checking' && "Verifying your account..."}
                            {step === 'referral' && "Join the network by entering your referrer"}
                            {step === 'login' && "Authentication successful"}
                        </p>
                    </div>

                    <Card className="border-highlight/20 bg-black/60 backdrop-blur-xl shadow-2xl shadow-black/50">
                        {step === 'connect' && (
                            <div className="py-4">
                                <Button
                                    onClick={connectWallet}
                                    disabled={walletLoading}
                                    className="w-full h-14 text-lg font-bold bg-highlight text-black hover:bg-highlight/90 shadow-[0_0_20px_rgba(248,197,95,0.2)] hover:shadow-[0_0_30px_rgba(248,197,95,0.4)] transition-all duration-300"
                                >
                                    {walletLoading ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="animate-spin" size={24} /> Connecting...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Wallet size={24} /> Connect Wallet
                                        </div>
                                    )}
                                </Button>
                            </div>
                        )}

                        {step === 'checking' && (
                            <div className="py-12 flex flex-col items-center justify-center text-highlight">
                                <Loader2 className="animate-spin mb-4" size={48} />
                                <p className="text-sm font-medium animate-pulse">Checking database...</p>
                            </div>
                        )}

                        {step === 'referral' && (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-xs text-gray-400 px-1">
                                        <span>Connected Account</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-highlight font-mono">{account?.slice(0, 6)}...{account?.slice(-4)}</span>
                                            <button onClick={disconnectWallet} className="text-red-400 hover:text-red-300 underline">Disconnect</button>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={referralCode}
                                            onChange={(e) => setReferralCode(e.target.value)}
                                            placeholder="Enter referral code"
                                            className="w-full h-14 pl-12 pr-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:border-highlight focus:ring-1 focus:ring-highlight focus:outline-none transition-all"
                                        />
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                            <Key size={20} />
                                        </div>
                                    </div>
                                    {validationError && (
                                        <div className="flex items-center gap-2 text-red-500 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                                            <AlertCircle size={16} />
                                            {validationError}
                                        </div>
                                    )}
                                </div>
                                <Button
                                    onClick={handleReferralSubmit}
                                    disabled={isSubmitting}
                                    className="w-full h-12 bg-white/10 hover:bg-white/20 text-white border border-white/10"
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="animate-spin" size={20} /> Verifying...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            Continue <ArrowRight size={20} />
                                        </div>
                                    )}
                                </Button>
                            </div>
                        )}

                        {step === 'login' && (
                            <div className="py-4 space-y-4">
                                <div className="text-center py-4">
                                    <div className="inline-flex items-center justify-center p-3 bg-green-500/10 text-green-500 rounded-full mb-3">
                                        <CheckCircle2 size={32} />
                                    </div>
                                    <h3 className="text-lg font-bold text-white">Verification Complete</h3>
                                    <p className="text-gray-400 text-sm">Welcome back to Gold4X</p>
                                </div>

                                <Button
                                    onClick={handleDashboardRedirect}
                                    className="w-full h-12 bg-highlight text-black hover:bg-highlight/90 font-bold shadow-lg shadow-highlight/20"
                                >
                                    <div className="flex items-center gap-2">
                                        Go to Dashboard <Zap size={20} />
                                    </div>
                                </Button>
                            </div>
                        )}
                    </Card>

                    <div className="mt-8 text-center">
                        <p className="text-xs text-gray-600">
                            By adding wallet definition you agree to our <a href="#" className="underline hover:text-gray-400">Terms & Conditions</a>
                        </p>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default Welcome;
