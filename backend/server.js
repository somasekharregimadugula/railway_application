
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ═══════ MIDDLEWARE ═══════
app.use(express.json());  // To read JSON data
app.use(cors());          // Allow React to connect



// ═══════ MONGODB CONNECTION ═══════
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log('✅ Connected to MongoDB!');
  console.log('Database: irctc');
})
.catch((error) => {
  console.log('❌ MongoDB Connection Failed!');
  console.log(error);
});


// ═══════ ROUTES ═══════

// Test Route
app.get('/', (req, res) => {
  res.json({ message: '🚂 IRCTC Backend Running!' });
});



// Import Routes
const authRoutes = require('./routes/auth');

app.use('/api', authRoutes);



// ═══════ START SERVER ═══════
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('═══════════════════════════════');
  console.log('🚀 IRCTC Backend Server Started!');
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log('═══════════════════════════════');
});
