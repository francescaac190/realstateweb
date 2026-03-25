"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAwards = listAwards;
exports.getAward = getAward;
exports.createAward = createAward;
exports.updateAward = updateAward;
exports.deleteAward = deleteAward;
const prisma_1 = require("../../config/prisma");
const errors_1 = require("../../utils/errors");
async function listAwards(userId) {
    return prisma_1.prisma.award.findMany({
        where: { userId },
        orderBy: { receivedAt: 'desc' },
    });
}
async function getAward(userId, id) {
    const award = await prisma_1.prisma.award.findFirst({
        where: { id, userId },
    });
    if (!award) {
        throw new errors_1.AppError('Premio no encontrado.', 404);
    }
    return award;
}
async function createAward(userId, data) {
    return prisma_1.prisma.award.create({
        data: {
            userId,
            name: data.name,
            receivedAt: new Date(data.receivedAt),
            imageUrl: data.imageUrl ?? null,
        },
    });
}
async function updateAward(userId, id, data) {
    const award = await prisma_1.prisma.award.findFirst({
        where: { id, userId },
    });
    if (!award) {
        throw new errors_1.AppError('Premio no encontrado.', 404);
    }
    return prisma_1.prisma.award.update({
        where: { id },
        data: {
            name: data.name,
            receivedAt: data.receivedAt ? new Date(data.receivedAt) : undefined,
            imageUrl: data.imageUrl,
        },
    });
}
async function deleteAward(userId, id) {
    const award = await prisma_1.prisma.award.findFirst({
        where: { id, userId },
    });
    if (!award) {
        throw new errors_1.AppError('Premio no encontrado.', 404);
    }
    await prisma_1.prisma.award.delete({ where: { id } });
    return { message: 'Premio eliminado.' };
}
