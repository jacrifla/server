require('dotenv').config();
const express = require('express');
const http = require('http');
const app = express();

const configureServer = require('./config/serverConfig');
const configureRoutes = require('./config/routeConfig');
const socketConfig = require('./config/socketConfig');

// Criando um servidor HTTP a partir do Express
const server = http.createServer(app);

// Configurando o CORS e as rotas
configureServer(app);
configureRoutes(app);

// Inicializando o WebSocket
const io = socketConfig(server);

// Iniciando o servidor HTTP (que agora também aceita WebSocket)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});