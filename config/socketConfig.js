const socketIo = require('socket.io');

module.exports = (server) => {
    // Cria a instância do Socket.IO
    const io = socketIo(server);

    // Evento de conexão com o cliente WebSocket
    io.on('connection', (socket) => {
        console.log('Novo cliente conectado');

        // Evento para notificar outros clientes sobre uma atualização na lista
        socket.on('update-list', (listId) => {
            console.log(`Lista ${listId} foi atualizada`);
            // Envia a atualização para todos os clientes
            io.emit('list-updated', listId);
        });

        // Quando o cliente se desconecta
        socket.on('disconnect', () => {
            console.log('Cliente desconectado');
        });
    });

    // Retorna a instância para outras configurações, se necessário
    return io;
};
