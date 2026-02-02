import type { Env } from '@/shared/types';
import { Hono } from 'hono';

const uploadRouter = new Hono<{ Bindings: Env }>();

/**
 * 头像上传
 * POST /api/upload/avatar
 */
uploadRouter.post('/avatar', async (c) => {
  return c.json({
    success: true,
    message: '上传功能开发中',
  });
});

export { uploadRouter };
