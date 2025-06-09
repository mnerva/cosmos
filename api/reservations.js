import express from 'express';
import { pool } from './db.js';
import crypto from 'crypto';

const router = express.Router();

router.post('/', async (req, res) => {
  const { firstName, lastName, reservations } = req.body;
  const providerIds = reservations?.map(r => r.offerId);

  if (!firstName || !lastName || !Array.isArray(providerIds) || providerIds.length === 0) {
    return res.status(400).json({ error: 'Missing or invalid data.' });
  }

  let connection;

  try {
    connection = await pool.getConnection();

    // Get provider details
    const [providers] = await connection.query(
      `SELECT p.id, p.price, TIMESTAMPDIFF(SECOND, p.flight_start, p.flight_end) AS duration, l.pricelist_id
       FROM providers p
       JOIN legs l ON p.leg_id = l.id
       WHERE p.id IN (${providerIds.map(() => '?').join(',')})`,
      providerIds
    );

    if (providers.length !== providerIds.length) {
      return res.status(400).json({ error: 'One or more provider IDs are invalid.' });
    }

    const pricelistId = providers[0].pricelist_id;

    const allSamePricelist = providers.every(p => p.pricelist_id === pricelistId);

    if (!allSamePricelist) {
      return res.status(400).json({ error: 'Providers must belong to the same pricelist.' });
    }

    const totalPrice = providers.reduce((sum, p) => sum + Number(p.price), 0);
    const totalTime = providers.reduce((sum, p) => sum + Number(p.duration), 0);
    // Generate a unique 6-character code
    const code = crypto.randomBytes(3).toString('hex').toUpperCase();

    // Insert reservation
    const [result] = await connection.execute(
      `INSERT INTO reservations (first_name, last_name, total_price, total_time, pricelist_id, code)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [firstName, lastName, totalPrice, totalTime, pricelistId, code]
    );

    const reservationId = result.insertId;

    // Link providers to reservation
    for (const pid of providerIds) {
      await connection.execute(
        `INSERT INTO reservation_providers (reservation_id, provider_id) VALUES (?, ?)`,
        [reservationId, pid]
      );
    }

    res.status(201).json({
      message: 'Reservation successful',
      reservationId,
      code,
      firstName,
      lastName
    });

  } catch (error) {
    console.error('Reservation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (connection) connection.release();
  }
});

router.get('/', async (req, res) => {
  const { code, firstName, lastName } = req.query;

  if (!code || !firstName || !lastName) {
    return res.status(400).json({ error: 'Missing code, first name, or last name.' });
  }

  try {
    const [reservations] = await pool.query(
      `SELECT * FROM reservations WHERE code = ? AND first_name = ? AND last_name = ?`,
      [code, firstName, lastName]
    );
    if (reservations.length === 0) {
      return res.status(404).json({ error: 'Reservation not found.' });
    }

    const reservation = reservations[0];

    // Get the related routes for the reservation
    const [routes] = await pool.query(`
      SELECT 
        rt.from_name,
        rt.to_name,
        p.company_name,
        p.flight_start,
        p.flight_end
      FROM reservation_providers rp
      JOIN providers p ON rp.provider_id = p.id
      JOIN legs l ON p.leg_id = l.id
      JOIN routes rt ON l.route_id = rt.id
      WHERE rp.reservation_id = ?
      ORDER BY p.flight_start
    `, [reservation.id]);

    res.json({
      reservation,
      routes
    });
  } catch (error) {
    console.error('Failed to fetch reservations:', error);
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
});

export default router;
