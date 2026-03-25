import { prisma } from '../../config/prisma';
import { AppError } from '../../utils/errors';

export async function listAwards(userId: string) {
  return prisma.award.findMany({
    where: { userId },
    orderBy: { receivedAt: 'desc' },
  });
}

export async function getAward(userId: string, id: string) {
  const award = await prisma.award.findFirst({
    where: { id, userId },
  });

  if (!award) {
    throw new AppError('Premio no encontrado.', 404);
  }

  return award;
}

export async function createAward(
  userId: string,
  data: { name: string; receivedAt: string; imageUrl?: string },
) {
  return prisma.award.create({
    data: {
      userId,
      name: data.name,
      receivedAt: new Date(data.receivedAt),
      imageUrl: data.imageUrl ?? null,
    },
  });
}

export async function updateAward(
  userId: string,
  id: string,
  data: { name?: string; receivedAt?: string; imageUrl?: string },
) {
  const award = await prisma.award.findFirst({
    where: { id, userId },
  });
  if (!award) {
    throw new AppError('Premio no encontrado.', 404);
  }

  return prisma.award.update({
    where: { id },
    data: {
      name: data.name,
      receivedAt: data.receivedAt ? new Date(data.receivedAt) : undefined,
      imageUrl: data.imageUrl,
    },
  });
}

export async function deleteAward(userId: string, id: string) {
  const award = await prisma.award.findFirst({
    where: { id, userId },
  });
  if (!award) {
    throw new AppError('Premio no encontrado.', 404);
  }

  await prisma.award.delete({ where: { id } });
  return { message: 'Premio eliminado.' };
}
