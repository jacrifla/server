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
        const { itemListId, userId, categoryId = null, brandId = null, barcode = null } = req.body;
    
        if (!itemListId || !userId) {
            return res.status(400).json({
                status: false,
                message: 'Parâmetros obrigatórios ausentes: itemListId ou userId.',
            });
        }
    
        try {
            // Obtém os detalhes do item
            const itemDetails = await ListItemModel.getItemDetails(itemListId);
            const { itemType, itemName, quantity, price } = itemDetails;
    
            if (itemType === 'custom' && barcode && !isValidBarcode(barcode)) {
                return res.status(400).json({
                    status: false,
                    message: 'Barcode inválido.',
                });
            }
    
            if (itemType === 'common') {
                const total = price * quantity;
                await createPurchase(itemListId, userId, quantity, price, total);
            }
    
            if (itemType === 'custom') {
                const newItem = await createItem(itemName, categoryId, brandId, barcode);
                const total = price * quantity;
                await createPurchase(newItem.itemId, userId, quantity, price, total);
            }

            await ListItemModel.markAsPurchase(itemListId);
    
            res.status(200).json({
                status: true,
                message: 'Compra realizada e item marcado como comprado com sucesso!',
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: 'Erro ao processar a compra.',
            });
        }
    },    
};

module.exports = ListItemController;