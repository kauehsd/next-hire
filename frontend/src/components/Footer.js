import React from 'react';
import '../App.css';

function Footer() {
  return (
    <footer className="footer-global">
      <div className="footer-row">
        <div className="footer-col">
          <h3>NextHire</h3>
          <p>The future of job search. Encontre as melhores oportunidades de emprego em todas as áreas, com tecnologia, precisão e automação.</p>
        </div>
        <div className="footer-col">
          <h4>Links Úteis</h4>
          <ul>
            <li><a href="#">Sobre Nós</a></li>
            <li><a href="#">Como Funciona</a></li>
            <li><a href="#">Política de Privacidade</a></li>
            <li><a href="#">Termos de Uso</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Suporte</h4>
          <ul>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Contato</a></li>
            <li><a href="#">Reportar Bug</a></li>
            <li><a href="#">Sugestões</a></li>
          </ul>
        </div>
        <div className="footer-col footer-col-estatisticas">
          <div className="footer-estatisticas-titulo">
            <h4>Estatísticas</h4>
          </div>
          <div className="footer-stats">
            <div><i className="fas fa-briefcase footer-icon"></i><span>35.000+</span><br/>Vagas</div>
            <div><i className="fas fa-users footer-icon"></i><span>12.000+</span><br/>Usuários</div>
          </div>
        </div>
      </div>
      <div className="footer-copy">
        © 2024 NextHire. Todos os direitos reservados.
      </div>
      <div className="footer-motivacional-flutuante">
        <span role="img" aria-label="dica">💡</span> Seu talento é o seu diferencial.<br/>Atualize seu perfil e conquiste novas oportunidades!
      </div>
    </footer>
  );
}

export default Footer; 