import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

const SYSTEM_PROMPT = `Você é a assistente virtual da Pretty Skin, uma loja brasileira de skincare.
Responda de forma simpática, breve (máximo 3 frases) e útil.
Fale sobre os produtos da loja quando relevante.
Responda sempre em português brasileiro.

Produtos disponíveis:
- Sérum Vitamina C 15% (R$ 89,90) — uniformiza o tom, reduz manchas, luminosidade em 14 dias
- Hidratante Corporal (R$ 59,90) — manteiga de karité + aloe vera, hidratação por 24h
- Esfoliante Facial (R$ 49,90) — micropartículas de rosa mosqueta, remove células mortas
- Tônico Facial (R$ 44,90) — água de rosas + niacinamida 5%, reequilibra o pH
- Protetor Solar FPS 60 (R$ 74,90) — acabamento matte, não entope os poros
- Creme Noturno (R$ 79,90) — tratamento regenerador para uso noturno

Não invente informações sobre produtos que não estão na lista acima.
Se não souber responder, oriente o cliente a entrar em contato pelo formulário de contato do site.`;

export default async function handler(req, res) {
  // Só aceita POST
  if (req.method !== 'POST') {
    return res.status(405).json({ erro: 'Método não permitido.' });
  }

  const { mensagem } = req.body;

  if (!mensagem || typeof mensagem !== 'string') {
    return res.status(400).json({ erro: 'Mensagem inválida.' });
  }

  try {
    const response = await client.chat.completions.create({
      model: 'deepseek-ai/deepseek-v4-flash',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: mensagem },
      ],
      temperature: 0.7,
      top_p: 0.95,
      max_tokens: 500,
      stream: false,
    });

    const texto =
      response.choices[0]?.message?.content || 'Não consegui gerar uma resposta.';

    res.status(200).json({ resposta: texto });
  } catch (err) {
    console.error('Erro ao chamar a API da NVIDIA:', err.message);
    res.status(500).json({ erro: 'Erro ao contactar a IA. Tente novamente.' });
  }
}
