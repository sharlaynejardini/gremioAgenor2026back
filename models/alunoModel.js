const { pool } = require('../config/db');

function mapearEleitor(row) {
  return {
    id: row.id,
    nome: row.nome,
    turmaId: row.turma_id,
    ano: row.turma,
    turma: row.turma,
    jaVotou: row.ja_votou,
    votou: row.ja_votou,
    createdAt: row.created_at
  };
}

async function listarAlunos() {
  const result = await pool.query(`
    SELECT e.id, e.nome, e.turma_id, e.ja_votou, e.created_at, t.nome AS turma
    FROM eleitores e
    JOIN turmas t ON t.id = e.turma_id
    ORDER BY e.nome
  `);

  return result.rows.map(mapearEleitor);
}

async function listarAlunosPorAno(ano) {
  const termo = String(ano).trim();
  const filtroTurma = termo.toLowerCase().includes('ano') ? termo : `${termo}%`;

  const result = await pool.query(`
    SELECT e.id, e.nome, e.turma_id, e.ja_votou, e.created_at, t.nome AS turma
    FROM eleitores e
    JOIN turmas t ON t.id = e.turma_id
    WHERE t.nome ILIKE $1
    ORDER BY e.nome
  `, [filtroTurma]);

  return result.rows.map(mapearEleitor);
}

async function buscarAlunoPorId(id) {
  const result = await pool.query(`
    SELECT e.id, e.nome, e.turma_id, e.ja_votou, e.created_at, t.nome AS turma
    FROM eleitores e
    JOIN turmas t ON t.id = e.turma_id
    WHERE e.id = $1
  `, [id]);

  return result.rows[0] ? mapearEleitor(result.rows[0]) : null;
}

async function registrarVoto(eleitorId, chapaNumero) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const eleitorResult = await client.query(`
      SELECT id, ja_votou
      FROM eleitores
      WHERE id = $1
      FOR UPDATE
    `, [eleitorId]);

    const eleitor = eleitorResult.rows[0];

    if (!eleitor) {
      throw new Error('Eleitor nao encontrado');
    }

    if (eleitor.ja_votou) {
      throw new Error('Eleitor ja votou');
    }

    const chapaResult = await client.query(`
      SELECT id
      FROM chapas
      WHERE numero = $1
    `, [chapaNumero]);

    const chapa = chapaResult.rows[0];

    if (!chapa) {
      throw new Error('Chapa nao encontrada');
    }

    await client.query(`
      INSERT INTO votos (eleitor_id, chapa_id)
      VALUES ($1, $2)
    `, [eleitor.id, chapa.id]);

    await client.query(`
      UPDATE eleitores
      SET ja_votou = true
      WHERE id = $1
    `, [eleitor.id]);

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');

    if (err.code === '23505') {
      throw new Error('Voto duplicado para este eleitor');
    }

    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  listarAlunos,
  listarAlunosPorAno,
  buscarAlunoPorId,
  registrarVoto
};
