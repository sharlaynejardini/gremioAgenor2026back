const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('Configure DATABASE_URL no arquivo .env');
}

const pool = globalThis.pgPool || new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  },
  max: Number(process.env.PG_POOL_MAX || 3)
});

globalThis.pgPool = pool;

module.exports = {
  pool
};
