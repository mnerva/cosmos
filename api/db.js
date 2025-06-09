import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const API_URL = 'https://cosmosodyssey.azurewebsites.net/api/v1.0/TravelPrices';

export async function insertFlightData() {
  const res = await fetch(API_URL);
  const data = await res.json();

  const { id: pricelistId, validUntil, legs } = data;

   // Skip if pricelist already exists
  const [existing] = await pool.execute(
    `SELECT 1 FROM pricelists WHERE id = ? LIMIT 1`,
    [pricelistId]
  );
  if (existing.length > 0) {
    console.log('Pricelist already exists, skipping insert.');
    return;
  }

  // Insert pricelist
  await pool.execute(
    `INSERT IGNORE INTO pricelists (id, valid_until) VALUES (?, ?)`,
    [pricelistId, validUntil]
  );

  // Insert all flight legs + related data
  for (const leg of legs) {
    const legId = leg.id;
    const route = leg.routeInfo;

    // Insert route
    await pool.execute(
      `INSERT IGNORE INTO routes (id, from_name, to_name, distance)
       VALUES (?, ?, ?, ?)`,
      [route.id, route.from.name, route.to.name, route.distance]
    );

    // Insert leg
    await pool.execute(
      `INSERT INTO legs (id, pricelist_id, route_id)
       VALUES (?, ?, ?)`,
      [legId, pricelistId, route.id]
    );

    // Insert providers
    for (const provider of leg.providers) {
      await pool.execute(
        `INSERT IGNORE INTO providers (
          id, company_id, company_name, price,
          flight_start, flight_end, leg_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          provider.id,
          provider.company.id,
          provider.company.name,
          provider.price,
          provider.flightStart,
          provider.flightEnd,
          legId
        ]
      );
    }
  }

  // Keep only the 15 newest pricelists
  await pool.execute(`
    DELETE FROM pricelists
    WHERE id NOT IN (
      SELECT id FROM (
        SELECT id FROM pricelists
        ORDER BY valid_until DESC
        LIMIT 15
      ) AS newest
    )
  `);
}
