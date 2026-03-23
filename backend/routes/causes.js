const express = require('express');
const router = express.Router();
const Cause = require('../models/Cause');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
    try {
        const causes = await Cause.find().sort({ createdAt: -1 });
        res.json(causes);
    } catch (err) {
        res.status(500).json({ error: 'Server error fetching causes' });
    }
});

router.post('/', authMiddleware, async (req, res) => {
    try {
        const newCause = new Cause(req.body);
        const savedCause = await newCause.save();
        res.status(201).json(savedCause);
    } catch (err) {
        res.status(500).json({ error: 'Server error creating cause' });
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await Cause.findByIdAndDelete(req.params.id);
        res.json({ message: 'Cause deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Server error deleting cause' });
    }
});

module.exports = router;
