// controllers/votoController.js
const votoModel = require('../models/votoModel');

async function getResultados(req, res) {
try {
const resultados = await votoModel.obterResultados();
res.json(resultados.map((resultado) => ({
chapa: resultado.chapa,
votos: resultado.votos
})));
} catch (err) {
console.error('Erro ao buscar resultados:', err);
res.status(500).json({ erro: 'Erro ao buscar resultados' });
}
}

async function getResultadosLegado(req, res) {
try {
const resultados = await votoModel.obterResultados();
res.json(resultados);
} catch (err) {
console.error('Erro ao buscar resultados:', err);
res.status(500).json({ erro: 'Erro ao buscar resultados' });
}
}

module.exports = {
getResultados,
getResultadosLegado
};
