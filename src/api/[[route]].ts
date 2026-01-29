import { Hono } from 'hono';
import { handle } from 'hono/cloudflare-pages';

const app = new Hono();

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

export const onRequest = handle(app);