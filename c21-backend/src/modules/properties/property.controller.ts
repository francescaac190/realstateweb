import { NextFunction, Request, Response } from 'express';
import * as propertyService from './property.service';

function toNumber(value: unknown) {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function toBoolean(value: unknown) {
  if (value === undefined) return undefined;
  if (value === 'true' || value === true) return true;
  if (value === 'false' || value === false) return false;
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
    const agentId = req.body.agentId ?? req.user?.id;
    const property = await propertyService.createProperty({
      ...req.body,
      agentId,
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
