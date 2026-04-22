const { pool } = require('../config/db');

function montarChapa(row) {
  return {
    id: row.id,
    nome: row.nome,
    numero: row.numero,
    descricao: row.descricao,
    candidatos: row.candidatos || []
  };
}

async function listarTodasChapas() {
  const result = await pool.query(`
    SELECT
      c.id,
      c.nome,
      c.numero,
      c.descricao,
      COALESCE(
        json_agg(
          json_build_object(
            'nome', ca.nome,
            'cargo', ca.cargo,
            'turma', t.nome
          )
          ORDER BY ca.cargo
        ) FILTER (WHERE ca.id IS NOT NULL),
        '[]'
      ) AS candidatos
    FROM chapas c
    LEFT JOIN candidatos ca ON ca.chapa_id = c.id
    LEFT JOIN turmas t ON t.id = ca.turma_id
    GROUP BY c.id, c.nome, c.numero, c.descricao
    ORDER BY c.numero
  `);

  return result.rows.map(montarChapa);
}

async function buscarChapaPorNumero(numero) {
  const result = await pool.query(`
    SELECT
      c.id,
      c.nome,
      c.numero,
      c.descricao,
      c.created_at,
      COALESCE(
        json_agg(
          json_build_object(
            'nome', ca.nome,
            'cargo', ca.cargo,
            'turma', t.nome
          )
          ORDER BY ca.cargo
        ) FILTER (WHERE ca.id IS NOT NULL),
        '[]'
      ) AS candidatos
    FROM chapas c
    LEFT JOIN candidatos ca ON ca.chapa_id = c.id
    LEFT JOIN turmas t ON t.id = ca.turma_id
    WHERE c.numero = $1
    GROUP BY c.id, c.nome, c.numero, c.descricao, c.created_at
  `, [numero]);

  const chapa = result.rows[0];

  if (!chapa) {
    return null;
  }

  const resposta = {
    id: chapa.id,
    nome: chapa.nome,
    numero: chapa.numero,
    descricao: chapa.descricao,
    createdAt: chapa.created_at,
    candidatos: chapa.candidatos || []
  };

  resposta.candidatos.forEach((candidato, index) => {
    resposta[`aluno${index + 1}`] = candidato.nome;
  });

  return resposta;
}

async function atualizarChapa(id, { nome, numero, descricao }) {
  const campos = [];
  const valores = [id];

  if (nome !== undefined) {
    valores.push(nome);
    campos.push(`nome = $${valores.length}`);
  }

  if (numero !== undefined) {
    valores.push(numero);
    campos.push(`numero = $${valores.length}`);
  }

  if (descricao !== undefined) {
    valores.push(descricao);
    campos.push(`descricao = $${valores.length}`);
  }

  if (!campos.length) {
    return buscarChapaPorId(id);
  }

  const result = await pool.query(`
    UPDATE chapas
    SET ${campos.join(', ')}
    WHERE id = $1
    RETURNING numero
  `, valores);

  if (!result.rows[0]) {
    return null;
  }

  return buscarChapaPorNumero(result.rows[0].numero);
}

async function buscarChapaPorId(id) {
  const result = await pool.query(`
    SELECT numero
    FROM chapas
    WHERE id = $1
  `, [id]);

  if (!result.rows[0]) {
    return null;
  }

  return buscarChapaPorNumero(result.rows[0].numero);
}

module.exports = {
  listarTodasChapas,
  buscarChapaPorNumero,
  buscarChapaPorId,
  atualizarChapa
};
