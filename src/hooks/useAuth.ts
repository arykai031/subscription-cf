import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store';
import type { User } from '@/shared/types';

/**
 * 认证 Hook 返回类型
 */
interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

/**
 * 认证 Hook
 * @returns 认证相关状态和方法
 */
export function useAuth(): UseAuthReturn {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
    initialize,
  } = useAuthStore();

  // 初始化认证状态
  useEffect(() => {
    initialize();
  }, [initialize]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };
}