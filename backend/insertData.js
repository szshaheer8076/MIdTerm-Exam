// insertData.js

const mongoose = require('mongoose');
require('dotenv').config(); // Load .env variables

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

// Define Schema (same as in server.js)
const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  inStock: { type: Boolean, default: true }
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

// Sample Data
const sampleMenu = [
  { name: "Espresso", category: "Hot Drinks", price: 800.50, inStock: true },
  { name: "Cappuccino", category: "Hot Drinks", price: 550.50, inStock: true },
  { name: "Latte", category: "Hot Drinks", price: 900.00, inStock: true },
  { name: "Iced Coffee", category: "Cold Drinks", price: 800.00, inStock: true },
  { name: "Croissant", category: "Pastries", price: 700.50, inStock: true },
  { name: "Muffin", category: "Pastries", price: 400.00, inStock: false }
];

// Insert data
async function insertData() {
  try {
    await MenuItem.deleteMany(); // Clear old data (optional)
    await MenuItem.insertMany(sampleMenu);
    console.log('✅ Sample menu data inserted successfully!');
  } catch (error) {
    console.error('❌ Error inserting data:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

insertData();
