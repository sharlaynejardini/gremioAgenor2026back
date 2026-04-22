const express = require('express');
const router = express.Router();
const turmaController = require('../controllers/turmaController');

router.get('/', turmaController.getTurmas);
router.post('/', turmaController.criarTurma);
router.get('/:id', turmaController.getTurmaPorId);
router.put('/:id', turmaController.atualizarTurma);
router.patch('/:id', turmaController.atualizarTurma);

module.exports = router;
