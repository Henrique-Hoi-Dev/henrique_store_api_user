const UserService = require('./user_service');
const BaseController = require('../../base/base_controller');
const HttpStatus = require('http-status');
const jwt = require('../../../../utils/jwt');

class UserController extends BaseController {
    constructor() {
        super();
        this._userService = new UserService();
    }

    // Métodos públicos
    async register(req, res, next) {
        try {
            const user = await this._userService.register(req.body);
            const token = jwt.generateToken({ userId: user.id, email: user.email });

            res.status(HttpStatus.CREATED).json({
                user: this.parseKeysToCamelcase(user),
                token
            });
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async login(req, res, next) {
        try {
            const { user, token } = await this._userService.login(req.body);
            res.status(HttpStatus.OK).json({
                user: this.parseKeysToCamelcase(user),
                token
            });
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async forgotPassword(req, res, next) {
        try {
            await this._userService.forgotPassword(req.body.email);
            res.status(HttpStatus.OK).json({
                message: 'Email de recuperação enviado com sucesso'
            });
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async resetPassword(req, res, next) {
        try {
            await this._userService.resetPassword(req.body.token, req.body.newPassword);
            res.status(HttpStatus.OK).json({
                message: 'Senha alterada com sucesso'
            });
        } catch (err) {
            next(this.handleError(err));
        }
    }

    // Métodos protegidos
    async getProfile(req, res, next) {
        try {
            const user = await this._userService.getById(req.user.userId);
            if (!user) return next(this.notFound('USER_NOT_FOUND'));
            res.status(HttpStatus.OK).json(this.parseKeysToCamelcase(user));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async updateProfile(req, res, next) {
        try {
            const user = await this._userService.update(req.user.userId, req.body);
            if (!user) return next(this.notFound('USER_NOT_FOUND'));
            res.status(HttpStatus.OK).json(this.parseKeysToCamelcase(user));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async changePassword(req, res, next) {
        try {
            await this._userService.changePassword(req.user.userId, req.body);
            res.status(HttpStatus.OK).json({
                message: 'Senha alterada com sucesso'
            });
        } catch (err) {
            next(this.handleError(err));
        }
    }

    // Métodos administrativos
    async list(req, res, next) {
        try {
            const { page, limit, is_active, role, search } = req.query;
            const result = await this._userService.list({ page, limit, is_active, role, search });
            res.status(HttpStatus.OK).json(this.parseKeysToCamelcase(result));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async getById(req, res, next) {
        try {
            const user = await this._userService.getById(req.params.id);
            if (!user) return next(this.notFound('USER_NOT_FOUND'));
            res.status(HttpStatus.OK).json(this.parseKeysToCamelcase(user));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async update(req, res, next) {
        try {
            const user = await this._userService.update(req.params.id, req.body);
            if (!user) return next(this.notFound('USER_NOT_FOUND'));
            res.status(HttpStatus.OK).json(this.parseKeysToCamelcase(user));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async softDelete(req, res, next) {
        try {
            const user = await this._userService.softDelete(req.params.id);
            if (!user) return next(this.notFound('USER_NOT_FOUND'));
            res.status(HttpStatus.OK).json(this.parseKeysToCamelcase(user));
        } catch (err) {
            next(this.handleError(err));
        }
    }
}

module.exports = UserController;
