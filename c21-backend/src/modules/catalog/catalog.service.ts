import { prisma } from '../../config/prisma';

export function listRoles() {
  return prisma.role.findMany({ orderBy: { name: 'asc' } });
}

export function listCurrencies() {
  return prisma.currency.findMany({ orderBy: { code: 'asc' } });
}

export function listPropertyTypes() {
  return prisma.propertyType.findMany({ orderBy: { name: 'asc' } });
}

export function listPropertyStatuses() {
  return prisma.propertyStatus.findMany({ orderBy: { name: 'asc' } });
}

export function listCities() {
  return prisma.city.findMany({ orderBy: { name: 'asc' } });
}

export function listZones(cityId?: number) {
  return prisma.zone.findMany({
    where: { cityId },
    orderBy: { name: 'asc' },
  });
}

export function listBranches() {
  return prisma.branch.findMany({ orderBy: { name: 'asc' } });
}
