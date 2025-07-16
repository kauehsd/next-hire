const axios = require('axios');
const cheerio = require('cheerio');
const Vaga = require('../models/Vaga');
const fs = require('fs');

// Configuração centralizada de URLs
const scrapingConfig = {
  remotar: {
    base: 'https://remotar.com.br',
    vagas: [
      '/vagas',
      '/vagas?page=2',
      '/vagas?page=3'
    ]
  }
};

// Função utilitária para registrar alerta em relatório
function registrarAlerta(site, mensagem) {
  const logMsg = `[${new Date().toISOString()}] [${site}] ${mensagem}\n`;
  fs.appendFileSync('scraping_alertas.log', logMsg);
  console.warn(logMsg);
}

// Função para tentar encontrar nova URL de vagas automaticamente
async function buscarNovaUrlRemotar() {
  try {
    const response = await axios.get(scrapingConfig.remotar.base, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 10000
    });
    const $ = cheerio.load(response.data);
    const links = [];
    $('a').each((i, el) => {
      const href = $(el).attr('href');
      if (href && /vaga|job|emprego/i.test(href)) {
        links.push(href.startsWith('http') ? href : scrapingConfig.remotar.base + href);
      }
    });
    return links;
  } catch (error) {
    registrarAlerta('Remotar', 'Falha ao buscar links na página inicial: ' + error.message);
    return [];
  }
}

// Função para fazer scraping do site Remotar com fallback automático
async function scrapeRemotar(tecnologias, nivel) {
  try {
    const vagas = [];
    let urls = scrapingConfig.remotar.vagas.map(u => u.startsWith('http') ? u : scrapingConfig.remotar.base + u);
    let erro404 = false;
    for (const url of urls) {
      try {
        const response = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          },
          timeout: 10000
        });
        const $ = cheerio.load(response.data);
        
        // Seletores específicos do Remotar (pode precisar de ajustes)
        $('.vaga-item, .job-card, .vacancy-item').each((index, element) => {
          const $el = $(element);
          
          const titulo = $el.find('.job-title, .vaga-titulo, h3').text().trim();
          const empresa = $el.find('.company-name, .empresa').text().trim();
          const localizacao = $el.find('.location, .localizacao').text().trim() || 'Remoto';
          const salario = $el.find('.salary, .salario').text().trim();
          const link = $el.find('a').attr('href');
          
          // Extrair tecnologias do título ou descrição
          const descricao = $el.find('.description, .descricao').text().toLowerCase();
          const tecnologiasEncontradas = [];
          
          // Lista de tecnologias comuns para buscar
          const techList = [
            'javascript', 'js', 'react', 'vue', 'angular', 'node.js', 'nodejs', 'python',
            'java', 'php', 'c#', 'c++', 'go', 'rust', 'ruby', 'django', 'flask',
            'express', 'mongodb', 'mysql', 'postgresql', 'redis', 'docker', 'kubernetes',
            'aws', 'azure', 'gcp', 'html', 'css', 'sass', 'less', 'typescript', 'ts'
          ];
          
          techList.forEach(tech => {
            if (descricao.includes(tech) || titulo.toLowerCase().includes(tech)) {
              tecnologiasEncontradas.push(tech);
            }
          });
          
          // Determinar nível baseado no título e descrição
          let nivelVaga = 'Pleno';
          const textoCompleto = (titulo + ' ' + descricao).toLowerCase();
          
          if (textoCompleto.includes('júnior') || textoCompleto.includes('junior') || 
              textoCompleto.includes('estagiário') || textoCompleto.includes('estagiario')) {
            nivelVaga = 'Júnior';
          } else if (textoCompleto.includes('sênior') || textoCompleto.includes('senior') ||
                     textoCompleto.includes('lead') || textoCompleto.includes('arquiteto')) {
            nivelVaga = 'Sênior';
          }
          
          if (titulo && link) {
            vagas.push({
              titulo,
              empresa: empresa || 'Empresa não informada',
              localizacao: localizacao || 'Remoto',
              salario: salario || 'A combinar',
              tecnologias: tecnologiasEncontradas.length > 0 ? tecnologiasEncontradas : ['Não especificado'],
              nivel: nivelVaga,
              link: link.startsWith('http') ? link : `${scrapingConfig.remotar.base}${link}`,
              fonte: 'Remotar'
            });
          }
        });
        
        // Aguardar um pouco entre as requisições para não sobrecarregar o servidor
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        if (error.response && error.response.status === 404) {
          erro404 = true;
          registrarAlerta('Remotar', `404 na URL: ${url}`);
        } else {
          registrarAlerta('Remotar', `Erro ao acessar ${url}: ${error.message}`);
        }
      }
    }
    // Se todas URLs deram 404, tentar buscar nova URL automaticamente
    if (erro404 && vagas.length === 0) {
      const novasUrls = await buscarNovaUrlRemotar();
      if (novasUrls.length > 0) {
        registrarAlerta('Remotar', `Novas URLs encontradas: ${novasUrls.join(', ')}`);
        // Tenta scraping na primeira nova URL encontrada
        try {
          const response = await axios.get(novasUrls[0], {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            timeout: 10000
          });
          const $ = cheerio.load(response.data);
          $('.vaga-item, .job-card, .vacancy-item').each((index, element) => {
            const $el = $(element);
            const titulo = $el.find('.job-title, .vaga-titulo, h3').text().trim();
            const empresa = $el.find('.company-name, .empresa').text().trim();
            const localizacao = $el.find('.location, .localizacao').text().trim() || 'Remoto';
            const salario = $el.find('.salary, .salario').text().trim();
            const link = $el.find('a').attr('href');
            const descricao = $el.find('.description, .descricao').text().toLowerCase();
            const tecnologiasEncontradas = [];
            const techList = [
              'javascript', 'js', 'react', 'vue', 'angular', 'node.js', 'nodejs', 'python',
              'java', 'php', 'c#', 'c++', 'go', 'rust', 'ruby', 'django', 'flask',
              'express', 'mongodb', 'mysql', 'postgresql', 'redis', 'docker', 'kubernetes',
              'aws', 'azure', 'gcp', 'html', 'css', 'sass', 'less', 'typescript', 'ts'
            ];
            techList.forEach(tech => {
              if (descricao.includes(tech) || titulo.toLowerCase().includes(tech)) {
                tecnologiasEncontradas.push(tech);
              }
            });
            let nivelVaga = 'Pleno';
            const textoCompleto = (titulo + ' ' + descricao).toLowerCase();
            if (textoCompleto.includes('júnior') || textoCompleto.includes('junior') || 
                textoCompleto.includes('estagiário') || textoCompleto.includes('estagiario')) {
              nivelVaga = 'Júnior';
            } else if (textoCompleto.includes('sênior') || textoCompleto.includes('senior') ||
                       textoCompleto.includes('lead') || textoCompleto.includes('arquiteto')) {
              nivelVaga = 'Sênior';
            }
            if (titulo && link) {
              vagas.push({
                titulo,
                empresa: empresa || 'Empresa não informada',
                localizacao: localizacao || 'Remoto',
                salario: salario || 'A combinar',
                tecnologias: tecnologiasEncontradas.length > 0 ? tecnologiasEncontradas : ['Não especificado'],
                nivel: nivelVaga,
                link: link.startsWith('http') ? link : `${scrapingConfig.remotar.base}${link}`,
                fonte: 'Remotar'
              });
            }
          });
        } catch (error) {
          registrarAlerta('Remotar', `Falha ao tentar scraping na nova URL: ${novasUrls[0]} - ${error.message}`);
        }
      } else {
        registrarAlerta('Remotar', 'Nenhuma nova URL de vagas encontrada automaticamente. Ação humana necessária.');
      }
    }
    return vagas;
    
  } catch (error) {
    registrarAlerta('Remotar', 'Erro geral no scraping: ' + error.message);
    return [];
  }
}

