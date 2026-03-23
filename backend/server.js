const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const causeRoutes = require('./routes/causes');
const paymentRoutes = require('./routes/payments');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Health Check
app.get('/', (req, res) => res.send('API is running...'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/causes', causeRoutes);
app.use('/api/payments', paymentRoutes);

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
      console.log('MongoDB connected successfully');
      
      // Seed causes if empty
      const Cause = require('./models/Cause');
      const count = await Cause.countDocuments();
      if (count === 0) {
          await Cause.insertMany([
              { title: 'Education for All', description: 'Help build schools and provide educational materials to underprivileged children.', targetAmount: 50000, image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=500&q=80' },
              { title: 'Feed the Hungry', description: 'Provide nutritious meals to families facing food insecurity in urban areas.', targetAmount: 30000, image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=500&q=80' },
              { title: 'Medical Relief Fund', description: 'Support emergency medical care and treatments for those who cannot afford it.', targetAmount: 100000, image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=500&q=80' }
          ]);
          console.log('Database seeded with demo causes.');
      }
  })
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
