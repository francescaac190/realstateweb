"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenExpiresInMs = void 0;
exports.signAccessToken = signAccessToken;
exports.signRefreshToken = signRefreshToken;
exports.verifyAccessToken = verifyAccessToken;
exports.verifyRefreshToken = verifyRefreshToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || JWT_SECRET;
if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
    throw new Error('JWT secrets are not configured.');
}
const ACCESS_TOKEN_TTL = process.env.ACCESS_TOKEN_TTL ?? '15m';
const REFRESH_TOKEN_TTL_DAYS = Number(process.env.REFRESH_TOKEN_TTL_DAYS ?? 30);
const REFRESH_TOKEN_TTL = process.env.REFRESH_TOKEN_TTL ?? `${REFRESH_TOKEN_TTL_DAYS}d`;
function signAccessToken(userId) {
    return jsonwebtoken_1.default.sign({ sub: userId, type: 'access' }, JWT_SECRET, {
        expiresIn: ACCESS_TOKEN_TTL,
    });
}
function signRefreshToken(userId, tokenId) {
    return jsonwebtoken_1.default.sign({ sub: userId, type: 'refresh', tokenId }, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_TTL });
}
function verifyAccessToken(token) {
    const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
    if (!payload?.sub || payload.type !== 'access') {
        throw new Error('Invalid access token');
    }
    return payload;
}
function verifyRefreshToken(token) {
    const payload = jsonwebtoken_1.default.verify(token, JWT_REFRESH_SECRET);
    if (!payload?.sub || payload.type !== 'refresh' || !payload.tokenId) {
        throw new Error('Invalid refresh token');
    }
    return payload;
}
exports.refreshTokenExpiresInMs = REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000;
