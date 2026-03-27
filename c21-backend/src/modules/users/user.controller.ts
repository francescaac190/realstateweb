import { NextFunction, Request, Response } from 'express';
import { UserStatus } from '@prisma/client';
import * as userService from './user.service';
import * as propertyService from '../properties/property.service';

function toNumber(value: unknown) {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

export async function listUsers(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const status = req.query.status as UserStatus | undefined;
    const roleId = toNumber(req.query.roleId);
    const branchId = toNumber(req.query.branchId);

    const users = await userService.listUsers({
      status,
      roleId,
      branchId,
    });
    res.status(200).json(users);
  } catch (err) {
    next(err as Error);
  }
}

export async function getUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err as Error);
  }
}

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err as Error);
  }
}

export async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.status(200).json(user);
  } catch (err) {
    next(err as Error);
  }
}

export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await userService.deleteUser(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    next(err as Error);
  }
}

export async function getProfile(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'No autorizado.' });
      return;
    }
    const user = await userService.getUserById(userId);
    res.status(200).json(user);
  } catch (err) {
    next(err as Error);
  }
}

export async function getAgentProperties(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    // Authenticated users viewing their own properties see all (including drafts).
    // Public requests only see published properties.
    const isOwner = req.user?.id === req.params.id;
    const properties = await propertyService.listProperties({
      agentId: req.params.id,
      isDraft: isOwner ? undefined : false,
    });
    res.status(200).json(properties);
  } catch (err) {
    next(err as Error);
  }
}

export async function updateProfile(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'No autorizado.' });
      return;
    }
    const user = await userService.updateUser(userId, req.body);
    res.status(200).json(user);
  } catch (err) {
    next(err as Error);
  }
}
