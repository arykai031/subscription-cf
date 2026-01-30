import type { User } from '@/shared/types';
import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-min-32-characters-long'
);

/**
 * JWT Payload 类型
 */
export interface JwtPayload {
  userId: string;
  email: string;
  username: string;
  [key: string]: unknown;
}

/**
 * 生成 JWT Token
 * @param user 用户信息
 * @returns JWT Token
 */
export async function generateToken(user: User): Promise<string> {
  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
    username: user.username,
  };

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(JWT_SECRET);

  return token;
}

/**
 * 验证 JWT Token
 * @param token JWT Token
 * @returns 解码后的 payload
 */
export async function verifyToken(token: string): Promise<JwtPayload> {
  const { payload } = await jwtVerify(token, JWT_SECRET);
  return payload as unknown as JwtPayload;
}
