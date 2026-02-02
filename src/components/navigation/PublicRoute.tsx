import { useAuth } from "@/hooks/useAuth";
import React from "react";
import { Navigate } from "react-router-dom";

/**
 * 公开路由组件属性
 */
interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * 公开路由组件
 * 已登录用户访问登录/注册页时重定向到首页
 * @param props - 组件属性
 * @returns React.JSX.Element
 */
export function PublicRoute({ children }: PublicRouteProps): React.JSX.Element {
  const { isAuthenticated, isLoading } = useAuth();

  // 加载中状态
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">加载中...</div>
      </div>
    );
  }

  // 已登录，重定向到首页
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // 未登录，渲染子组件
  return <>{children}</>;
}
