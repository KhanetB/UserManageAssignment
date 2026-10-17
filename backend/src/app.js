import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './config/database.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 5000);

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '100kb' }));

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch {
    res.status(503).json({ status: 'error', database: 'disconnected' });
  }
});

app.use('/api/users', userRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.path}` });
});

app.listen(port, () => {
  console.log(`User Management API listening on http://localhost:${port}`);
});
