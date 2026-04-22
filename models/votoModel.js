const { pool } = require('../config/db');

async function obterResultados() {
  const result = await pool.query(`
    SELECT
      c.nome AS chapa,
      c.numero AS chapa_numero,
      COUNT(v.id)::int AS votos
    FROM chapas c
    LEFT JOIN votos v ON v.chapa_id = c.id
    GROUP BY c.id, c.nome, c.numero
    ORDER BY votos DESC, c.numero
  `);

  return result.rows.map((row) => ({
    chapa: row.chapa,
    votos: row.votos,
    chapaNumero: row.chapa_numero,
    nomeChapa: row.chapa,
    totalVotos: row.votos
  }));
}

module.exports = {
  obterResultados
};
