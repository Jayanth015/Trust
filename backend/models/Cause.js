const mongoose = require('mongoose');

const CauseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    targetAmount: { type: Number, required: true },
    image: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Cause', CauseSchema);
