require('dotenv').config();
const express = require('express');
const app = express();

const configureServer = require('./config/serverConfig');
const configureRoutes = require('./config/routeConfig');

configureServer(app);
configureRoutes(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running`);
});