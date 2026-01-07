import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    TrendingUp,
    Wallet,
    Users,
    PieChart,
    Bot,
    Trophy,
    Coins,
    ReceiptText,
    Headphones,
    Menu,
    X,
    Zap,
    LogOut,
    RefreshCw
} from 'lucide-react';
import Button from './ui/Button';
import { useWeb3 } from '../context/Web3Context';

const SidebarItem = ({ icon: Icon, label, to, active, badge }) => (
    <Link
        to={to}
        className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 mb-1 ${active
            ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg shadow-purple-900/20'
            : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
    >
        <div className="flex items-center gap-3">
            <Icon size={20} />
            <span className="font-medium">{label}</span>
        </div>
        {badge && (
            <span className="text-[10px] font-bold uppercase tracking-wider bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded-full border border-yellow-500/20">
                {badge}
            </span>
        )}
    </Link>
);

const SidebarSection = ({ title, items, location }) => (
    <div className="mb-6">
        <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{title}</h3>
        <div className="space-y-1">
            {items.map((item) => (
                <SidebarItem
                    key={item.path}
                    icon={item.icon}
                    label={item.label}
                    to={item.path}
                    active={location.pathname === item.path}
                    badge={item.badge}
                />
            ))}
        </div>
    </div>
);

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { connectWallet, disconnectWallet, account, loading } = useWeb3();
    const location = useLocation();
    const navigate = useNavigate();

    // Protect routes: Redirect to Welcome if not connected
    // NOTE: In a real app we might verify with backend token too, but for now wallet presence is the gate.
    useEffect(() => {
        // If wallet is not connected, we should redirect to Welcome.
        // However, on refresh 'account' might be null initially until Web3Context restores it.
        // We rely on Web3Context's "loading" or similar state if it exists, or just weak protection for now.
        // Given Web3Context tries to restore session on mount, we should wait?
        // Actually, Web3Context uses window.ethereum.on('accountsChanged') but doesn't auto-connect (unless previously authorized).
        // Let's assume if no account and not loading -> Redirect.
        if (!account && !loading) {
            navigate('/welcome');
        }
    }, [account, loading, navigate]);

    const navGroups = [
        {
            title: 'Main Menu',
            items: [
                { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
                { icon: TrendingUp, label: 'Investment', path: '/investment' },
                { icon: Wallet, label: 'Income', path: '/income' },
            ]
        },
        {
            title: 'Network',
            items: [
                { icon: Users, label: 'Referral Network', path: '/reffralincome' },
                { icon: PieChart, label: 'Team Analytics', path: '/team' },
            ]
        },
        {
            title: 'Bots & Pools',
            items: [
                { icon: Bot, label: 'Autopool Bots', path: '/autopool', badge: 'Active' },
                { icon: Trophy, label: 'Rank System', path: '/rank' },
            ]
        },
        {
            title: 'Wallet',
            items: [
                { icon: Coins, label: 'G4X Wallet', path: '/wallet' },
            ]
        },
        {
            title: 'Account',
            items: [
                { icon: ReceiptText, label: 'Transactions', path: '/transactions' },
                { icon: Headphones, label: 'Support', path: '/support' },
            ]
        }
    ];

    return (
        <div className="h-screen flex bg-background text-white overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                className={`fixed lg:static top-0 left-0 h-full w-72 bg-secondary border-r border-white/5 z-50 flex flex-col transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    }`}
            >
                <div className="p-3 flex items-center gap-4">
                    <div className="p-2 bg-gradient-to-br from-primary to-highlight rounded-xl shadow-lg shadow-orange-500/20 text-black">
                        <Zap size={24} fill="currentColor" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-highlight bg-clip-text text-transparent">
                            Gold4X
                        </h1>
                        <p className="text-xs text-gray-400 font-medium">AI Trading Platform</p>
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-400 ml-auto">
                        <X />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto pt-4 px-3 scrollbar-hide">
                    {navGroups.map((group, idx) => (
                        <SidebarSection key={idx} title={group.title} items={group.items} location={location} />
                    ))}
                </nav>

                <div className="p-3 border-t border-white/20">
                    <Button
                        variant="ghost"
                        className="w-full justify-center text-red-400 hover:text-red-500"
                        onClick={() => {
                            disconnectWallet();
                            navigate('/welcome');
                        }}
                    >
                        <LogOut size={20} />
                        Logout
                    </Button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Header */}
                <header className="h-20 border-b border-white/5 bg-background/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-30">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="lg:hidden p-2 text-gray-400 hover:text-white"
                    >
                        <Menu />
                    </button>

                    <div className="flex-1 flex flex-col justify-center ml-4">
                        {location.pathname === '/investment' ? (
                            <>
                                <h2 className="text-xl md:text-2xl font-bold leading-tight bg-gradient-to-r from-highlight to-orange-500 bg-clip-text text-transparent">Investment</h2>
                                <p className="text-xs md:text-sm text-gray-400 hidden md:block">Secure your future with AI-powered trading. Minimum investment: $100 USDT</p>
                            </>
                        ) : location.pathname === '/income' ? (
                            <>
                                <h2 className="text-xl md:text-2xl font-bold leading-tight text-highlight">Income Dashboard</h2>
                                <p className="text-xs md:text-sm text-gray-400 hidden md:block">Track your earnings and withdrawals</p>
                            </>
                        ) : location.pathname === '/reffralincome' ? (
                            <>
                                <h2 className="text-xl md:text-2xl font-bold leading-tight text-highlight">Referral Network</h2>
                                <p className="text-xs md:text-sm text-gray-400 hidden md:block">Manage your downline and track network earnings</p>
                            </>
                        ) : location.pathname === '/team' ? (
                            <>
                                <h2 className="text-xl md:text-2xl font-bold leading-tight text-highlight">Team Analytics</h2>
                                <p className="text-xs md:text-sm text-gray-400 hidden md:block">Analyze your team's performance and earnings distribution</p>
                            </>
                        ) : location.pathname === '/autopool' ? (
                            <>
                                <h2 className="text-xl md:text-2xl font-bold leading-tight text-highlight">Autopool Bots</h2>
                                <p className="text-xs md:text-sm text-gray-400 hidden md:block">Track your bot positions and upcoming payouts</p>
                            </>
                        ) : location.pathname === '/rank' ? (
                            <>
                                <h2 className="text-xl md:text-2xl font-bold leading-tight text-highlight">Rank System</h2>
                                <p className="text-xs md:text-sm text-gray-400 hidden md:block">Achieve higher ranks to unlock monthly salaries and bonuses</p>
                            </>
                        ) : location.pathname === '/wallet' ? (
                            <>
                                <h2 className="text-xl md:text-2xl font-bold leading-tight text-highlight">G4X Wallet</h2>
                                <p className="text-xs md:text-sm text-gray-400 hidden md:block">Manage your G4X tokens and convert to USDT anytime</p>
                            </>
                        ) : location.pathname === '/transactions' ? (
                            <>
                                <h2 className="text-xl md:text-2xl font-bold leading-tight text-highlight">All Transactions</h2>
                                <p className="text-xs md:text-sm text-gray-400 hidden md:block">View all your G4X and USDT transactions</p>
                            </>
                        ) : location.pathname === '/support' ? (
                            <>
                                <h2 className="text-xl md:text-2xl font-bold leading-tight text-highlight">Support</h2>
                                <p className="text-xs md:text-sm text-gray-400 hidden md:block">Get help with your account, withdrawals and more</p>
                            </>
                        ) : (
                            <>
                                <h2 className="text-xl md:text-2xl font-bold leading-tight text-highlight">Dashboard</h2>
                                <p className="text-xs md:text-sm text-gray-400 hidden md:block">Track your investments and earnings</p>
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-3 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 hover:animate-spin transition-colors text-highlight flex items-center justify-center">
                            <RefreshCw size={20} />
                        </button>
                        <Button onClick={!account ? connectWallet : undefined} disabled={loading} className={account ? "bg-green-600/20 text-green-400 border-green-500/20" : ""}>
                            {loading ? 'Connecting...' : account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Connect Wallet'}
                        </Button>
                    </div>
                </header>

                {/* Content Scroll Area */}
                <div className="flex-1 overflow-y-auto p-4 lg:p-8 pb-32">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div >
    );
};

export default Layout;
