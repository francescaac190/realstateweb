"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsers = listUsers;
exports.getUserById = getUserById;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
const prisma_1 = require("../../config/prisma");
const errors_1 = require("../../utils/errors");
const password_1 = require("../../utils/password");
const userSelect = {
    id: true,
    firstName: true,
    lastName: true,
    email: true,
    phone: true,
    username: true,
    documentNumber: true,
    address: true,
    cityId: true,
    roleId: true,
    branchId: true,
    hireDate: true,
    status: true,
    isVerified: true,
    verifiedAt: true,
    createdAt: true,
    updatedAt: true,
    socialAccounts: true,
    role: { select: { id: true, code: true, name: true } },
    city: { select: { id: true, name: true } },
    branch: { select: { id: true, name: true } },
};
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
async function listUsers(filters) {
    return prisma_1.prisma.user.findMany({
        where: {
            status: filters?.status,
            roleId: filters?.roleId,
            branchId: filters?.branchId,
        },
        select: userSelect,
        orderBy: { createdAt: 'desc' },
    });
}
async function getUserById(id) {
    const user = await prisma_1.prisma.user.findUnique({
        where: { id },
        select: userSelect,
    });
    if (!user) {
        throw new errors_1.AppError('Usuario no encontrado.', 404);
    }
    return user;
}
async function createUser(data) {
    const normalizedEmail = data.email.trim().toLowerCase();
    const exists = await prisma_1.prisma.user.findUnique({
        where: { email: normalizedEmail },
    });
    if (exists) {
        throw new errors_1.AppError('El correo ya se encuentra en uso.', 400);
    }
    const roleId = data.roleId ?? (await getAgentRoleId());
    const username = await generateUsername(normalizedEmail);
    const passwordHash = await (0, password_1.hashPassword)(data.password);
    return prisma_1.prisma.user.create({
        data: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: normalizedEmail,
            phone: data.phone ?? null,
            username,
            passwordHash,
            documentNumber: data.documentNumber ?? null,
            address: data.address ?? null,
            cityId: data.cityId ?? null,
            roleId,
            branchId: data.branchId ?? null,
            hireDate: data.hireDate ? new Date(data.hireDate) : null,
            status: data.status ?? 'ACTIVE',
            isVerified: data.isVerified ?? false,
            socialAccounts: data.socialAccounts
                ? {
                    create: data.socialAccounts.map((account) => ({
                        provider: account.provider,
                        handle: account.handle,
                        isVerified: account.isVerified ?? false,
                    })),
                }
                : undefined,
        },
        select: userSelect,
    });
}
async function updateUser(id, data) {
    const user = await prisma_1.prisma.user.findUnique({ where: { id } });
    if (!user) {
        throw new errors_1.AppError('Usuario no encontrado.', 404);
    }
    const updateData = {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        documentNumber: data.documentNumber,
        address: data.address,
        cityId: data.cityId,
        roleId: data.roleId,
        branchId: data.branchId,
        hireDate: data.hireDate ? new Date(data.hireDate) : undefined,
        status: data.status,
        isVerified: data.isVerified,
    };
    if (data.email) {
        const normalizedEmail = data.email.trim().toLowerCase();
        if (normalizedEmail !== user.email) {
            const exists = await prisma_1.prisma.user.findUnique({
                where: { email: normalizedEmail },
            });
            if (exists) {
                throw new errors_1.AppError('El correo ya se encuentra en uso.', 400);
            }
        }
        updateData.email = normalizedEmail;
        updateData.username = await generateUsername(normalizedEmail);
    }
    if (data.password) {
        updateData.passwordHash = await (0, password_1.hashPassword)(data.password);
    }
    const updatedUser = await prisma_1.prisma.user.update({
        where: { id },
        data: updateData,
        select: userSelect,
    });
    if (data.socialAccounts?.length) {
        const operations = data.socialAccounts.map((account) => prisma_1.prisma.userSocialAccount.upsert({
            where: {
                userId_provider: {
                    userId: id,
                    provider: account.provider,
                },
            },
            update: {
                handle: account.handle,
                isVerified: account.isVerified ?? false,
            },
            create: {
                userId: id,
                provider: account.provider,
                handle: account.handle,
                isVerified: account.isVerified ?? false,
            },
        }));
        await prisma_1.prisma.$transaction(operations);
    }
    return updatedUser;
}
async function deleteUser(id) {
    const user = await prisma_1.prisma.user.findUnique({ where: { id } });
    if (!user) {
        throw new errors_1.AppError('Usuario no encontrado.', 404);
    }
    await prisma_1.prisma.user.delete({ where: { id } });
    return { message: 'Usuario eliminado.' };
}
async function getAgentRoleId() {
    const role = await prisma_1.prisma.role.findUnique({ where: { code: 'AGENT' } });
    if (!role) {
        throw new errors_1.AppError('El rol AGENT no fue encontrado.', 500);
    }
    return role.id;
}
