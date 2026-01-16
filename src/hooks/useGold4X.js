import { useState, useCallback } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { ethers } from 'ethers';

const ERC20_ABI = [
    "function approve(address spender, uint256 amount) public returns (bool)",
    "function allowance(address owner, address spender) public view returns (uint256)",
    "function balanceOf(address account) public view returns (uint256)"
];

export const useGold4X = () => {
    const { contract, account, provider } = useWeb3();
    const [txLoading, setTxLoading] = useState(false);

    const invest = useCallback(async (amountStr, referrer = "0x0000000000000000000000000000000000000000", tokenType) => {
        if (!contract || !account) throw new Error("Wallet not connected");

        setTxLoading(true);
        try {
            const amount = ethers.parseEther(amountStr);
            const contractAddress = await contract.getAddress();

            // 0 = USDT, 1 = USDC, 2 = G4X
            let tokenAddress;
            if (tokenType === 0) {
                tokenAddress = await contract.USDT();
            } else if (tokenType === 1) {
                tokenAddress = await contract.USDC();
            } else {
                // G4X - assumes contract is G4X token or it's separate?
                // Contract inherits ERC20, so it IS the G4X token.
                // But wait, the contract transfers G4X from user?
                // `_transfer(msg.sender, adminWallet, amount)`
                // If the contract IS the token, we don't need approval for `transferFrom`?
                // Contract code: `_transfer(msg.sender, adminWallet, amount);` (Internal ERC20 function).
                // Yes, the contract IS the G4X token. So no approval needed for G4X investment, just the balance check and the call.
                // But wait, `_transfer` is internal?
                // `contract Gold4XSystem is ERC20 ...`
                // `_transfer` called from `invest`.
                // So for G4X (tokenType 2), no approval needed.
                tokenAddress = null;
            }

            if (tokenAddress) {
                const signer = await provider.getSigner();
                const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);

                // Check allowance
                const allowance = await tokenContract.allowance(account, contractAddress);
                if (allowance < amount) {
                    console.log("Approving token...");
                    const approveTx = await tokenContract.approve(contractAddress, amount);
                    await approveTx.wait();
                    console.log("Approved");
                }
            }

            // Execute Investment
            console.log(`Investing ${amountStr} of type ${tokenType} with referrer ${referrer}`);
            const tx = await contract.invest(amount, referrer, tokenType);
            await tx.wait();
            console.log("Investment successful");
            return tx;
        } catch (error) {
            console.error("Investment failed:", error);
            throw error;
        } finally {
            setTxLoading(false);
        }
    }, [contract, account, provider]);

    const claimROI = useCallback(async () => {
        if (!contract) return;
        setTxLoading(true);
        try {
            const tx = await contract.claimMyROI();
            await tx.wait();
            return true;
        } catch (error) {
            console.error("Claim ROI failed:", error);
            throw error;
        } finally {
            setTxLoading(false);
        }
    }, [contract]);

    const claimRankReward = useCallback(async () => {
        if (!contract) return;
        setTxLoading(true);
        try {
            const tx = await contract.claimMyRankReward();
            await tx.wait();
            return true;
        } catch (error) {
            console.error("Claim Rank Reward failed:", error);
            throw error;
        } finally {
            setTxLoading(false);
        }
    }, [contract]);

    const getROIInfo = useCallback(async () => {
        if (!contract || !account) return null;
        try {
            const result = await contract.canClaimROI(account);
            return {
                canClaim: result[0],
                timeUntilNext: Number(result[1]),
                pendingAmount: ethers.formatEther(result[2])
            };
        } catch (error) {
            console.error("Get ROI Info failed:", error);
            return null;
        }
    }, [contract, account]);

    const getRankSalaryInfo = useCallback(async () => {
        if (!contract || !account) return null;
        try {
            const result = await contract.canClaimRankSalary(account);
            return {
                canClaim: result[0],
                timeUntilNext: Number(result[1]),
                salaryAmount: ethers.formatEther(result[2]),
                currentRank: result[3]
            };
        } catch (error) {
            console.error("Get Rank Info failed:", error);
            return null;
        }
    }, [contract, account]);

    const getUserInfo = useCallback(async (userAddress) => {
        const targetAddress = userAddress || account;
        if (!contract || !targetAddress) return null;
        try {
            // users returns a struct, we need the 3rd value (index 2) which is totalEarned based on ABI 
            // ABI: totalInvested, roiEligible, totalEarned
            const result = await contract.users(targetAddress);
            return {
                totalEarned: ethers.formatEther(result[2])
            };
        } catch (error) {
            console.error("Get User Info failed:", error);
            return null;
        }
    }, [contract, account]);

    return {
        invest,
        claimROI,
        claimRankReward,
        getROIInfo,
        getRankSalaryInfo,
        getUserInfo,
        txLoading
    };
};
