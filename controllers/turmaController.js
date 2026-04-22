const turmaModel = require('../models/turmaModel');

async function getTurmas(req, res) {
  try {
    const turmas = await turmaModel.listarTurmas();
    res.json(turmas);
  } catch (err) {
    console.error('Erro ao listar turmas:', err);
    res.status(500).json({ erro: 'Erro ao listar turmas' });
  }
}

async function getTurmaPorId(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ erro: 'ID invalido' });
  }

  try {
    const turma = await turmaModel.buscarTurmaPorId(id);
    if (!turma) return res.status(404).json({ erro: 'Turma nao encontrada' });
    res.json(turma);
  } catch (err) {
    console.error('Erro ao buscar turma:', err);
    res.status(500).json({ erro: 'Erro ao buscar turma' });
  }
}

async function criarTurma(req, res) {
  const nome = String(req.body.nome || '').trim();

  if (!nome) {
    return res.status(400).json({ erro: 'Nome da turma e obrigatorio' });
  }

  try {
    const turma = await turmaModel.cadastrarTurma(nome);
    res.status(201).json(turma);
  } catch (err) {
    console.error('Erro ao cadastrar turma:', err);

    if (err.code === '23505') {
      return res.status(409).json({ erro: 'Turma ja cadastrada' });
    }

    res.status(500).json({ erro: 'Erro ao cadastrar turma' });
  }
}

async function atualizarTurma(req, res) {
  const { id } = req.params;
  const nome = String(req.body.nome || '').trim();

  if (!id || !nome) {
    return res.status(400).json({ erro: 'ID e nome sao obrigatorios' });
  }

  try {
    const turma = await turmaModel.atualizarTurma(id, nome);
    if (!turma) return res.status(404).json({ erro: 'Turma nao encontrada' });
    res.json(turma);
  } catch (err) {
    console.error('Erro ao atualizar turma:', err);

    if (err.code === '23505') {
      return res.status(409).json({ erro: 'Turma ja cadastrada' });
    }

    res.status(500).json({ erro: 'Erro ao atualizar turma' });
  }
}

module.exports = {
  getTurmas,
  getTurmaPorId,
  criarTurma,
  atualizarTurma
};
