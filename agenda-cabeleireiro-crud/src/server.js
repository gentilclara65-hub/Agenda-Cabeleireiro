require('dotenv').config();

const express = require('express');
const path = require('path');
const agendamentosRoutes = require('./routes/agendamentos');

const app = express();
const publicPath = path.join(__dirname, '..', 'public');

app.use(express.json());
app.use(express.static(publicPath));

// O frontend fica na mesma aplicacao para simplificar a demonstracao.
app.use('/api/agendamentos', agendamentosRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.use((req, res) => {
  res.status(404).json({ mensagem: 'Rota nao encontrada.' });
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  console.log(`Servidor rodando em http://${HOST}:${PORT}`);
});

globalThis.__agendaCabeleireiroServer = server;

module.exports = server;
