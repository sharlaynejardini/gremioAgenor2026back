const express = require('express');
const cors = require('cors');
const { pool } = require('./config/db');
const alunoController = require('./controllers/alunoController');
const votoController = require('./controllers/votoController');
const alunoRoutes = require('./routes/alunoRoutes');
const chapaRoutes = require('./routes/chapaRoutes');
const votoRoutes = require('./routes/votoRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/teste-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() AS data_hora');
    res.json({ conectado: true, dataHora: result.rows[0].data_hora });
  } catch (err) {
    console.error('Erro na conexao com o banco:', err);
    res.status(500).json({ conectado: false, erro: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('API do Gremio funcionando!');
});

app.post('/votar', alunoController.votar);
app.get('/resultado', votoController.getResultados);
app.use('/alunos', alunoRoutes);
app.use('/chapas', chapaRoutes);
app.use('/votos', votoRoutes);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

module.exports = app;
