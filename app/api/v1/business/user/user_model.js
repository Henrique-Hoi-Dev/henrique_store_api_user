const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../../../config/database');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

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
            allowNull: true
        },
        hash_password: {
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
        // Address
        address: {
            type: DataTypes.JSONB,
            allowNull: true,
            comment: 'Complete user address'
        },
        // User preferences
        preferences: {
            type: DataTypes.JSONB,
            allowNull: true,
            comment: 'User preferences (notifications, language, etc.)'
        },
        // Marketing data
        marketing_consent: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        newsletter_subscription: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        // Integration data
        external_id: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'External ID for integration with other systems'
        },
        integration_source: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Integration source (facebook, google, etc.)'
        },
        // Audit data
        created_by: {
            type: DataTypes.UUID,
            allowNull: true,
            comment: 'ID of user who created this record'
        },
        updated_by: {
            type: DataTypes.UUID,
            allowNull: true,
            comment: 'ID of user who updated this record'
        },
        // Password reset fields
        reset_token_hash: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Hash of password reset token'
        },
        reset_token_expires: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Token expiration date'
        },
        password_changed_at: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Date of last password change'
        },
        // Additional fields for e-commerce
        failed_login_attempts: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            comment: 'Number of failed login attempts'
        },
        locked_until: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Date until account is locked'
        },
        last_password_change: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Date of last password change'
        },
        password_history: {
            type: DataTypes.JSONB,
            allowNull: true,
            comment: 'History of recent passwords (to prevent reuse)'
        },
        // Security data
        two_factor_enabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: 'Whether two-factor authentication is enabled'
        },
        two_factor_secret: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Secret for 2FA (TOTP)'
        },
        backup_codes: {
            type: DataTypes.JSONB,
            allowNull: true,
            comment: 'Backup codes for 2FA'
        },
        // Compliance data (LGPD/GDPR)
        data_processing_consent: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: 'Consent for data processing'
        },
        consent_date: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Consent date'
        },
        data_deletion_requested: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: 'Whether user requested data deletion'
        },
        data_deletion_date: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Scheduled data deletion date'
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
        ],
        hooks: {
            beforeCreate: async (user) => {
                if (!user.password) {
                    throw new Error('Password is required for user creation');
                }

                // Hash the password
                user.hash_password = await user.hashPassword(user.password);
                user.last_password_change = new Date();
            }
        }
    }
);

// Instance methods for password hashing
User.prototype.hashPassword = async function (password) {
    try {
        // Generate salt with 10 rounds for development
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        throw new Error(`Error generating password hash: ${error.message}`);
    }
};

// Método para validar senha
User.prototype.validatePassword = async function (password) {
    try {
        // Compare provided password with stored hash
        const isValid = await bcrypt.compare(password, this.hash_password);
        return isValid;
    } catch (error) {
        throw new Error(`Error validating password: ${error.message}`);
    }
};

// Método para gerar token de reset de senha
User.prototype.generatePasswordResetToken = function () {
    try {
        // Generate random token of 32 bytes
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Generate token hash to store in database
        const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Set expiration (1 hour)
        const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);

        return {
            resetToken,
            resetTokenHash,
            resetTokenExpires
        };
    } catch (error) {
        throw new Error(`Error generating reset token: ${error.message}`);
    }
};

// Método para validar token de reset
User.prototype.validatePasswordResetToken = function (token) {
    try {
        if (!this.reset_token_hash || !this.reset_token_expires) {
            return false;
        }

        // Check if token expired
        if (new Date() > this.reset_token_expires) {
            return false;
        }

        // Generate hash of provided token
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

        // Compare with stored hash
        return tokenHash === this.reset_token_hash;
    } catch (error) {
        throw new Error(`Error validating reset token: ${error.message}`);
    }
};

// Método para limpar token de reset
User.prototype.clearPasswordResetToken = function () {
    this.reset_token_hash = null;
    this.reset_token_expires = null;
    return this.save();
};

