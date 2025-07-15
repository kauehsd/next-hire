import React, { useState, useEffect } from 'react';
import '../App.css';

function BuscarVagas({ usuario, onOpenLogin }) {
  const [vagas, setVagas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [filtros, setFiltros] = useState({
    cargo: '',
    cidade: '',
    nivel: '',
    tipo: ''
  });
  const [favoritos, setFavoritos] = useState(() => {
    const favs = localStorage.getItem('vagasFavoritas');
    return favs ? JSON.parse(favs) : [];
  });

  useEffect(() => {
    localStorage.setItem('vagasFavoritas', JSON.stringify(favoritos));
  }, [favoritos]);

  function handleChange(e) {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  }

  function toggleFavorito(titulo) {
    setFavoritos(favs => {
      if (favs.includes(titulo)) {
        return favs.filter(f => f !== titulo);
      } else {
        return [...favs, titulo];
      }
    });
  }

  async function buscarVagas(e) {
    if (e) e.preventDefault();
    setLoading(true);
    setErro('');
    setVagas([]);
    try {
      const params = new URLSearchParams();
      if (filtros.cargo) params.append('cargo', filtros.cargo);
      if (filtros.cidade) params.append('localizacao', filtros.cidade);
      if (filtros.nivel) params.append('nivel', filtros.nivel);
      if (filtros.tipo) params.append('tipo', filtros.tipo);
      const response = await fetch(`${window.API_URL || 'https://next-hire-kqom.onrender.com/api'}/vagas?${params.toString()}`);
      if (!response.ok) throw new Error('Erro ao buscar vagas');
      const data = await response.json();
      let vagasData = data.vagas || [];
      // MOCK: Se não vier nenhuma vaga da API, usar mock para teste
      if (!vagasData.length) {
        vagasData = [
          {
            titulo: 'Desenvolvedor Frontend React',
            nivel: 'Júnior',
            tecnologias: ['React', 'JavaScript', 'CSS'],
            localizacao: 'Remoto',
            salario: 'R$ 3.500',
            empresa: 'Tech Solutions',
            fonte: 'Mock',
            link: '#'
          },
          {
            titulo: 'Analista de Dados',
            nivel: 'Pleno',
            tecnologias: ['Python', 'SQL', 'Power BI'],
            localizacao: 'São Paulo',
            salario: 'R$ 5.000',
            empresa: 'Data Insights',
            fonte: 'Mock',
            link: '#'
          }
        ];
      }
      setVagas(vagasData);
    } catch (err) {
      setErro('Erro ao buscar vagas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="tab-buscar" className="tab-section active">
      <div className="buscar-vagas-content">
        <h2>Buscar Vagas</h2>
        <form id="filtrosVagas" className="filtros-vagas" onSubmit={buscarVagas}>
          <div className="form-group">
            <input
              type="text"
              id="filtroCargo"
              name="cargo"
              placeholder="Cargo desejado (ex: Analista, Designer, Vendedor)"
              autoComplete="off"
              value={filtros.cargo}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              id="filtroCidade"
              name="cidade"
              placeholder="Cidade"
              autoComplete="off"
              value={filtros.cidade}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <select id="filtroNivel" name="nivel" value={filtros.nivel} onChange={handleChange}>
              <option value="">Nível</option>
              <option value="Estágio">Estágio</option>
              <option value="Júnior">Júnior</option>
              <option value="Pleno">Pleno</option>
              <option value="Sênior">Sênior</option>
              <option value="Especialista">Especialista</option>
            </select>
          </div>
          <div className="form-group">
            <select id="filtroTipo" name="tipo" value={filtros.tipo} onChange={handleChange}>
              <option value="">Tipo</option>
              <option value="remoto">Remoto</option>
              <option value="presencial">Presencial</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Buscar</button>
        </form>
        <div className="vagas-lista" id="resultados">
          {loading && <div className="loading"><p>🔍 Buscando vagas...</p></div>}
          {erro && <div className="error"><p>{erro}</p></div>}
          {!loading && !erro && vagas.length > 0 && (
            <div className="vagas-grid">
              {vagas.map((vaga, idx) => (
                <div className="vaga-card" key={idx}>
                  <div className="vaga-header">
                    <h3>{vaga.titulo}</h3>
                    <span className={`nivel-badge ${vaga.nivel ? vaga.nivel.toLowerCase() : ''}`}>{vaga.nivel}</span>
                  </div>
                  <div className="vaga-content">
                    <p className="tecnologias">
                      <strong>🛠️ Tecnologias:</strong> {vaga.tecnologias && vaga.tecnologias.map((tech, i) => <span className="tech-tag" key={i}>{tech}</span>)}
                    </p>
                    <p className="localizacao"><strong>📍 Localização:</strong> {vaga.localizacao}</p>
                    {vaga.salario && <p className="salario"><strong>💰 Salário:</strong> {vaga.salario}</p>}
                    {vaga.empresa && <p className="empresa"><strong>🏢 Empresa:</strong> {vaga.empresa}</p>}
                    {vaga.fonte && <p className="fonte"><strong>📰 Fonte:</strong> {vaga.fonte}</p>}
                  </div>
                  <div className="vaga-actions">
                    <a href={vaga.link} target="_blank" rel="noopener noreferrer" className="btn-ver-vaga">Ver Vaga</a>
                    <button
                      className="btn-favoritar"
                      onClick={() => {
                        if (!usuario) { onOpenLogin && onOpenLogin(); return; }
                        toggleFavorito(vaga.titulo);
                      }}
                      style={{ color: favoritos.includes(vaga.titulo) ? 'red' : 'gray' }}
                      title={favoritos.includes(vaga.titulo) ? 'Remover dos favoritos' : 'Favoritar'}
                    >
                      {favoritos.includes(vaga.titulo) ? '❤️' : '🩷'} Favoritar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {!loading && !erro && vagas.length === 0 && (
            <div className="no-results">
              <p>😔 Nenhuma vaga encontrada para seu perfil.</p>
              <p>Tente ajustar suas tecnologias ou localização.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default BuscarVagas; 