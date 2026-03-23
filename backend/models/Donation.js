const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    causeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cause' },
    amount: { type: Number, required: true },
    paymentId: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Donation', DonationSchema);
