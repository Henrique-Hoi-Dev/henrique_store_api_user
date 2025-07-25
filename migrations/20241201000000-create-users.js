'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Users', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false
            },
            cpf: {
                type: Sequelize.STRING,
                allowNull: true,
                unique: true
            },
            phone: {
                type: Sequelize.STRING,
                allowNull: true
            },
            birth_date: {
                type: Sequelize.DATEONLY,
                allowNull: true
            },
            gender: {
                type: Sequelize.ENUM('MALE', 'FEMALE', 'OTHER'),
                allowNull: true
            },
            role: {
                type: Sequelize.ENUM('ADMIN', 'CUSTOMER', 'SELLER', 'USER'),
                defaultValue: 'CUSTOMER',
                allowNull: false
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                defaultValue: true
            },
            email_verified: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            phone_verified: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            last_login: {
                type: Sequelize.DATE,
                allowNull: true
            },
            address: {
                type: Sequelize.JSONB,
                allowNull: true
            },
            preferences: {
                type: Sequelize.JSONB,
                allowNull: true
            },
            marketing_consent: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            newsletter_subscription: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            external_id: {
                type: Sequelize.STRING,
                allowNull: true
            },
            integration_source: {
                type: Sequelize.STRING,
                allowNull: true
            },
            created_by: {
                type: Sequelize.UUID,
                allowNull: true
            },
            updated_by: {
                type: Sequelize.UUID,
                allowNull: true
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });

        // Criar índices
        await queryInterface.addIndex('Users', ['email']);
        await queryInterface.addIndex('Users', ['cpf']);
        await queryInterface.addIndex('Users', ['role']);
        await queryInterface.addIndex('Users', ['is_active']);
        await queryInterface.addIndex('Users', ['external_id']);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Users');
    }
};
