const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

// Cadastro de usuário
router.post('/cadastrar', async (req, res) => {
  try {
    const {
      nome, sobrenome, dataNascimento, cpf, email, senha,
      estado, cidade, area, nivel, formacao, pretensao,
      experiencia, habilidades, idiomas, linkedin, github, outroLink
    } = req.body;

    // Validação básica
    if (!nome || !sobrenome || !dataNascimento || !cpf || !email || !senha || !estado || !cidade || !area || !nivel || !formacao) {
      return res.status(400).json({ erro: 'Preencha todos os campos obrigatórios.' });
    }

    // Verificar se já existe email ou cpf
    const existe = await Usuario.findOne({ $or: [ { email }, { cpf } ] });
    if (existe) {
      return res.status(409).json({ erro: 'E-mail ou CPF já cadastrado.' });
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Criar usuário
    const usuario = new Usuario({
      nome, sobrenome, dataNascimento, cpf, email,
      senha: senhaHash, estado, cidade, area, nivel, formacao,
      pretensao, experiencia,
      habilidades: habilidades ? habilidades.split(',').map(h => h.trim()) : [],
      idiomas: idiomas ? idiomas.split(',').map(i => i.trim()) : [],
      linkedin, github, outroLink
    });
    await usuario.save();
    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao cadastrar usuário.' });
  }
});

// Listar todos os usuários
router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar usuários.' });
  }
});

module.exports = router; 