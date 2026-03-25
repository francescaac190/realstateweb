import { Prisma } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { AppError } from '../../utils/errors';

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

function toDecimal(value?: number) {
  if (value === undefined) {
    return undefined;
  }
  return new Prisma.Decimal(value);
}

export async function listProperties(filters?: {
  cityId?: number;
  typeId?: number;
  statusId?: number;
  agentId?: string;
  isDraft?: boolean;
}) {
  return prisma.property.findMany({
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

export async function getPropertyById(
  id: string,
  options?: { allowDrafts?: boolean },
) {
  const property = await prisma.property.findUnique({
    where: { id },
    include: propertyInclude,
  });

  if (!property) {
    throw new AppError('Propiedad no encontrada.', 404);
  }

  if (property.isDraft && !options?.allowDrafts) {
    throw new AppError('Propiedad no encontrada.', 404);
  }

  return property;
}

export async function createProperty(data: {
  title: string;
  description?: string;
  pricePerM2?: number;
  totalPrice?: number;
  currencyId?: number;
  typeId?: number;
  statusId?: number;
  areaM2?: number;
  builtAreaM2?: number;
  frontM2?: number;
  depthM2?: number;
  address?: string;
  cityId?: number;
  zoneId?: number;
  lat?: number;
  lng?: number;
  bedrooms?: number;
  bathrooms?: number;
  suites?: number;
  parking?: number;
  isDraft?: boolean;
  agentId?: string;
  media?: Array<{ type: 'IMAGE' | 'VIDEO'; url: string; order?: number }>;
}) {
  if (!data.isDraft) {
    if (!data.currencyId || !data.typeId || !data.statusId) {
      throw new AppError(
        'currencyId, typeId y statusId son requeridos.',
        400,
      );
    }
  }

  return prisma.property.create({
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

export async function updateProperty(
  id: string,
  data: {
    title?: string;
    description?: string;
    pricePerM2?: number;
    totalPrice?: number;
    currencyId?: number;
    typeId?: number;
    statusId?: number;
    areaM2?: number;
    builtAreaM2?: number;
    frontM2?: number;
    depthM2?: number;
    address?: string;
    cityId?: number;
    zoneId?: number;
    lat?: number;
    lng?: number;
    bedrooms?: number;
    bathrooms?: number;
    suites?: number;
    parking?: number;
    isDraft?: boolean;
    agentId?: string;
    media?: Array<{ type: 'IMAGE' | 'VIDEO'; url: string; order?: number }>;
  },
) {
  const property = await prisma.property.findUnique({ where: { id } });
  if (!property) {
    throw new AppError('Propiedad no encontrada.', 404);
  }

  const updated = await prisma.property.update({
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
    await prisma.$transaction([
      prisma.propertyMedia.deleteMany({ where: { propertyId: id } }),
      prisma.propertyMedia.createMany({
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

export async function deleteProperty(id: string) {
  const property = await prisma.property.findUnique({ where: { id } });
  if (!property) {
    throw new AppError('Propiedad no encontrada.', 404);
  }

  await prisma.property.delete({ where: { id } });
  return { message: 'Propiedad eliminada.' };
}
