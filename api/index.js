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
  const path = req.query.path;
  if (path) {
    req.url = '/api/' + (Array.isArray(path) ? path.join('/') : path);
    const qs = new URLSearchParams(req.query);
    qs.delete('path');
    const rest = qs.toString();
    if (rest) req.url += '?' + rest;
  }

  // Vercel may pass req.body as a Promise; ensure it's resolved before Express
  if (req.body && typeof req.body.then === 'function') {
    try {
      req.body = await req.body;
    } catch {
      req.body = {};
    }
  }
  if (req.method !== 'GET' && req.method !== 'HEAD' && req.body === undefined) {
    const chunks = [];
    try {
      for await (const chunk of req) chunks.push(chunk);
      const raw = Buffer.concat(chunks).toString('utf8');
      req.body =
        raw && /application\/json/i.test(req.headers['content-type'] || '')
          ? JSON.parse(raw)
          : {};
    } catch {
      req.body = {};
    }
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