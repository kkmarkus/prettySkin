# Pretty Skin 🌸

E-commerce de skincare brasileiro com chatbot de atendimento integrado à IA.

---

## Visão geral

A **Pretty Skin** é uma loja virtual de cosméticos e skincare desenvolvida com foco em design elegante, experiência de usuário fluida e atendimento inteligente via chatbot. O projeto integra um backend Node.js com a API da NVIDIA NIM (modelo DeepSeek) para responder dúvidas dos clientes em tempo real sobre os produtos da loja.

---

## Funcionalidades

- **Carrossel hero** com troca automática, controle por botões, dots e swipe touch
- **Catálogo de produtos** com cards animados e botão de adicionar ao carrinho
- **Carrinho lateral** com controle de quantidade, total em tempo real e badge animado
- **Busca** por nome de produto com filtragem instantânea
- **Formulário de contato** com validação e feedback visual
- **Chatbot com IA** integrado via API da NVIDIA NIM (DeepSeek V4 Flash)
- **Animações de entrada** via IntersectionObserver
- **Design responsivo** com paleta pink/dourado e tipografia Playfair Display + Outfit
- **Navegação inteligente** com link ativo por seção e header que oculta ao rolar

---

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Frontend | HTML5, CSS3, JavaScript (ES6+) |
| Backend | Node.js + Express |
| IA | NVIDIA NIM API — modelo `deepseek-ai/deepseek-v4-flash` |
| HTTP Client (IA) | SDK OpenAI (compatível com NVIDIA NIM) |
| Variáveis de ambiente | dotenv |
| CORS | cors |

---

## Estrutura do projeto

```
prettySkin/
├── images/                      # Imagens dos produtos e banners
│   ├── serum-vitamina-c.jpeg
│   ├── hidratante-corporal.jpeg
│   ├── esfoliante-facial.jpeg
│   ├── tonico-facial.jpeg
│   ├── protetor-solar.jpeg
│   ├── banner-hero-1.jpeg
│   ├── banner-hero-2.jpeg
│   └── banner-hero-3.jpeg
├── index.html                   # Estrutura da página
├── style.css                    # Estilos e design system
├── script.js                    # Lógica do frontend (carrossel, carrinho, chatbot)
├── server.js                    # Servidor Express + integração com API de IA
├── package.json
├── .env                         # Variáveis de ambiente (não versionado)
└── .gitignore
```

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- Chave de API da NVIDIA NIM — obtenha gratuitamente em [build.nvidia.com](https://build.nvidia.com)

---

## Instalação e execução

```bash
# 1. Clone o repositório
git clone https://github.com/kkmarkus/prettySkin.git
cd prettySkin

# 2. Instale as dependências
npm install

# 3. Crie o arquivo de variáveis de ambiente
cp .env.example .env
# Edite o .env e adicione sua chave da NVIDIA

# 4. Inicie o servidor
npm start
```

Acesse em: `http://localhost:3000`

Para desenvolvimento com hot reload:

```bash
npm run dev
```

---

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
NVIDIA_API_KEY=nvapi-sua_chave_aqui
PORT=3000
```

> ⚠️ **Nunca versione o arquivo `.env`.** Ele já está listado no `.gitignore`.

---

## Produtos disponíveis

| Produto | Preço |
|---|---|
| Sérum Facial Vitamina C 15% + Hialurônico | R$ 89,90 |
| Hidratante Corporal Óleo de Macadâmia e amêndoas | R$ 59,90 |
| Esfoliante Facial Argila Rosa | R$ 49,90 |
| Tônico Facial Água de Rosas + Niacinamida 5% | R$ 44,90 |
| Protetor Solar FPS 60 Acabamento Matte | R$ 74,90 |
| Creme Noturno Regenerador | R$ 79,90 |

---

## Chatbot

O chatbot é acionado pelo botão flutuante no canto inferior direito da página. Ele é alimentado pelo modelo **DeepSeek V4 Flash** via NVIDIA NIM e responde dúvidas sobre produtos, ingredientes, preços e orientações gerais de skincare, sempre em português e com tom simpático.

A comunicação segue o fluxo:

```
Usuário → frontend (script.js)
       → POST /api/chat (server.js)
       → NVIDIA NIM API (DeepSeek V4 Flash)
       → resposta exibida no chat
```

---

## Scripts disponíveis

```bash
npm start      # Inicia o servidor em produção
npm run dev    # Inicia com hot reload (node --watch)
```

---

## Branches

| Branch | Descrição |
|---|---|
| `main` | Versão estável |
| `feat/chatbot-nvidia` | Integração do chatbot com NVIDIA NIM + imagens dos produtos |

---

## Licença

Este projeto foi desenvolvido para fins acadêmicos e de portfólio.

---

*Feito no Piauí* 🌸
