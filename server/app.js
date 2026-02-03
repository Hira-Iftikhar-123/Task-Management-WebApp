const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
// Skip body parsing if already set (e.g. by Vercel serverless) so we don't get empty body
app.use((req, res, next) => {
  if (req.body !== undefined && req.body !== null) {
    return next();
  }
  express.json()(req, res, next);
});
app.use((req, res, next) => {
  if (req.body !== undefined && req.body !== null) {
    return next();
  }
  express.urlencoded({ extended: true })(req, res, next);
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

module.exports = app;