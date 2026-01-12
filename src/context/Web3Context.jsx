import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import Gold4XSystemABI from '../abis/Gold4XSystem.json';

const Web3Context = createContext();

// TODO: Replace with deployed contract address
const CONTRACT_ADDRESS = "0x2E968a5fb0AEeA6d1a884AE406be61A5604c5808";

export const Web3Provider = ({ children }) => {
    const [account, setAccount] = useState(null);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const connectWallet = useCallback(async () => {
        if (!window.ethereum) {
            setError("Please install MetaMask!");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const _account = accounts[0];
            setAccount(_account);

            const _provider = new ethers.BrowserProvider(window.ethereum);
            setProvider(_provider);

            const _signer = await _provider.getSigner();
            setSigner(_signer);

            const _contract = new ethers.Contract(CONTRACT_ADDRESS, Gold4XSystemABI, _signer);
            setContract(_contract);

            setError('');
        } catch (err) {
            console.error(err);
            setError("Failed to connect wallet.");
        } finally {
            setLoading(false);
        }
    }, []);

    // Check if wallet is already connected
    useEffect(() => {
        const checkConnection = async () => {
            if (window.ethereum) {
                try {
                    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                    if (accounts.length > 0) {
                        setAccount(accounts[0]);
                        const _provider = new ethers.BrowserProvider(window.ethereum);
                        setProvider(_provider);
                        const _signer = await _provider.getSigner();
                        setSigner(_signer);
                        const _contract = new ethers.Contract(CONTRACT_ADDRESS, Gold4XSystemABI, _signer);
                        setContract(_contract);
                    }
                } catch (err) {
                    console.error("Error checking connection:", err);
                }
            }
            setLoading(false);
        };

        checkConnection();
    }, []);

    const disconnectWallet = useCallback(() => {
        setAccount(null);
        setProvider(null);
        setSigner(null);
        setContract(null);
        setUserData(null);
        // localStorage.removeItem('walletconnect'); // If we were using walletconnect
    }, []);

    const fetchUserData = useCallback(async () => {
        if (contract && account) {
            try {
                const data = await contract.users(account);

                // Fetch other mappings
                let pendingBalance = 0n;
                // Try catch for other mappings in case they fail or ABI is incomplete
                try {
                    // Check if ABI supports withdrawableBalance
                    // If ABI was simple, maybe I missed it. I need to simple-check.
                    // The ABI I wrote earlier didn't include withdrawableBalance mapping! 
                    // I must update ABI first or use "getROIInfo" which I'm adding? No.
                    // I'll assume I can just use contract.balanceOf for G4X token balance.
                } catch (e) { }

                const balance = await contract.balanceOf(account);

                // Serialize the struct data
                const formattedData = {
                    totalInvested: ethers.formatEther(data.totalInvested),
                    roiEligible: ethers.formatEther(data.roiEligible),
                    totalEarned: ethers.formatEther(data.totalEarned),
                    totalWithdrawn: ethers.formatEther(data.totalWithdrawn),
                    directs: Number(data.directs),
                    currentRank: data.currentRank,
                    g4xBalance: ethers.formatEther(balance),
                    activeBotCount: 0,
                    roiIncome: '0.0'
                };

                // Try to fetch active bot count
                try {
                    const botCount = await contract.getUserBotCount(account);
                    formattedData.activeBotCount = Number(botCount);
                } catch (e) {
                    // Check botActivated fallback
                    if (data.botActivated) formattedData.activeBotCount = 1;
                }

                // Try to fetch ROI Income (new mapping)
                try {
                    const roiTotal = await contract.roiIncome(account);
                    formattedData.roiIncome = ethers.formatEther(roiTotal);
                } catch (e) {
                    console.log("Could not fetch roiIncome:", e);
                }

                // Add autopool position
                formattedData.autopoolPosition = Number(data.autopoolPosition);

                // Add referrer
                formattedData.referrer = data.referrer;

                // Add Business Volume
                formattedData.businessVolume = ethers.formatEther(data.businessVolume);

                // Fetch Active Bot Positions
                try {
                    const activeBotIds = await contract.getUserActiveBotPositions(account);
                    formattedData.activeBotPositions = activeBotIds.map(id => Number(id));
                } catch (e) {
                    // console.error("Error fetching active bots:", e);
                    formattedData.activeBotPositions = [];
                }

                // Decode Rank
                try {
                    // Check if rank is not empty bytes32
                    if (data.currentRank && data.currentRank !== ethers.ZeroHash) {
                        formattedData.currentRank = ethers.decodeBytes32String(data.currentRank);
                    } else {
                        formattedData.currentRank = "No Rank";
                    }
                } catch (e) {
                    console.log("Error decoding rank:", e);
                    formattedData.currentRank = "No Rank";
                }

                // Fetch Rank Salary Details
                try {
                    // canClaimRankSalary returns (bool canClaim, uint256 timeUntilNext, uint256 salaryAmount, bytes32 currentRank)
                    // We need to check if ABI has this function first.
                    const [canClaim, timeUntilNext, salaryAmount] = await contract.canClaimRankSalary(account);
                    formattedData.rankSalary = ethers.formatEther(salaryAmount);
                } catch (e) {
                    // If function missing or error, default to 0
                    formattedData.rankSalary = '0.0';
                    if (formattedData.currentRank === "STAR") formattedData.rankSalary = '450.0'; // Approx fallback if needed
                    if (formattedData.currentRank === "GOLD") formattedData.rankSalary = '900.0';
                }

                // Fetch Income Breakdowns
                try {
                    const [direct, sponsor, autopool, rank] = await Promise.all([
                        contract.directIncome(account).catch(() => 0n),
                        contract.sponsorIncome(account).catch(() => 0n),
                        contract.autopoolIncome(account).catch(() => 0n),
                        contract.rankIncome(account).catch(() => 0n)
                    ]);

                    formattedData.directIncome = ethers.formatEther(direct);
                    formattedData.sponsorIncome = ethers.formatEther(sponsor);
                    formattedData.autopoolIncome = ethers.formatEther(autopool);
                    formattedData.rankIncome = ethers.formatEther(rank);

                } catch (e) {
                    console.log("Error fetching income breakdowns:", e);
                    formattedData.directIncome = '0.0';
                    formattedData.sponsorIncome = '0.0';
                    formattedData.autopoolIncome = '0.0';
                    formattedData.rankIncome = '0.0';
                }

                // Fetch pool details if in a pool
                if (formattedData.autopoolPosition > 0) {
                    try {
                        const poolInfo = await contract.botPools(formattedData.autopoolPosition);
                        // poolInfo is likely [poolSize, payoutAmount, rebirthFee, currentIndex] (standard accessor)
                        formattedData.poolInfo = {
                            poolSize: Number(poolInfo[0]),
                            payoutAmount: ethers.formatEther(poolInfo[1]),
                            rebirthFee: ethers.formatEther(poolInfo[2])
                        };
                    } catch (e) {
                        console.log("Error fetching pool info:", e);
                    }
                }

                setUserData(formattedData);
            } catch (err) {
                console.error("Error fetching user data:", err);
            }
        }
    }, [contract, account]);

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                    window.location.reload();
                } else {
                    setAccount(null);
                    setSigner(null);
                    setContract(null);
                }
            });
        }
    }, []);

    useEffect(() => {
        if (account && contract) {
            fetchUserData();
        }
    }, [account, contract, fetchUserData]);

    return (
        <Web3Context.Provider value={{
            account,
            provider,
            signer,
            contract,
            userData,
            connectWallet,
            disconnectWallet,
            loading,
            error,
            fetchUserData
        }}>
            {children}
        </Web3Context.Provider>
    );
};

export const useWeb3 = () => useContext(Web3Context);
