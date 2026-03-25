import { NextFunction, Request, Response } from 'express';
import * as awardService from './award.service';

function getUserId(req: Request, res: Response) {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: 'No autorizado.' });
    return null;
  }
  return userId;
}

export async function listAwards(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = getUserId(req, res);
    if (!userId) return;

    const awards = await awardService.listAwards(userId);
    res.status(200).json(awards);
  } catch (err) {
    next(err as Error);
  }
}

export async function getAward(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = getUserId(req, res);
    if (!userId) return;

    const award = await awardService.getAward(userId, req.params.id);
    res.status(200).json(award);
  } catch (err) {
    next(err as Error);
  }
}

export async function createAward(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = getUserId(req, res);
    if (!userId) return;

    const award = await awardService.createAward(userId, req.body);
    res.status(201).json(award);
  } catch (err) {
    next(err as Error);
  }
}

export async function updateAward(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = getUserId(req, res);
    if (!userId) return;

    const award = await awardService.updateAward(
      userId,
      req.params.id,
      req.body,
    );
    res.status(200).json(award);
  } catch (err) {
    next(err as Error);
  }
}

export async function deleteAward(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = getUserId(req, res);
    if (!userId) return;

    const result = await awardService.deleteAward(userId, req.params.id);
    res.status(200).json(result);
  } catch (err) {
    next(err as Error);
  }
}
