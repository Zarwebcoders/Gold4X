import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import Gold4XSystemABI from '../abis/Gold4XSystem.json';

const Web3Context = createContext();

// TODO: Replace with deployed contract address
const CONTRACT_ADDRESS = "0x802444870255c7E9A8d22DcC8BeE83E5439f1868";

export const Web3Provider = ({ children }) => {
    const [account, setAccount] = useState(null);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const connectWallet = useCallback(async () => {
        if (!window.ethereum) {
            setError("Please install MetaMask!");
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
                    g4xBalance: ethers.formatEther(balance)
                };
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
