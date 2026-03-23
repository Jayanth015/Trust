const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Donation = require('../models/Donation');
const authMiddleware = require('../middleware/authMiddleware');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

router.get('/key', (req, res) => {
    res.json({ key: process.env.RAZORPAY_KEY_ID });
});

router.post('/create-order', authMiddleware, async (req, res) => {
    try {
        const { amount } = req.body;
        if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });

        if (process.env.RAZORPAY_KEY_ID === 'rzp_test_YOUR_KEY_ID') {
            return res.json({ id: 'order_mock_' + Date.now(), amount: amount * 100, currency: 'INR', isMock: true });
        }

        const options = {
            amount: amount * 100, // amount in paise
            currency: 'INR',
            receipt: `receipt_${Math.floor(Math.random() * 10000)}`
        };

        const order = await razorpay.orders.create(options);
        res.json({ id: order.id, amount: order.amount, currency: order.currency });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error creating order' });
    }
});

router.post('/verify-payment', authMiddleware, (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (process.env.RAZORPAY_KEY_ID === 'rzp_test_YOUR_KEY_ID') {
            return res.json({ message: 'Payment verified successfully (Mock Mode)', verified: true });
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            res.json({ message: 'Payment verified successfully', verified: true });
        } else {
            res.status(400).json({ error: 'Invalid signature', verified: false });
        }
    } catch (err) {
        res.status(500).json({ error: 'Server error verifying payment' });
    }
});

router.post('/donate', authMiddleware, async (req, res) => {
    try {
        const { causeId, amount, paymentId } = req.body;
        
        const donation = new Donation({
            userId: req.user.id,
            causeId,
            amount,
            paymentId
        });
        
        await donation.save();
        res.status(201).json({ message: 'Donation saved successfully', donation });
    } catch (err) {
        res.status(500).json({ error: 'Server error saving donation' });
    }
});

// Fetch user's donations
router.get('/history', authMiddleware, async (req, res) => {
    try {
        const donations = await Donation.find({ userId: req.user.id })
                                        .populate('causeId', 'title')
                                        .sort({ createdAt: -1 });
        res.json(donations);
    } catch (err) {
        res.status(500).json({ error: 'Server error fetching donation history' });
    }
});

module.exports = router;
