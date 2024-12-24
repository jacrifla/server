const UserModel = require('../models/user');
const { isValidEmail } = require('../utils/validation');

exports.createUser = async (req, res) => {
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

        const userExists = await UserModel.findByEmail({email});

        if (userExists) {
            return res.status(400).json({
                status: false,
                message: 'Já existe um usuário com este email'
            });
        };

        const newUser = await UserModel.create({name, email, password});
        res.status(201).json({
            status: true,
            message: 'Usuário criado com sucesso',
            data: newUser
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Ocorreu um erro interno',
            error: error.message
        })
    }
};

exports.findByEmail = async (req, res) => {
    const { email } = req.body;
    try {
        if (!email) {
            res.status(404).json({
                status: false,
                message: 'O email é necessário'
            });
        };

        const user = await UserModel.findByEmail({email});
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
            message: 'Ocorreu um erro interno',
            error: error.message
        });
    }
};

exports.findById = async (req, res) => {
    const { userId } = req.params;  

    try {
        if (!userId) {
            res.status(400).json({
                status: false,
                message: 'O ID é necessário'
            });
        };

        const user = await UserModel.findById({userId});
        
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
            message: 'Ocorreu um erro interno',
            error: error.message
        });
    }
};

exports.updateUser = async (req, res) => {
    const { userId } = req.params;
    const { name, email } = req.body;

    try {
        if (!userId) {
            res.status(400).json({
                status: false,
                message: 'O ID é necessário'
            });
        };

        if (!name && !email) {
            res.status(400).json({
                status: false,
                message: 'O nome ou email é necessário'
            });
        };

        const updatedUser = await UserModel.update({userId, name, email});
        
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
            message: 'Ocorreu um erro interno',
            error: error.message
        }); 
    }
};

exports.deleteUser = async (req, res) => {
    const { userId } = req.params;

    try {
        if (!userId) {
            res.status(400).json({
                status: false,
                message: 'O ID é necessário'
            });
        };

        const deletedUser = await UserModel.delete({userId});
        
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
            message: 'Ocorreu um erro interno',
            error: error.message
        });
    }
};

exports.restoreUser = async (req, res) => {
    const { email } = req.body;

    try {
        if (!email) {
            res.status(400).json({
                status: false,
                message: 'O email é necessário'
            });
        };

        const restoredUser = await UserModel.restore({email});
        
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
            message: 'Ocorreu um erro interno',
            error: error.message
        });
    }
};

exports.resetPasswordUser = async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        if (!email || !newPassword) {
            res.status(400).json({
                status: false,
                message: 'O email e a nova senha são necessárias'
            });
        };

        const resetPassword = await UserModel.resetPassword({email, newPassword});

        if (!resetPassword) {
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
            message: 'Ocorreu um erro interno',
            error: error.message
        });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            res.status(400).json({
                status: false,
                message: 'O email e a senha são necessárias'
            });
        };

        const login = await UserModel.login({email, password});
        
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
            message: 'Ocorreu um erro interno',
            error: error.message
        });
    }
};