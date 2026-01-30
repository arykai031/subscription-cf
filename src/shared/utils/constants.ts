/**
 * 分页相关常量
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 1,
} as const;

/**
 * JWT 相关常量
 */
export const JWT = {
  ACCESS_TOKEN_EXPIRES_IN: '15m',
  REFRESH_TOKEN_EXPIRES_IN: '7d',
  ACCESS_TOKEN_EXPIRES_SECONDS: 900, // 15分钟 = 900秒
  REFRESH_TOKEN_EXPIRES_SECONDS: 604800, // 7天 = 604800秒
} as const;

/**
 * 文件上传相关常量
 */
export const UPLOAD = {
  MAX_AVATAR_SIZE: 2 * 1024 * 1024, // 2MB
  ALLOWED_AVATAR_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_AVATAR_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
} as const;

/**
 * 主题选项
 */
export const THEMES = ['light', 'dark', 'system'] as const;

/**
 * 推送渠道选项
 */
export const PUSH_CHANNELS = ['wechat', 'qywechat', 'none'] as const;

/**
 * 默认用户设置
 */
export const DEFAULT_USER_SETTINGS = {
  showLunar: false,
  pushEnabled: true,
  theme: 'system',
} as const;

/**
 * 默认推送渠道
 */
export const DEFAULT_PUSH_CHANNEL = 'wechat';

/**
 * 时间格式正则
 */
export const TIME_FORMAT_REGEX = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

/**
 * 邮箱格式正则
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * 手机号格式正则（中国大陆）
 */
export const PHONE_REGEX = /^1[3-9]\d{9}$/;

/**
 * 用户名格式正则
 */
export const USERNAME_REGEX = /^[a-zA-Z0-9_\u4e00-\u9fa5]{2,20}$/;