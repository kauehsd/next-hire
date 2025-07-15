import React, { useState, useEffect } from 'react';
import '../App.css';

function ModalLogin({ open, onClose, onLoginSuccess }) {
  const [aba, setAba] = useState('login');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [feedbackTipo, setFeedbackTipo] = useState('');

  function resetForm() {
    setEmail(''); setSenha(''); setNome(''); setFeedback(''); setFeedbackTipo('');
  }

  useEffect(() => { if (!open) resetForm(); }, [open]);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true); setFeedback(''); setFeedbackTipo('');
    try {
      const resp = await fetch(`${window.API_URL || 'https://next-hire-kqom.onrender.com'}/api/usuarios/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, senha })
      });
      const data = await resp.json();
      if (resp.ok) {
        setFeedback('Login realizado com sucesso!'); setFeedbackTipo('success');
        setTimeout(() => {
          setFeedback(''); setFeedbackTipo('');
          if (onLoginSuccess) onLoginSuccess({ nome: data.nome, email: data.email });
        }, 1000);
      } else {
        setFeedback(data.erro || 'E-mail ou senha inválidos.'); setFeedbackTipo('error');
      }
    } catch { setFeedback('Erro ao conectar ao servidor.'); setFeedbackTipo('error'); }
    setLoading(false);
  }

  async function handleCadastro(e) {
    e.preventDefault();
    setLoading(true); setFeedback(''); setFeedbackTipo('');
    try {
      const resp = await fetch(`${window.API_URL || 'https://next-hire-kqom.onrender.com'}/api/usuarios/cadastrar`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nome, email, senha })
      });
      const data = await resp.json();
      if (resp.ok) {
        setFeedback('Cadastro realizado com sucesso! Faça login.'); setFeedbackTipo('success');
        setTimeout(() => { setAba('login'); resetForm(); }, 1200);
      } else {
        setFeedback(data.erro || 'Erro ao cadastrar.'); setFeedbackTipo('error');
      }
    } catch { setFeedback('Erro ao conectar ao servidor.'); setFeedbackTipo('error'); }
    setLoading(false);
  }

  if (!open) return null;
  return (
    <div id="modalLogin" className="modal active">
      <div className="modal-content">
        <span className="close" id="fecharModalLogin" onClick={onClose}>&times;</span>
        <div className="login-tabs">
          <button className={`tab-btn${aba === 'login' ? ' active' : ''}`} onClick={() => { setAba('login'); resetForm(); }}>Entrar</button>
          <button className={`tab-btn${aba === 'cadastro' ? ' active' : ''}`} onClick={() => { setAba('cadastro'); resetForm(); }}>Criar Conta</button>
        </div>
        {aba === 'login' ? (
          <form id="formLogin" onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="loginEmail">E-mail</label>
              <input type="email" id="loginEmail" name="loginEmail" required value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="loginSenha">Senha</label>
              <input type="password" id="loginSenha" name="loginSenha" required value={senha} onChange={e => setSenha(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
            {feedback && <div className={`mensagem ${feedbackTipo}`}>{feedback}</div>}
          </form>
        ) : (
          <form id="formCadastro" onSubmit={handleCadastro} className="login-form">
            <div className="form-group">
              <label htmlFor="cadNome">Nome</label>
              <input type="text" id="cadNome" name="nome" required value={nome} onChange={e => setNome(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="cadEmail">E-mail</label>
              <input type="email" id="cadEmail" name="email" required value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="cadSenha">Senha</label>
              <input type="password" id="cadSenha" name="senha" minLength={6} required value={senha} onChange={e => setSenha(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Cadastrando...' : 'Cadastrar'}</button>
            {feedback && <div className={`mensagem ${feedbackTipo}`}>{feedback}</div>}
          </form>
        )}
        <div className="login-social">
          <p>Ou entre com:</p>
          <button className="btn-social google"><i className="fab fa-google"></i> Google</button>
          <button className="btn-social linkedin"><i className="fab fa-linkedin"></i> LinkedIn</button>
        </div>
        <div className="login-options">
          {aba === 'login' ? (
            <p>Não tem cadastro? <a href="#" id="linkCriarConta" onClick={e => { e.preventDefault(); setAba('cadastro'); resetForm(); }}>Criar conta</a></p>
          ) : (
            <p>Já tem conta? <a href="#" onClick={e => { e.preventDefault(); setAba('login'); resetForm(); }}>Entrar</a></p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModalLogin; 