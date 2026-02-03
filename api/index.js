require('dotenv').config();
const mongoose = require('mongoose');
const app = require('../server/app');

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not set');
  }
  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;
}

module.exports = async (req, res) => {
  // Restore original path so Express routes correctly (rewrite sends path in query)
  const path = req.query.path;
  if (path) {
    req.url = '/api/' + (Array.isArray(path) ? path.join('/') : path);
    const qs = new URLSearchParams(req.query);
    qs.delete('path');
    const rest = qs.toString();
    if (rest) req.url += '?' + rest;
  }

  try {
    await connectDB();
  } catch (err) {
    console.error('DB connection error:', err);
    res.status(500).json({ message: 'Server configuration error' });
    return;
  }

  return new Promise((resolve, reject) => {
    res.on('finish', resolve);
    res.on('error', reject);
    app(req, res);
  });
};
