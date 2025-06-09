import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import reservationsRouter from './reservations.js';
import { initializeDatabase } from './initDb.js';
import { pool } from './db.js';
import cron from 'node-cron';
import { insertFlightData } from './db.js';

dotenv.config();
const app = express();

initializeDatabase();

app.use(cors());
app.use(express.json());

// API route
app.use('/api/reservations', reservationsRouter);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);

  // Start syncing every 5 minutes
  cron.schedule('*/5 * * * *', () => {
    insertFlightData().catch(console.error);
  });
});

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Successfully connected to the database!');
    connection.release();
  } catch (err) {
    console.error('Failed to connect to the database:', err.message);
    process.exit(1); // stop the server if DB is unreachable
  }
})();
