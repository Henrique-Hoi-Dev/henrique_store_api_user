/**
 * Role-Based Access Control (RBAC) Middleware
 * Simple and performant access control based on user roles
 */

const logger = require('../utils/logger');

/**
 * Check if user is authenticated
 */
const isAuthenticated = (req) => {
    return req.locals && req.locals.user;
};

/**
 * Check if user has required role(s)
 */
const hasRole = (userRole, requiredRoles) => {
    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    return roles.includes(userRole);
};

/**
 * Check if user is admin
 */
const isAdmin = (userRole) => {
    return userRole === 'ADMIN';
};

/**
 * Check if user owns the resource or is admin
 */
const ownsResource = (userId, resourceId, userRole) => {
    return isAdmin(userRole) || userId === resourceId;
};

/**
 * Create error response
 */
const createError = (message, status, key) => {
    const error = new Error(message);
    error.status = status;
    error.key = key;
    return error;
};

/**
 * Role-based access control middleware
 */
const requireRole = (requiredRoles) => {
    return (req, res, next) => {
        try {
            // Check authentication
            if (!isAuthenticated(req)) {
                return next(createError('Authentication required', 401, 'AUTHENTICATION_REQUIRED'));
            }

            const user = req.locals.user;
            const userRole = user.role;

            // Check role
            if (!hasRole(userRole, requiredRoles)) {
                logger.warn(`Access denied: User ${user.id} (${userRole}) - Required: ${requiredRoles}`);
                return next(createError('Insufficient permissions', 403, 'INSUFFICIENT_PERMISSIONS'));
            }

            logger.info(`Access granted: User ${user.id} (${userRole})`);
            next();
        } catch (error) {
            logger.error('RBAC middleware error:', error);
            next(error);
        }
    };
};

/**
 * Resource ownership middleware
 */
const requireOwnershipOrAdmin = (resourceIdParam = 'id') => {
    return (req, res, next) => {
        try {
            // Check authentication
            if (!isAuthenticated(req)) {
                return next(createError('Authentication required', 401, 'AUTHENTICATION_REQUIRED'));
            }

            const user = req.locals.user;
            const resourceId = req.params[resourceIdParam];

            // Check ownership or admin
            if (!ownsResource(user.id, resourceId, user.role)) {
                logger.warn(`Access denied: User ${user.id} (${user.role}) - Resource: ${resourceId}`);
                return next(createError('Insufficient permissions', 403, 'INSUFFICIENT_PERMISSIONS'));
            }

            next();
        } catch (error) {
            logger.error('Ownership middleware error:', error);
            next(error);
        }
    };
};

/**
 * Active user validation middleware
 */
const requireActiveUser = () => {
    return (req, res, next) => {
        try {
            // Check authentication
            if (!isAuthenticated(req)) {
                return next(createError('Authentication required', 401, 'AUTHENTICATION_REQUIRED'));
            }

            const user = req.locals.user;

            // Validate user data
            if (!user.id || !user.email || !user.role) {
                logger.warn(`Invalid user data: ${user.id}`);
                return next(createError('Invalid user data', 401, 'INVALID_USER_DATA'));
            }

            next();
        } catch (error) {
            logger.error('Active user middleware error:', error);
            next(error);
        }
    };
};

/**
 * Email verification middleware
 */
const requireVerifiedEmail = () => {
    return (req, res, next) => {
        try {
            // Check authentication
            if (!isAuthenticated(req)) {
                return next(createError('Authentication required', 401, 'AUTHENTICATION_REQUIRED'));
            }

            const user = req.locals.user;

            // Check email verification
            if (!user.email_verified) {
                logger.warn(`Unverified user ${user.id} tried to access protected endpoint`);
                return next(createError('Email verification required', 403, 'EMAIL_VERIFICATION_REQUIRED'));
            }

            next();
        } catch (error) {
            logger.error('Email verification middleware error:', error);
            next(error);
        }
    };
};

/**
 * Simple authentication check
 */
const requireAuthenticated = (req, res, next) => {
    if (!isAuthenticated(req)) {
        return next(createError('Authentication required', 401, 'AUTHENTICATION_REQUIRED'));
    }
    next();
};

/**
 * Pre-configured RBAC middleware
 */
const RBAC = {
    requireAdmin: requireRole('ADMIN'),
    requireSeller: requireRole('SELLER'),
    requireBuyer: requireRole('BUYER'),
    requireAdminOrSeller: requireRole(['ADMIN', 'SELLER']),
    requireAdminOrBuyer: requireRole(['ADMIN', 'BUYER']),
    requireAuthenticated
};

module.exports = {
    requireRole,
    requireOwnershipOrAdmin,
    requireActiveUser,
    requireVerifiedEmail,
    RBAC
};
