'use strict';

// Carrossel/Hero

const CAROUSEL = (() => {
  const slides     = document.querySelectorAll('.carousel-slide');
  const dots       = document.querySelectorAll('.dot');
  let   indiceAtual = 0;
  let   timer       = null;
  const INTERVALO   = 5000; // troca automática a cada 5s

  // Ativa o slide de índice `n`, desativa os demais
  function irParaSlide(n) {
    slides[indiceAtual].classList.remove('active');
    dots[indiceAtual].classList.remove('active');
    dots[indiceAtual].setAttribute('aria-selected', 'false');

    indiceAtual = (n + slides.length) % slides.length;

    slides[indiceAtual].classList.add('active');
    dots[indiceAtual].classList.add('active');
    dots[indiceAtual].setAttribute('aria-selected', 'true');
  }

  /** Avança (+1) ou volta (-1) */
  function moverSlide(direcao) {
    irParaSlide(indiceAtual + direcao);
    reiniciarTimer();
  }

  function reiniciarTimer() {
    clearInterval(timer);
    timer = setInterval(() => moverSlide(1), INTERVALO);
  }

  function init() {
    if (!slides.length) return;

    // Garante que apenas o primeiro slide começa ativo
    slides.forEach((s, i) => s.classList.toggle('active', i === 0));
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === 0);
      d.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    });

    reiniciarTimer();

    // Botões prev/next via addEventListener
    const btnPrev = document.querySelector('.carousel-btn.prev');
    const btnNext = document.querySelector('.carousel-btn.next');
    btnPrev?.addEventListener('click', () => { moverSlide(-1); reiniciarTimer(); });
    btnNext?.addEventListener('click', () => { moverSlide(1);  reiniciarTimer(); });

    // Dots via addEventListener
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { irParaSlide(i); reiniciarTimer(); });
    });

    // Pausa ao passar o mouse sobre o carousel
    const hero = document.querySelector('.carousel-hero');
    if (hero) {
      hero.addEventListener('mouseenter', () => clearInterval(timer));
      hero.addEventListener('mouseleave', reiniciarTimer);
    }

    let touchStartX = 0;
    hero?.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
      clearInterval(timer); // pausa o timer durante o toque, igual ao mouseenter
    }, { passive: true });
    hero?.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) moverSlide(diff > 0 ? 1 : -1);
      else reiniciarTimer(); // sem swipe detectado: reinicia o timer
    });
  }

  return { init, irParaSlide, moverSlide };
})();



// Cabeçalho
const HEADER = (() => {
  const nav        = document.getElementById('headerNav');
  const navLinks   = document.querySelectorAll('.header-nav a');
  const sections   = document.querySelectorAll('section[id], footer[id]');
  let   lastScroll = 0;

  // Esconde/mostra a barra de nav ao rolar
  function onScroll() {
    const currentScroll = window.scrollY;
    const scrollingDown = currentScroll > lastScroll;

    if (nav) {
      if (scrollingDown && currentScroll > 80) {
        nav.classList.add('nav-hidden');
      } else if (!scrollingDown) {
        nav.classList.remove('nav-hidden');
      }
    }

    lastScroll = currentScroll <= 0 ? 0 : currentScroll;
    atualizarLinkAtivo();
  }

  /** Marca o link cujo destino está na viewport */
  function atualizarLinkAtivo() {
    let atualId = '';

    sections.forEach(sec => {
      const topo = sec.getBoundingClientRect().top;
      if (topo <= 160) atualId = sec.id;
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('ativo', href === `#${atualId}`);
    });
  }

  function init() {
    if (!nav) return;
    window.addEventListener('scroll', onScroll, { passive: true });
    atualizarLinkAtivo(); // executa uma vez ao carregar
  }

  return { init };
})();


// Carrinho

