import { NextFunction, Request, Response } from 'express';
import * as contactService from './contact.service';

function getUserId(req: Request, res: Response) {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: 'No autorizado.' });
    return null;
  }
  return userId;
}

export async function listContacts(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = getUserId(req, res);
    if (!userId) return;

    const contacts = await contactService.listContacts(userId);
    res.status(200).json(contacts);
  } catch (err) {
    next(err as Error);
  }
}

export async function getContact(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = getUserId(req, res);
    if (!userId) return;

    const contact = await contactService.getContact(userId, req.params.id);
    res.status(200).json(contact);
  } catch (err) {
    next(err as Error);
  }
}

export async function createContact(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = getUserId(req, res);
    if (!userId) return;

    const contact = await contactService.createContact(userId, req.body);
    res.status(201).json(contact);
  } catch (err) {
    next(err as Error);
  }
}

export async function updateContact(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = getUserId(req, res);
    if (!userId) return;

    const contact = await contactService.updateContact(
      userId,
      req.params.id,
      req.body,
    );
    res.status(200).json(contact);
  } catch (err) {
    next(err as Error);
  }
}

export async function deleteContact(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = getUserId(req, res);
    if (!userId) return;

    const result = await contactService.deleteContact(
      userId,
      req.params.id,
    );
    res.status(200).json(result);
  } catch (err) {
    next(err as Error);
  }
}
