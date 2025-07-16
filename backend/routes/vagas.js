const express = require('express');
const router = express.Router();
const { buscarVagas } = require('../utils/scraper');

// Rota para buscar vagas reais do banco e de múltiplas fontes
router.get('/', async (req, res) => {
  try {
    const perfil = {
      cargo: req.query.cargo || '',
      nivel: req.query.nivel || '',
      localizacao: req.query.localizacao || '',
      tipo: req.query.tipo || ''
    };
    const resultado = await buscarVagas(perfil);
    res.json(resultado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar vagas.' });
  }
});

// Rota para obter temas de áreas
router.get('/temas-areas', (req, res) => {
  const dataPath = path.join(__dirname, '../../frontend/data/temas-areas.json');
  try {
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    res.json(data);
  } catch (err) {
    res.status(404).json({ erro: 'Dados de temas de áreas não encontrados.' });
  }
});

module.exports = router; 