const CARRINHO = (() => {
  const badge = document.getElementById('cartBadge');
  let   total = 0;
  // Mapa: nome do produto -> quantidade
  const itens = {};

  // Abre o painel lateral do carrinho
  function abrirPainel() {
    const painel  = document.getElementById('carrinhopainel');
    const overlay = document.getElementById('carrinhoOverlay');
    if (!painel) return;
    painel.classList.add('aberto');
    overlay?.classList.add('ativo');
    document.body.style.overflow = 'hidden'; // trava o scroll do body
  }

  // Fecha o painel lateral do carrinho
  function fecharPainel() {
    const painel  = document.getElementById('carrinhopainel');
    const overlay = document.getElementById('carrinhoOverlay');
    if (!painel) return;
    painel.classList.remove('aberto');
    overlay?.classList.remove('ativo');
    document.body.style.overflow = '';
  }

  // Atualiza a lista de itens renderizada no painel
  function renderizarItens() {
    const lista = document.getElementById('carrinhoItens');
    if (!lista) return;

    lista.innerHTML = '';

    const nomes = Object.keys(itens);
    if (!nomes.length) {
      lista.innerHTML = '<p class="carrinho-vazio">Seu carrinho está vazio.</p>';
      return;
    }

    nomes.forEach(nome => {
      const div = document.createElement('div');
      div.className = 'carrinho-item';
      div.innerHTML = `
        <span class="carrinho-item-nome">${nome}</span>
        <span class="carrinho-item-qtd">× ${itens[nome]}</span>
      `;
      lista.appendChild(div);
    });
  }

  // Incrementa o contador e anima o badge 
  function adicionar(nomeProduto) {
    total++;
    itens[nomeProduto] = (itens[nomeProduto] || 0) + 1;

    if (badge) {
      badge.textContent = total;
      badge.classList.remove('ping');
      void badge.offsetWidth;
      badge.classList.add('ping');
    }

    renderizarItens();
    mostrarNotificacao(`"${nomeProduto}" adicionado ao carrinho!`);
  }

  // Toast de confirmação no canto superior direito 
  function mostrarNotificacao(texto) {
    const toast = document.createElement('div');
    toast.className = 'toast-notificacao';
    toast.textContent = texto;
    document.body.appendChild(toast);

    // Anima entrada
    requestAnimationFrame(() => toast.classList.add('toast-visivel'));

    // Remove após 3 s
    setTimeout(() => {
      toast.classList.remove('toast-visivel');
      toast.addEventListener('transitionend', () => toast.remove());
    }, 3000);
  }

  function init() {
    // Botão do ícone de carrinho no header -> abre o painel
    const btnCarrinho = document.getElementById('btnCarrinho');
    btnCarrinho?.addEventListener('click', abrirPainel);

    // Botão fechar dentro do painel
    const btnFechar = document.getElementById('carrinhoFechar');
    btnFechar?.addEventListener('click', fecharPainel);

    // Overlay também fecha o painel ao clicar fora
    const overlay = document.getElementById('carrinhoOverlay');
    overlay?.addEventListener('click', fecharPainel);

    // Delega o clique nos botões "+ Carrinho" de todos os cards
    document.querySelectorAll('.btn-adicionar').forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.card-produto');
        const nome = card?.querySelector('h3')?.textContent || 'Produto';
        adicionar(nome);
      });
    });
  }

  return { init, adicionar };
})();


