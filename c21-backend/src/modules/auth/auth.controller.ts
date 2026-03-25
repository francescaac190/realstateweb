import { NextFunction, Request, Response } from 'express';
import * as authService from './auth.service';

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { firstName, lastName, email, password, phone } = req.body;
    const result = await authService.register(
      firstName,
      lastName,
      email,
      password,
      phone,
    );
    res.status(201).json(result);
  } catch (err) {
    next(err as Error);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.status(200).json(result);
  } catch (err) {
    next(err as Error);
  }
}

export async function refresh(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refresh(refreshToken);
    res.status(200).json(result);
  } catch (err) {
    next(err as Error);
  }
}

export async function logout(
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
    const { refreshToken } = req.body;
    await authService.logout(userId, refreshToken);
    res.status(200).json({ message: 'Sesión cerrada.' });
  } catch (err) {
    next(err as Error);
  }
}

export async function changePassword(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'No autorizado.' });
      return;
    }

    const result = await authService.changePassword(
      userId,
      currentPassword,
      newPassword,
    );
    res.status(200).json(result);
  } catch (err) {
    next(err as Error);
  }
}
