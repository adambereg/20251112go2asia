/**
 * JWT утилиты на базе jose
 * Единственная библиотека для работы с JWT в проекте
 */

import * as jose from 'jose';

export interface JWTPayload {
  userId?: string;
  email?: string;
  role?: string;
  [key: string]: unknown;
}

/**
 * Проверка JWT токена
 */
export async function verifyJWT(
  token: string,
  secret: string
): Promise<JWTPayload> {
  const secretKey = new TextEncoder().encode(secret);
  const { payload } = await jose.jwtVerify(token, secretKey);
  return payload as JWTPayload;
}

/**
 * Создание JWT токена
 */
export async function signJWT(
  payload: JWTPayload,
  secret: string,
  expirationTime: string = '2h'
): Promise<string> {
  const secretKey = new TextEncoder().encode(secret);
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expirationTime)
    .sign(secretKey);
}

