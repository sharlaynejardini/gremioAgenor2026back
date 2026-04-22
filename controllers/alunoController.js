const AlunoModel = require('../models/alunoModel');

async function getTodosAlunos(req, res) {
  try {
    const alunos = await AlunoModel.listarAlunos();
    res.json(alunos);
  } catch (err) {
    console.error('Erro ao buscar alunos:', err);
    res.status(500).json({ erro: 'Erro ao buscar alunos' });
  }
}

async function getAlunosPorAno(req, res) {
  const ano = req.params.ano;

  if (!ano || typeof ano !== 'string') {
    return res.status(400).json({ erro: 'Ano invalido' });
  }

  try {
    const alunos = await AlunoModel.listarAlunosPorAno(ano);
    res.json(alunos);
  } catch (err) {
    console.error('Erro ao buscar alunos por ano:', err);
    res.status(500).json({ erro: 'Erro ao buscar alunos por ano' });
  }
}

async function getAlunoPorId(req, res) {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ erro: 'ID invalido' });
  }

  try {
    const aluno = await AlunoModel.buscarAlunoPorId(id);
    if (!aluno) return res.status(404).json({ erro: 'Aluno nao encontrado' });
    res.json(aluno);
  } catch (err) {
    console.error('Erro ao buscar aluno:', err);
    res.status(500).json({ erro: 'Erro ao buscar aluno' });
  }
}

async function registrarVoto(req, res) {
  const id = req.params.id;
  const numeroChapa = Number(req.body.numeroChapa);

  if (!id || Number.isNaN(numeroChapa)) {
    return res.status(400).json({ erro: 'Dados invalidos' });
  }

  try {
    const aluno = await AlunoModel.buscarAlunoPorId(id);
    if (!aluno) return res.status(404).json({ erro: 'Aluno nao encontrado' });
    if (aluno.votou) return res.status(400).json({ erro: 'Aluno ja votou' });

    await AlunoModel.registrarVoto(id, numeroChapa);
    res.status(200).json({ sucesso: true, mensagem: 'Voto registrado com sucesso' });
  } catch (err) {
    console.error('Erro ao registrar voto:', err);
    res.status(500).json({ erro: 'Erro ao registrar voto' });
  }
}

async function votar(req, res) {
  const { eleitor_id: eleitorId, chapa_numero: chapaNumero } = req.body;
  const numeroChapa = Number(chapaNumero);

  if (!eleitorId || Number.isNaN(numeroChapa)) {
    return res.status(400).json({ erro: 'Dados invalidos' });
  }

  try {
    await AlunoModel.registrarVoto(eleitorId, numeroChapa);
    res.status(201).json({ sucesso: true, mensagem: 'Voto registrado com sucesso' });
  } catch (err) {
    console.error('Erro ao registrar voto:', err);

    if (err.message.includes('nao encontrado')) {
      return res.status(404).json({ erro: err.message });
    }

    if (err.message.includes('ja votou') || err.message.includes('duplicado')) {
      return res.status(409).json({ erro: err.message });
    }

    res.status(500).json({ erro: 'Erro ao registrar voto' });
  }
}

module.exports = {
  getTodosAlunos,
  getAlunosPorAno,
  getAlunoPorId,
  registrarVoto,
  votar
};
