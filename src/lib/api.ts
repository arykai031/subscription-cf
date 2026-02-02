import type { ApiResponse, User } from '@/shared/types';
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '@/shared/types/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * 认证状态监听器类型
 */
type AuthStateListener = (isAuthenticated: boolean) => void;

/**
 * 认证状态监听器列表
 */
const authStateListeners: AuthStateListener[] = [];

/**
 * 订阅认证状态变化
 * @param listener - 监听器函数
 * @returns 取消订阅函数
 */
export function onAuthStateChange(listener: AuthStateListener): () => void {
  authStateListeners.push(listener);
  return () => {
    const index = authStateListeners.indexOf(listener);
    if (index > -1) {
      authStateListeners.splice(index, 1);
    }
  };
}

/**
 * 通知认证状态变化
 * @param isAuthenticated - 是否已认证
 */
function notifyAuthStateChange(isAuthenticated: boolean): void {
  authStateListeners.forEach((listener) => listener(isAuthenticated));
}

/**
 * 获取存储的 Token
 * @returns Token 或 null
 */
function getToken(): string | null {
  return localStorage.getItem('token');
}

/**
 * 封装 fetch 请求
 * 自动携带 Token，处理 401 错误
 * @param endpoint - API 端点
 * @param options - 请求选项
 * @returns Promise<ApiResponse<T>>
 */
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // 处理 401 未授权错误
    if (response.status === 401) {
      // 清除本地存储的认证信息
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // 通知认证状态变化
      notifyAuthStateChange(false);
      // 抛出错误，让调用者处理跳转
      throw new Error('登录已过期，请重新登录');
    }

    const data = await response.json() as ApiResponse<T>;

    if (!response.ok) {
      throw new Error(data.error || '请求失败');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('网络错误，请稍后重试');
  }
}

/**
 * 认证相关 API
 */
export const authApi = {
  /**
   * 用户登录
   * @param credentials - 登录凭证
   * @returns 用户信息和 Token
   */
  login: async (credentials: LoginRequest): Promise<{ user: User; token: string }> => {
    const response = await fetchApi<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (!response.success || !response.data) {
      throw new Error(response.error || '登录失败');
    }

    // 保存 token
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));

    // 通知认证状态变化
    notifyAuthStateChange(true);

    return response.data;
  },

  /**
   * 用户注册
   * @param data - 注册信息
   * @returns 用户信息和 Token
   */
  register: async (data: RegisterRequest): Promise<{ user: User; token: string }> => {
    const response = await fetchApi<RegisterResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!response.success || !response.data) {
      throw new Error(response.error || '注册失败');
    }

    // 保存 token
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));

    // 通知认证状态变化
    notifyAuthStateChange(true);

    return response.data;
  },

  /**
   * 退出登录
   */
  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    notifyAuthStateChange(false);
  },

  /**
   * 获取当前用户
   * @returns 用户信息或 null
   */
  getCurrentUser: (): User | null => {
    const userJson = localStorage.getItem('user');
    if (!userJson) return null;
    try {
      return JSON.parse(userJson) as User;
    } catch {
      return null;
    }
  },

  /**
   * 检查是否已登录
   * @returns boolean
   */
  isAuthenticated: (): boolean => {
    return !!getToken();
  },
};

export { fetchApi };
