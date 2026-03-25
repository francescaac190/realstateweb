import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';
import { AppError } from '../utils/errors';

export function validateBody(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      next(
        new AppError('Datos invalidos.', 400, parsed.error.flatten()),
      );
      return;
    }
    req.body = parsed.data;
    next();
  };
}
