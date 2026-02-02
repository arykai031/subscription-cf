import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/shared/types';
import { authApi, onAuthStateChange } from './api';

/**
 * 认证状态接口
 */
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  initialize: () => void;
  setAuthState: (isAuthenticated: boolean, user: User | null) => void;
}

/**
 * 认证状态管理
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      /**
       * 初始化认证状态
       * 从 localStorage 恢复用户状态
       */
      initialize: () => {
        const user = authApi.getCurrentUser();
        const isAuthenticated = authApi.isAuthenticated();
        set({ user, isAuthenticated });

        // 订阅认证状态变化
        onAuthStateChange((newIsAuthenticated) => {
          if (!newIsAuthenticated) {
            // Token 过期或登出，清除状态
            set({ user: null, isAuthenticated: false, error: null });
          }
        });
      },

      /**
       * 设置认证状态
       * @param isAuthenticated - 是否已认证
       * @param user - 用户信息
       */
      setAuthState: (isAuthenticated: boolean, user: User | null) => {
        set({ isAuthenticated, user });
      },

      /**
       * 用户登录
       * @param email - 邮箱
       * @param password - 密码
       */
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const { user } = await authApi.login({ email, password });
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '登录失败',
            isLoading: false,
          });
          throw error;
        }
      },

      /**
       * 用户注册
       * @param email - 邮箱
       * @param username - 用户名
       * @param password - 密码
       */
      register: async (email: string, username: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const { user } = await authApi.register({ email, username, password });
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '注册失败',
            isLoading: false,
          });
          throw error;
        }
      },

      /**
       * 退出登录
       */
      logout: () => {
        authApi.logout();
        set({ user: null, isAuthenticated: false, error: null });
      },

      /**
       * 清除错误信息
       */
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
