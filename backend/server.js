// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load variables from .env

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection failed:', err.message));

// Define Menu Item Schema
const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  inStock: { type: Boolean, default: true }
});

// Create Model
const MenuItem = mongoose.model('MenuItem', menuItemSchema);

// Endpoint 1: Get all menu items
app.get('/menu', async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menu', error: error.message });
  }
});

// Endpoint 2: Get one random in-stock item
app.get('/menu/random', async (req, res) => {
  try {
    const randomItem = await MenuItem.aggregate([
      { $match: { inStock: true } },
      { $sample: { size: 1 } }
    ]);

    if (randomItem.length === 0) {
      return res.status(404).json({ message: 'No in-stock items found' });
    }

    res.json(randomItem[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching random item', error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`☕ Coffee shop server running on port ${PORT}`);
});
