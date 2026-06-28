# 🌸 Pretty Skin

> Realce o que te faz única ✨

**Pretty Skin** é um e-commerce de skincare brasileiro com chatbot de IA integrado. Desenvolvido como projeto acadêmico da disciplina de **Desenvolvimento Web Aplicada à Inteligência Artificial** no [PIT — Piauí Instituto de Tecnologia](https://www.pit.pi.gov.br/).

---

## 🎯 Funcionalidades

- ✅ Catálogo de produtos com busca em tempo real
- ✅ Carrinho de compras com painel lateral
- ✅ Hero carousel com autoplay e controle por toque
- ✅ Chatbot com IA (NVIDIA API + DeepSeek)
- ✅ Formulário de contato com validação
- ✅ Design responsivo (mobile first)
- ✅ Animações com Intersection Observer

---

## 🏗️ Estrutura do Projeto

```text
prettySkin/
│
├── index.html
│
├── assets/
│   ├── css/
│   │   ├── variables.css       ← tokens de design
│   │   └── style.css           ← estilos gerais
│   │
│   ├── js/
│   │   ├── main.js             ← carousel, header, carrinho, busca, formulário, animações
│   │   └── chat.js             ← módulo do chatbot IA
│   │
│   └── images/                 ← imagens dos produtos e hero
│
├── api/
│   └── chat.js                 ← Vercel Serverless Function (/api/chat)
│
├── .github/
│   ├── code-definitions.md     ← padrões de código
│   └── design-definitions.md   ← identidade visual
│
├── server.js                   ← servidor local para desenvolvimento
├── package.json
├── .env.example
└── README.md
```

---

## 🎨 Identidade Visual

### Paleta de Cores

| Elemento          | Cor             | Hex       |
|-------------------|-----------------|-----------|
| Primária          | Pink Forte      | `#E44F9C` |
| Secundária        | Pink Médio      | `#FF69B4` |
| Acento            | Dourado         | `#FCBB14` |
| Fundo             | Branco          | `#FFFFFF` |
| Fundo suave       | Rosa Névoa      | `#FDF5F9` |
| Texto principal   | Preto           | `#1C1C1C` |
| Texto secundário  | Ameixa Muted    | `#7A5F6E` |

**Gradiente principal:** `#E44F9C → #FCBB14`

### Tipografia

- **Títulos:** Playfair Display (elegante, literário)
- **Corpo:** Outfit (moderno, legível)

---

## 🛠️ Stack Tecnológico

| Camada       | Tecnologia                          |
|--------------|-------------------------------------|
| Markup       | HTML5 semântico                     |
| Estilos      | CSS3 (Grid, Flexbox, Custom Properties) |
| Scripts      | JavaScript vanilla ES6+ (módulos IIFE) |
| IA           | NVIDIA API + DeepSeek V4 Flash      |
| Deploy       | Vercel (CDN + Serverless Functions) |

---

## 🤖 Arquitetura da IA

O chatbot usa a **NVIDIA API** com o modelo `deepseek-ai/deepseek-v4-flash`.

A separação é clara:

```
Navegador → POST /api/chat → Vercel Serverless Function → NVIDIA API
```

Em produção, `api/chat.js` é uma Serverless Function no Vercel.
Em desenvolvimento local, `server.js` (Express) delega para a mesma função.

---

## 🚀 Como Rodar Localmente

### Pré-requisitos

- Node.js 18+
- Chave de API da NVIDIA

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/pretty-skin.git
cd pretty-skin

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env e insira sua NVIDIA_API_KEY

# 4. Rode o servidor local
npm run dev
```

Acesse em `http://localhost:3000`.

---

## ☁️ Deploy no Vercel

O Vercel detecta automaticamente a estrutura do projeto:

- Arquivos estáticos (`index.html`, `assets/`) → servidos via **CDN**
- Pasta `api/` → **Serverless Functions**

Não é necessário nenhum `vercel.json`.

Passos:

1. Faça o push do projeto para o GitHub
2. Importe o repositório no [Vercel](https://vercel.com)
3. Em **Environment Variables**, adicione `NVIDIA_API_KEY` com sua chave
4. Deploy ✅

---

## 📋 Padrões de Desenvolvimento

Consulte os documentos em `.github/`:

- [`code-definitions.md`](.github/code-definitions.md) — convenções de código, nomenclatura, padrões JS/CSS
- [`design-definitions.md`](.github/design-definitions.md) — paleta, tipografia, componentes, tokens

---

## 📦 Produtos Disponíveis

| Produto                              | Categoria         | Preço     |
|--------------------------------------|-------------------|-----------|
| Sérum Facial Vitamina C + Hialurônico | Tratamento Facial | R$ 89,90 |
| Hidratante Corporal de Macadâmia     | Hidratação        | R$ 59,90 |
| Esfoliante Facial de Argila Rosa     | Limpeza           | R$ 49,90 |
| Tônico Facial Água de Rosas          | Tonificação       | R$ 44,90 |
| Protetor Solar FPS 60 Toque Seco     | Proteção Solar    | R$ 74,90 |
| Óleo Facial Dourado Rosa Mosqueta    | Tratamento Noturno| R$ 99,90 |
| Máscara Facial Detox Carvão + Aloe   | Tratamento        | R$ 54,90 |
| Creme para Olhos Anti-Olheiras       | Contorno dos Olhos| R$ 79,90 |

---

## 📝 Licença

Este projeto está sob licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**Pretty Skin** — Nascemos no Piauí para cuidar de você. 🌸
