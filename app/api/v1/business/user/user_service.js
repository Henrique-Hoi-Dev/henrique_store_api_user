const UserModel = require('./user_model');
const BaseService = require('../../base/base_service');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { generateToken } = require('../../../../utils/jwt');
const { Op } = require('sequelize');

class UserService extends BaseService {
    constructor() {
        super();
        this._userModel = UserModel;
    }

    _generateToken(userProps, options = {}) {
        const { password, hash_password, cpf, email, phone, ...userWithoutPassword } = userProps;

        const token = generateToken(userWithoutPassword);
        return token;
    }

    _generateRefreshToken(userProps) {
        const props = {
            userId: userProps.userId,
            role: userProps.role,
            name: userProps.name
        };
        return this._generateToken(props, { expiresIn: '7d' });
    }

    async register(userData) {
        const existingUser = await this._userModel.findOne({
            where: {
                [Op.or]: [{ email: userData.email }]
            }
        });

        if (existingUser) {
            if (existingUser.email === userData.email) {
                throw new Error('EMAIL_ALREADY_EXISTS');
            }
        }

        const user = await this._userModel.createWithHash({
            ...userData,
            role: userData.role || 'CUSTOMER'
        });

        const accessToken = this._generateToken(user);
        const refreshToken = this._generateRefreshToken(user);

        return {
            accessToken,
            refreshToken
        };
    }

    async login(credentials) {
        const user = await this._userModel.findByEmail(credentials.email);

        if (!user) {
            throw new Error('INVALID_CREDENTIALS');
        }

        if (!user.is_active) {
            throw new Error('USER_INACTIVE');
        }

        if (user.isAccountLocked()) {
            throw new Error('ACCOUNT_LOCKED');
        }

        const isValidPassword = await user.validatePassword(credentials.password);
        if (!isValidPassword) {
            await user.incrementFailedLoginAttempts();
            throw new Error('INVALID_CREDENTIALS');
        }

        await user.resetFailedLoginAttempts();

        user.last_login = new Date();
        await user.save();

        const accessToken = this._generateToken(user);
        const refreshToken = this._generateRefreshToken(user);

        return {
            accessToken,
            refreshToken
        };
    }

    async forgotPassword(email) {
        const user = await this._userModel.findByEmail(email);

        if (!user) {
            throw new Error('EMAIL_NOT_FOUND');
        }

        // Gera token de reset usando o método do modelo
        const { resetToken, resetTokenHash, resetTokenExpires } = user.generatePasswordResetToken();

        // Salva o hash do token e a expiração
        user.reset_token_hash = resetTokenHash;
        user.reset_token_expires = resetTokenExpires;
        await user.save();

        // TODO: Enviar email com o resetToken
        // Por enquanto, apenas retorna o token (em produção, enviar por email)
        console.log('Reset token:', resetToken);

        return { resetToken };
    }

    async resetPassword(token, newPassword) {
        try {
            // Busca usuário pelo token de reset
            const user = await this._userModel.findOne({
                where: {
                    reset_token_hash: crypto.createHash('sha256').update(token).digest('hex'),
                    reset_token_expires: { [Op.gt]: new Date() }
                }
            });

            if (!user) {
                throw new Error('INVALID_OR_EXPIRED_TOKEN');
            }

            // Valida o token usando o método do modelo
            const isValidToken = user.validatePasswordResetToken(token);
            if (!isValidToken) {
                throw new Error('INVALID_OR_EXPIRED_TOKEN');
            }

            // Atualiza a senha usando o método do modelo
            await this._userModel.updatePassword(user.id, newPassword);

            // Limpa o token de reset
            await user.clearPasswordResetToken();

            return true;
        } catch (error) {
            throw new Error('INVALID_TOKEN');
        }
    }

    async changePassword(userId, { currentPassword, newPassword }) {
        const user = await this._userModel.findByPk(userId);

        if (!user) {
            throw new Error('USER_NOT_FOUND');
        }

        // Valida a senha atual usando o método do modelo
        const isValidPassword = await user.validatePassword(currentPassword);
        if (!isValidPassword) {
            throw new Error('INVALID_CURRENT_PASSWORD');
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

    async getById({ id }) {
        return this._userModel.findByPk(id, {
            attributes: { exclude: ['password'] }
        });
    }

    async getProfile(userProps) {
        const user = userProps.dataValues;

        return this._userModel.findByPk(user.id, {
            attributes: { exclude: ['password', 'hash_password'] }
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
