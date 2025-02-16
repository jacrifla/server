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
        const { itemListId, userId, categoryId = null, brandId = null, barcode = null, purchaseDate } = req.body;


        if (!itemListId || !userId) {
            return res.status(400).json({
                status: false,
                message: 'Parâmetros obrigatórios ausentes: itemListId ou userId.',
            });
        }

        try {
            // Obtém os detalhes do item
            const itemDetails = await ListItemModel.getItemDetails(itemListId);

            if (!itemDetails) {
                return res.status(404).json({
                    status: false,
                    message: 'Item não encontrado na lista.',
                });
            }

            const { itemType, itemName, quantity, price } = itemDetails;

            // Valida quantity e price
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

            if (purchaseDate && isNaN(Date.parse(purchaseDate))) {
                return res.status(400).json({
                    status: false,
                    message: 'Data de compra inválida.',
                });
            }

            if (itemType === 'custom' && barcode && !isValidBarcode(barcode)) {
                return res.status(400).json({
                    status: false,
                    message: 'Barcode inválido.',
                });
            }

            let finalItemId = itemListId;

            if (itemType === 'custom') {
                try {
                    const newItem = await createItem(itemName, categoryId, brandId, barcode);
                    if (!newItem || !newItem.itemId) {
                        throw new Error('Falha ao criar item personalizado.');
                    }
                    finalItemId = newItem.itemId;
                } catch (error) {
                    return res.status(500).json({
                        status: false,
                        message: 'Erro ao criar item personalizado.',
                    });
                }
            }

            // Calcula total da compra
            const total = price * quantity;

            try {
                await createPurchase(finalItemId, userId, quantity, price, total, purchaseDate);
            } catch (error) {
                return res.status(500).json({
                    status: false,
                    message: 'Erro ao registrar a compra.',
                });
            }

            try {
                await ListItemModel.markAsPurchase(itemListId);
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