const express = require('express');
const router = express.Router();
const UserController = require('./user_controller');
const validation = require('./user_validation');
const validator = require('../../../../utils/validator');
const { ensureAuthorization, verifyToken } = require('../../../../main/middleware');

const userController = new UserController();

// Rotas públicas (sem autenticação)
router.post('/register', validator(validation.register), userController.register);
router.post('/login', validator(validation.login), userController.login);
router.post('/forgot-password', validator(validation.forgotPassword), userController.forgotPassword);
router.post('/reset-password', validator(validation.resetPassword), userController.resetPassword);

// Rotas protegidas (com autenticação)
router.get('/profile', ensureAuthorization, verifyToken, userController.getProfile);
router.put(
    '/profile',
    ensureAuthorization,
    verifyToken,
    validator(validation.updateProfile),
    userController.updateProfile
);
router.put(
    '/change-password',
    ensureAuthorization,
    verifyToken,
    validator(validation.changePassword),
    userController.changePassword
);

// Rotas administrativas (apenas admin)
router.get('/', ensureAuthorization, verifyToken, validator(validation.list), userController.list);
router.get('/:id', ensureAuthorization, verifyToken, validator(validation.getById), userController.getById);
router.put('/:id', ensureAuthorization, verifyToken, validator(validation.update), userController.update);
router.delete('/:id', ensureAuthorization, verifyToken, validator(validation.softDelete), userController.softDelete);

module.exports = router;
