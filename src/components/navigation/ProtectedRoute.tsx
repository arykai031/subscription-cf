import { useAuth } from '@/hooks/useAuth';
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * 受保护路由组件属性
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * 受保护路由组件
 * 验证用户是否已登录，未登录则重定向到登录页
 * @param props - 组件属性
 * @returns React.JSX.Element
 */
export function ProtectedRoute({ children }: ProtectedRouteProps): React.JSX.Element {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // 加载中状态
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">加载中...</div>
      </div>
    );
  }

  // 未登录，重定向到登录页
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 已登录，渲染子组件
  return <>{children}</>;
}
