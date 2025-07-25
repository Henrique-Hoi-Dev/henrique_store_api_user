const User = require('./user_model');
const BaseService = require('../../base/base_service');
const bcrypt = require('bcrypt');
const jwt = require('../../../../utils/jwt');
const { Op } = require('sequelize');

class UserService extends BaseService {
    constructor() {
        super();
        this._userModel = User;
    }

    // Métodos de autenticação
    async register(userData) {
        // Verificar se email já existe
        const existingUser = await this._userModel.findOne({
            where: { email: userData.email }
        });

        if (existingUser) {
            throw new Error('Email já cadastrado');
        }

        // Criptografar senha
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        // Criar usuário
        const user = await this._userModel.create({
            ...userData,
            password: hashedPassword,
            role: userData.role || 'CUSTOMER'
        });

        // Remover senha do retorno
        const { password, ...userWithoutPassword } = user.toJSON();
        return userWithoutPassword;
    }

    async login(credentials) {
        const user = await this._userModel.findOne({
            where: { email: credentials.email }
        });

        if (!user) {
            throw new Error('Email ou senha inválidos');
        }

        if (!user.is_active) {
            throw new Error('Usuário inativo');
        }

        const isValidPassword = await bcrypt.compare(credentials.password, user.password);
        if (!isValidPassword) {
            throw new Error('Email ou senha inválidos');
        }

        // Gerar token
        const token = jwt.generateToken({ userId: user.id, email: user.email });

        // Remover senha do retorno
        const { password, ...userWithoutPassword } = user.toJSON();
        return { user: userWithoutPassword, token };
    }

    async forgotPassword(email) {
        const user = await this._userModel.findOne({
            where: { email }
        });

        if (!user) {
            throw new Error('Email não encontrado');
        }

        // Gerar token de reset (implementar lógica de email)
        const resetToken = jwt.generateToken({ userId: user.id }, '1h');

        // TODO: Enviar email com token de reset
        // Por enquanto, apenas log
        console.log(`Reset token for ${email}: ${resetToken}`);

        return true;
    }

    async resetPassword(token, newPassword) {
        try {
            const decoded = jwt.verifyToken(token);
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await this._userModel.update({ password: hashedPassword }, { where: { id: decoded.userId } });

            return true;
        } catch (error) {
            throw new Error('Token inválido ou expirado');
        }
    }

    async changePassword(userId, { currentPassword, newPassword }) {
        const user = await this._userModel.findByPk(userId);

        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        const isValidPassword = await bcrypt.compare(currentPassword, user.password);
        if (!isValidPassword) {
            throw new Error('Senha atual incorreta');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await user.update({ password: hashedPassword });

        return true;
    }

    // Métodos CRUD
    async list({ page = 1, limit = 20, is_active, role, search }) {
        const where = {};

        if (typeof is_active !== 'undefined') where.is_active = is_active;
        if (role) where.role = role;
        if (search) {
            where[Op.or] = [{ name: { [Op.iLike]: `%${search}%` } }, { email: { [Op.iLike]: `%${search}%` } }];
        }

        const offset = (page - 1) * limit;
        const { rows, count } = await this._userModel.findAndCountAll({
            where,
            offset,
            limit: parseInt(limit, 10),
            order: [['created_at', 'DESC']],
            attributes: { exclude: ['password'] }
        });

        return {
            data: rows,
            meta: {
                total: count,
                page: parseInt(page, 10),
                limit: parseInt(limit, 10)
            }
        };
    }

    async getById(id) {
        return this._userModel.findByPk(id, {
            attributes: { exclude: ['password'] }
        });
    }

    async update(id, data) {
        const user = await this._userModel.findByPk(id);
        if (!user) return null;

        // Se estiver atualizando senha, criptografar
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }

        await user.update(data);

        // Remover senha do retorno
        const { password, ...userWithoutPassword } = user.toJSON();
        return userWithoutPassword;
    }

    async softDelete(id) {
        const user = await this._userModel.findByPk(id);
        if (!user) return null;

        await user.update({ is_active: false });

        // Remover senha do retorno
        const { password, ...userWithoutPassword } = user.toJSON();
        return userWithoutPassword;
    }
}

module.exports = UserService;
