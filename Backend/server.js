const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

const taskRoutes = require('./routes/taskRoutes');
const { notFound } = require('./middleware/errorHandler');
const { errorHandler } = require('./middleware/errorHandler');
require('./config/db');

dotenv.config();

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(morgan('dev'));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.status(200).json({ ok: true });
});

app.use('/api/tasks', taskRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  // Intentionally minimal logging.
  console.log(`Backend listening on port ${PORT}`);
});

