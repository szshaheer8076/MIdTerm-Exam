// server.js (project root)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Load .env only in local dev; on Vercel, use dashboard env vars
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config(); // reads .env from project root
}

const app = express();

app.use(cors());
app.use(express.json());

// Reuse MongoDB connection across invocations
let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
  }
}

// Schema & model
const menuItemSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  inStock: Boolean,
});

const MenuItem =
  mongoose.models.MenuItem || mongoose.model('MenuItem', menuItemSchema);

const infoResponse = {
  message: 'Coffee Shop API running',
  endpoints: ['/api/menu', '/api/menu/random'],
};

// Root info (optional but nice to have)
app.get('/', async (req, res) => {
  await connectDB();
  res.json(infoResponse);
});

// Base API info
app.get('/api', async (req, res) => {
  await connectDB();
  res.json(infoResponse);
});

// Get all menu items
app.get('/api/menu', async (req, res) => {
  await connectDB();
  const items = await MenuItem.find();
  res.json(items);
});

// Get a random in-stock menu item
app.get('/api/menu/random', async (req, res) => {
  await connectDB();
  const [randomItem] = await MenuItem.aggregate([
    { $match: { inStock: true } },
    { $sample: { size: 1 } },
  ]);
  res.json(randomItem || {});
});

module.exports = app; // Do NOT call app.listen() on Vercel