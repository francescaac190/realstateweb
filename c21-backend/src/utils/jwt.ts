import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || JWT_SECRET;

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error('JWT secrets are not configured.');
}

const ACCESS_TOKEN_TTL = process.env.ACCESS_TOKEN_TTL ?? '15m';
const REFRESH_TOKEN_TTL_DAYS = Number(
  process.env.REFRESH_TOKEN_TTL_DAYS ?? 30,
);
const REFRESH_TOKEN_TTL =
  process.env.REFRESH_TOKEN_TTL ?? `${REFRESH_TOKEN_TTL_DAYS}d`;

export type AccessTokenPayload = {
  sub: string;
  type: 'access';
};

export type RefreshTokenPayload = {
  sub: string;
  type: 'refresh';
  tokenId: string;
};

export function signAccessToken(userId: string): string {
  return jwt.sign({ sub: userId, type: 'access' }, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_TTL,
  });
}

export function signRefreshToken(userId: string, tokenId: string): string {
  return jwt.sign(
    { sub: userId, type: 'refresh', tokenId },
    JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_TTL },
  );
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const payload = jwt.verify(token, JWT_SECRET) as AccessTokenPayload;
  if (!payload?.sub || payload.type !== 'access') {
    throw new Error('Invalid access token');
  }
  return payload;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  const payload = jwt.verify(token, JWT_REFRESH_SECRET) as RefreshTokenPayload;
  if (!payload?.sub || payload.type !== 'refresh' || !payload.tokenId) {
    throw new Error('Invalid refresh token');
  }
  return payload;
}

export const refreshTokenExpiresInMs =
  REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000;
