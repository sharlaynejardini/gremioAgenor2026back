// routes/votoRoutes.js
const express = require('express');
const router = express.Router();
const votoController = require('../controllers/votoController');

router.get('/resultados', votoController.getResultadosLegado);

module.exports = router;
