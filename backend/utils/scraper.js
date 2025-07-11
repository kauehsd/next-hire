const axios = require('axios');
const cheerio = require('cheerio');
const Vaga = require('../models/Vaga');

// Função para fazer scraping do site Remotar
async function scrapeRemotar(tecnologias, nivel) {
  try {
    const vagas = [];
    
    // URLs para diferentes páginas do Remotar
    const urls = [
      'https://remotar.com.br/vagas',
      'https://remotar.com.br/vagas?page=2',
      'https://remotar.com.br/vagas?page=3'
    ];

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
              link: link.startsWith('http') ? link : `https://remotar.com.br${link}`,
              fonte: 'Remotar'
            });
          }
        });
        
        // Aguardar um pouco entre as requisições para não sobrecarregar o servidor
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.log(`Erro ao fazer scraping de ${url}:`, error.message);
      }
    }
    
    return vagas;
    
  } catch (error) {
    console.error('Erro no scraping do Remotar:', error);
    return [];
  }
}

// Função para fazer scraping do LinkedIn (simulado)
async function scrapeLinkedIn(tecnologias, nivel) {
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

// Função principal para buscar vagas de múltiplas fontes
async function buscarVagas(perfil) {
  const { cargo, nivel, localizacao, tipo } = perfil;
  let todasVagas = [];
  let fontes = [];

  // Buscar vagas de múltiplas fontes em paralelo
  const resultados = await Promise.allSettled([
    scrapeIndeed(cargo, nivel, localizacao, tipo),
    scrapeRemotar(cargo, nivel, localizacao, tipo),
    scrapeLinkedIn(cargo, nivel, localizacao, tipo)
  ]);

  resultados.forEach((result, idx) => {
    if (result.status === 'fulfilled' && Array.isArray(result.value)) {
      todasVagas = todasVagas.concat(result.value);
      if (result.value.length > 0) {
        if (idx === 0) fontes.push('Indeed');
        if (idx === 1) fontes.push('Remotar');
        if (idx === 2) fontes.push('LinkedIn');
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
  scrapeIndeed
}; 