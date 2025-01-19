const cron = require('node-cron');
const ShareModel = require('../models/share');

cron.schedule('0 3 * * *', async () => {
    try {
        console.log('Iniciando a exclusão de tokens expirados...');
        await ShareModel.deleteExpiredTokens();
        console.log('Tokens expirados deletados com sucesso.');
    } catch (error) {
        console.error('Erro ao excluir tokens expirados:', error);
    }
});
