"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listProperties = listProperties;
exports.getPropertyById = getPropertyById;
exports.createProperty = createProperty;
exports.updateProperty = updateProperty;
exports.deleteProperty = deleteProperty;
const client_1 = require("@prisma/client");
const prisma_1 = require("../../config/prisma");
const errors_1 = require("../../utils/errors");
const propertyInclude = {
    currency: true,
    type: true,
    status: true,
    city: true,
    zone: true,
    media: true,
    agent: {
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
        },
    },
};
function toDecimal(value) {
    if (value === undefined) {
        return undefined;
    }
    return new client_1.Prisma.Decimal(value);
}
async function listProperties(filters) {
    return prisma_1.prisma.property.findMany({
        where: {
            cityId: filters?.cityId,
            typeId: filters?.typeId,
            statusId: filters?.statusId,
            agentId: filters?.agentId,
            isDraft: filters?.isDraft,
        },
        include: propertyInclude,
        orderBy: { createdAt: 'desc' },
    });
}
async function getPropertyById(id, options) {
    const property = await prisma_1.prisma.property.findUnique({
        where: { id },
        include: propertyInclude,
    });
    if (!property) {
        throw new errors_1.AppError('Propiedad no encontrada.', 404);
    }
    if (property.isDraft && !options?.allowDrafts) {
        throw new errors_1.AppError('Propiedad no encontrada.', 404);
    }
    return property;
}
async function createProperty(data) {
    if (!data.isDraft) {
        if (!data.currencyId || !data.typeId || !data.statusId) {
            throw new errors_1.AppError('currencyId, typeId y statusId son requeridos.', 400);
        }
    }
    return prisma_1.prisma.property.create({
        data: {
            title: data.title,
            description: data.description ?? null,
            pricePerM2: toDecimal(data.pricePerM2),
            totalPrice: toDecimal(data.totalPrice),
            currencyId: data.currencyId ?? null,
            typeId: data.typeId ?? null,
            statusId: data.statusId ?? null,
            areaM2: toDecimal(data.areaM2),
            builtAreaM2: toDecimal(data.builtAreaM2),
            frontM2: toDecimal(data.frontM2),
            depthM2: toDecimal(data.depthM2),
            address: data.address ?? null,
            cityId: data.cityId ?? null,
            zoneId: data.zoneId ?? null,
            lat: data.lat ?? null,
            lng: data.lng ?? null,
            bedrooms: data.bedrooms ?? null,
            bathrooms: data.bathrooms ?? null,
            suites: data.suites ?? null,
            parking: data.parking ?? null,
            isDraft: data.isDraft ?? false,
            agentId: data.agentId ?? null,
            media: data.media
                ? {
                    create: data.media.map((item) => ({
                        type: item.type,
                        url: item.url,
                        order: item.order ?? 0,
                    })),
                }
                : undefined,
        },
        include: propertyInclude,
    });
}
async function updateProperty(id, data) {
    const property = await prisma_1.prisma.property.findUnique({ where: { id } });
    if (!property) {
        throw new errors_1.AppError('Propiedad no encontrada.', 404);
    }
    const updated = await prisma_1.prisma.property.update({
        where: { id },
        data: {
            title: data.title,
            description: data.description,
            pricePerM2: toDecimal(data.pricePerM2),
            totalPrice: toDecimal(data.totalPrice),
            currencyId: data.currencyId,
            typeId: data.typeId,
            statusId: data.statusId,
            areaM2: toDecimal(data.areaM2),
            builtAreaM2: toDecimal(data.builtAreaM2),
            frontM2: toDecimal(data.frontM2),
            depthM2: toDecimal(data.depthM2),
            address: data.address,
            cityId: data.cityId,
            zoneId: data.zoneId,
            lat: data.lat,
            lng: data.lng,
            bedrooms: data.bedrooms,
            bathrooms: data.bathrooms,
            suites: data.suites,
            parking: data.parking,
            isDraft: data.isDraft,
            agentId: data.agentId,
        },
        include: propertyInclude,
    });
    if (data.media) {
        await prisma_1.prisma.$transaction([
            prisma_1.prisma.propertyMedia.deleteMany({ where: { propertyId: id } }),
            prisma_1.prisma.propertyMedia.createMany({
                data: data.media.map((item) => ({
                    propertyId: id,
                    type: item.type,
                    url: item.url,
                    order: item.order ?? 0,
                })),
            }),
        ]);
    }
    return updated;
}
async function deleteProperty(id) {
    const property = await prisma_1.prisma.property.findUnique({ where: { id } });
    if (!property) {
        throw new errors_1.AppError('Propiedad no encontrada.', 404);
    }
    await prisma_1.prisma.property.delete({ where: { id } });
    return { message: 'Propiedad eliminada.' };
}
