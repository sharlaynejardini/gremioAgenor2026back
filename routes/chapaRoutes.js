const express = require('express');
const router = express.Router();
const chapaController = require('../controllers/chapaController');

// Rota para listar todas as chapas
router.get('/', chapaController.getTodasChapas);

// Rota para buscar uma chapa pelo número
router.get('/:numero', chapaController.getChapaPorNumero);

module.exports = router;
