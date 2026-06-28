# Identidade Visual — Pretty Skin

> "Realce o que te faz única ✨"

Plataforma de e-commerce de skincare brasileira.
Personalidade: **feminina, sofisticada, acessível e confiante.**
Estética: **Glam Natural Moderno** — a sensação de uma boutique de beleza premium que também é para todo mundo.

---

## Paleta de Cores

| Papel             | Nome           | Hex       | Uso                                        |
|-------------------|----------------|-----------|--------------------------------------------|
| Primária          | Pink Forte     | `#E44F9C` | Logo, botões, destaques, links ativos      |
| Secundária        | Pink Médio     | `#FF69B4` | Hovers, gradientes, badges                 |
| Terciária         | Pink Claro     | `#FF97D9` | Elementos decorativos, ícones suaves       |
| Acento            | Dourado        | `#FCBB14` | CTAs principais, badge do carrinho, stars  |
| Acento claro      | Dourado Claro  | `#FFD463` | Hover do dourado, gradientes               |
| Fundo             | Branco         | `#FFFFFF` | Background geral                           |
| Fundo suave       | Rosa Névoa     | `#FDF5F9` | Seções alternadas, cards                   |
| Texto principal   | Preto          | `#1C1C1C` | Títulos, corpo de texto                    |
| Texto secundário  | Ameixa Muted   | `#7A5F6E` | Descrições, metadados, placeholders        |
| Borda             | Rosa Claro     | `#F0D6E8` | Divisores, bordas de input e card          |

**Gradiente principal:** `#E44F9C → #FCBB14` — botões primários, badges, destaques.\
**Gradiente de slide 1:** `#f5e6ee` · **Slide 2:** `#f0d8e7` · **Slide 3:** `#ebc9de` — fundos do hero carousel.

---

## Tipografia

| Papel      | Família                              | Pesos       |
|------------|--------------------------------------|-------------|
| Títulos    | Playfair Display, Georgia, serif     | 400, 600, 700 (+ italic 400) |
| Corpo      | Outfit, sans-serif                   | 300, 400, 500, 600 |

**Regra:** Playfair Display para headlines e elementos de marca. Outfit para qualquer texto corrido, label, botão ou UI element.

---

## Tokens de Design

Todos os tokens estão centralizados em `assets/css/variables.css`.

### Bordas Arredondadas

```css
--raio-sm:   8px;    /* inputs, badges pequenos */
--raio-md:   14px;   /* cards de produto, painéis */
--raio-lg:   24px;   /* seções, hero cards */
--raio-full: 9999px; /* pílulas, botões redondos, avatar */
```

### Sombras

```css
--sombra-sm:   0 2px 12px rgba(228, 79, 156, .10);  /* cards em repouso */
--sombra-md:   0 6px 28px rgba(228, 79, 156, .15);  /* cards em hover */
--sombra-lg:   0 12px 48px rgba(228, 79, 156, .22); /* modais, painéis */
--sombra-gold: 0 6px 24px rgba(252, 187, 20, .28);  /* botões dourados */
```

### Transição Padrão

```css
--t: .3s ease;
```

Usar `var(--t)` em todos os `transition`. Nunca valores hardcoded.

---

## Componentes

### Botão Primário

```css
background: linear-gradient(135deg, var(--pink-forte), var(--dourado));
color: var(--branco);
border-radius: var(--raio-full);
transition: opacity var(--t), transform var(--t);
```

Hover: `opacity: 0.92` + `transform: translateY(-1px)`

### Card de Produto

```css
background: var(--branco);
border: 1px solid var(--border);
border-radius: var(--raio-md);
box-shadow: var(--sombra-sm);
```

Hover: `box-shadow: var(--sombra-md)` + `transform: translateY(-4px)`

Conteúdo obrigatório: imagem · categoria · nome · descrição · preço · botão "+ Carrinho"

### Chatbot Widget

- Posição: `fixed bottom-right`
- Botão toggle: `56px × 56px`, gradiente principal, `border-radius: full`
- Janela: `320px wide`, `border-radius: var(--raio-lg)`, sombra `lg`
- Mensagem do bot: fundo `var(--bg-suave)`, texto `var(--preto)`
- Mensagem do usuário: fundo `var(--pink-forte)`, texto `var(--branco)`

---

## Elementos Visuais

**Usar:** texturas suaves, gradientes rosados, produtos bem fotografados em fundo neutro, tipografia elegante com contraste com sans-serif moderno.

**Evitar:** visual clínico/farmacêutico, verde (remete a medicamento), excesso de sombras pretas, ilustrações infantis, bordas cortadas demais.

**Imagens:** fundo branco ou nude para produtos. Fundo lifestyle suave (rosa, bege, natural) para hero e sobre.

---

## Tom de Comunicação

- **Voz:** amigável, direta, sem jargão excessivo
- **Chatbot:** simpático, breve (máx. 3 frases), sempre em português brasileiro
- **Microcopy:** positivo e encorajador — "Adicionado ao carrinho! 🛍️" em vez de "Item inserido."
