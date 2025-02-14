const socketIo = require('socket.io');

module.exports = (server) => {
    // Cria a instância do Socket.IO
    const io = socketIo(server);

    // Evento de conexão com o cliente WebSocket
    io.on('connection', (socket) => {
        console.log('Novo cliente conectado');
        
        // Emitir quando um item for atualizado
        socket.on('updateItem', (item) => {
          io.emit('itemUpdated', item);  // Emite para todos os clientes
        });
      
        // Emitir quando um item for adicionado
        socket.on('addItem', (item) => {
          io.emit('itemAdded', item);
        });
      
        // Emitir quando um item for excluído
        socket.on('deleteItem', (itemId) => {
          io.emit('itemDeleted', itemId);
        });
      
        // Emitir quando uma lista for atualizada
        socket.on('updateList', (list) => {
          io.emit('listUpdated', list);
        });
      
        socket.on('disconnect', () => {
          console.log('Cliente desconectado');
        });
      });

    // Retorna a instância para outras configurações, se necessário
    return io;
};
