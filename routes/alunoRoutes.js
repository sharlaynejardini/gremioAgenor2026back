const express = require('express');
const router = express.Router();
const AlunoController = require('../controllers/alunoController');

router.get('/', AlunoController.getTodosAlunos);
router.post('/', AlunoController.criarAluno);
router.get('/ano/:ano', AlunoController.getAlunosPorAno);
router.get('/:id', AlunoController.getAlunoPorId);
router.put('/:id', AlunoController.atualizarAluno);
router.patch('/:id', AlunoController.atualizarAluno);
router.post('/:id/votar', AlunoController.registrarVoto);

module.exports = router;
