import { pool } from './db.js';

export async function initializeDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pricelists (
        id CHAR(36) PRIMARY KEY,
        valid_until DATETIME NOT NULL
      )
    `)

    await pool.query(`
      CREATE TABLE IF NOT EXISTS routes (
        id CHAR(36) PRIMARY KEY,
        from_name VARCHAR(100) NOT NULL,
        to_name VARCHAR(100) NOT NULL,
        distance BIGINT
      )
    `)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS legs (
        id CHAR(36) PRIMARY KEY,
        pricelist_id CHAR(36),
        route_id CHAR(36),
        FOREIGN KEY (route_id) REFERENCES routes(id),
        FOREIGN KEY (pricelist_id) REFERENCES pricelists(id) ON DELETE CASCADE
      )
    `)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS providers (
        id CHAR(36) PRIMARY KEY,
        company_id CHAR(36),
        company_name VARCHAR(100),
        price DECIMAL(12,2),
        flight_start DATETIME,
        flight_end DATETIME,
        leg_id CHAR(36),
        FOREIGN KEY (leg_id) REFERENCES legs(id) ON DELETE CASCADE
      )
    `)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reservations (
        id INT PRIMARY KEY AUTO_INCREMENT,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        total_price DECIMAL(10,2) NOT NULL,
        total_time BIGINT,
        pricelist_id CHAR(36),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        code VARCHAR(100),
        FOREIGN KEY (pricelist_id) REFERENCES pricelists(id)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS reservation_providers (
        reservation_id INT,
        provider_id CHAR(36),
        PRIMARY KEY (reservation_id, provider_id),
        FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE CASCADE,
        FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE CASCADE
      )
    `);

    console.log('Database initialized');
  } catch (err) {
    console.error('Error initializing DB:', err);
  }
}
