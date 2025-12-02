const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({ path: '../.env' });

const app = express();

app.use(cors());
app.use(express.json());

// Connect MongoDB once
if (!global._mongoClientPromise) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err.message));

  global._mongoClientPromise = mongoose;
}

// Schema
const menuItemSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  inStock: Boolean
});

const MenuItem = mongoose.models.MenuItem || mongoose.model('MenuItem', menuItemSchema);

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Coffee Shop API running',
    endpoints: ['/api/menu', '/api/menu/random']
  });
});

app.get('/menu', async (req, res) => {
  const items = await MenuItem.find();
  res.json(items);
});

app.get('/menu/random', async (req, res) => {
  const randomItem = await MenuItem.aggregate([
    { $match: { inStock: true } },
    { $sample: { size: 1 } }
  ]);
  res.json(randomItem[0] || {});
});

// Export handler for Vercel
module.exports = app;
