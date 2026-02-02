import type { Env, User } from '@/shared/types';
import type { ApiResponse } from '@/shared/types/api';
import type { Context, Next } from 'hono';
import { verifyToken } from '../utils/jwt';

/**
 * 扩展 Hono 上下文变量类型
 */
type Variables = {
  user: User;
};

/**
 * JWT 认证中间件
 * 验证请求中的 JWT Token，并将用户信息附加到上下文
 * @param c - Hono 上下文
 * @param next - 下一个中间件
 * @returns Promise<void>
 */
export async function authMiddleware(
  c: Context<{ Bindings: Env; Variables: Variables }>,
  next: Next
): Promise<void> {
  try {
    // 从 Authorization Header 获取 Token
    const authHeader = c.req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      c.status(401);
      c.json<ApiResponse>({
        success: false,
        error: '未提供认证令牌',
      });
      return;
    }

    const token = authHeader.substring(7);

    if (!token) {
      c.status(401);
      c.json<ApiResponse>({
        success: false,
        error: '认证令牌格式不正确',
      });
      return;
    }

    // 验证 Token
    const payload = await verifyToken(token);

    // 从数据库获取完整用户信息
    const db = c.env.DB as D1Database;
    const user = await db
      .prepare(
        'SELECT id, email, username, phone, avatar_url, created_at, updated_at FROM users WHERE id = ?'
      )
      .bind(payload.userId)
      .first<User & { avatar_url?: string; created_at: number; updated_at: number }>();

    if (!user) {
      c.status(401);
      c.json<ApiResponse>({
        success: false,
        error: '用户不存在或已被删除',
      });
      return;
    }

    // 将用户信息附加到上下文
    c.set('user', {
      ...user,
      avatarUrl: user.avatar_url,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    });

    await next();
  } catch (error) {
    // Token 验证失败
    c.status(401);
    c.json<ApiResponse>({
      success: false,
      error: '认证令牌无效或已过期',
    });
  }
}

/**
 * D1 Database 类型定义
 */
interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(): Promise<T | null>;
  run(): Promise<D1Result>;
}

interface D1Result {
  success: boolean;
}
