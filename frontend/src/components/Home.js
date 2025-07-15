import React from 'react';
import '../App.css';

function Home({ onBuscarVagas }) {
  return (
    <section id="tab-home" className="tab-section active">
      <div className="hero-home">
        <div className="motivacional">Seu próximo emprego está a um clique de distância!</div>
        <h1>Encontre a vaga perfeita para você!</h1>
        <p>O Buscador de Vagas Inteligente conecta você às melhores oportunidades do mercado, de forma automatizada, personalizada e precisa.</p>
        <button className="btn btn-primary" id="ctaBuscarVagas" onClick={onBuscarVagas}>Buscar Vagas</button>
      </div>
      <div className="stats-home">
        <div className="stat-card"><i className="fas fa-users"></i><h3>+12.000</h3><p>Usuários ativos</p></div>
        <div className="stat-card"><i className="fas fa-briefcase"></i><h3>+35.000</h3><p>Vagas indexadas</p></div>
        <div className="stat-card"><i className="fas fa-globe"></i><h3>+10</h3><p>Áreas profissionais</p></div>
        <div className="stat-card"><i className="fas fa-building"></i><h3>+1.500</h3><p>Empresas parceiras</p></div>
      </div>
      <div className="dicas-home">
        <h2>Dicas para sua carreira</h2>
        <ul>
          <li><i className="fas fa-check"></i> Mantenha seu perfil sempre atualizado.</li>
          <li><i className="fas fa-check"></i> Use palavras-chave relevantes nas suas habilidades.</li>
          <li><i className="fas fa-check"></i> Cadastre-se para receber vagas por e-mail.</li>
          <li><i className="fas fa-check"></i> Aproveite as recomendações personalizadas do sistema.</li>
        </ul>
      </div>
      <div className="depoimentos-home">
        <h2>Depoimentos de quem já conseguiu emprego</h2>
        <div className="depoimentos-grid">
          <div className="depoimento-card">
            <p>“Consegui minha vaga dos sonhos em menos de 2 semanas usando o buscador!”</p>
            <span>- Ana, Desenvolvedora</span>
          </div>
          <div className="depoimento-card">
            <p>“O sistema é muito fácil de usar e as vagas realmente combinam com meu perfil.”</p>
            <span>- Carlos, Analista de RH</span>
          </div>
          <div className="depoimento-card">
            <p>“Recebi várias oportunidades por e-mail e fui contratado rapidamente!”</p>
            <span>- Juliana, Designer</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home; 