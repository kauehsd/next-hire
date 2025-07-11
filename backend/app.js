const express = require('express');
const cors = require('cors');
require('dotenv').config();
const vagasRouter = require('./routes/vagas');
const usuariosRouter = require('./routes/usuarios');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Conexão MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB Atlas conectado com sucesso!');
}).catch((err) => {
  console.error('Erro ao conectar no MongoDB Atlas:', err);
});

app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

app.use('/api/usuarios', usuariosRouter);
app.use('/api/vagas', vagasRouter);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 