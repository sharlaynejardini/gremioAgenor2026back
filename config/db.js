const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

function missingDatabaseUrl() {
  throw new Error('DATABASE_URL nao configurada. Defina essa variavel no ambiente da Vercel.');
}

const pool = connectionString
  ? globalThis.pgPool || new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    },
    max: Number(process.env.PG_POOL_MAX || 3)
  })
  : {
    query: missingDatabaseUrl,
    connect: missingDatabaseUrl
  };

globalThis.pgPool = pool;

module.exports = {
  pool
};
