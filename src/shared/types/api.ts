import type { Subscription, User, UserSettings } from './index';

/**
 * 认证相关类型
 */
export interface ApiResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
}

export interface RefreshTokenResponse {
  token: string;
}

/**
 * 订阅相关类型
 */

export interface CreateSubscriptionRequest {
  title: string;
  reminderTime: string;
  isEnabled?: boolean;
  pushChannel?: 'wechat' | 'qywechat' | 'none';
  channelConfig?: Record<string, string>;
}

export interface UpdateSubscriptionRequest {
  title?: string;
  reminderTime?: string;
  isEnabled?: boolean;
  pushChannel?: 'wechat' | 'qywechat' | 'none';
  channelConfig?: Record<string, string>;
}

export interface SubscriptionListResponse {
  subscriptions: Subscription[];
  total: number;
}

/**
 * 设置相关类型
 */

export interface UpdateSettingsRequest {
  showLunar?: boolean;
  pushEnabled?: boolean;
  theme?: 'light' | 'dark' | 'system';
}

export interface SettingsResponse {
  settings: UserSettings;
}

/**
 * 上传相关类型
 */

export interface UploadAvatarResponse {
  url: string;
  key: string;
}