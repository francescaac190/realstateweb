import crypto from 'crypto';
import { UserStatus } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { AppError } from '../../utils/errors';
import { hashPassword, verifyPassword } from '../../utils/password';
import {
  refreshTokenExpiresInMs,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../../utils/jwt';

type SafeUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  username: string;
  roleId: number;
  status: UserStatus;
  cityId: number | null;
  branchId: number | null;
  createdAt: Date;
  updatedAt: Date;
};

function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

async function issueTokens(userId: string) {
  const accessToken = signAccessToken(userId);
  const tokenId = crypto.randomUUID();
  const refreshToken = signRefreshToken(userId, tokenId);
  const tokenHash = hashToken(refreshToken);
  const expiresAt = new Date(Date.now() + refreshTokenExpiresInMs);

  await prisma.refreshToken.create({
    data: {
      id: tokenId,
      userId,
      tokenHash,
      expiresAt,
    },
  });

  return { accessToken, refreshToken };
}

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

const safeUserSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  username: true,
  roleId: true,
  status: true,
  cityId: true,
  branchId: true,
  createdAt: true,
  updatedAt: true,
};

export async function register(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  phone?: string,
) {
  const normalizedEmail = email.trim().toLowerCase();
  const exists = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (exists) {
    throw new AppError('El correo ya se encuentra en uso.', 400);
  }

  const role = await prisma.role.findUnique({ where: { code: 'AGENT' } });
  if (!role) {
    throw new AppError('El rol AGENT no fue encontrado.', 500);
  }

  const username = await generateUsername(normalizedEmail);
  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email: normalizedEmail,
      phone: phone ?? null,
      username,
      passwordHash,
      roleId: role.id,
      status: 'ACTIVE',
    },
    select: safeUserSelect,
  });

  const tokens = await issueTokens(user.id);

  return { user: user as SafeUser, ...tokens };
}

export async function login(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    throw new AppError('Usuario no encontrado.', 404);
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    throw new AppError('Credenciales invalidas.', 401);
  }

  const safeUser: SafeUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    username: user.username,
    roleId: user.roleId,
    status: user.status,
    cityId: user.cityId,
    branchId: user.branchId,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  const tokens = await issueTokens(user.id);

  return { user: safeUser, ...tokens };
}

export async function refresh(refreshToken: string) {
  const payload = verifyRefreshToken(refreshToken);
  const tokenHash = hashToken(refreshToken);

  const stored = await prisma.refreshToken.findUnique({
    where: { tokenHash },
  });

  if (
    !stored ||
    stored.revokedAt ||
    stored.expiresAt < new Date() ||
    stored.userId !== payload.sub ||
    stored.id !== payload.tokenId
  ) {
    throw new AppError('Refresh token invalido.', 401);
  }

  await prisma.refreshToken.update({
    where: { id: stored.id },
    data: { revokedAt: new Date() },
  });

  return issueTokens(stored.userId);
}

export async function logout(userId: string, refreshToken: string) {
  const tokenHash = hashToken(refreshToken);

  const stored = await prisma.refreshToken.findUnique({ where: { tokenHash } });

  if (!stored || stored.userId !== userId) {
    throw new AppError('Refresh token invalido.', 401);
  }

  await prisma.refreshToken.update({
    where: { id: stored.id },
    data: { revokedAt: new Date() },
  });
}

export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError('Usuario no encontrado.', 404);
  }

  const valid = await verifyPassword(currentPassword, user.passwordHash);
  if (!valid) {
    throw new AppError('Password actual incorrecto.', 401);
  }

  const passwordHash = await hashPassword(newPassword);
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });

  await prisma.refreshToken.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });

  return { message: 'Password actualizado.' };
}
