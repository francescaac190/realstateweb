import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { AppError } from '../utils/errors';

export function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    next(new AppError('Token requerido.', 401));
    return;
  }

  const [type, token] = authHeader.split(' ');
  if (type !== 'Bearer' || !token) {
    next(new AppError('Token invalido.', 401));
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub };
    next();
  } catch {
    next(new AppError('Token invalido o expirado.', 401));
  }
}

// Optional auth: attach user if token is valid; ignore invalid/missing tokens.
export function optionalAuthMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    next();
    return;
  }

  const [type, token] = authHeader.split(' ');
  if (type !== 'Bearer' || !token) {
    next();
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub };
  } catch {
    // Ignore invalid token for public endpoints.
  }

  next();
}
