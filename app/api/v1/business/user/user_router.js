const express = require('express');
const router = express.Router();
const UserController = require('./user_controller');
const validation = require('./user_validation');
const validator = require('../../../../utils/validator');
const { ensureAuthorization, verifyToken } = require('../../../../main/middleware');

const userController = new UserController();

// Rotas públicas (sem autenticação)
router.post('/register', validator(validation.register), userController.register.bind(userController));
router.post('/login', validator(validation.login), userController.login.bind(userController));
router.post(
    '/forgot-password',
    validator(validation.forgotPassword),
    userController.forgotPassword.bind(userController)
);
router.post('/reset-password', validator(validation.resetPassword), userController.resetPassword.bind(userController));

// Rotas protegidas (com autenticação)
router.get('/profile', ensureAuthorization, verifyToken, userController.getProfile.bind(userController));
router.put('/profile', ensureAuthorization, verifyToken, userController.updateProfile.bind(userController));
router.put('/change-password', ensureAuthorization, verifyToken, userController.changePassword.bind(userController));

// Rotas administrativas (apenas admin)
router.get('/', ensureAuthorization, verifyToken, userController.list.bind(userController));
router.get('/:id', ensureAuthorization, verifyToken, userController.getById.bind(userController));
router.put('/:id', ensureAuthorization, verifyToken, userController.update.bind(userController));
router.delete('/:id', ensureAuthorization, verifyToken, userController.softDelete.bind(userController));

module.exports = router;
