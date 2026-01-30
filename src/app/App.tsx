import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

// 懒加载页面组件
const LoginPage = lazy(() => import('./login/page'));
const RegisterPage = lazy(() => import('./register/page'));

/**
 * 加载中组件
 */
const Loading: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-gray-600">加载中...</div>
  </div>
);

/**
 * 应用主组件
 */
const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route
            path="/"
            element={
              <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold">订阅管理系统</h1>
                <p className="mt-4 text-gray-600">欢迎使用订阅管理系统</p>
              </div>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;