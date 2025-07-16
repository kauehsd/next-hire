# NextHire – Buscador de Vagas Inteligente

Sistema web inteligente que analisa o perfil do usuário e busca vagas em múltiplas fontes, recomendando oportunidades personalizadas.

## ✨ Funcionalidades

- **Perfil Personalizado:** Cadastro completo com tecnologias, nível, localização e pretensão salarial.
- **Busca Inteligente:** Web scraping de sites reais de vagas (Remotar, LinkedIn, etc).
- **Filtros Avançados:** Matching automático por tecnologias, nível e localização.
- **Interface Moderna:** Design responsivo em React, com gradientes e UX otimizada.
- **Sistema de Favoritos:** Salvar vagas interessantes no navegador.
- **Fallback Inteligente:** Dados mock quando scraping ou API falha.
- **Múltiplas Fontes:** Busca em diversos sites simultaneamente.

## 🛠️ Tecnologias

- **Frontend:** React, CSS3, FontAwesome, localStorage
- **Backend:** Node.js, Express, Mongoose, MongoDB Atlas, dotenv, cors, axios, cheerio, bcryptjs, nodemailer
- **Hospedagem:** Vercel (frontend), Render (backend), MongoDB Atlas (banco)
- **Extras:** Web scraping, API REST, variáveis de ambiente, deploy cloud

## 🚀 Como rodar

### 1. Instalar dependências
```bash
cd backend
npm install
cd ../frontend
npm install
```

### 2. Configurar variáveis de ambiente
No backend, crie um arquivo `.env`:
```
MONGODB_URI=...
PORT=3000
```

### 3. Iniciar backend
```bash
cd backend
npm start
```

### 4. Iniciar frontend
```bash
cd frontend
npm run dev
```

### 5. Deploy
- **Frontend:** Vercel
- **Backend:** Render
- **Banco:** MongoDB Atlas

## 🧩 Estrutura

```
buscador-vagas-inteligente/
├── frontend/      # React app
├── backend/       # Node.js/Express API
├── perfil/        # Dados de perfil de exemplo
├── README.md
```

## 🐞 Solução de Problemas

- **Erro de conexão com banco:** Verifique variável MONGODB_URI e IP liberado no Atlas.
- **API não responde:** Render pode estar dormindo, aguarde alguns segundos.
- **Vagas não aparecem:** Veja logs do backend e do Atlas.

## 📋 Roadmap

- [ ] Melhorar acessibilidade
- [ ] Adicionar mais fontes de vagas
- [ ] Notificações por email
- [ ] Dashboard de estatísticas

---

Contribuições são bem-vindas! 

---

## Observação Final

Este projeto foi desenvolvido como portfólio para demonstrar habilidades em React, Node.js, MongoDB, scraping e integração cloud. O NextHire está pronto para uso e expansão, mas foi pausado devido à limitação de APIs públicas de grandes portais de vagas e à necessidade de parcerias para escalar comercialmente. Sinta-se à vontade para explorar, clonar e evoluir o sistema! 