import type { Env } from '@/shared/types';
import { Hono } from 'hono';

const settingsRouter = new Hono<{ Bindings: Env }>();

/**
 * 获取用户设置
 * GET /api/settings
 */
settingsRouter.get('/', async (c) => {
  return c.json({
    success: true,
    data: {
      showLunar: false,
      pushEnabled: true,
      theme: 'system',
    },
  });
});

export { settingsRouter };
