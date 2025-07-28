const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json({ limit: '50mb' }));

const INSTANCE = 'Pierry';
const API_KEY = 'A8Nf3ndOnkRl6na0alk81b0G24ddxqkB';
const BASE_URL = `http://qwogo8c4wsgc8cwo0ksgskgg.195.200.6.174.sslip.io/message/sendText`;

app.post('/messages-upsert', async (req, res) => {
  const data = req.body?.data;
  const key = data?.key;

  // Detecta o número do remetente
  let sender = key?.participant || key?.remoteJid || req.body?.sender;
  console.log(`📦 Número do usuário: ${sender}`);

  if (!sender) {
    console.warn('❌ Não foi possível identificar o número do remetente.');
    return res.sendStatus(400);
  }
  const isGroup = sender.includes('@g.us'); // mensagem de grupo
    if (isGroup) {
    console.log(`👥 Ignorando mensagem de grupo`);
    return res.sendStatus(200);
  }
  // Remove o "@s.whatsapp.net" ou "@g.us" do número
  sender = sender.replace(/@.*$/, '');

  const message = data?.message?.conversation;
  //if (message?.toLowerCase() !== 'oi') return res.sendStatus(200);

  // Valida se o bot enviou mensagem para ele mesmo
  const instanceNumber = '554797606148';
  if (sender === instanceNumber) {
    console.log(`🚫 Ignorando mensagem enviada por mim mesmo (${sender})`);
    return res.sendStatus(200);
  }

  if (!message || typeof message !== 'string') {
    console.log(`📦 Ignorando mensagem não textual de ${sender}`);
    return res.sendStatus(200);
  }
  
  console.log(`📩 Mensagem recebida de ${sender}: ${message}`);

  if (!sender || !message) return res.sendStatus(400);

  try {
    await axios.post(`${BASE_URL}/${INSTANCE}`, {
      number: sender,
      text: `Você disse: ${message}`
    }, {
      headers: {
        'Content-Type': 'application/json',
        'apikey': API_KEY
      }
    });

    console.log(`✅ Resposta enviada para ${sender}`);
    res.sendStatus(200);
  } catch (error) {
    console.error('❌ Erro ao responder:', error.message);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
  console.log(`🚀 Webhook escutando na porta ${PORT}`);
});
