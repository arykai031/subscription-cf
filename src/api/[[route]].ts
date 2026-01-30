import type { Env } from '@/shared/types';
import { Hono } from 'hono';
import { handle } from 'hono/cloudflare-pages';
import { authRouter } from './routes/auth';

const app = new Hono<{ Bindings: Env }>();

// CORS 中间件
app.use('*', async (c, next) => {
  const origin = c.env.ENVIRONMENT === 'development' ? 'http://localhost:5173' : c.req.header('Origin') || '';
  c.header('Access-Control-Allow-Origin', origin);
  c.header('Access-Control-Allow-Credentials', 'true');
  c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (c.req.method === 'OPTIONS') return c.body(null, 204);
  await next();
});

// 健康检查
app.get('/api/health', (c) => c.json({ status: 'ok', env: c.env.ENVIRONMENT }));

// 认证路由
app.route('/api/auth', authRouter);

export const onRequest = handle(app);