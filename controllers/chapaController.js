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

module.exports = {
getTodasChapas,
getChapaPorNumero
};