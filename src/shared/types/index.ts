/**
 * 用户类型
 */
export interface User {
  id: string;
  email: string;
  username: string;
  phone?: string;
  avatarUrl?: string;
  createdAt: number;
  updatedAt: number;
}

/**
 * 订阅类型（当前迭代仅存储配置）
 */
export interface Subscription {
  id: string;
  userId: string;
  title: string;
  reminderTime: string;
  isEnabled: boolean;
  pushChannel: 'wechat' | 'qywechat' | 'none';
  channelConfig?: Record<string, string>;
  createdAt: number;
  updatedAt: number;
}

/**
 * 用户设置类型
 */
export interface UserSettings {
  userId: string;
  showLunar: boolean;
  pushEnabled: boolean;
  theme: 'light' | 'dark' | 'system';
  updatedAt: number;
}

/**
 * API 通用响应类型
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Cloudflare 环境绑定类型
 */
export interface Env {
  DB: unknown;
  AVATARS_BUCKET: unknown;
  JWT_SECRET: string;
  ENVIRONMENT: string;
}
