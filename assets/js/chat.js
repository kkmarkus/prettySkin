'use strict';

const CHATBOT = (() => {
  let btnToggle, widget, mensagens, inputChat, btnEnviar;

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
      resposta: 'Você pode nos contatar pelo formulário na seção Contato, ou pelo telefone (86) 4002-8922, de segunda a sexta das 8h às 18h. Adoramos ouvir você! 💌'
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

  async function obterResposta(texto) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mensagem: texto }),
  });

  if (!res.ok) throw new Error('Erro na resposta do servidor');

  const data = await res.json();
  return data.resposta || 'Não consegui entender. Tente novamente!';
}

  function adicionarMensagem(texto, tipo) {
    const div = document.createElement('div');
    div.className = tipo === 'bot' ? 'msg-bot' : 'msg-user';
    div.textContent = texto;
    mensagens.appendChild(div);
    mensagens.scrollTop = mensagens.scrollHeight;
  }

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

  function enviarMensagem() {
  const texto = inputChat?.value.trim();
  if (!texto) return;

  adicionarMensagem(texto, 'user');
  inputChat.value = '';

  mostrarDigitando();

  obterResposta(texto)
    .then(resposta => {
      removerDigitando();
      adicionarMensagem(resposta, 'bot');
    })
    .catch(() => {
      removerDigitando();
      adicionarMensagem('Ops! Ocorreu um erro. Tente novamente ou fale pelo formulário de Contato.', 'bot');
    });
}

  function toggleChat() {
    const aberto = !widget.classList.contains('hidden');
    widget.classList.toggle('hidden', aberto);
    btnToggle.classList.toggle('aberto', !aberto);
    btnToggle.setAttribute('aria-expanded', String(!aberto));
    btnToggle.setAttribute('aria-label', aberto ? 'Abrir chat' : 'Fechar chat');

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


document.addEventListener('DOMContentLoaded', () => {
  CHATBOT.init();
});
