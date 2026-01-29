import React from "react";
import { Route, Routes } from "react-router-dom";

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route
          path="/"
          element={<div className="container mx-auto px-4 py-8">首页</div>}
        />
        <Route
          path="/login"
          element={<div className="container mx-auto px-4 py-8">登录页</div>}
        />
        <Route
          path="/register"
          element={<div className="container mx-auto px-4 py-8">注册页</div>}
        />
      </Routes>
    </div>
  );
};
