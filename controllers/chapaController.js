const chapaModel = require('../models/chapaModel');

// GET /chapa
async function getTodasChapas(req, res) {
try {
const chapas = await chapaModel.listarTodasChapas();
res.status(200).json(chapas);
} catch (error) {
console.error('Erro ao buscar chapas:', error);
res.status(500).json({ erro: 'Erro ao buscar chapas' });
}
}

// GET /chapa/:numero
async function getChapaPorNumero(req, res) {
const numero = parseInt(req.params.numero);
if (isNaN(numero)) {
return res.status(400).json({ erro: 'Número de chapa inválido' });
}

try {
const chapa = await chapaModel.buscarChapaPorNumero(numero);
if (!chapa) {
return res.status(404).json({ erro: 'Chapa não encontrada' });
}
res.status(200).json(chapa);
} catch (error) {
console.error('Erro ao buscar chapa por número:', error);
res.status(500).json({ erro: 'Erro ao buscar chapa' });
}
}

async function atualizarChapa(req, res) {
const id = req.params.id;
const nome = req.body.nome === undefined ? undefined : String(req.body.nome).trim();
const numero = req.body.numero === undefined ? undefined : Number(req.body.numero);
const descricao = req.body.descricao;

if (!id) {
return res.status(400).json({ erro: 'ID invalido' });
}

if (nome === '') {
return res.status(400).json({ erro: 'Nome nao pode ser vazio' });
}

if (numero !== undefined && Number.isNaN(numero)) {
return res.status(400).json({ erro: 'Numero de chapa invalido' });
}

try {
const chapa = await chapaModel.atualizarChapa(id, { nome, numero, descricao });
if (!chapa) {
return res.status(404).json({ erro: 'Chapa nao encontrada' });
}
res.status(200).json(chapa);
} catch (error) {
console.error('Erro ao atualizar chapa:', error);

if (error.code === '23505') {
return res.status(409).json({ erro: 'Numero ou nome de chapa ja cadastrado' });
}

res.status(500).json({ erro: 'Erro ao atualizar chapa' });
}
}

module.exports = {
getTodasChapas,
getChapaPorNumero,
atualizarChapa
};
