// Dados de estados e cidades
let estadosCidades = {};
let temasAreas = {};

// Carregar estados do IBGE
async function carregarEstadosCidades() {
  try {
    // Buscar estados
    const estadosResp = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');
    const estados = await estadosResp.json();
    const estadoSelect = document.getElementById('estado');
    estadoSelect.innerHTML = '<option value="">Selecione o estado</option>';
    estados.forEach(estado => {
      const opt = document.createElement('option');
      opt.value = estado.sigla;
      opt.textContent = estado.nome;
      estadoSelect.appendChild(opt);
    });
    // Evento para carregar cidades ao selecionar estado
    estadoSelect.addEventListener('change', async (e) => {
      await popularCidades(e.target.value);
    });
  } catch (err) {
    console.error('Erro ao carregar estados do IBGE:', err);
  }
}

// Carregar cidades do IBGE
async function popularCidades(uf) {
  const cidadeSelect = document.getElementById('cidade');
  cidadeSelect.innerHTML = '<option value="">Selecione a cidade</option>';
  if (!uf) return;
  try {
    const cidadesResp = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`);
    const cidades = await cidadesResp.json();
    cidades.forEach(cidade => {
      const opt = document.createElement('option');
      opt.value = cidade.nome;
      opt.textContent = cidade.nome;
      cidadeSelect.appendChild(opt);
    });
  } catch (err) {
    console.error('Erro ao carregar cidades do IBGE:', err);
  }
}

// Carregar temas de áreas
async function carregarTemasAreas() {
  try {
    const response = await fetch(`${API_URL}/temas-areas`);
    temasAreas = await response.json();
    criarSeletorAreas();
  } catch (error) {
    console.error('Erro ao carregar temas de áreas:', error);
    // Fallback para dados locais se o backend não estiver disponível
    try {
      const localResponse = await fetch('data/temas-areas.json');
      temasAreas = await localResponse.json();
      criarSeletorAreas();
    } catch (localError) {
      console.error('Erro ao carregar dados locais:', localError);
    }
  }
}

// Criar seletor visual de áreas
function criarSeletorAreas() {
  const areaGrid = document.getElementById('areaGrid');
  const areaSelect = document.getElementById('area');
  
  areaGrid.innerHTML = '';
  
  Object.keys(temasAreas).forEach(areaKey => {
    const area = temasAreas[areaKey];
    
    // Criar card da área
    const areaCard = document.createElement('div');
    areaCard.className = 'area-card';
    areaCard.setAttribute('data-area', areaKey);
    areaCard.innerHTML = `
      <i class="${area.icone}"></i>
      <h4>${area.nome}</h4>
      <p>${area.descricao}</p>
    `;
    
    areaCard.addEventListener('click', () => {
      selecionarArea(areaKey);
    });
    
    areaGrid.appendChild(areaCard);
    
    // Adicionar opção ao select
    const option = document.createElement('option');
    option.value = areaKey;
    option.textContent = area.nome;
    areaSelect.appendChild(option);
  });
}

// Selecionar área e aplicar tema
function selecionarArea(areaKey) {
  // Remover seleção anterior
  document.querySelectorAll('.area-card').forEach(card => {
    card.classList.remove('selected');
  });
  
  // Selecionar novo card
  const selectedCard = document.querySelector(`[data-area="${areaKey}"]`);
  if (selectedCard) {
    selectedCard.classList.add('selected');
  }
  
  // Atualizar select
  document.getElementById('area').value = areaKey;
  
  // Aplicar tema
  aplicarTema(areaKey);
}

// Aplicar tema ao site
function aplicarTema(areaKey) {
  const tema = temasAreas[areaKey];
  if (!tema) return;
  
  // Aplicar tema ao body
  document.body.setAttribute('data-tema', areaKey);
  
  // Atualizar ícone do logo
  const logoIcon = document.querySelector('.logo i');
  if (logoIcon) {
    logoIcon.className = tema.icone;
  }
  
  // Atualizar ícone do hero
  const heroIcon = document.querySelector('.hero-image i');
  if (heroIcon) {
    heroIcon.className = tema.icone;
  }
  
  // Salvar área selecionada
  localStorage.setItem('areaSelecionada', areaKey);
}

// Máscara de CPF
function aplicarMascaraCPF(input) {
  input.addEventListener('input', function(e) {
    let v = input.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    input.value = v;
  });
}

// Validação de CPF
function validarCPF(cpf) {
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length !== 11 || /^([0-9])\1+$/.test(cpf)) return false;
  let soma = 0, resto;
  for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i-1, i)) * (11 - i);
  resto = (soma * 10) % 11;
  if ((resto === 10) || (resto === 11)) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;
  soma = 0;
  for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i-1, i)) * (12 - i);
  resto = (soma * 10) % 11;
  if ((resto === 10) || (resto === 11)) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;
  return true;
}

// Validação de data de nascimento (maior de 14 anos)
function validarDataNascimento(data) {
  const nasc = new Date(data);
  const hoje = new Date();
  const idade = hoje.getFullYear() - nasc.getFullYear();
  if (idade < 14) return false;
  if (idade === 14) {
    if (
      hoje.getMonth() < nasc.getMonth() ||
      (hoje.getMonth() === nasc.getMonth() && hoje.getDate() < nasc.getDate())
    ) {
      return false;
    }
  }
  return true;
}

// Validação de email
function validarEmail(email) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

// Validação de senha forte
function validarSenha(senha) {
  return senha.length >= 6;
}

// Validação de URL
function validarURL(url) {
  if (!url) return true;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Autocomplete para habilidades e idiomas (sugestões básicas)
const sugestoesHabilidades = [
  'Excel', 'Word', 'PowerPoint', 'Liderança', 'Comunicação', 'JavaScript', 'Python', 'Java', 'SQL', 'Gestão', 'Vendas', 'Atendimento', 'Inglês', 'Espanhol', 'Francês', 'HTML', 'CSS', 'React', 'Node.js', 'Redação', 'Negociação', 'Proatividade', 'Trabalho em equipe'
];
const sugestoesIdiomas = [
  'Português', 'Inglês', 'Espanhol', 'Francês', 'Alemão', 'Italiano', 'Mandarim', 'Japonês', 'Russo', 'Árabe'
];

function autocomplete(input, lista) {
  input.addEventListener('input', function() {
    const val = this.value.split(',').pop().trim().toLowerCase();
    closeAllLists();
    if (!val) return false;
    const list = document.createElement('div');
    list.setAttribute('class', 'autocomplete-items');
    this.parentNode.appendChild(list);
    lista.forEach(item => {
      if (item.toLowerCase().startsWith(val)) {
        const itemDiv = document.createElement('div');
        itemDiv.innerHTML = '<strong>' + item.substr(0, val.length) + '</strong>' + item.substr(val.length);
        itemDiv.addEventListener('click', () => {
          let partes = this.value.split(',');
          partes[partes.length - 1] = ' ' + item;
          this.value = partes.join(',').replace(/^,/, '').trim();
          closeAllLists();
        });
        list.appendChild(itemDiv);
      }
    });
  });
  function closeAllLists() {
    const items = document.querySelectorAll('.autocomplete-items');
    items.forEach(i => i.parentNode.removeChild(i));
  }
  document.addEventListener('click', function(e) {
    closeAllLists();
  });
}

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
  await carregarEstadosCidades();
  await carregarTemasAreas();
  await carregarPerfil();
  setupEventListeners();
  setupNavigation();
  
  // Aplicar tema salvo
  const areaSalva = localStorage.getItem('areaSelecionada');
  if (areaSalva && temasAreas[areaSalva]) {
    aplicarTema(areaSalva);
    selecionarArea(areaSalva);
  }
});

// Configurar event listeners
function setupEventListeners() {
  // Seleção de estado/cidade
  document.getElementById('estado').addEventListener('change', (e) => {
    popularCidades(e.target.value);
  });

  // Formulário de perfil
  document.getElementById('perfilForm').addEventListener('submit', salvarPerfil);

  // Filtros
  document.getElementById('filtroArea').addEventListener('change', aplicarFiltros);
  document.getElementById('filtroNivel').addEventListener('change', aplicarFiltros);
  document.getElementById('filtroTipo').addEventListener('change', aplicarFiltros);
}

// Configurar navegação
function setupNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('href').substring(1);
      scrollToSection(target);
      
      // Atualizar link ativo
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
}

// Função para rolar para seção
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    const headerHeight = document.querySelector('.header').offsetHeight;
    const targetPosition = section.offsetTop - headerHeight - 20;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
}

// Carregar perfil existente
async function carregarPerfil() {
  try {
    const response = await fetch(`${API_URL}/perfil`);
    const perfil = await response.json();
    
    if (perfil) {
      document.getElementById('nome').value = perfil.nome || '';
      document.getElementById('email').value = perfil.email || '';
      document.getElementById('area').value = perfil.area || '';
      document.getElementById('formacao').value = perfil.formacao || '';
      document.getElementById('pretensao').value = perfil.pretensao || '';
      document.getElementById('tecnologias').value = perfil.tecnologias ? perfil.tecnologias.join(', ') : '';
      document.getElementById('nivel').value = perfil.nivel || '';
      
      // Carregar estado e cidade se existirem
      if (perfil.estado) {
        document.getElementById('estado').value = perfil.estado;
        popularCidades(perfil.estado);
        if (perfil.cidade) {
          setTimeout(() => {
            document.getElementById('cidade').value = perfil.cidade;
          }, 100);
        }
      }
      
      // Aplicar tema se área estiver definida
      if (perfil.area && temasAreas[perfil.area]) {
        aplicarTema(perfil.area);
        selecionarArea(perfil.area);
      }
    }
  } catch (err) {
    console.log('Perfil não encontrado ou erro ao carregar');
  }
}

// Salvar perfil
async function salvarPerfil(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const perfil = {
    nome: formData.get('nome'),
    email: formData.get('email'),
    estado: formData.get('estado'),
    cidade: formData.get('cidade'),
    localizacao: `${formData.get('cidade')}, ${estadosCidades[formData.get('estado')]?.nome || ''}`,
    area: formData.get('area'),
    formacao: formData.get('formacao'),
    pretensao: formData.get('pretensao'),
    tecnologias: formData.get('tecnologias').split(',').map(tech => tech.trim()).filter(tech => tech),
    nivel: formData.get('nivel')
  };

  try {
    const response = await fetch(`${API_URL}/perfil`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(perfil)
    });

    if (response.ok) {
      mostrarMensagem('Perfil salvo com sucesso!', 'success');
      // Buscar vagas automaticamente após salvar perfil
      setTimeout(() => {
        buscarVagas();
      }, 1000);
    } else {
      mostrarMensagem('Erro ao salvar perfil', 'error');
    }
  } catch (err) {
    mostrarMensagem('Erro ao salvar perfil', 'error');
  }
}

// Buscar vagas
async function buscarVagas() {
  const resultados = document.getElementById('resultados');
  resultados.innerHTML = '<div class="loading"><p>🔍 Buscando vagas...</p></div>';

  try {
    const response = await fetch(`${API_URL}/vagas`);
    const data = await response.json();
    
    if (data.vagas && data.vagas.length > 0) {
      const infoBusca = data.aviso ? `<div class="aviso-busca">⚠️ ${data.aviso}</div>` : '';
      const fontesInfo = data.fontes ? `<div class="fontes-info">📊 Fontes: ${data.fontes.join(', ')}</div>` : '';
      
      resultados.innerHTML = `
        <div class="resultados-header">
          <h2>🎯 Vagas Recomendadas (${data.total})</h2>
          ${infoBusca}
          ${fontesInfo}
        </div>
        <div class="vagas-grid">
          ${data.vagas.map(vaga => `
            <div class="vaga-card">
              <div class="vaga-header">
                <h3>${vaga.titulo}</h3>
                <span class="nivel-badge ${vaga.nivel.toLowerCase()}">${vaga.nivel}</span>
              </div>
              <div class="vaga-content">
                <p class="tecnologias">
                  <strong>🛠️ Tecnologias:</strong> 
                  ${vaga.tecnologias.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </p>
                <p class="localizacao">
                  <strong>📍 Localização:</strong> ${vaga.localizacao}
                </p>
                ${vaga.salario ? `<p class="salario"><strong>💰 Salário:</strong> ${vaga.salario}</p>` : ''}
                ${vaga.empresa ? `<p class="empresa"><strong>🏢 Empresa:</strong> ${vaga.empresa}</p>` : ''}
                ${vaga.fonte ? `<p class="fonte"><strong>📰 Fonte:</strong> ${vaga.fonte}</p>` : ''}
              </div>
              <div class="vaga-actions">
                <a href="${vaga.link}" target="_blank" class="btn-ver-vaga">Ver Vaga</a>
                <button class="btn-favoritar" onclick="favoritarVaga('${vaga.titulo}')">❤️ Favoritar</button>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      resultados.innerHTML = `
        <div class="no-results">
          <p>😔 Nenhuma vaga encontrada para seu perfil.</p>
          <p>Tente ajustar suas tecnologias ou localização.</p>
        </div>
      `;
    }
  } catch (err) {
    resultados.innerHTML = `
      <div class="error">
        <p>❌ Erro ao buscar vagas.</p>
        <p>Verifique se o servidor está rodando.</p>
      </div>
    `;
  }
}

// Aplicar filtros
async function aplicarFiltros() {
  const area = document.getElementById('filtroArea').value;
  const nivel = document.getElementById('filtroNivel').value;
  const tipo = document.getElementById('filtroTipo').value;
  
  const resultados = document.getElementById('resultados');
  resultados.innerHTML = '<div class="loading"><p>🔍 Aplicando filtros...</p></div>';

  try {
    const params = new URLSearchParams();
    if (area) params.append('area', area);
    if (nivel) params.append('nivel', nivel);
    if (tipo) params.append('tipo', tipo);
    
    const response = await fetch(`${API_URL}/vagas?${params.toString()}`);
    const data = await response.json();
    
    if (data.vagas && data.vagas.length > 0) {
      const infoBusca = data.aviso ? `<div class="aviso-busca">⚠️ ${data.aviso}</div>` : '';
      const fontesInfo = data.fontes ? `<div class="fontes-info">📊 Fontes: ${data.fontes.join(', ')}</div>` : '';
      
      resultados.innerHTML = `
        <div class="resultados-header">
          <h2>🎯 Vagas Filtradas (${data.total})</h2>
          ${infoBusca}
          ${fontesInfo}
        </div>
        <div class="vagas-grid">
          ${data.vagas.map(vaga => `
            <div class="vaga-card">
              <div class="vaga-header">
                <h3>${vaga.titulo}</h3>
                <span class="nivel-badge ${vaga.nivel.toLowerCase()}">${vaga.nivel}</span>
              </div>
              <div class="vaga-content">
                <p class="tecnologias">
                  <strong>🛠️ Tecnologias:</strong> 
                  ${vaga.tecnologias.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </p>
                <p class="localizacao">
                  <strong>📍 Localização:</strong> ${vaga.localizacao}
                </p>
                ${vaga.salario ? `<p class="salario"><strong>💰 Salário:</strong> ${vaga.salario}</p>` : ''}
                ${vaga.empresa ? `<p class="empresa"><strong>🏢 Empresa:</strong> ${vaga.empresa}</p>` : ''}
                ${vaga.fonte ? `<p class="fonte"><strong>📰 Fonte:</strong> ${vaga.fonte}</p>` : ''}
              </div>
              <div class="vaga-actions">
                <a href="${vaga.link}" target="_blank" class="btn-ver-vaga">Ver Vaga</a>
                <button class="btn-favoritar" onclick="favoritarVaga('${vaga.titulo}')">❤️ Favoritar</button>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      resultados.innerHTML = `
        <div class="no-results">
          <p>😔 Nenhuma vaga encontrada com os filtros aplicados.</p>
          <p>Tente ajustar os filtros ou seu perfil.</p>
        </div>
      `;
    }
  } catch (err) {
    resultados.innerHTML = `
      <div class="error">
        <p>❌ Erro ao aplicar filtros.</p>
        <p>Verifique se o servidor está rodando.</p>
      </div>
    `;
  }
}

// Função para favoritar vagas
function favoritarVaga(titulo) {
  const favoritos = JSON.parse(localStorage.getItem('vagasFavoritas') || '[]');
  if (!favoritos.includes(titulo)) {
    favoritos.push(titulo);
    localStorage.setItem('vagasFavoritas', JSON.stringify(favoritos));
    mostrarMensagem('Vaga favoritada!', 'success');
  } else {
    const index = favoritos.indexOf(titulo);
    favoritos.splice(index, 1);
    localStorage.setItem('vagasFavoritas', JSON.stringify(favoritos));
    mostrarMensagem('Vaga removida dos favoritos', 'info');
  }
}

// Modal de login
function mostrarLogin() {
  document.getElementById('loginModal').style.display = 'block';
}

function fecharLogin() {
  document.getElementById('loginModal').style.display = 'none';
}

function mostrarCadastro() {
  // Implementar cadastro no futuro
  mostrarMensagem('Funcionalidade em desenvolvimento', 'info');
}

// Função para mostrar mensagens
function mostrarMensagem(texto, tipo) {
  const mensagem = document.createElement('div');
  mensagem.className = `mensagem ${tipo}`;
  mensagem.textContent = texto;
  
  document.body.appendChild(mensagem);
  
  setTimeout(() => {
    mensagem.remove();
  }, 3000);
}

// Fechar modal ao clicar fora
window.onclick = function(event) {
  const modal = document.getElementById('loginModal');
  if (event.target === modal) {
    fecharLogin();
  }
}

// Scroll suave para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = this.getAttribute('href').substring(1);
    scrollToSection(target);
  });
});

// Atualizar navegação ativa baseada no scroll
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollY >= (sectionTop - 200)) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}); 

// Validação do formulário
const perfilForm = document.getElementById('perfilForm');
if (perfilForm) {
  perfilForm.addEventListener('submit', function(e) {
    let erro = '';
    const cpf = document.getElementById('cpf').value;
    const dataNasc = document.getElementById('dataNascimento').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const linkedin = document.getElementById('linkedin').value;
    const github = document.getElementById('github').value;
    const outroLink = document.getElementById('outroLink').value;
    const pretensao = document.getElementById('pretensao').value;

    if (!validarCPF(cpf)) erro = 'CPF inválido.';
    else if (!validarDataNascimento(dataNasc)) erro = 'Data de nascimento inválida ou menor de 14 anos.';
    else if (!validarEmail(email)) erro = 'E-mail inválido.';
    else if (!validarSenha(senha)) erro = 'Senha deve ter pelo menos 6 caracteres.';
    else if (!validarURL(linkedin)) erro = 'LinkedIn inválido.';
    else if (!validarURL(github)) erro = 'GitHub inválido.';
    else if (!validarURL(outroLink)) erro = 'Link profissional inválido.';
    else if (pretensao && pretensao < 0) erro = 'Pretensão salarial inválida.';

    if (erro) {
      e.preventDefault();
      alert(erro);
      return false;
    }
  });
} 

// Modal login
const modalLogin = document.getElementById('modalLogin');
const fecharModalLogin = document.getElementById('fecharModalLogin');
function abrirModalLogin() {
  modalLogin.classList.add('active');
}
if (fecharModalLogin) {
  fecharModalLogin.onclick = () => modalLogin.classList.remove('active');
}
// Só abre modal ao clicar em 'Entrar'
const btnEntrar = document.getElementById('abrirLogin');
if (btnEntrar) {
  btnEntrar.onclick = abrirModalLogin;
}
// Remover qualquer chamada automática a abrirModalLogin ou checarLoginOuAbrirModal

// Link para criar conta
const linkCriarConta = document.getElementById('linkCriarConta');
if (linkCriarConta) {
  linkCriarConta.onclick = function(e) {
    e.preventDefault();
    modalLogin.classList.remove('active');
    ativarGuia('perfil');
    document.getElementById('perfilForm').scrollIntoView({ behavior: 'smooth' });
  };
}

function mostrarDecorHome(ativo) {
  const bg = document.getElementById('bgDecorHome');
  const frase = document.getElementById('fraseMotivacionalHome');
  if (bg) bg.style.display = ativo ? 'block' : 'none';
  if (frase) frase.style.display = ativo ? 'flex' : 'none';
}

// Navegação entre guias
function ativarGuia(tab, atualizarHash = true) {
  document.querySelectorAll('.tab-section').forEach(sec => sec.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
  if (tab === 'home') {
    document.getElementById('tab-home').classList.add('active');
    document.querySelector('.nav-link[data-tab="home"]').classList.add('active');
    mostrarDecorHome(true);
    if (window.trocarFraseMotivacional) window.trocarFraseMotivacional();
  } else if (tab === 'buscar') {
    document.getElementById('tab-buscar').classList.add('active');
    document.querySelector('.nav-link[data-tab="buscar"]').classList.add('active');
    mostrarDecorHome(false);
  } else if (tab === 'perfil') {
    document.getElementById('tab-perfil').classList.add('active');
    document.querySelector('.nav-link[data-tab="perfil"]').classList.add('active');
    mostrarDecorHome(false);
  }
  if (atualizarHash) {
    window.location.hash = tab;
  }
}

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const tab = link.getAttribute('data-tab');
    ativarGuia(tab);
  });
});

document.getElementById('ctaBuscarVagas').onclick = () => ativarGuia('buscar');
document.getElementById('abrirLoginBuscar').onclick = abrirModalLogin;

// Tabs login/cadastro
const tabBtns = document.querySelectorAll('.tab-btn');
tabBtns.forEach(btn => {
  btn.onclick = function() {
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if (btn.dataset.step === 'login') ativarStepLogin();
    else ativarStepCadastro();
  };
});
function ativarStepLogin() {
  document.getElementById('loginStep').classList.add('active');
  document.getElementById('cadastroStep').classList.remove('active');
}
function ativarStepCadastro() {
  document.getElementById('loginStep').classList.remove('active');
  document.getElementById('cadastroStep').classList.add('active');
  renderizarCadastroEtapas();
}

// Cadastro em etapas (exemplo simplificado)
function renderizarCadastroEtapas() {
  const cadastroStep = document.getElementById('cadastroStep');
  cadastroStep.innerHTML = `
    <form id="formCadastro">
      <div class="cadastro-etapa">
        <label for="cadNome">Nome</label>
        <input type="text" id="cadNome" name="nome" required />
        <label for="cadSobrenome">Sobrenome</label>
        <input type="text" id="cadSobrenome" name="sobrenome" required />
        <label for="cadDataNascimento">Data de Nascimento</label>
        <input type="date" id="cadDataNascimento" name="dataNascimento" required />
        <label for="cadCPF">CPF</label>
        <input type="text" id="cadCPF" name="cpf" maxlength="14" required />
        <label for="cadEmail">E-mail</label>
        <input type="email" id="cadEmail" name="email" required />
        <label for="cadSenha">Senha</label>
        <input type="password" id="cadSenha" name="senha" minlength="6" required />
        <label for="cadEstado">Estado</label>
        <select id="cadEstado" name="estado" required></select>
        <label for="cadCidade">Cidade</label>
        <select id="cadCidade" name="cidade" required></select>
        <label for="cadArea">Área de Atuação</label>
        <select id="cadArea" name="area" required></select>
        <label for="cadNivel">Nível</label>
        <select id="cadNivel" name="nivel" required>
          <option value="">Selecione</option>
          <option value="Estágio">Estágio</option>
          <option value="Júnior">Júnior</option>
          <option value="Pleno">Pleno</option>
          <option value="Sênior">Sênior</option>
          <option value="Especialista">Especialista</option>
        </select>
        <label for="cadFormacao">Formação</label>
        <select id="cadFormacao" name="formacao" required>
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
        <label for="cadPretensao">Pretensão Salarial</label>
        <input type="number" id="cadPretensao" name="pretensao" min="0" placeholder="R$" />
        <label for="cadExperiencia">Experiência Profissional</label>
        <input type="text" id="cadExperiencia" name="experiencia" placeholder="Ex: 2 anos, Analista de RH, etc" />
        <label for="cadHabilidades">Habilidades (separe por vírgula)</label>
        <input type="text" id="cadHabilidades" name="habilidades" placeholder="Ex: Excel, Liderança, JavaScript" />
        <label for="cadIdiomas">Idiomas (separe por vírgula)</label>
        <input type="text" id="cadIdiomas" name="idiomas" placeholder="Ex: Inglês, Espanhol" />
        <label for="cadLinkedin">LinkedIn</label>
        <input type="url" id="cadLinkedin" name="linkedin" placeholder="https://linkedin.com/in/seu-perfil" />
        <label for="cadGithub">GitHub</label>
        <input type="url" id="cadGithub" name="github" placeholder="https://github.com/seu-usuario" />
        <label for="cadOutroLink">Outro Link Profissional</label>
        <input type="url" id="cadOutroLink" name="outroLink" placeholder="https://" />
        <button type="submit" class="btn btn-primary">Cadastrar</button>
      </div>
    </form>
  `;
  // Preencher selects de estado/cidade/área
  carregarEstadosCidadesCadastro();
  carregarAreasCadastro();
  // Máscara CPF e autocomplete
  aplicarMascaraCPF(document.getElementById('cadCPF'));
  autocomplete(document.getElementById('cadHabilidades'), sugestoesHabilidades);
  autocomplete(document.getElementById('cadIdiomas'), sugestoesIdiomas);
  // Submissão
  document.getElementById('formCadastro').onsubmit = async function(e) {
    e.preventDefault();
    const form = e.target;
    const dados = Object.fromEntries(new FormData(form));
    // Validações básicas (pode expandir)
    if (!validarCPF(dados.cpf)) return alert('CPF inválido.');
    if (!validarDataNascimento(dados.dataNascimento)) return alert('Data de nascimento inválida ou menor de 14 anos.');
    if (!validarEmail(dados.email)) return alert('E-mail inválido.');
    if (!validarSenha(dados.senha)) return alert('Senha deve ter pelo menos 6 caracteres.');
    if (!validarURL(dados.linkedin)) return alert('LinkedIn inválido.');
    if (!validarURL(dados.github)) return alert('GitHub inválido.');
    if (!validarURL(dados.outroLink)) return alert('Link profissional inválido.');
    if (dados.pretensao && dados.pretensao < 0) return alert('Pretensão salarial inválida.');
    // Enviar para backend
    try {
      const resp = await fetch(`${API_URL}/api/usuarios/cadastrar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });
      const res = await resp.json();
      if (resp.ok) {
        alert('Cadastro realizado com sucesso! Faça login.');
        ativarStepLogin();
      } else {
        alert(res.erro || 'Erro ao cadastrar.');
      }
    } catch (err) {
      alert('Erro ao conectar ao servidor.');
    }
  };
}
// Preencher estados/cidades no cadastro
async function carregarEstadosCidadesCadastro() {
  const estadoSel = document.getElementById('cadEstado');
  const cidadeSel = document.getElementById('cadCidade');
  estadoSel.innerHTML = '<option value="">Selecione o estado</option>';
  cidadeSel.innerHTML = '<option value="">Selecione a cidade</option>';
  try {
    const estadosResp = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');
    const estados = await estadosResp.json();
    estados.forEach(estado => {
      const opt = document.createElement('option');
      opt.value = estado.sigla;
      opt.textContent = estado.nome;
      estadoSel.appendChild(opt);
    });
    estadoSel.onchange = async function() {
      cidadeSel.innerHTML = '<option value="">Selecione a cidade</option>';
      if (!estadoSel.value) return;
      const cidadesResp = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoSel.value}/municipios`);
      const cidades = await cidadesResp.json();
      cidades.forEach(cidade => {
        const opt = document.createElement('option');
        opt.value = cidade.nome;
        opt.textContent = cidade.nome;
        cidadeSel.appendChild(opt);
      });
    };
  } catch {}
}
// Preencher áreas no cadastro
function carregarAreasCadastro() {
  const areaSel = document.getElementById('cadArea');
  areaSel.innerHTML = '<option value="">Selecione a área</option>';
  Object.keys(temasAreas).forEach(areaKey => {
    const area = temasAreas[areaKey];
    const opt = document.createElement('option');
    opt.value = areaKey;
    opt.textContent = area.nome;
    areaSel.appendChild(opt);
  });
}
// Login
const formLogin = document.getElementById('formLogin');
if (formLogin) {
  formLogin.onsubmit = async function(e) {
    e.preventDefault();
    // Aqui você pode implementar autenticação real
    alert('Login simulado. Integração real em breve!');
    modalLogin.classList.remove('active');
    ativarGuia('buscar');
  };
}
// Bloquear busca de vagas para não logados (simulação)
// (No futuro, usar autenticação real e tokens) 

// Simulação de login (futuro: autenticação real)
let usuarioLogado = false;

function checarLoginOuAbrirModal() {
  if (!usuarioLogado) abrirModalLogin();
  // Se logado, pode prosseguir normalmente (futuro)
}

// Autocomplete de cidades para o filtro de cidade
async function autocompleteCidadeFiltro() {
  const input = document.getElementById('filtroCidade');
  let timeout = null;
  input.addEventListener('input', function() {
    clearTimeout(timeout);
    const val = this.value.trim();
    if (val.length < 2) return closeCidadeList();
    timeout = setTimeout(async () => {
      try {
        const resp = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/municipios?nome=${encodeURIComponent(val)}`);
        const cidades = await resp.json();
        closeCidadeList();
        const list = document.createElement('div');
        list.setAttribute('class', 'autocomplete-items');
        this.parentNode.appendChild(list);
        cidades.forEach(cidade => {
          const itemDiv = document.createElement('div');
          itemDiv.textContent = cidade.nome + ' - ' + cidade.microrregiao.mesorregiao.UF.sigla;
          itemDiv.addEventListener('click', () => {
            input.value = cidade.nome;
            closeCidadeList();
          });
          list.appendChild(itemDiv);
        });
      } catch {}
    }, 300);
  });
  function closeCidadeList() {
    const items = document.querySelectorAll('.autocomplete-items');
    items.forEach(i => i.parentNode.removeChild(i));
  }
  document.addEventListener('click', function(e) {
    if (e.target !== input) closeCidadeList();
  });
}

