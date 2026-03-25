"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listContacts = listContacts;
exports.getContact = getContact;
exports.createContact = createContact;
exports.updateContact = updateContact;
exports.deleteContact = deleteContact;
const prisma_1 = require("../../config/prisma");
const errors_1 = require("../../utils/errors");
async function listContacts(userId) {
    return prisma_1.prisma.contact.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });
}
async function getContact(userId, id) {
    const contact = await prisma_1.prisma.contact.findFirst({
        where: { id, userId },
    });
    if (!contact) {
        throw new errors_1.AppError('Contacto no encontrado.', 404);
    }
    return contact;
}
async function createContact(userId, data) {
    return prisma_1.prisma.contact.create({
        data: {
            userId,
            name: data.name,
            phone: data.phone ?? null,
            email: data.email ?? null,
        },
    });
}
async function updateContact(userId, id, data) {
    const contact = await prisma_1.prisma.contact.findFirst({
        where: { id, userId },
    });
    if (!contact) {
        throw new errors_1.AppError('Contacto no encontrado.', 404);
    }
    return prisma_1.prisma.contact.update({
        where: { id },
        data: {
            name: data.name,
            phone: data.phone,
            email: data.email,
        },
    });
}
async function deleteContact(userId, id) {
    const contact = await prisma_1.prisma.contact.findFirst({
        where: { id, userId },
    });
    if (!contact) {
        throw new errors_1.AppError('Contacto no encontrado.', 404);
    }
    await prisma_1.prisma.contact.delete({ where: { id } });
    return { message: 'Contacto eliminado.' };
}