// Função para fazer scraping do LinkedIn (simulado)
async function scrapeLinkedIn(tecnologias, nivel) {
  try {
    // Como o LinkedIn tem proteções anti-bot, vamos simular resultados
    const vagasSimuladas = [
      {
        titulo: 'Desenvolvedor Full Stack',
        empresa: 'Tech Solutions',
        localizacao: 'São Paulo, SP',
        salario: 'R$ 6.000 - 9.000',
        tecnologias: ['React', 'Node.js', 'JavaScript'],
        nivel: 'Pleno',
        link: 'https://linkedin.com/jobs/view/123456',
        fonte: 'LinkedIn'
      },
      {
        titulo: 'Frontend Developer',
        empresa: 'Digital Innovation',
        localizacao: 'Remoto',
        salario: 'R$ 4.500 - 7.000',
        tecnologias: ['React', 'TypeScript', 'CSS'],
        nivel: 'Júnior',
        link: 'https://linkedin.com/jobs/view/123457',
        fonte: 'LinkedIn'
      }
    ];
    
    return vagasSimuladas.filter(vaga => {
      const matchTecnologias = vaga.tecnologias.some(tech => 
        tecnologias.some(userTech => 
          userTech.toLowerCase().includes(tech.toLowerCase()) || 
          tech.toLowerCase().includes(userTech.toLowerCase())
        )
      );
      return matchTecnologias && vaga.nivel === nivel;
    });
  } catch (error) {
    console.error('Erro no scraping do LinkedIn:', error);
    return [];
  }
}

