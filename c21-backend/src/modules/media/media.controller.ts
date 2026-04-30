import { Request, Response, NextFunction } from 'express';

export function uploadMedia(req: Request, res: Response, next: NextFunction) {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      res.status(400).json({ error: 'No se recibieron archivos.' });
      return;
    }

    const baseUrl =
      process.env.BASE_URL ?? `${req.protocol}://${req.get('host')}`;

    const urls = files.map(
      (file) => `${baseUrl}/uploads/${file.filename}`,
    );

    res.status(200).json({ urls });
  } catch (err) {
    next(err);
  }
}
