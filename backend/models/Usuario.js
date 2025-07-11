const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  sobrenome: { type: String, required: true },
  dataNascimento: { type: Date, required: true },
  cpf: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  estado: { type: String, required: true },
  cidade: { type: String, required: true },
  area: { type: String, required: true },
  nivel: { type: String, required: true },
  formacao: { type: String, required: true },
  pretensao: { type: Number },
  experiencia: { type: String },
  habilidades: { type: [String] },
  idiomas: { type: [String] },
  linkedin: { type: String },
  github: { type: String },
  outroLink: { type: String },
  criadoEm: { type: Date, default: Date.now },
  atualizadoEm: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Usuario', UsuarioSchema); 