// Security methods for e-commerce
User.prototype.incrementFailedLoginAttempts = async function () {
    this.failed_login_attempts += 1;

    // Lock account after 5 failed attempts for 30 minutes
    if (this.failed_login_attempts >= 5) {
        this.locked_until = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    }

    return await this.save();
};

User.prototype.resetFailedLoginAttempts = async function () {
    this.failed_login_attempts = 0;
    this.locked_until = null;
    return await this.save();
};

User.prototype.isAccountLocked = function () {
    if (!this.locked_until) return false;
    return new Date() < this.locked_until;
};

User.prototype.addPasswordToHistory = async function (password) {
    const history = this.password_history || [];
    const hashedPassword = await this.hashPassword(password);

    // Keep only the last 5 passwords
    history.push({
        hash: hashedPassword,
        changed_at: new Date()
    });

    if (history.length > 5) {
        history.shift(); // Remove oldest password
    }

    this.password_history = history;
    this.last_password_change = new Date();
    return await this.save();
};

User.prototype.isPasswordInHistory = async function (newPassword) {
    if (!this.password_history || this.password_history.length === 0) {
        return false;
    }

    for (const passwordEntry of this.password_history) {
        const isValid = await bcrypt.compare(newPassword, passwordEntry.hash);
        if (isValid) return true;
    }

    return false;
};

// Method to check password strength
User.prototype.validatePasswordStrength = function (password) {
    const minLength = 6; // Reduced for development
    const hasNumbers = /\d/.test(password);

    const errors = [];

    if (password.length < minLength) {
        errors.push(`Password must have at least ${minLength} characters`);
    }
    if (!hasNumbers) {
        errors.push('Password must contain at least one number');
    }

    return {
        isValid: errors.length === 0,
        errors,
        score: [password.length >= minLength, hasNumbers].filter(Boolean).length
    };
};

// Hook for automatic password hashing before updating
User.beforeUpdate(async (user) => {
    if (user.changed('password') && user.password) {
        // Validate password strength
        const strengthCheck = user.validatePasswordStrength(user.password);
        if (!strengthCheck.isValid) {
            throw new Error(`Password does not meet security requirements: ${strengthCheck.errors.join(', ')}`);
        }

        // Check if password is not in history
        const isInHistory = await user.isPasswordInHistory(user.password);
        if (isInHistory) {
            throw new Error('New password cannot be the same as the last 5 passwords used');
        }

        // Add current password to history before updating
        if (user.hash_password) {
            await user.addPasswordToHistory(user.password);
        }

        user.hash_password = await user.hashPassword(user.password);
        user.last_password_change = new Date();
        // Remove plain text password
        user.password = undefined;
    }
});

// Static methods for common operations
User.findByEmail = async function (email) {
    return await this.findOne({ where: { email: email.toLowerCase() } });
};

User.findByCPF = async function (cpf) {
    return await this.findOne({ where: { cpf: cpf } });
};

User.findActiveUsers = async function () {
    return await this.findAll({ where: { is_active: true } });
};

User.findByRole = async function (role) {
    return await this.findAll({ where: { role: role } });
};

// Method to create user with automatic hash
User.createWithHash = async function (userData) {
    try {
        if (!userData.password) {
            throw new Error('Password is required for user creation');
        }

        // Hash the password before creating
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

        // Create user with hashed password
        const user = await this.create({
            ...userData,
            hash_password: hashedPassword,
            last_password_change: new Date()
        });

        return user;
    } catch (error) {
        throw new Error(`Error creating user: ${error.message}`);
    }
};

// Método para atualizar senha
User.updatePassword = async function (userId, newPassword) {
    try {
        const user = await this.findByPk(userId);
        if (!user) {
            throw new Error('User not found');
        }

        user.password = newPassword;
        await user.save();

        return user;
    } catch (error) {
        throw new Error(`Error updating password: ${error.message}`);
    }
};

module.exports = User;
