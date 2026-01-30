import type { Env, User } from '@/shared/types';
import type { ApiResponse, LoginRequest, RegisterRequest } from '@/shared/types/api';
import { isValidEmail, isValidPassword, isValidUsername } from '@/shared/utils/validation';
import bcrypt from 'bcryptjs';
import { Hono } from 'hono';
import { generateToken } from '../utils/jwt';

const authRouter = new Hono<{ Bindings: Env }>();

/**
 * 用户注册
 * POST /api/auth/register
 */
authRouter.post('/register', async (c) => {
  const db = c.env.DB;

  try {
    const body = await c.req.json<RegisterRequest>();
    const { email, username, password } = body;

    // 验证输入
    if (!email || !username || !password) {
      return c.json<ApiResponse>({
        success: false,
        error: '请填写所有必填字段',
      }, 400);
    }

    if (!isValidEmail(email)) {
      return c.json<ApiResponse>({
        success: false,
        error: '邮箱格式不正确',
      }, 400);
    }

    if (!isValidUsername(username)) {
      return c.json<ApiResponse>({
        success: false,
        error: '用户名格式不正确（2-20位，支持字母、数字、下划线和中文）',
      }, 400);
    }

    if (!isValidPassword(password)) {
      return c.json<ApiResponse>({
        success: false,
        error: '密码长度至少6位',
      }, 400);
    }

    // 检查邮箱是否已存在
    const existingEmail = await db.prepare(
      'SELECT id FROM users WHERE email = ?'
    ).bind(email).first();

    if (existingEmail) {
      return c.json<ApiResponse>({
        success: false,
        error: '该邮箱已被注册',
      }, 409);
    }

    // 检查用户名是否已存在
    const existingUsername = await db.prepare(
      'SELECT id FROM users WHERE username = ?'
    ).bind(username).first();

    if (existingUsername) {
      return c.json<ApiResponse>({
        success: false,
        error: '该用户名已被使用',
      }, 409);
    }

    // 生成用户ID
    const userId = crypto.randomUUID();

    // 加密密码
    const passwordHash = await bcrypt.hash(password, 10);

    // 创建用户
    await db.prepare(
      `INSERT INTO users (id, email, username, password_hash, created_at, updated_at)
       VALUES (?, ?, ?, ?, unixepoch(), unixepoch())`
    ).bind(userId, email, username, passwordHash).run();

    // 创建默认用户设置
    await db.prepare(
      `INSERT INTO user_settings (user_id, show_lunar, push_enabled, theme, updated_at)
       VALUES (?, 0, 1, 'system', unixepoch())`
    ).bind(userId).run();

    // 获取创建的用户信息
    const user = await db.prepare(
      'SELECT id, email, username, phone, avatar_url, created_at, updated_at FROM users WHERE id = ?'
    ).bind(userId).first<User>();

    if (!user) {
      return c.json<ApiResponse>({
        success: false,
        error: '用户创建失败',
      }, 500);
    }

    // 生成 JWT Token
    const token = await generateToken(user);

    return c.json<ApiResponse<{ user: User; token: string }>>({
      success: true,
      data: {
        user: {
          ...user,
          avatarUrl: user.avatar_url,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
        },
        token,
      },
      message: '注册成功',
    }, 201);

  } catch (error) {
    console.error('注册失败:', error);
    return c.json<ApiResponse>({
      success: false,
      error: '注册失败，请稍后重试',
    }, 500);
  }
});

/**
 * 用户登录
 * POST /api/auth/login
 */
authRouter.post('/login', async (c) => {
  const db = c.env.DB;

  try {
    const body = await c.req.json<LoginRequest>();
    const { email, password } = body;

    // 验证输入
    if (!email || !password) {
      return c.json<ApiResponse>({
        success: false,
        error: '请填写邮箱和密码',
      }, 400);
    }

    // 查找用户
    const user = await db.prepare(
      'SELECT id, email, username, password_hash, phone, avatar_url, created_at, updated_at FROM users WHERE email = ?'
    ).bind(email).first<User & { password_hash: string }>();

    if (!user) {
      return c.json<ApiResponse>({
        success: false,
        error: '邮箱或密码错误',
      }, 401);
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return c.json<ApiResponse>({
        success: false,
        error: '邮箱或密码错误',
      }, 401);
    }

    // 生成 JWT Token
    const token = await generateToken(user);

    // 移除密码字段
    const { password_hash, ...userWithoutPassword } = user;

    return c.json<ApiResponse<{ user: User; token: string }>>({
      success: true,
      data: {
        user: {
          ...userWithoutPassword,
          avatarUrl: user.avatar_url,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
        },
        token,
      },
      message: '登录成功',
    });

  } catch (error) {
    console.error('登录失败:', error);
    return c.json<ApiResponse>({
      success: false,
      error: '登录失败，请稍后重试',
    }, 500);
  }
});

export { authRouter };
