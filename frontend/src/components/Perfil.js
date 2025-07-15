import React, { useState, useEffect } from 'react';
import '../App.css';

function Perfil({ usuario }) {
  const [perfil, setPerfil] = useState({
    nome: '', sobrenome: '', dataNascimento: '', cpf: '', email: '', senha: '',
    estado: '', cidade: '', area: '', nivel: '', formacao: '', pretensao: '',
    experiencia: '', habilidades: '', idiomas: '', linkedin: '', github: '', outroLink: ''
  });
  const [feedback, setFeedback] = useState('');
  const [feedbackTipo, setFeedbackTipo] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function carregarPerfil() {
      setLoading(true);
      try {
        const resp = await fetch(`${window.API_URL || 'https://next-hire-kqom.onrender.com'}/perfil`);
        if (resp.ok) {
          const data = await resp.json();
          setPerfil({ ...perfil, ...data });
        }
      } catch {}
      setLoading(false);
    }
    carregarPerfil();
    // eslint-disable-next-line
  }, []);

  function handleChange(e) {
    setPerfil({ ...perfil, [e.target.name]: e.target.value });
  }

  async function salvarPerfil(e) {
    e.preventDefault();
    setLoading(true);
    setFeedback('');
    setFeedbackTipo('');
    try {
      const resp = await fetch(`${window.API_URL || 'https://next-hire-kqom.onrender.com'}/perfil`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(perfil)
      });
      if (resp.ok) {
        setFeedback('Perfil salvo com sucesso!');
        setFeedbackTipo('success');
      } else {
        setFeedback('Erro ao salvar perfil.');
        setFeedbackTipo('error');
      }
    } catch {
      setFeedback('Erro ao salvar perfil.');
      setFeedbackTipo('error');
    }
    setLoading(false);
  }

  return (
    <section id="tab-perfil" className="tab-section active">
      <div className="perfil-content">
        <h2>Seu Perfil</h2>
        <div className="perfil-form-container">
          <form id="perfilForm" className="perfil-form" autoComplete="off" onSubmit={salvarPerfil}>
            {/* Agrupar campos em linhas responsivas */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nome">Nome</label>
                <input type="text" id="nome" name="nome" required value={perfil.nome} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="sobrenome">Sobrenome</label>
                <input type="text" id="sobrenome" name="sobrenome" required value={perfil.sobrenome} onChange={handleChange} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="dataNascimento">Data de Nascimento</label>
                <input type="date" id="dataNascimento" name="dataNascimento" required value={perfil.dataNascimento} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="cpf">CPF</label>
                <input type="text" id="cpf" name="cpf" maxLength="14" placeholder="000.000.000-00" required value={perfil.cpf} onChange={handleChange} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <input type="email" id="email" name="email" required value={perfil.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="senha">Senha</label>
                <input type="password" id="senha" name="senha" minLength="6" required autoComplete="new-password" value={perfil.senha} onChange={handleChange} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="estado">Estado</label>
                <input type="text" id="estado" name="estado" required value={perfil.estado} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="cidade">Cidade</label>
                <input type="text" id="cidade" name="cidade" required value={perfil.cidade} onChange={handleChange} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group" style={{width:'100%'}}>
                <label htmlFor="area">Área de Atuação</label>
                <input type="text" id="area" name="area" required value={perfil.area} onChange={handleChange} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nivel">Nível</label>
                <select id="nivel" name="nivel" required value={perfil.nivel} onChange={handleChange}>
                  <option value="">Selecione</option>
                  <option value="Estágio">Estágio</option>
                  <option value="Júnior">Júnior</option>
                  <option value="Pleno">Pleno</option>
                  <option value="Sênior">Sênior</option>
                  <option value="Especialista">Especialista</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="formacao">Formação</label>
                <select id="formacao" name="formacao" required value={perfil.formacao} onChange={handleChange}>
                  <option value="">Selecione</option>
                  <option value="Fundamental Incompleto">Fundamental Incompleto</option>
                  <option value="Fundamental Cursando">Fundamental Cursando</option>
                  <option value="Fundamental Completo">Fundamental Completo</option>
                  <option value="Médio Incompleto">Médio Incompleto</option>
                  <option value="Médio Cursando">Médio Cursando</option>
                  <option value="Médio Completo">Médio Completo</option>
                  <option value="Técnico Incompleto">Técnico Incompleto</option>
                  <option value="Técnico Cursando">Técnico Cursando</option>
                  <option value="Técnico Completo">Técnico Completo</option>
                  <option value="Superior Incompleto">Superior Incompleto</option>
                  <option value="Superior Cursando">Superior Cursando</option>
                  <option value="Superior Completo">Superior Completo</option>
                  <option value="Pós-graduação">Pós-graduação</option>
                  <option value="Mestrado">Mestrado</option>
                  <option value="Doutorado">Doutorado</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="pretensao">Pretensão Salarial</label>
                <input type="number" id="pretensao" name="pretensao" min="0" placeholder="R$" value={perfil.pretensao} onChange={handleChange} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="experiencia">Experiência Profissional</label>
                <input type="text" id="experiencia" name="experiencia" placeholder="Ex: 2 anos, Analista de RH, etc" value={perfil.experiencia} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="habilidades">Habilidades (separe por vírgula)</label>
                <input type="text" id="habilidades" name="habilidades" placeholder="Ex: Excel, Liderança, JavaScript" value={perfil.habilidades} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="idiomas">Idiomas (separe por vírgula)</label>
                <input type="text" id="idiomas" name="idiomas" placeholder="Ex: Inglês, Espanhol" value={perfil.idiomas} onChange={handleChange} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="linkedin">LinkedIn</label>
                <input type="url" id="linkedin" name="linkedin" placeholder="https://linkedin.com/in/seu-perfil" value={perfil.linkedin} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="github">GitHub</label>
                <input type="url" id="github" name="github" placeholder="https://github.com/seu-usuario" value={perfil.github} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="outroLink">Outro Link Profissional</label>
                <input type="url" id="outroLink" name="outroLink" placeholder="https://" value={perfil.outroLink} onChange={handleChange} />
              </div>
            </div>
            <button type="submit" id="salvarPerfilBtn" className="salvar-perfil-btn btn btn-primary" disabled={loading}>{loading ? 'Salvando...' : 'Salvar Perfil'}</button>
            {feedback && <div className={`mensagem ${feedbackTipo}`}>{feedback}</div>}
          </form>
        </div>
      </div>
    </section>
  );
}

export default Perfil; 