const UserModel = require('../models/user');
const { isValidEmail } = require('../utils/validation');

const UserController = {
    createUser: async (req, res) => {
        const { name, email, password } = req.body;

        try {
            if (!name || !email || !password) {
                return res.status(400).json({
                    status: false,
                    message: 'Todos os campos são necessários'
                });
            };

            if (!isValidEmail(email)) {
                return res.status(400).json({
                    status: false,
                    message: 'Email inválido'
                });
            };

            if (password.length < 6) {
                return res.status(400).json({
                    status: false,
                    message: 'A senha precisa ter no mínimo 6 caracteres'
                })
            }

            const userExists = await UserModel.findByEmail(email);

            if (userExists && !userExists.deletedAt) {
                return res.status(400).json({
                    status: false,
                    message: 'Já existe um usuário com este email'
                });
            };

            const newUser = await UserModel.createUser(name, email, password);
            res.status(201).json({
                status: true,
                message: 'Usuário criado com sucesso',
                data: newUser
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message,
            });
        }
    },

    findByEmail: async (req, res) => {
        const { email } = req.body;
        try {
            if (!email) {
                res.status(404).json({
                    status: false,
                    message: 'O email é necessário'
                });
            };

            const user = await UserModel.findByEmail(email);
            if (!user) {
                return res.status(404).json({
                    status: false,
                    message: 'Usuário não encontrado'
                });
            };
            res.status(200).json({
                status: true,
                message: 'Usuário encontrado',
                data: user
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message,
            });
        }
    },

    findById: async (req, res) => {
        const { userId } = req.params;

        try {
            if (!userId) {
                res.status(400).json({
                    status: false,
                    message: 'O ID é necessário'
                });
            };

            const user = await UserModel.findById(userId);

            if (!user) {
                return res.status(404).json({
                    status: false,
                    message: 'Usuário não encontrado'
                });
            };

            res.status(200).json({
                status: true,
                message: 'Usuário encontrado',
                data: user
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message,
            });
        }
    },

    updateUser: async (req, res) => {
        const { userId } = req.params;
        const { name, email } = req.body;

        try {
            if (!userId) {
                return res.status(400).json({
                    status: false,
                    message: 'O ID é necessário'
                });
            };

            if (!name && !email) {
                return res.status(400).json({
                    status: false,
                    message: 'O nome ou email é necessário'
                });
            };

            const updatedUser = await UserModel.update(userId, name, email);

            if (!updatedUser) {
                return res.status(404).json({
                    status: false,
                    message: 'Usuário não encontrado'
                });
            };

            res.status(200).json({
                status: true,
                message: 'Usuário atualizado com sucesso',
                data: updatedUser
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message,
            });
        }
    },

    deleteUser: async (req, res) => {
        const { userId } = req.params;

        try {
            if (!userId) {
                res.status(400).json({
                    status: false,
                    message: 'O ID é necessário'
                });
            };

            const deletedUser = await UserModel.delete(userId);

            if (!deletedUser) {
                return res.status(404).json({
                    status: false,
                    message: 'Usuário não encontrado ou excluído'
                });
            };

            res.status(200).json({
                status: true,
                message: 'Usuário excluído com sucesso'
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            });
        }
    },

    restoreUser: async (req, res) => {
        const { email } = req.body;

        try {
            if (!email) {
                res.status(400).json({
                    status: false,
                    message: 'O email é necessário'
                });
            };

            const restoredUser = await UserModel.restore(email);

            if (!restoredUser) {
                return res.status(404).json({
                    status: false,
                    message: 'Usuário não encontrado ou restaurado'
                });
            };

            res.status(200).json({
                status: true,
                message: 'Usuário restaurado com sucesso'
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            });
        }
    },

    resetPasswordUser: async (req, res) => {
        const { email, newPassword } = req.body;
        try {
            if (!email || !newPassword) {
                res.status(400).json({
                    status: false,
                    message: 'O email e a nova senha são necessárias'
                });
            };

            if (newPassword.length < 6) {
                return res.status(400).json({
                    status: false,
                    message: 'A nova senha deve ter pelo menos 6 caracteres'
                });
            }

            const resetPassword = await UserModel.resetPassword(email, newPassword);

            if (resetPassword === 0) {
                return res.status(404).json({
                    status: false,
                    message: 'Usuário não encontrado ou senha resetada'
                });
            };

            res.status(200).json({
                status: true,
                message: 'Senha resetada com sucesso'
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            });
        }
    },

    loginUser: async (req, res) => {
        const { email, password } = req.body;
        try {
            if (!email || !password) {
                res.status(400).json({
                    status: false,
                    message: 'O email e a senha são necessárias'
                });
            };

            const login = await UserModel.login(email, password);

            if (!login) {
                return res.status(401).json({
                    status: false,
                    message: 'Email ou senha inválidos'
                });
            };

            res.status(200).json({
                status: true,
                message: 'Login efetuado com sucesso',
                data: login
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            });
        }
    },

    getAllUsers: async (req, res) => {
        try {
            const users = await UserModel.getAllUsers();
            res.status(200).json({
                status: true,
                data: users
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            });
        }
    },
};

module.exports = UserController;