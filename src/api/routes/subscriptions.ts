import type { Env } from '@/shared/types';
import { Hono } from 'hono';

const subscriptionRouter = new Hono<{ Bindings: Env }>();

/**
 * 获取订阅列表
 * GET /api/subscriptions
 */
subscriptionRouter.get('/', async (c) => {
  return c.json({
    success: true,
    data: [],
  });
});

export { subscriptionRouter };
