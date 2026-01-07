const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
// Default to local if no ENV provided
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://zarwebcoders:zarwebcoders@cluster0.lqgakzj.mongodb.net/gold4x";

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
    walletAddress: { type: String, required: true, unique: true, lowercase: true },
    referrerAddress: { type: String, lowercase: true },
    joinedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Investment Schema
const investmentSchema = new mongoose.Schema({
    walletAddress: { type: String, required: true, lowercase: true },
    amount: { type: Number, required: true },
    tokenType: { type: String, required: true }, // 'USDT' or 'USDC'
    referrerAddress: { type: String, lowercase: true, default: null },
    activationFee: { type: Number, default: 0 },
    roiEligible: { type: Number, default: 0 },
    g4xReceived: { type: Number, default: 0 },
    dailyRoi: { type: Number, default: 0 },
    txHash: { type: String, required: true, unique: true },
    timestamp: { type: Date, default: Date.now }
});

const Investment = mongoose.model('Investment', investmentSchema);

// Routes

// 4. Record Investment
// 4. Record Investment
app.post('/api/invest', async (req, res) => {
    try {
        const {
            walletAddress,
            amount,
            tokenType,
            txHash,
            referrerAddress,
            activationFee,
            roiEligible,
            g4xReceived,
            dailyRoi
        } = req.body;

        if (!walletAddress || !amount || !tokenType || !txHash) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const newInvestment = new Investment({
            walletAddress: walletAddress.toLowerCase(),
            amount,
            tokenType,
            txHash,
            referrerAddress: referrerAddress ? referrerAddress.toLowerCase() : null,
            activationFee: activationFee || 0,
            roiEligible: roiEligible || 0,
            g4xReceived: g4xReceived || 0,
            dailyRoi: dailyRoi || 0
        });

        await newInvestment.save();

        // Optional: Update User's total investment in DB if you want to mirror chain data
        // For now, just recording the transaction log.

        res.status(201).json({ success: true, investment: newInvestment });
    } catch (error) {
        // Handle duplicate txHash error specifically if needed
        if (error.code === 11000) {
            return res.status(400).json({ error: "Transaction already recorded" });
        }
        res.status(500).json({ error: error.message });
    }
});

// 1. Check if user exists
app.get('/api/users/:address', async (req, res) => {
    try {
        const address = req.params.address.toLowerCase();
        const user = await User.findOne({ walletAddress: address });

        if (user) {
            return res.json({ exists: true, user });
        } else {
            return res.json({ exists: false });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Validate Referral Code (Check if referrer user exists)
app.get('/api/referral/:address', async (req, res) => {
    try {
        const address = req.params.address.toLowerCase();

        // Genesis / Admin Check
        const genesisAddress = "0x7b84e7e09d210b76ed9d2d51b8473ff83e424a29".toLowerCase();

        if (address === genesisAddress) {
            return res.json({ isValid: true, isGenesis: true });
        }

        const referrer = await User.findOne({ walletAddress: address });

        if (referrer) {
            return res.json({ isValid: true });
        } else {
            return res.json({ isValid: false });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Register User
app.post('/api/register', async (req, res) => {
    try {
        const { walletAddress, referrerAddress } = req.body;

        if (!walletAddress || !referrerAddress) {
            return res.status(400).json({ error: "Missing fields" });
        }

        const normalizedWallet = walletAddress.toLowerCase();
        const normalizedReferrer = referrerAddress.toLowerCase();

        // Prevent self-referral
        if (normalizedWallet === normalizedReferrer) {
            return res.status(400).json({ error: "Cannot refer yourself" });
        }

        // Check if user already exists
        const existing = await User.findOne({ walletAddress: normalizedWallet });
        if (existing) {
            return res.status(400).json({ error: "User already registered" });
        }

        const newUser = new User({
            walletAddress: normalizedWallet,
            referrerAddress: normalizedReferrer
        });

        await newUser.save();
        res.status(201).json({ success: true, user: newUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
