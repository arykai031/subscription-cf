import type { ApiResponse, User } from '@/shared/types';
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '@/shared/types/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * 获取存储的 Token
 */
function getToken(): string | null {
  return localStorage.getItem('token');
}

/**
 * 封装 fetch 请求
 */
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

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

    return response.data;
  },

  /**
   * 用户注册
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

    return response.data;
  },

  /**
   * 退出登录
   */
  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * 获取当前用户
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
   */
  isAuthenticated: (): boolean => {
    return !!getToken();
  },
};

export { fetchApi };