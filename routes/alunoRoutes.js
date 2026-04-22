// routes/alunoRoutes.js
const express = require('express');
const router = express.Router();
const AlunoController = require('../controllers/alunoController');

// Rota para listar todos os alunos
router.get('/', AlunoController.getTodosAlunos);

// Rota para listar alunos por ano
router.get('/ano/:ano', AlunoController.getAlunosPorAno);

// Rota para obter dados de um aluno específico
router.get('/:id', AlunoController.getAlunoPorId);

// Rota para registrar o voto de um aluno
router.post('/:id/votar', AlunoController.registrarVoto);

module.exports = router;