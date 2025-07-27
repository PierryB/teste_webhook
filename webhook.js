const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const INSTANCE = 'Pierry';
const API_KEY = 'A280D3CC7FE6-439A-89B4-5155D09092AF';
const BASE_URL = `http://qwogo8c4wsgc8cwo0ksgskgg.195.200.6.174.sslip.io/message/sendText`;

app.post('/messages-upsert', async (req, res) => {
  const data = req.body;
  const sender = data?.sender?.split('@')[0];
  const message = data?.data?.message?.conversation;

  console.log(`📩 Mensagem recebida de ${sender}: ${message}`);

  if (!sender || !message) return res.sendStatus(400);

  try {
    await axios.post(`${BASE_URL}/${INSTANCE}`, {
      number: sender,
      message: `Você disse: ${message}`
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
