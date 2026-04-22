const express = require('express');
const router = express.Router();
const chapaController = require('../controllers/chapaController');

router.get('/', chapaController.getTodasChapas);
router.get('/:numero', chapaController.getChapaPorNumero);
router.put('/:id', chapaController.atualizarChapa);
router.patch('/:id', chapaController.atualizarChapa);

module.exports = router;
