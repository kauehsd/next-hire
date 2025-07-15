import React from 'react';
import '../App.css';

function Header({ onNavigate, onOpenLogin, usuario, onLogout }) {
  return (
    <header className="header">
      <div className="container header-content">
        <div className="logo">
          <i className="fas fa-arrow-up-right-dots"></i> NextHire <span className="slogan">The future of job search.</span>
        </div>
        <nav>
          <a href="#" className="nav-link" onClick={() => onNavigate('home')}>Início</a>
          <a href="#" className="nav-link" onClick={() => onNavigate('buscar')}>Buscar Vagas</a>
          <a href="#" className="nav-link" onClick={() => onNavigate('perfil')}>Seu Perfil</a>
          {usuario ? (
            <>
              <span className="usuario-logado">👤 {usuario.nome || usuario.email}</span>
              <button className="btn btn-login" onClick={onLogout}>Sair</button>
            </>
          ) : (
            <button className="btn btn-login" id="abrirLogin" onClick={onOpenLogin}>Entrar</button>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header; 