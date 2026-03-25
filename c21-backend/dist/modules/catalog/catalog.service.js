"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listRoles = listRoles;
exports.listCurrencies = listCurrencies;
exports.listPropertyTypes = listPropertyTypes;
exports.listPropertyStatuses = listPropertyStatuses;
exports.listCities = listCities;
exports.listZones = listZones;
exports.listBranches = listBranches;
const prisma_1 = require("../../config/prisma");
function listRoles() {
    return prisma_1.prisma.role.findMany({ orderBy: { name: 'asc' } });
}
function listCurrencies() {
    return prisma_1.prisma.currency.findMany({ orderBy: { code: 'asc' } });
}
function listPropertyTypes() {
    return prisma_1.prisma.propertyType.findMany({ orderBy: { name: 'asc' } });
}
function listPropertyStatuses() {
    return prisma_1.prisma.propertyStatus.findMany({ orderBy: { name: 'asc' } });
}
function listCities() {
    return prisma_1.prisma.city.findMany({ orderBy: { name: 'asc' } });
}
function listZones(cityId) {
    return prisma_1.prisma.zone.findMany({
        where: { cityId },
        orderBy: { name: 'asc' },
    });
}
function listBranches() {
    return prisma_1.prisma.branch.findMany({ orderBy: { name: 'asc' } });
}