// Busca
const BUSCA = (() => {
  const input = document.getElementById('buscaInput');
  const cards = () => document.querySelectorAll('.card-produto');

  function filtrar(termo) {
    const t = termo.trim().toLowerCase();
    cards().forEach(card => {
      const nome      = card.querySelector('h3')?.textContent.toLowerCase()      || '';
      const categoria = card.querySelector('.card-categoria')?.textContent.toLowerCase() || '';
      const descricao = card.querySelector('.card-descricao')?.textContent.toLowerCase() || '';
      const encontrou = !t || nome.includes(t) || categoria.includes(t) || descricao.includes(t);
      card.style.opacity   = encontrou ? '1' : '0.25';
      card.style.transform = encontrou ? '' : 'scale(0.97)';
    });
  }

  function init() {
    if (!input) return;

    input.addEventListener('input', e => filtrar(e.target.value));

    // Botão de busca (lupa no header)
    const btnBusca = input.closest('.header-seach')?.querySelector('button');
    btnBusca?.addEventListener('click', () => {
        if (input.value.trim()) {
        document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' });
      }
    });

    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && input.value.trim()) {
        document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  return { init };
})();


// Formulário de Contato

const FORMULARIO = (() => {
  function enviarFormulario(event) {
    event.preventDefault();

    const form    = event.target;
    const btn     = form.querySelector('.btn-enviar');
    const nome    = form.nome.value.trim();
    const email   = form.email.value.trim();
    const assunto = form.assunto.value;

    // Validação básica
    if (!assunto) {
      mostrarFeedback(form, 'Por favor, selecione um assunto.', 'erro');
      return;
    }

    // Simula o envio 
    btn.textContent = 'Enviando…';
    btn.disabled    = true;

    setTimeout(() => {
      const sucesso = true;

      if (sucesso) {
        mostrarFeedback(
          form,
          `Obrigado, ${nome}! Recebemos sua mensagem e responderemos em breve para ${email}. 💌`,
          'sucesso'
        );
        form.reset();
      } else {
        mostrarFeedback(
          form,
          'Ops! Ocorreu um erro ao enviar sua mensagem. Tente novamente ou ligue para (86) 99999-0000.',
          'erro'
        );
      }

      btn.textContent = 'Enviar mensagem';
      btn.disabled    = false;
    }, 1400);
  }

  function mostrarFeedback(form, texto, tipo) {
    // Remove feedback anterior
    form.querySelector('.form-feedback')?.remove();

    const el = document.createElement('p');
    el.className = `form-feedback form-feedback--${tipo}`;
    el.textContent = texto;
    form.appendChild(el);

    // Auto-remove após 6 s
    setTimeout(() => el.remove(), 6000);
  }

  function init() {
    // Vincula ao submit do form via addEventListener
    const form = document.getElementById('contatoForm');
    form?.addEventListener('submit', enviarFormulario);
  }

  return { init };
})();


// Chatbot
const CHATBOT = (() => {
  let btnToggle, widget, mensagens, inputChat, btnEnviar;

  /* ── Base de conhecimento genérica ─────────────────────────── */
  const BASE = [
    {
      gatilhos: ['oi', 'olá', 'ola', 'hey', 'hello', 'bom dia', 'boa tarde', 'boa noite'],
      resposta: 'Olá! 💕 Seja bem-vinda à Pretty Skin! Como posso te ajudar hoje?'
    },
    {
      gatilhos: ['produto', 'creme', 'sérum', 'serum', 'hidratante', 'limpeza', 'esfoliante', 'tônico', 'tonico'],
      resposta: 'Temos uma linha completa de skincare! Confira nossa seção de Produtos para ver todos os itens disponíveis. Tem algum tipo de produto específico que procura? 🌸'
    },
    {
      gatilhos: ['preço', 'preco', 'valor', 'quanto custa', 'caro', 'barato', 'promoção', 'promocao', 'desconto'],
      resposta: 'Os preços estão todos indicados nos cards de cada produto. Também temos promoções especiais — fique de olho no nosso carrossel! 💛'
    },
    {
      gatilhos: ['frete', 'entrega', 'prazo', 'envio', 'receber', 'chegada'],
      resposta: 'Realizamos entregas para todo o Brasil! O prazo médio é de 5 a 10 dias úteis, dependendo da sua região. O frete grátis está disponível em pedidos acima de R$ 150. 🚚'
    },
    {
      gatilhos: ['pagamento', 'pix', 'cartão', 'cartao', 'boleto', 'parcel'],
      resposta: 'Aceitamos PIX, cartão de crédito (em até 12x) e boleto bancário. Pagamentos via PIX têm 5% de desconto! 💳'
    },
    {
      gatilhos: ['troca', 'devolução', 'devolucao', 'reembolso', 'arrependimento'],
      resposta: 'Nossa política de trocas e devoluções segue o Código de Defesa do Consumidor: você tem até 7 dias após o recebimento para solicitar. Entre em contato pela seção Contato do nosso site! 🔄'
    },
    {
      gatilhos: ['pele', 'tipo de pele', 'oleosa', 'seca', 'mista', 'sensível', 'sensivel', 'acne'],
      resposta: 'Temos produtos formulados para todos os tipos de pele: oleosa, seca, mista e sensível. Me conta mais sobre a sua pele que posso te indicar melhor! 🌿'
    },
    {
      gatilhos: ['ingrediente', 'formula', 'fórmula', 'composição', 'composicao', 'natural', 'vegano', 'cruelty'],
      resposta: 'Todos os nossos produtos são formulados com ingredientes naturais e livres de parabenos. Somos uma marca cruelty-free e comprometida com a sustentabilidade! 🌱'
    },
    {
      gatilhos: ['contato', 'telefone', 'email', 'whatsapp', 'atendimento', 'falar', 'humano'],
      resposta: 'Você pode nos contatar pelo formulário na seção Contato, ou pelo telefone (86) 99999-0000, de segunda a sexta das 8h às 18h. Adoramos ouvir você! 💌'
    },
    {
      gatilhos: ['sobre', 'empresa', 'marca', 'historia', 'história', 'fundação', 'fundacao'],
      resposta: 'A Pretty Skin nasceu com um propósito: trazer skincare de qualidade para todo mundo, com ingredientes naturais e preços acessíveis. Conheça mais na seção Sobre nós! ✨'
    },
    {
      gatilhos: ['obrigada', 'obrigado', 'valeu', 'thanks', 'grata'],
      resposta: 'De nada! Estou aqui sempre que precisar. Cuide-se bem! 💕'
    },
    {
      gatilhos: ['tchau', 'até', 'ate', 'bye', 'adeus', 'xau'],
      resposta: 'Até logo! Que sua pele esteja sempre radiante! 🌸✨'
    },
  ];

  // ── Motor de resposta ──────────────────────────────────────── 
  /**
   * TODO: Quando a API estiver pronta, substitua esta função por uma
   * chamada assíncrona ao endpoint, por exemplo:
   *
   *   async function obterResposta(texto) {
   *     const res = await fetch('https://api.openai.com/v1/chat/completions', { ... });
   *     const data = await res.json();
   *     return data.choices[0].message.content;
   *   }
   */
  function obterResposta(texto) {
    const t = texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    for (const item of BASE) {
      if (item.gatilhos.some(g => t.includes(g))) {
        return item.resposta;
      }
    }

    // Resposta padrão
    return 'Hmm, não tenho certeza sobre isso ainda! 😊 Mas você pode falar com nossa equipe pelo formulário de Contato ou pelo telefone (86) 99999-0000. Ficamos felizes em ajudar!';
  }

  // ── Renderização de mensagens ────────────────────────────────
  function adicionarMensagem(texto, tipo) {
    const div = document.createElement('div');
    div.className = tipo === 'bot' ? 'msg-bot' : 'msg-user';
    div.textContent = texto;
    mensagens.appendChild(div);
    mensagens.scrollTop = mensagens.scrollHeight;
  }

  /** Indicador de "digitando..." */
  function mostrarDigitando() {
    const div = document.createElement('div');
    div.className = 'msg-bot msg-digitando';
    div.id = 'msg-digitando';
    div.textContent = '●●●';
    mensagens.appendChild(div);
    mensagens.scrollTop = mensagens.scrollHeight;
    return div;
  }

  function removerDigitando() {
    document.getElementById('msg-digitando')?.remove();
  }

  // ── Envio de mensagem ──────────────────────────────────────── 
  function enviarMensagem() {
    const texto = inputChat?.value.trim();
    if (!texto) return;

    adicionarMensagem(texto, 'user');
    inputChat.value = '';

    // Simula latência de IA
    const digitando = mostrarDigitando();
    setTimeout(() => {
      removerDigitando();
      adicionarMensagem(obterResposta(texto), 'bot');
    }, 800 + Math.random() * 600);
  }

  // ── Toggle do widget ───────────────────────────────────────── 
  function toggleChat() {
    const aberto = !widget.classList.contains('hidden');
    widget.classList.toggle('hidden', aberto);
    btnToggle.textContent = aberto ? '💬' : '✕';
    btnToggle.setAttribute('aria-expanded', String(!aberto));

    if (!aberto) inputChat?.focus();
  }

  function init() {
    btnToggle  = document.getElementById('chat-toggle');
    widget     = document.getElementById('chat');
    mensagens  = document.getElementById('chatMessages');
    inputChat  = document.getElementById('chatInput');
    btnEnviar  = widget?.querySelector('.chat-input button');

    if (!btnToggle || !widget) return;

    btnToggle.addEventListener('click', toggleChat);

    btnEnviar?.addEventListener('click', enviarMensagem);

    inputChat?.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        enviarMensagem();
      }
    });
  }

  return { init };
})();


// Animações
const ANIMACOES = (() => {
  const ELEMENTOS = [
    '.card-produto',
    '.secao-titulo',
    '.section-header',
    '.sobre-texto',
    '.sobre-imagem',
    '.contato-info',
    '.contato-form',
    '.valor-item',
    '.contato-detalhe',
  ];

  function init() {
    const alvo = document.querySelectorAll(ELEMENTOS.join(', '));

    if (!alvo.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visivel');
            observer.unobserve(entry.target); // anima só uma vez
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    alvo.forEach((el, i) => {
      el.classList.add('animar');
      if (el.classList.contains('card-produto')) {
        el.style.transitionDelay = `${(i % 4) * 80}ms`;
      }
      observer.observe(el);
    });
  }

  return { init };
})();


// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  CAROUSEL.init();
  HEADER.init();
  CARRINHO.init();
  BUSCA.init();
  FORMULARIO.init();
  CHATBOT.init();
  ANIMACOES.init();
});
