const UserService = require('./user_service');
const HttpStatus = require('http-status');
const BaseController = require('../../base/base_controller');

class UserController extends BaseController {
    constructor() {
        super();
        this._userService = new UserService();
    }

    async register(req, res, next) {
        try {
            const data = await this._userService.register(req.body);
            res.status(HttpStatus.status.CREATED).json(this.parseKeysToCamelcase({ data }));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async login(req, res, next) {
        try {
            const data = await this._userService.login(req.body);
            res.status(HttpStatus.status.OK).json(this.parseKeysToCamelcase({ data }));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async forgotPassword(req, res, next) {
        try {
            await this._userService.forgotPassword(req.body.email);
            res.status(HttpStatus.status.OK).json(this.parseKeysToCamelcase({ message: 'EMAIL_RECOVERY_SENT' }));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async resetPassword(req, res, next) {
        try {
            await this._userService.resetPassword(req.body.token, req.body.newPassword);
            res.status(HttpStatus.status.OK).json(this.parseKeysToCamelcase({ message: 'PASSWORD_RESET_SUCCESS' }));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    // Métodos protegidos
    async getProfile(req, res, next) {
        try {
            const data = await this._userService.getProfile(req.locals.user);
            res.status(HttpStatus.status.OK).json(this.parseKeysToCamelcase({ data }));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async updateProfile(req, res, next) {
        try {
            const data = await this._userService.update(req.user.userId, req.body);
            res.status(HttpStatus.status.OK).json(this.parseKeysToCamelcase({ data }));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async changePassword(req, res, next) {
        try {
            await this._userService.changePassword(req.user.userId, req.body);
            res.status(HttpStatus.status.OK).json(this.parseKeysToCamelcase({ message: 'PASSWORD_CHANGED_SUCCESS' }));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async list(req, res, next) {
        try {
            const data = await this._userService.list(req.query);
            res.status(HttpStatus.status.OK).json(this.parseKeysToCamelcase({ data }));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async getById(req, res, next) {
        try {
            const data = await this._userService.getById(req.params.id);
            res.status(HttpStatus.status.OK).json(this.parseKeysToCamelcase({ data }));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async update(req, res, next) {
        try {
            const data = await this._userService.update(req.params.id, req.body);
            res.status(HttpStatus.status.OK).json(this.parseKeysToCamelcase({ data }));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async softDelete(req, res, next) {
        try {
            const data = await this._userService.softDelete(req.params.id);
            res.status(HttpStatus.status.OK).json(this.parseKeysToCamelcase({ data }));
        } catch (err) {
            next(this.handleError(err));
        }
    }
}

module.exports = UserController;
