const ListItemModel = require('../models/listItem');
const { createItem } = require('../models/items');
const { createPurchase } = require('../models/purchases');
const { isValidBarcode } = require('../utils/validation');

const ListItemController = {
    createItem: async (req, res) => {
        try {
            const itemData = req.body;

            if (!itemData.listId) {
                return res.status(400).json({
                    status: false,
                    message: "O campo 'listId' é obrigatório.",
                });
            }

            const newItem = await ListItemModel.create(itemData);

            res.status(201).json({
                status: true,
                message: 'Item criado com sucesso',
                data: newItem,
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message,
            });
        }
    },

    getItemsByListId: async (req, res) => {
        const { listId } = req.params;

        try {
            const items = await ListItemModel.findByListId(listId);
            res.status(200).json({
                status: true,
                data: items,
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message,
            });
        }
    },

    updateItem: async (req, res) => {
        const { itemListId } = req.params;
        const itemData = req.body;

        try {
            const updatedItem = await ListItemModel.update(itemListId, itemData);
            res.status(200).json({
                status: true,
                message: 'Item atualizado com sucesso',
                data: updatedItem,
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message,
            });
        }
    },

    deleteItem: async (req, res) => {
        const { itemListId } = req.params;

        try {
            const deletedItem = await ListItemModel.delete(itemListId);
            res.status(200).json({
                status: true,
                message: 'Item deletado com sucesso',
                data: deletedItem,
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message,
            });
        }
    },

    markAsPurchased: async (req, res) => {
        const { itemListId, itemId, userId, categoryId = null, brandId = null, barcode = null, purchaseDate } = req.body;

        // Verifica se itemListId ou itemId e userId foram passados
        if (!userId || (!itemListId && !itemId)) {
            return res.status(400).json({
                status: false,
                message: 'Parâmetros obrigatórios ausentes: itemListId ou itemId, userId.',
            });
        }

        try {
            // Verifica se é um item customizado (novo) ou comum (já existente)
            let finalItemId = itemId;
            let itemDetails = null;

            if (itemListId) {
                // Buscar os detalhes do item apenas se for customizado
                itemDetails = await ListItemModel.getItemDetails(itemListId);
                if (!itemDetails) {
                    return res.status(404).json({
                        status: false,
                        message: 'Item não encontrado na lista.',
                    });
                }

                const { itemType, itemName, quantity, price } = itemDetails;

                // Validar quantidade e preço
                if (!quantity || isNaN(quantity) || quantity <= 0) {
                    return res.status(400).json({
                        status: false,
                        message: 'Quantidade inválida.',
                    });
                }

                if (!price || isNaN(price) || price < 0) {
                    return res.status(400).json({
                        status: false,
                        message: 'Preço inválido.',
                    });
                }

                if (itemType === 'custom') {
                    // Criar item customizado e usar o itemId gerado
                    try {
                        const newItem = await createItem(itemName, categoryId, brandId, barcode);
                        if (!newItem || !newItem.itemId) {
                            throw new Error('Falha ao criar item personalizado.');
                        }
                        finalItemId = newItem.itemId; // Agora temos o itemId do novo item
                    } catch (error) {
                        return res.status(500).json({
                            status: false,
                            message: 'Erro ao criar item personalizado.',
                        });
                    }
                }
            }

            // Verificar se finalItemId foi atribuído corretamente
            if (!finalItemId) {
                return res.status(400).json({
                    status: false,
                    message: 'ID do item não encontrado ou inválido.',
                });
            }

            // Calcular total da compra
            const total = itemDetails ? itemDetails.price * itemDetails.quantity : 0;
            
            try {
                const purchase = await createPurchase(finalItemId, userId, itemDetails.quantity, itemDetails.price, total, purchaseDate);
            } catch (error) {
                return res.status(500).json({
                    status: false,
                    message: 'Erro ao registrar a compra.',
                });
            }

            // Marcar o item como comprado na tabela list_items
            try {
                const markedItem = await ListItemModel.markAsPurchase(itemListId || finalItemId);
            } catch (error) {
                return res.status(500).json({
                    status: false,
                    message: 'Erro ao marcar o item como comprado.',
                });
            }

            return res.status(200).json({
                status: true,
                message: 'Compra realizada e item marcado como comprado com sucesso!',
            });
        } catch (error) {
            console.error('Erro inesperado:', error);
            return res.status(500).json({
                status: false,
                message: 'Erro ao processar a compra.',
            });
        }
    },
};

module.exports = ListItemController;