// Função para fazer scraping do Indeed
async function scrapeIndeed(tecnologias, nivel, localizacao) {
  try {
    const vagas = [];
    // Exemplo de URL de busca do Indeed (ajuste conforme necessário)
    const query = encodeURIComponent(tecnologias.join(' '));
    const url = `https://br.indeed.com/jobs?q=${query}&l=${encodeURIComponent(localizacao || '')}`;
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 10000
    });
    const $ = cheerio.load(response.data);
    // Ajuste os seletores conforme o HTML do Indeed
    $('.jobsearch-SerpJobCard, .result').each((i, el) => {
      const titulo = $(el).find('.jobtitle').text().trim() || $(el).find('h2').text().trim();
      const empresa = $(el).find('.company').text().trim();
      const localizacao = $(el).find('.location').text().trim();
      const link = 'https://br.indeed.com' + ($(el).find('a').attr('href') || '');
      const salario = $(el).find('.salaryText').text().trim();
      const descricao = $(el).find('.summary').text().trim();
      if (titulo && link) {
        vagas.push({
          titulo,
          empresa,
          localizacao,
          tecnologias,
          nivel,
          link,
          fonte: 'Indeed',
          area: '',
          salario,
          descricao
        });
      }
    });
    // Salvar vagas no MongoDB (evitar duplicatas pelo link)
    for (const vaga of vagas) {
      await Vaga.updateOne(
        { link: vaga.link },
        { $set: vaga },
        { upsert: true }
      );
    }
    return vagas;
  } catch (error) {
    console.error('Erro ao buscar vagas no Indeed:', error);
    return [];
  }
}

// Função para fazer scraping do site Gupy
async function scrapeGupy() {
  const axios = require('axios');
  const cheerio = require('cheerio');
  const vagas = [];
  try {
    // Exemplo: busca vagas de tecnologia na página principal do Gupy
    const url = 'https://portal.gupy.io/job-search/positions?term=tecnologia';
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 10000
    });
    const $ = cheerio.load(response.data);
    $('.sc-tilXH bXwqkq').each((i, el) => {
      const titulo = $(el).find('h2').text().trim();
      const empresa = $(el).find('.sc-hHLeRK').text().trim();
      const localizacao = $(el).find('.sc-dkPtRN').text().trim();
      const link = $(el).find('a').attr('href');
      if (titulo && link) {
        vagas.push({
          titulo,
          empresa: empresa || 'Empresa não informada',
          localizacao: localizacao || 'Remoto',
          salario: 'A combinar',
          tecnologias: ['Não especificado'],
          nivel: 'Não especificado',
          link: link.startsWith('http') ? link : `https://portal.gupy.io${link}`,
          fonte: 'Gupy'
        });
      }
    });
  } catch (error) {
    registrarAlerta('Gupy', `Erro ao acessar Gupy: ${error.message}`);
  }
  return vagas;
}

// Função principal para buscar vagas de múltiplas fontes
async function buscarVagas(perfil) {
  const { cargo, nivel, localizacao, tipo } = perfil;
  let todasVagas = [];
  let fontes = [];

  // Buscar vagas de múltiplas fontes em paralelo
  const resultados = await Promise.allSettled([
    scrapeIndeed(cargo, nivel, localizacao, tipo),
    scrapeRemotar(cargo, nivel, localizacao, tipo),
    scrapeLinkedIn(cargo, nivel, localizacao, tipo),
    scrapeGupy() // Adicionado scraping do Gupy
  ]);

  resultados.forEach((result, idx) => {
    if (result.status === 'fulfilled' && Array.isArray(result.value)) {
      todasVagas = todasVagas.concat(result.value);
      if (result.value.length > 0) {
        if (idx === 0) fontes.push('Indeed');
        if (idx === 1) fontes.push('Remotar');
        if (idx === 2) fontes.push('LinkedIn');
        if (idx === 3) fontes.push('Gupy'); // Adicionado Gupy às fontes
      }
    }
  });

  // Salvar todas as vagas no banco (evitar duplicatas pelo link)
  for (const vaga of todasVagas) {
    await Vaga.updateOne(
      { link: vaga.link },
      { $set: vaga },
      { upsert: true }
    );
  }

  // Buscar do banco de dados para garantir consistência
  let query = {};
  if (cargo) query.titulo = { $regex: cargo, $options: 'i' };
  if (nivel) query.nivel = nivel;
  if (localizacao) query.localizacao = { $regex: localizacao, $options: 'i' };
  if (tipo) query.tipo = { $regex: tipo, $options: 'i' };

  const vagasBanco = await Vaga.find(query).sort({ dataColeta: -1 }).limit(30);
  return { vagas: vagasBanco, total: vagasBanco.length, fontes };
}

module.exports = {
  buscarVagas,
  scrapeRemotar,
  scrapeLinkedIn,
  scrapeIndeed,
  scrapeGupy
}; 