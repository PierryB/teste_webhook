const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// Substitua pela sua chave da Evolution API
const API_KEY = 'A8Nf3ndOnkRl6na0alk81b0G24ddxqkB';
const INSTANCE_NAME = 'Pierry';
const EVOLUTION_URL = 'http://localhost:8080/message/sendText';

app.post('/webhook', async (req, res) => {
  const { from, body } = req.body;

  console.log(`📩 Nova mensagem de ${from}: ${body}`);

  try {
    // Envia resposta automática
    await axios.post(`${EVOLUTION_URL}/${INSTANCE_NAME}`, {
      number: from,
      message: 'Olá! Esta é uma resposta automática do bot 🤖'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'apikey': API_KEY
      }
    });

    console.log(`✅ Resposta enviada para ${from}`);
    res.sendStatus(200);
  } catch (error) {
    console.error('Erro ao responder:', error.message);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
  console.log(`🚀 Webhook rodando na porta ${PORT}`);
});