// Autocomplete de profissões reais para o filtro de cargo
async function autocompleteProfissaoFiltro() {
  const input = document.getElementById('filtroCargo');
  let profissoes = [];
  try {
    const resp = await fetch('data/profissoes.json');
    profissoes = await resp.json();
  } catch {}
  input.addEventListener('input', function() {
    closeProfissaoList();
    const val = this.value.trim().toLowerCase();
    if (!val) return;
    const list = document.createElement('div');
    list.setAttribute('class', 'autocomplete-items');
    this.parentNode.appendChild(list);
    profissoes.filter(p => p.toLowerCase().includes(val)).forEach(prof => {
      const itemDiv = document.createElement('div');
      itemDiv.textContent = prof;
      itemDiv.addEventListener('click', () => {
        input.value = prof;
        closeProfissaoList();
        buscarVagasComFiltros(); // Busca automática ao selecionar profissão
      });
      list.appendChild(itemDiv);
    });
  });
  function closeProfissaoList() {
    const items = document.querySelectorAll('.autocomplete-items');
    items.forEach(i => i.parentNode.removeChild(i));
  }
  document.addEventListener('click', function(e) {
    if (e.target !== input) closeProfissaoList();
  });
}

// Atualizar filtro de tipo para incluir 'Híbrido'
if (document.getElementById('filtroTipo')) {
  const tipoSelect = document.getElementById('filtroTipo');
  if (![...tipoSelect.options].some(opt => opt.value === 'hibrido')) {
    const opt = document.createElement('option');
    opt.value = 'hibrido';
    opt.textContent = 'Híbrido';
    tipoSelect.appendChild(opt);
  }
}

