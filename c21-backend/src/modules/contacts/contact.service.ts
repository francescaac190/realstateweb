import { prisma } from '../../config/prisma';
import { AppError } from '../../utils/errors';

export async function listContacts(userId: string) {
  return prisma.contact.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getContact(userId: string, id: string) {
  const contact = await prisma.contact.findFirst({
    where: { id, userId },
  });

  if (!contact) {
    throw new AppError('Contacto no encontrado.', 404);
  }

  return contact;
}

export async function createContact(
  userId: string,
  data: { name: string; phone?: string; email?: string },
) {
  return prisma.contact.create({
    data: {
      userId,
      name: data.name,
      phone: data.phone ?? null,
      email: data.email ?? null,
    },
  });
}

export async function updateContact(
  userId: string,
  id: string,
  data: { name?: string; phone?: string; email?: string },
) {
  const contact = await prisma.contact.findFirst({
    where: { id, userId },
  });
  if (!contact) {
    throw new AppError('Contacto no encontrado.', 404);
  }

  return prisma.contact.update({
    where: { id },
    data: {
      name: data.name,
      phone: data.phone,
      email: data.email,
    },
  });
}

export async function deleteContact(userId: string, id: string) {
  const contact = await prisma.contact.findFirst({
    where: { id, userId },
  });
  if (!contact) {
    throw new AppError('Contacto no encontrado.', 404);
  }

  await prisma.contact.delete({ where: { id } });
  return { message: 'Contacto eliminado.' };
}
