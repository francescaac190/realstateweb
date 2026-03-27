import { Request, Response, NextFunction } from 'express';
import path from 'path';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:4000';

export function uploadMedia(req: Request, res: Response, next: NextFunction) {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      res.status(400).json({ error: 'No se recibieron archivos.' });
      return;
    }

    const urls = files.map(
      (file) => `${BASE_URL}/uploads/${file.filename}`,
    );

    res.status(200).json({ urls });
  } catch (err) {
    next(err);
  }
}
