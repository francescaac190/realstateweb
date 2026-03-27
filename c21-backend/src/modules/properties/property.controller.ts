import { NextFunction, Request, Response } from 'express';
import * as propertyService from './property.service';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:4000';

function toNumber(value: unknown) {
  if (value === '' || value === undefined || value === null) return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function toBoolean(value: unknown) {
  if (value === undefined) return undefined;
  if (value === 'true' || value === true) return true;
  if (value === 'false' || value === false) return false;
  return undefined;
}

function toStr(value: unknown): string | undefined {
  if (typeof value === 'string' && value.trim() !== '') return value.trim();
  return undefined;
}

export async function listProperties(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const cityId = toNumber(req.query.cityId);
    const typeId = toNumber(req.query.typeId);
    const statusId = toNumber(req.query.statusId);
    const agentId = req.query.agentId as string | undefined;
    const isDraft = toBoolean(req.query.isDraft);
    const canSeeDrafts = Boolean(req.user);

    const properties = await propertyService.listProperties({
      cityId,
      typeId,
      statusId,
      agentId,
      isDraft: canSeeDrafts ? isDraft : false,
    });
    res.status(200).json(properties);
  } catch (err) {
    next(err as Error);
  }
}

export async function getProperty(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const property = await propertyService.getPropertyById(req.params.id, {
      allowDrafts: Boolean(req.user),
    });
    res.status(200).json(property);
  } catch (err) {
    next(err as Error);
  }
}

export async function createProperty(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const b = req.body;

    const title = toStr(b.title);
    if (!title) {
      res.status(400).json({ error: 'El título es obligatorio.' });
      return;
    }

    // Build media records from uploaded files (multer disk storage)
    const files = req.files as Express.Multer.File[] | undefined;
    const uploadedMedia =
      files && files.length > 0
        ? files.map((f, i) => ({
            type: 'IMAGE' as const,
            url: `${BASE_URL}/uploads/${f.filename}`,
            order: i,
          }))
        : undefined;

    const property = await propertyService.createProperty({
      title,
      description: toStr(b.description),
      typeId: toNumber(b.typeId),
      statusId: toNumber(b.statusId),
      currencyId: toNumber(b.currencyId),
      totalPrice: toNumber(b.totalPrice),
      pricePerM2: toNumber(b.pricePerM2),
      cityId: toNumber(b.cityId),
      zoneId: toNumber(b.zoneId),
      address: toStr(b.address),
      areaM2: toNumber(b.areaM2),
      builtAreaM2: toNumber(b.builtAreaM2),
      frontM2: toNumber(b.frontM2),
      depthM2: toNumber(b.depthM2),
      bedrooms: toNumber(b.bedrooms),
      bathrooms: toNumber(b.bathrooms),
      suites: toNumber(b.suites),
      parking: toNumber(b.parking),
      isDraft: toBoolean(b.isDraft) ?? true,
      agentId: toStr(b.agentId) ?? req.user?.id,
      media: uploadedMedia,
    });

    res.status(201).json(property);
  } catch (err) {
    next(err as Error);
  }
}

export async function updateProperty(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const property = await propertyService.updateProperty(
      req.params.id,
      req.body,
    );
    res.status(200).json(property);
  } catch (err) {
    next(err as Error);
  }
}

export async function deleteProperty(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await propertyService.deleteProperty(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    next(err as Error);
  }
}
