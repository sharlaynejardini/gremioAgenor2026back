const { pool } = require('../config/db');

async function listarTurmas() {
  const result = await pool.query(`
    SELECT id, nome
    FROM turmas
    ORDER BY nome
  `);

  return result.rows;
}

async function buscarTurmaPorId(id) {
  const result = await pool.query(`
    SELECT id, nome
    FROM turmas
    WHERE id = $1
  `, [id]);

  return result.rows[0] || null;
}

async function cadastrarTurma(nome) {
  const result = await pool.query(`
    INSERT INTO turmas (nome)
    VALUES ($1)
    RETURNING id, nome
  `, [nome]);

  return result.rows[0];
}

async function atualizarTurma(id, nome) {
  const result = await pool.query(`
    UPDATE turmas
    SET nome = $2
    WHERE id = $1
    RETURNING id, nome
  `, [id, nome]);

  return result.rows[0] || null;
}

module.exports = {
  listarTurmas,
  buscarTurmaPorId,
  cadastrarTurma,
  atualizarTurma
};
