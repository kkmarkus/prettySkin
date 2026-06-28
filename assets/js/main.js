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

  // Avança (+1) ou volta (-1)
  function moverSlide(direcao) {
    irParaSlide(indiceAtual + direcao);
    reiniciarTimer(); // chamado uma única vez 
  }

  function reiniciarTimer() {
    clearInterval(timer);
    timer = setInterval(() => irParaSlide(indiceAtual + 1), INTERVALO);
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

    const btnPrev = document.querySelector('.carousel-btn.prev');
    const btnNext = document.querySelector('.carousel-btn.next');
    btnPrev?.addEventListener('click', () => { moverSlide(-1); });
    btnNext?.addEventListener('click', () => { moverSlide(1);  });

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
      clearInterval(timer);
    }, { passive: true });
    hero?.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) moverSlide(diff > 0 ? 1 : -1);
      else reiniciarTimer();
    }, { passive: true });

    // Pausa o timer quando a aba sai de foco
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) clearInterval(timer);
      else reiniciarTimer();
    });
  }

  return { init, irParaSlide, moverSlide };
})();



// Cabeçalho
const HEADER = (() => {
  const nav        = document.getElementById('headerNav');
  const navLinks   = document.querySelectorAll('.header-nav a');
  const sections   = document.querySelectorAll('section[id]');
  let   lastScroll = 0;

  // Esconde/mostra a barra de nav ao rolar
  let scrollTicking = false;

  function onScroll() {
    if (scrollTicking) return;
    scrollTicking = true;

    requestAnimationFrame(() => {
      const currentScroll = window.scrollY;
      const delta         = currentScroll - lastScroll;
      const LIMIAR         = 6;

      if (nav && Math.abs(delta) > LIMIAR) {
        const scrollingDown = delta > 0;

        if (scrollingDown && currentScroll > 80) {
          nav.classList.add('nav-hidden');
        } else if (!scrollingDown) {
          nav.classList.remove('nav-hidden');
        }

        lastScroll = currentScroll <= 0 ? 0 : currentScroll;
      }

      atualizarLinkAtivo();
      scrollTicking = false;
    });
  }

  // Marca o link cujo destino está na viewport
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
  // Mapa: nome do produto -> { qtd, preco }
  const itens = {};

  // Recalcula e exibe o total
  function atualizarTotal() {
    const totalSpan = document.getElementById('carrinhoTotal');
    if (!totalSpan) return;
    const soma = Object.values(itens).reduce((acc, it) => acc + it.preco * it.qtd, 0);
    totalSpan.textContent = soma.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  // Atualiza badge com a soma de quantidades
  function atualizarBadge(animar = false) {
    if (!badge) return;
    const total = Object.values(itens).reduce((acc, it) => acc + it.qtd, 0);
    badge.textContent = total;
    if (animar) {
      badge.classList.remove('ping');
      void badge.offsetWidth;
      badge.classList.add('ping');
    }
  }

  // Abre o painel lateral do carrinho
  function abrirPainel() {
    const painel  = document.getElementById('carrinhopainel');
    const overlay = document.getElementById('carrinhoOverlay');
    if (!painel) return;
    painel.classList.add('aberto');
    overlay?.classList.add('ativo');
    document.body.style.overflow = 'hidden';
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
      atualizarTotal();
      return;
    }

    nomes.forEach(nome => {
      const div = document.createElement('div');
      div.className = 'carrinho-item';
         const subtotal = (itens[nome].preco * itens[nome].qtd)
        .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      div.innerHTML = `
        <div class="carrinho-item-info">
          <span class="carrinho-item-nome">${nome}</span>
          <span class="carrinho-item-preco">${subtotal}</span>
        </div>
        <div class="carrinho-item-controles">
          <button type="button" class="btn-qtd btn-qtd-menos" data-nome="${nome}" aria-label="Diminuir quantidade">−</button>
          <span class="carrinho-item-qtd">${itens[nome].qtd}</span>
          <button type="button" class="btn-qtd btn-qtd-mais" data-nome="${nome}" aria-label="Aumentar quantidade">+</button>
        </div>
      `;
      lista.appendChild(div);
    });

    // Delegação de eventos nos botões de quantidade
    lista.querySelectorAll('.btn-qtd').forEach(btn => {
      btn.addEventListener('click', () => {
        const nome = btn.dataset.nome;
        if (!itens[nome]) return;
        if (btn.classList.contains('btn-qtd-mais')) {
          itens[nome].qtd++;
        } else {
          itens[nome].qtd--;
          if (itens[nome].qtd <= 0) delete itens[nome];
        }
        atualizarBadge();
        renderizarItens();
      });
    });

    atualizarTotal();
  }

  // Incrementa o contador e anima o badge
  function adicionar(nomeProduto, preco = 0) {
    if (!itens[nomeProduto]) {
      itens[nomeProduto] = { qtd: 0, preco };
    }
    itens[nomeProduto].qtd++;

    atualizarBadge(true);
    renderizarItens();
    mostrarNotificacao(`"${nomeProduto}" adicionado ao carrinho!`);
  }

  // Toast de confirmação no canto superior direito
  function mostrarNotificacao(texto) {
    const toast = document.createElement('div');
    toast.className = 'toast-notificacao';
    toast.textContent = texto;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('toast-visivel'));

    setTimeout(() => {
      toast.classList.remove('toast-visivel');
      toast.addEventListener('transitionend', () => toast.remove());
    }, 3000);
  }

  function init() {
    const btnCarrinho = document.getElementById('btnCarrinho');
    btnCarrinho?.addEventListener('click', abrirPainel);

    const btnFechar = document.getElementById('carrinhoFechar');
    btnFechar?.addEventListener('click', fecharPainel);

    const overlay = document.getElementById('carrinhoOverlay');
    overlay?.addEventListener('click', fecharPainel);

    document.querySelectorAll('.btn-adicionar').forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.card-produto');
        const nome = card?.querySelector('h3')?.textContent || 'Produto';
        // Tenta ler preço numérico do card (ex: "R$ 49,90" → 49.90)
        const precoTexto = card?.querySelector('.card-preco')?.textContent || '';
        const preco = parseFloat(precoTexto.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
        adicionar(nome, preco);
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
    let encontrouAlgum = false;

    cards().forEach(card => {
      const nome      = card.querySelector('h3')?.textContent.toLowerCase()           || '';
      const categoria = card.querySelector('.card-categoria')?.textContent.toLowerCase() || '';
      const descricao = card.querySelector('.card-descricao')?.textContent.toLowerCase() || '';
      const encontrou = !t || nome.includes(t) || categoria.includes(t) || descricao.includes(t);
      card.style.opacity   = encontrou ? '1' : '0.25';
      card.style.transform = encontrou ? '' : 'scale(0.97)';
      if (encontrou) encontrouAlgum = true;
    });

    // Estado vazio: exibe aviso quando a busca não retorna nenhum produto visível.
    let aviso = document.getElementById('busca-vazia');
    if (!encontrouAlgum && t) {
      if (!aviso) {
        aviso = document.createElement('p');
        aviso.id = 'busca-vazia';
        aviso.style.cssText =
          'text-align:center;color:var(--texto-muted);padding:2rem 1rem;' +
          'grid-column:1/-1;font-size:.9rem;font-weight:300;';
        document.querySelector('.produtos-grid')?.appendChild(aviso);
      }
      aviso.textContent = `Nenhum produto encontrado para "${termo}".`;
    } else {
      aviso?.remove();
    }
  }

  function init() {
    if (!input) return;

    input.addEventListener('input', e => filtrar(e.target.value));

    const btnBusca = input.closest('.cabecalho-busca')?.querySelector('button');
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
  function marcarInvalido(campo) {
    campo.classList.add('campo-invalido');
    campo.addEventListener('input', () => campo.classList.remove('campo-invalido'), { once: true });
  }

  async function enviarFormulario(event) {
    event.preventDefault();

    const form    = event.target;
    const btn     = form.querySelector('.btn-enviar');

    const nome    = form.nome.value.trim();
    const email   = form.email.value.trim();
    const assunto = form.assunto.value;
    const mensagem = form.mensagem.value.trim();

    // Validação completa de todos os campos obrigatórios
    if (!nome) {
      marcarInvalido(form.nome);
      mostrarFeedback(form, 'Por favor, informe seu nome.', 'erro');
      form.nome.focus();
      return;
    }
    if (!email) {
      marcarInvalido(form.email);
      mostrarFeedback(form, 'Por favor, informe seu e-mail.', 'erro');
      form.email.focus();
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      marcarInvalido(form.email);
      mostrarFeedback(form, 'Por favor, informe um e-mail válido.', 'erro');
      form.email.focus();
      return;
    }
    if (!assunto) {
      marcarInvalido(form.assunto);
      mostrarFeedback(form, 'Por favor, selecione um assunto.', 'erro');
      form.assunto.focus();
      return;
    }
    if (!mensagem) {
      marcarInvalido(form.mensagem);
      mostrarFeedback(form, 'Por favor, escreva sua mensagem.', 'erro');
      form.mensagem.focus();
      return;
    }

    btn.textContent = 'Enviando…';
    btn.disabled    = true;

    try {
      await new Promise(resolve => setTimeout(resolve, 1400));

      mostrarFeedback(
        form,
        `Obrigado, ${nome}! Recebemos sua mensagem e responderemos em breve para ${email}.`,
        'sucesso'
      );
      form.reset();

    } catch (err) {
      mostrarFeedback(
        form,
        'Ops! Ocorreu um erro ao enviar sua mensagem. Tente novamente ou ligue para (86) 4002-8922.',
        'erro'
      );
    } finally {
      // finally garante que o botão sempre volta ao estado normal,
      // seja em caso de sucesso ou erro da API.
      btn.textContent = 'Enviar mensagem';
      btn.disabled    = false;
    }
  }

  function mostrarFeedback(form, texto, tipo) {
    form.querySelector('.form-feedback')?.remove();

    const el = document.createElement('p');
    el.className = `form-feedback form-feedback--${tipo}`;
    el.textContent = texto;
    form.appendChild(el);

    setTimeout(() => el.remove(), 6000);
  }

  function init() {
    const form = document.getElementById('contatoForm');
    form?.addEventListener('submit', enviarFormulario);
  }

  return { init };
})();



// Animações
const ANIMACOES = (() => {
  const ELEMENTOS = [
    '.card-produto',
    '.secao-cabecalho',
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

    let cardIndex = 0;
    alvo.forEach(el => {
      el.classList.add('animar');
      if (el.classList.contains('card-produto')) {
        el.style.transitionDelay = `${(cardIndex % 4) * 80}ms`;
        cardIndex++;
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

  ANIMACOES.init();
});
