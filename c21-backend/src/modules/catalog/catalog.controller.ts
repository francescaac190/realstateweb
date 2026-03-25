import { NextFunction, Request, Response } from 'express';
import * as catalogService from './catalog.service';

function toNumber(value: unknown) {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

export async function getRoles(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const roles = await catalogService.listRoles();
    res.status(200).json(roles);
  } catch (err) {
    next(err as Error);
  }
}

export async function getCurrencies(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const currencies = await catalogService.listCurrencies();
    res.status(200).json(currencies);
  } catch (err) {
    next(err as Error);
  }
}

export async function getPropertyTypes(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const types = await catalogService.listPropertyTypes();
    res.status(200).json(types);
  } catch (err) {
    next(err as Error);
  }
}

export async function getPropertyStatuses(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const statuses = await catalogService.listPropertyStatuses();
    res.status(200).json(statuses);
  } catch (err) {
    next(err as Error);
  }
}

export async function getCities(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const cities = await catalogService.listCities();
    res.status(200).json(cities);
  } catch (err) {
    next(err as Error);
  }
}

export async function getZones(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const cityId = toNumber(req.query.cityId);
    const zones = await catalogService.listZones(cityId);
    res.status(200).json(zones);
  } catch (err) {
    next(err as Error);
  }
}

export async function getBranches(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const branches = await catalogService.listBranches();
    res.status(200).json(branches);
  } catch (err) {
    next(err as Error);
  }
}
