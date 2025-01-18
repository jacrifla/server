const ShareModel = require('../models/share');

const ShareController = {
    generateShareToken: async (req, res) => {
        const { listId } = req.body;

        try {
            if (!listId) {
                return res.status(400).json({ 
                    status: false, 
                    message: "Faltando parâmetros necessários." 
                });
            }

            const tokenData = await ShareModel.generateShareToken(listId);
            return res.status(200).json({ 
                status: true,
                data: {
                    token: tokenData.token, 
                    expiresAt: tokenData.expiresAt 
                }
            });
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: error.message
            });
        }
    },

    acceptShareToken: async (req, res) => {
        const { userId, token } = req.body;

        try {
            if (!userId || !token) {
                return res.status(400).json({
                    status: false, 
                    message: "Faltando parâmetros necessários." 
                });
            }

            const sharedList = await ShareModel.acceptShareToken(userId, token);
            return res.status(200).json({ 
                status: true,
                data: sharedList
            });
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: error.message
            });
        }
    },
};

module.exports = ShareController;