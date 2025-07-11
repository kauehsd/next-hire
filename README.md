# Buscador de Vagas Inteligente

Sistema web inteligente que analisa o perfil do usuário e busca vagas na internet, recomendando oportunidades personalizadas para inscrição.

## ✨ Funcionalidades

- **Perfil Personalizado**: Cadastro completo com tecnologias, nível, localização e pretensão salarial
- **Busca Inteligente**: Web scraping de sites reais de vagas (Remotar, LinkedIn)
- **Filtros Avançados**: Matching automático por tecnologias, nível e localização
- **Interface Moderna**: Design responsivo com cores claras e UX otimizada
- **Sistema de Favoritos**: Salvar vagas interessantes no navegador
- **Fallback Inteligente**: Dados mock quando scraping falha
- **Múltiplas Fontes**: Busca em diversos sites simultaneamente

## 🛠️ Tecnologias

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js + Express
- **Scraping**: Axios + Cheerio
- **Design**: CSS Grid, Flexbox, Gradientes modernos

## 📁 Estrutura

```
buscador-vagas-inteligente/
├── frontend/
│   ├── index.html          # Interface principal
│   ├── script.js           # Lógica do frontend
│   └── style.css           # Estilos modernos e responsivos
├── backend/
│   ├── app.js              # Servidor Express
│   ├── config.js           # Configurações do projeto
│   ├── routes/
│   │   └── vagas.js        # Rotas da API
│   └── utils/
│       ├── filtroVagas.js  # Lógica de filtragem
│       └── scraper.js      # Web scraping de vagas
├── perfil/
│   └── usuario.json        # Perfil do usuário
├── .gitignore
└── README.md
```

## 🚀 Como rodar

### 1. Instalar dependências
```bash
cd backend
npm install
```

### 2. Configurar perfil
Edite o arquivo `perfil/usuario.json` ou use a interface web:
```json
{
  "nome": "Seu Nome",
  "email": "seu@email.com",
  "tecnologias": ["JavaScript", "React", "Node.js"],
  "localizacao": "São Paulo, SP",
  "nivel": "Pleno"
}
```

### 3. Iniciar servidor
```bash
cd backend
npm start
```

### 4. Acessar aplicação
Abra o arquivo `frontend/index.html` no navegador ou use um servidor local.

## 🔧 Configuração

### Variáveis de Ambiente
Crie um arquivo `.env` no backend (opcional):
```env
PORT=3000
NODE_ENV=development
SCRAPING_TIMEOUT=10000
```

### Personalização
- **Cores**: Edite as variáveis CSS em `frontend/style.css`
- **Fontes de vagas**: Configure URLs em `backend/config.js`
- **Filtros**: Ajuste lógica em `backend/utils/filtroVagas.js`

## 📊 Fluxo do Sistema

1. **Cadastro de Perfil**: Usuário define tecnologias, nível e localização
2. **Busca Inteligente**: Sistema faz scraping de múltiplos sites
3. **Filtragem Avançada**: Vagas são filtradas por relevância
4. **Apresentação**: Interface mostra vagas recomendadas
5. **Interação**: Usuário pode favoritar e acessar vagas

## 🎯 Algoritmo de Matching

O sistema usa um algoritmo inteligente que considera:
- **Tecnologias**: Matching por palavras-chave e sinônimos
- **Nível**: Júnior, Pleno, Sênior
- **Localização**: Remoto, presencial ou híbrido
- **Relevância**: Ordenação por número de tecnologias em comum

## 🔒 Segurança e Ética

- **Rate Limiting**: Delays entre requisições para não sobrecarregar sites
- **User-Agent**: Headers apropriados para identificação
- **Fallback**: Sistema funciona mesmo se scraping falhar
- **Respeito**: Apenas dados públicos são coletados

## 🚧 Limitações

- Alguns sites podem ter proteções anti-bot
- Dependência da estrutura HTML dos sites
- Necessidade de atualização periódica dos seletores

## 🔄 Próximas Funcionalidades

- [ ] Cache de resultados
- [ ] Mais sites de vagas
- [ ] Notificações por email
- [ ] Dashboard de estatísticas
- [ ] API pública
- [ ] Sistema de login

## 📝 Licença

MIT License - veja o arquivo LICENSE para detalhes.

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor, leia as diretrizes de contribuição antes de submeter um PR. 