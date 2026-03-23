const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files (index.html, script.js)
app.use(express.static(path.join(__dirname)));

// Initialize Razorpay with test keys
// NOTE: Replace 'rzp_test_YOUR_KEY_ID' and 'YOUR_KEY_SECRET' with actual API keys from Razorpay Dashboard
const razorpay = new Razorpay({
    key_id: 'rzp_test_YOUR_KEY_ID', 
    key_secret: 'YOUR_KEY_SECRET'
});

// Create Order API
app.post('/create-order', async (req, res) => {
    try {
        const { amount } = req.body;

        // Requirement: Validate amount
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: "Invalid amount. Must be greater than 0." });
        }

        const options = {
            amount: amount * 100, // Amount is in paise (smallest currency unit, e.g., 100 paise = 1 INR)
            currency: "INR",
            receipt: `receipt_order_${Math.floor(Math.random() * 10000)}`
        };

        const order = await razorpay.orders.create(options);

        // Return order details to frontend
        res.json({
            id: order.id,
            amount: order.amount,
            currency: order.currency
        });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ error: "Something went wrong while creating the order" });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
