import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/errors';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
      details: err.details,
    });
    return;
  }

  console.error('[Unhandled Error]', err);
  res.status(500).json({ error: 'Error interno del servidor.' });
}
