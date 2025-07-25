const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../../../config/database');

const User = sequelize.define(
    'User',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        cpf: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true
        },
        birth_date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        gender: {
            type: DataTypes.ENUM('MALE', 'FEMALE', 'OTHER'),
            allowNull: true
        },
        role: {
            type: DataTypes.ENUM('ADMIN', 'CUSTOMER', 'SELLER'),
            defaultValue: 'CUSTOMER',
            allowNull: false
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        email_verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        phone_verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        last_login: {
            type: DataTypes.DATE,
            allowNull: true
        },
        // Endereço
        address: {
            type: DataTypes.JSONB,
            allowNull: true,
            comment: 'Endereço completo do usuário'
        },
        // Preferências do usuário
        preferences: {
            type: DataTypes.JSONB,
            allowNull: true,
            comment: 'Preferências do usuário (notificações, idioma, etc.)'
        },
        // Dados de marketing
        marketing_consent: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        newsletter_subscription: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        // Dados de integração
        external_id: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'ID externo para integração com outros sistemas'
        },
        integration_source: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Fonte da integração (facebook, google, etc.)'
        },
        // Dados de auditoria
        created_by: {
            type: DataTypes.UUID,
            allowNull: true,
            comment: 'ID do usuário que criou este registro'
        },
        updated_by: {
            type: DataTypes.UUID,
            allowNull: true,
            comment: 'ID do usuário que atualizou este registro'
        }
    },
    {
        tableName: 'Users',
        underscored: true,
        timestamps: true,
        indexes: [
            {
                fields: ['email']
            },
            {
                fields: ['cpf']
            },
            {
                fields: ['role']
            },
            {
                fields: ['is_active']
            },
            {
                fields: ['external_id']
            }
        ]
    }
);

module.exports = User;
