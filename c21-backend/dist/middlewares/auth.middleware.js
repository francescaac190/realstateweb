"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
exports.optionalAuthMiddleware = optionalAuthMiddleware;
const jwt_1 = require("../utils/jwt");
const errors_1 = require("../utils/errors");
function authMiddleware(req, _res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        next(new errors_1.AppError('Token requerido.', 401));
        return;
    }
    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) {
        next(new errors_1.AppError('Token invalido.', 401));
        return;
    }
    try {
        const payload = (0, jwt_1.verifyAccessToken)(token);
        req.user = { id: payload.sub };
        next();
    }
    catch {
        next(new errors_1.AppError('Token invalido o expirado.', 401));
    }
}
// Optional auth: attach user if token is valid; ignore invalid/missing tokens.
function optionalAuthMiddleware(req, _res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        next();
        return;
    }
    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) {
        next();
        return;
    }
    try {
        const payload = (0, jwt_1.verifyAccessToken)(token);
        req.user = { id: payload.sub };
    }
    catch {
        // Ignore invalid token for public endpoints.
    }
    next();
}