// Função para montar query string dos filtros (cargo, cidade, nivel, tipo)
function montarQueryVagas() {
  const cargo = document.getElementById('filtroCargo').value;
  const cidade = document.getElementById('filtroCidade').value;
  const nivel = document.getElementById('filtroNivel').value;
  const tipo = document.getElementById('filtroTipo').value;
  const params = new URLSearchParams();
  if (cargo) params.append('cargo', cargo);
  if (cidade) params.append('localizacao', cidade);
  if (nivel) params.append('nivel', nivel);
  if (tipo) params.append('tipo', tipo);
  return params.toString();
}

// Função para buscar vagas com filtros
async function buscarVagasComFiltros(e) {
  if (e) e.preventDefault();
  const resultados = document.getElementById('resultados');
  resultados.innerHTML = '<div class="loading"><p>🔍 Buscando vagas...</p></div>';
  try {
    const query = montarQueryVagas();
    const response = await fetch(`${API_URL}/vagas?${query}`);
    const data = await response.json();
    const vagas = data.vagas || [];
    if (vagas.length > 0) {
      resultados.innerHTML = `
        <div class="resultados-header">
          <h2>🎯 Vagas Encontradas (${data.total})</h2>
          <div class="fontes-info">📊 Fontes: ${(data.fontes || []).join(', ')}</div>
        </div>
        <div class="vagas-grid">
          ${vagas.map(vaga => `
            <div class="vaga-card">
              <div class="vaga-header">
                <h3>${vaga.titulo}</h3>
                <span class="nivel-badge ${vaga.nivel ? vaga.nivel.toLowerCase() : ''}">${vaga.nivel || ''}</span>
              </div>
              <div class="vaga-content">
                <p class="cargo"><strong>💼 Cargo:</strong> ${vaga.titulo}</p>
                <p class="localizacao"><strong>📍 Localização:</strong> ${vaga.localizacao || ''}</p>
                ${vaga.salario ? `<p class="salario"><strong>💰 Salário:</strong> ${vaga.salario}</p>` : ''}
                ${vaga.empresa ? `<p class="empresa"><strong>🏢 Empresa:</strong> ${vaga.empresa}</p>` : ''}
                ${vaga.fonte ? `<p class="fonte"><strong>📰 Fonte:</strong> ${vaga.fonte}</p>` : ''}
              </div>
              <div class="vaga-actions">
                <a href="#" class="btn-ver-vaga" onclick="candidatarVaga('${vaga.link}');return false;">Candidatar-se</a>
                <a href="${vaga.link}" target="_blank" class="btn-detalhes">Ver detalhes</a>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      resultados.innerHTML = `
        <div class="no-results">
          <p>😔 Nenhuma vaga encontrada para os filtros selecionados.</p>
          <p>Tente ajustar o cargo, cidade ou nível.</p>
        </div>
      `;
    }
  } catch (err) {
    resultados.innerHTML = `
      <div class="error">
        <p>❌ Erro ao buscar vagas.</p>
        <p>Verifique se o servidor está rodando.</p>
      </div>
    `;
  }
}

// Função para ação de candidatar-se
function candidatarVaga(link) {
  const usuarioLogado = localStorage.getItem('usuarioLogado');
  if (!usuarioLogado) {
    mostrarMensagem('Você precisa estar logado para se candidatar. Faça login ou cadastre-se!', 'warning');
    abrirModalLogin();
    return;
  }
  window.open(link, '_blank');
}

// Inicializar filtros e busca automática ao carregar aba
if (document.getElementById('filtrosVagas')) {
  autocompleteCidadeFiltro();
  autocompleteProfissaoFiltro();
  document.getElementById('filtrosVagas').addEventListener('submit', buscarVagasComFiltros);
  buscarVagasComFiltros();
} 