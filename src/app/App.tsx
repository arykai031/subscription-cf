import { ProtectedRoute } from '@/components/navigation/ProtectedRoute';
import { PublicRoute } from '@/components/navigation/PublicRoute';
import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

// 懒加载页面组件
const LoginPage = lazy(() => import('./login/page'));
const RegisterPage = lazy(() => import('./register/page'));

/**
 * 加载中组件
 * @returns React.JSX.Element
 */
function Loading(): React.JSX.Element {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-600">加载中...</div>
    </div>
  );
}

/**
 * 首页组件（临时占位）
 * @returns React.JSX.Element
 */
function HomePage(): React.JSX.Element {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          订阅管理系统
        </h1>
        <p className="text-gray-600">
          欢迎使用！您已成功登录。
        </p>
      </div>
    </div>
  );
}

/**
 * 应用主组件
 * @returns React.JSX.Element
 */
function App(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* 受保护路由 - 需要登录 */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />

          {/* 公开路由 - 已登录用户会重定向到首页 */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
