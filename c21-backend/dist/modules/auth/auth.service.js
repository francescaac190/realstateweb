"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.refresh = refresh;
exports.changePassword = changePassword;
const crypto_1 = __importDefault(require("crypto"));
const prisma_1 = require("../../config/prisma");
const errors_1 = require("../../utils/errors");
const password_1 = require("../../utils/password");
const jwt_1 = require("../../utils/jwt");
function hashToken(token) {
    return crypto_1.default.createHash('sha256').update(token).digest('hex');
}
async function issueTokens(userId) {
    const accessToken = (0, jwt_1.signAccessToken)(userId);
    const tokenId = crypto_1.default.randomUUID();
    const refreshToken = (0, jwt_1.signRefreshToken)(userId, tokenId);
    const tokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + jwt_1.refreshTokenExpiresInMs);
    await prisma_1.prisma.refreshToken.create({
        data: {
            id: tokenId,
            userId,
            tokenHash,
            expiresAt,
        },
    });
    return { accessToken, refreshToken };
}
async function generateUsername(email) {
    const base = email
        .split('@')[0]
        .toLowerCase()
        .replace(/[^a-z0-9._-]/g, '');
    let candidate = base;
    let counter = 1;
    while (await prisma_1.prisma.user.findUnique({ where: { username: candidate } })) {
        candidate = `${base}${counter}`;
        counter += 1;
    }
    return candidate;
}
const safeUserSelect = {
    id: true,
    firstName: true,
    lastName: true,
    email: true,
    phone: true,
    username: true,
    roleId: true,
    status: true,
    cityId: true,
    branchId: true,
    createdAt: true,
    updatedAt: true,
};
async function register(firstName, lastName, email, password, phone) {
    const normalizedEmail = email.trim().toLowerCase();
    const exists = await prisma_1.prisma.user.findUnique({
        where: { email: normalizedEmail },
    });
    if (exists) {
        throw new errors_1.AppError('El correo ya se encuentra en uso.', 400);
    }
    const role = await prisma_1.prisma.role.findUnique({ where: { code: 'AGENT' } });
    if (!role) {
        throw new errors_1.AppError('El rol AGENT no fue encontrado.', 500);
    }
    const username = await generateUsername(normalizedEmail);
    const passwordHash = await (0, password_1.hashPassword)(password);
    const user = await prisma_1.prisma.user.create({
        data: {
            firstName,
            lastName,
            email: normalizedEmail,
            phone: phone ?? null,
            username,
            passwordHash,
            roleId: role.id,
            status: 'ACTIVE',
        },
        select: safeUserSelect,
    });
    const tokens = await issueTokens(user.id);
    return { user: user, ...tokens };
}
async function login(email, password) {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await prisma_1.prisma.user.findUnique({
        where: { email: normalizedEmail },
    });
    if (!user) {
        throw new errors_1.AppError('Usuario no encontrado.', 404);
    }
    const valid = await (0, password_1.verifyPassword)(password, user.passwordHash);
    if (!valid) {
        throw new errors_1.AppError('Credenciales invalidas.', 401);
    }
    const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        username: user.username,
        roleId: user.roleId,
        status: user.status,
        cityId: user.cityId,
        branchId: user.branchId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
    const tokens = await issueTokens(user.id);
    return { user: safeUser, ...tokens };
}
async function refresh(refreshToken) {
    const payload = (0, jwt_1.verifyRefreshToken)(refreshToken);
    const tokenHash = hashToken(refreshToken);
    const stored = await prisma_1.prisma.refreshToken.findUnique({
        where: { tokenHash },
    });
    if (!stored ||
        stored.revokedAt ||
        stored.expiresAt < new Date() ||
        stored.userId !== payload.sub ||
        stored.id !== payload.tokenId) {
        throw new errors_1.AppError('Refresh token invalido.', 401);
    }
    await prisma_1.prisma.refreshToken.update({
        where: { id: stored.id },
        data: { revokedAt: new Date() },
    });
    return issueTokens(stored.userId);
}
async function changePassword(userId, currentPassword, newPassword) {
    const user = await prisma_1.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new errors_1.AppError('Usuario no encontrado.', 404);
    }
    const valid = await (0, password_1.verifyPassword)(currentPassword, user.passwordHash);
    if (!valid) {
        throw new errors_1.AppError('Password actual incorrecto.', 401);
    }
    const passwordHash = await (0, password_1.hashPassword)(newPassword);
    await prisma_1.prisma.user.update({
        where: { id: userId },
        data: { passwordHash },
    });
    await prisma_1.prisma.refreshToken.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() },
    });
    return { message: 'Password actualizado.' };
}
