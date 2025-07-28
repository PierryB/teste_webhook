const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json({ limit: '10mb' }));

const INSTANCE = process.env.INSTANCE_NAME;
const API_KEY = process.env.API_KEY;
const BASE_URL = `${process.env.EVOLUTION_URL}/message/sendText`;

app.post('/messages-upsert', async (req, res) => {
  const data = req.body?.data;
  const key = data?.key;

  // Valida se o bot enviou mensagem para ele mesmo
  const isFromMe = key?.fromMe === true;
  if (isFromMe) {
    console.log(`🚫 Ignorando mensagem enviada por mim mesmo`);
    return res.sendStatus(200);
  }

  // Valida se mensagem é de um grupo
  const remoteJid = key?.remoteJid || '';
  const isGroup = remoteJid.endsWith('@g.us');
    if (isGroup) {
    console.log(`👥 Ignorando mensagem de grupo`);
    return res.sendStatus(200);
  }
  
  // Detecta o número do remetente
  let sender = key?.participant || key?.remoteJid || req.body?.sender;
  console.log(`📦 Número do usuário: ${sender}`);

  if (!sender) {
    console.warn('❌ Não foi possível identificar o número do remetente.');
    return res.sendStatus(400);
  }

  // Remove o "@s.whatsapp.net" ou "@g.us" do número
  sender = sender.replace(/@.*$/, '');

  const message = data?.message?.conversation;

  if (!message || typeof message !== 'string') {
    console.log(`🚫 Ignorando mensagem não textual de ${sender}`);
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
