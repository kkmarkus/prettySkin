# Padrões de Código — Pretty Skin

## Objetivo

Este documento define os padrões de desenvolvimento do projeto Pretty Skin.

Todos os desenvolvedores e agentes de IA devem seguir estas convenções para garantir:

- Organização
- Manutenibilidade
- Legibilidade
- Consistência do código

---

## Estrutura de Pastas

```text
prettySkin/
│
├── index.html
│
├── assets/
│   ├── css/
│   │   ├── variables.css       ← tokens de design (cores, tipografia, espaçamentos)
│   │   └── style.css           ← todos os estilos (importa variables.css)
│   │
│   ├── js/
│   │   ├── main.js             ← carousel, header, carrinho, busca, formulário, animações
│   │   └── chat.js             ← módulo do chatbot IA
│   │
│   └── images/                 ← imagens dos produtos e hero
│
├── api/
│   └── chat.js                 ← serverless function (endpoint /api/chat)
│
├── server.js                   ← servidor Express para desenvolvimento local
├── package.json
├── .env.example
└── README.md
```

---

## Convenção de Nomes

### Arquivos

Utilizar `kebab-case`:

```text
variables.css
main.js
chat.js
```

### Classes CSS

Utilizar `kebab-case`:

```text
.card-produto
.card-info
.btn-adicionar
.chat-widget
```

### IDs HTML

Utilizar `kebab-case`, apenas para elementos únicos:

```html
id="buscaInput"
id="carrinhopainel"
id="chatMessages"
```

### Variáveis JavaScript

Utilizar `camelCase`:

```javascript
const indiceAtual = 0;
const inputChat = document.getElementById('chatInput');
```

### Constantes JavaScript

Utilizar `UPPER_SNAKE_CASE`:

```javascript
const INTERVALO = 5000;
const SYSTEM_PROMPT = `...`;
```

### Módulos JavaScript (IIFEs)

Utilizar `UPPER_SNAKE_CASE`:

```javascript
const CAROUSEL = (() => { ... })();
const CARRINHO = (() => { ... })();
const CHATBOT  = (() => { ... })();
```

---

## HTML

### Estrutura Semântica

Utilizar sempre os elementos corretos:

```html
<header>
<nav>
<main>
<section>
<article>
<footer>
<aside>
```

### Indentação

2 espaços.

### Atributos obrigatórios em imagens

```html
<img src="assets/images/produto.jpeg" alt="Descrição do produto" loading="lazy">
```

---

## CSS

### Organização em `style.css`

Ordem obrigatória:

```
1. @import "./variables.css"
2. Reset
3. Layout base (body, .container)
4. Componentes por seção (header, hero, produtos, sobre, contato, footer)
5. Componentes flutuantes (carrinho, chatbot, toast)
6. Animações e utilitários
7. Responsividade (@media queries)
```

### Variáveis

Todas as cores, fontes, sombras e espaçamentos ficam **exclusivamente** em `variables.css`.
Nunca usar valores hardcoded no `style.css` para propriedades que já têm variável definida:

```css
/* ✅ correto */
color: var(--pink-forte);
border-radius: var(--raio-md);

/* ❌ evitar */
color: #E44F9C;
border-radius: 14px;
```

---

## JavaScript

### Padrão de módulo (IIFE)

Cada funcionalidade é um módulo IIFE com método `init()` público:

```javascript
const NOME_MODULO = (() => {
  // estado interno privado
  let variavel = null;

  // funções internas privadas
  function fazer() { ... }

  // inicialização pública
  function init() {
    // query seletores e event listeners aqui
  }

  return { init };
})();
```

### Separação de responsabilidades

- `main.js` — interface: carousel, header, carrinho, busca, formulário de contato, animações
- `chat.js` — chatbot: comunicação com `/api/chat`, renderização de mensagens

### Eventos

Separar handlers de lógica:

```javascript
// ✅ correto
function enviarMensagem() { ... }
inputChat.addEventListener('keydown', e => {
  if (e.key === 'Enter') enviarMensagem();
});

// ❌ evitar
inputChat.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    // lógica toda inline
  }
});
```

---

## API (Serverless)

O endpoint `/api/chat` é implementado em `api/chat.js` como uma Vercel Serverless Function.

- Aceita apenas `POST`
- Corpo: `{ mensagem: string }`
- Resposta de sucesso: `{ resposta: string }`
- Resposta de erro: `{ erro: string }`

Para desenvolvimento local, o `server.js` delega para a mesma função:

```javascript
app.post('/api/chat', (req, res) => chatHandler(req, res));
```

---

## Boas Práticas

- HTML semântico sempre
- Sem CSS inline
- Sem JavaScript inline
- Funções pequenas com uma responsabilidade
- Nomes descritivos — o código deve se auto-documentar
- `loading="lazy"` em todas as imagens abaixo do fold
- `aria-label` em botões sem texto visível
