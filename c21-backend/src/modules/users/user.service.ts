import { Prisma, UserStatus } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { AppError } from '../../utils/errors';
import { hashPassword } from '../../utils/password';

const userSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  username: true,
  documentNumber: true,
  address: true,
  cityId: true,
  roleId: true,
  branchId: true,
  hireDate: true,
  status: true,
  isVerified: true,
  verifiedAt: true,
  createdAt: true,
  updatedAt: true,
  socialAccounts: true,
  role: { select: { id: true, code: true, name: true } },
  city: { select: { id: true, name: true } },
  branch: { select: { id: true, name: true } },
};

async function generateUsername(email: string) {
  const base = email
    .split('@')[0]
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '');
  let candidate = base;
  let counter = 1;

  while (await prisma.user.findUnique({ where: { username: candidate } })) {
    candidate = `${base}${counter}`;
    counter += 1;
  }

  return candidate;
}

export async function listUsers(filters?: {
  status?: UserStatus;
  roleId?: number;
  branchId?: number;
}) {
  return prisma.user.findMany({
    where: {
      status: filters?.status,
      roleId: filters?.roleId,
      branchId: filters?.branchId,
    },
    select: userSelect,
    orderBy: { createdAt: 'desc' },
  });
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: userSelect,
  });

  if (!user) {
    throw new AppError('Usuario no encontrado.', 404);
  }

  return user;
}

export async function createUser(data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  documentNumber?: string;
  address?: string;
  cityId?: number;
  roleId?: number;
  branchId?: number;
  hireDate?: string;
  status?: UserStatus;
  isVerified?: boolean;
  socialAccounts?: Array<{
    provider: 'WHATSAPP' | 'FACEBOOK' | 'INSTAGRAM' | 'TIKTOK';
    handle: string;
    isVerified?: boolean;
  }>;
}) {
  const normalizedEmail = data.email.trim().toLowerCase();
  const exists = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (exists) {
    throw new AppError('El correo ya se encuentra en uso.', 400);
  }

  const roleId = data.roleId ?? (await getAgentRoleId());
  const username = await generateUsername(normalizedEmail);
  const passwordHash = await hashPassword(data.password);

  return prisma.user.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: normalizedEmail,
      phone: data.phone ?? null,
      username,
      passwordHash,
      documentNumber: data.documentNumber ?? null,
      address: data.address ?? null,
      cityId: data.cityId ?? null,
      roleId,
      branchId: data.branchId ?? null,
      hireDate: data.hireDate ? new Date(data.hireDate) : null,
      status: data.status ?? 'ACTIVE',
      isVerified: data.isVerified ?? false,
      socialAccounts: data.socialAccounts
        ? {
            create: data.socialAccounts.map((account) => ({
              provider: account.provider,
              handle: account.handle,
              isVerified: account.isVerified ?? false,
            })),
          }
        : undefined,
    },
    select: userSelect,
  });
}

export async function updateUser(
  id: string,
  data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    phone?: string;
    documentNumber?: string;
    address?: string;
    cityId?: number;
    roleId?: number;
    branchId?: number;
    hireDate?: string;
    status?: UserStatus;
    isVerified?: boolean;
    socialAccounts?: Array<{
      provider: 'WHATSAPP' | 'FACEBOOK' | 'INSTAGRAM' | 'TIKTOK';
      handle: string;
      isVerified?: boolean;
    }>;
  },
) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new AppError('Usuario no encontrado.', 404);
  }

  const updateData: Prisma.UserUpdateInput = {
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone,
    documentNumber: data.documentNumber,
    address: data.address,
    cityId: data.cityId,
    roleId: data.roleId,
    branchId: data.branchId,
    hireDate: data.hireDate ? new Date(data.hireDate) : undefined,
    status: data.status,
    isVerified: data.isVerified,
  };

  if (data.email) {
    const normalizedEmail = data.email.trim().toLowerCase();
    if (normalizedEmail !== user.email) {
      const exists = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });
      if (exists) {
        throw new AppError('El correo ya se encuentra en uso.', 400);
      }
    }
    updateData.email = normalizedEmail;
    updateData.username = await generateUsername(normalizedEmail);
  }

  if (data.password) {
    updateData.passwordHash = await hashPassword(data.password);
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: updateData,
    select: userSelect,
  });

  if (data.socialAccounts?.length) {
    const operations = data.socialAccounts.map((account) =>
      prisma.userSocialAccount.upsert({
        where: {
          userId_provider: {
            userId: id,
            provider: account.provider,
          },
        },
        update: {
          handle: account.handle,
          isVerified: account.isVerified ?? false,
        },
        create: {
          userId: id,
          provider: account.provider,
          handle: account.handle,
          isVerified: account.isVerified ?? false,
        },
      }),
    );
    await prisma.$transaction(operations);
  }

  return updatedUser;
}

export async function deleteUser(id: string) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new AppError('Usuario no encontrado.', 404);
  }

  await prisma.user.delete({ where: { id } });
  return { message: 'Usuario eliminado.' };
}

async function getAgentRoleId() {
  const role = await prisma.role.findUnique({ where: { code: 'AGENT' } });
  if (!role) {
    throw new AppError('El rol AGENT no fue encontrado.', 500);
  }
  return role.id;
}
