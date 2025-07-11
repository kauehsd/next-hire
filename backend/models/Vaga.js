const mongoose = require('mongoose');

const VagaSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  empresa: { type: String },
  localizacao: { type: String },
  tecnologias: { type: [String] },
  nivel: { type: String },
  link: { type: String, required: true, unique: true },
  fonte: { type: String },
  area: { type: String },
  salario: { type: String },
  descricao: { type: String },
  dataColeta: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vaga', VagaSchema); 