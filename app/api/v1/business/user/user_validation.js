const { Joi } = require('express-validation');

module.exports = {
    // Validações públicas
    register: {
        body: Joi.object({
            name: Joi.string().min(2).max(100).required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
            cpf: Joi.string()
                .pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)
                .optional(),
            phone: Joi.string()
                .pattern(/^\(\d{2}\) \d{4,5}-\d{4}$/)
                .optional(),
            birth_date: Joi.date().max('now').optional(),
            gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER').optional(),
            role: Joi.string().valid('CUSTOMER', 'SELLER').optional(),
            address: Joi.object({
                street: Joi.string().optional(),
                number: Joi.string().optional(),
                complement: Joi.string().optional(),
                neighborhood: Joi.string().optional(),
                city: Joi.string().optional(),
                state: Joi.string().optional(),
                zip_code: Joi.string().optional(),
                country: Joi.string().optional()
            }).optional(),
            marketing_consent: Joi.boolean().optional(),
            newsletter_subscription: Joi.boolean().optional()
        })
    },

    login: {
        body: Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required()
        })
    },

    forgotPassword: {
        body: Joi.object({
            email: Joi.string().email().required()
        })
    },

    resetPassword: {
        body: Joi.object({
            token: Joi.string().required(),
            newPassword: Joi.string().min(6).required()
        })
    },

    // Validações protegidas
    updateProfile: {
        body: Joi.object({
            name: Joi.string().min(2).max(100).optional(),
            phone: Joi.string()
                .pattern(/^\(\d{2}\) \d{4,5}-\d{4}$/)
                .optional(),
            birth_date: Joi.date().max('now').optional(),
            gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER').optional(),
            address: Joi.object({
                street: Joi.string().optional(),
                number: Joi.string().optional(),
                complement: Joi.string().optional(),
                neighborhood: Joi.string().optional(),
                city: Joi.string().optional(),
                state: Joi.string().optional(),
                zip_code: Joi.string().optional(),
                country: Joi.string().optional()
            }).optional(),
            preferences: Joi.object({
                language: Joi.string().valid('pt-BR', 'en-US', 'es-ES').optional(),
                notifications: Joi.object({
                    email: Joi.boolean().optional(),
                    sms: Joi.boolean().optional(),
                    push: Joi.boolean().optional()
                }).optional(),
                theme: Joi.string().valid('light', 'dark').optional()
            }).optional(),
            marketing_consent: Joi.boolean().optional(),
            newsletter_subscription: Joi.boolean().optional()
        })
    },

    changePassword: {
        body: Joi.object({
            currentPassword: Joi.string().required(),
            newPassword: Joi.string().min(6).required()
        })
    },

    // Validações administrativas
    list: {
        query: Joi.object({
            page: Joi.number().integer().min(1).optional(),
            limit: Joi.number().integer().min(1).max(100).optional(),
            is_active: Joi.boolean().optional(),
            role: Joi.string().valid('ADMIN', 'CUSTOMER', 'SELLER').optional(),
            search: Joi.string().min(2).optional()
        })
    },

    getById: {
        params: Joi.object({
            id: Joi.string().uuid().required()
        })
    },

    update: {
        params: Joi.object({
            id: Joi.string().uuid().required()
        }),
        body: Joi.object({
            name: Joi.string().min(2).max(100).optional(),
            email: Joi.string().email().optional(),
            cpf: Joi.string()
                .pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)
                .optional(),
            phone: Joi.string()
                .pattern(/^\(\d{2}\) \d{4,5}-\d{4}$/)
                .optional(),
            birth_date: Joi.date().max('now').optional(),
            gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER').optional(),
            role: Joi.string().valid('ADMIN', 'CUSTOMER', 'SELLER').optional(),
            is_active: Joi.boolean().optional(),
            email_verified: Joi.boolean().optional(),
            phone_verified: Joi.boolean().optional(),
            address: Joi.object({
                street: Joi.string().optional(),
                number: Joi.string().optional(),
                complement: Joi.string().optional(),
                neighborhood: Joi.string().optional(),
                city: Joi.string().optional(),
                state: Joi.string().optional(),
                zip_code: Joi.string().optional(),
                country: Joi.string().optional()
            }).optional(),
            preferences: Joi.object({
                language: Joi.string().valid('pt-BR', 'en-US', 'es-ES').optional(),
                notifications: Joi.object({
                    email: Joi.boolean().optional(),
                    sms: Joi.boolean().optional(),
                    push: Joi.boolean().optional()
                }).optional(),
                theme: Joi.string().valid('light', 'dark').optional()
            }).optional(),
            marketing_consent: Joi.boolean().optional(),
            newsletter_subscription: Joi.boolean().optional(),
            external_id: Joi.string().optional(),
            integration_source: Joi.string().optional()
        })
    },

    softDelete: {
        params: Joi.object({
            id: Joi.string().uuid().required()
        })
    }
};
