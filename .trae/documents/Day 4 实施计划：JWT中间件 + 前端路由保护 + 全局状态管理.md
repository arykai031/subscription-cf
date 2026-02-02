## JWT 中间件 + 前端路由保护 + 全局状态管理

## 详细任务清单

### 任务1: JWT 中间件 (src/api/middleware/auth.ts)

* 实现 JWT Token 验证中间件

* 从 Authorization Header 提取 Token

* 验证 Token 有效性

* 将用户信息附加到请求上下文

* 处理 Token 过期/无效情况的错误响应

### 任务2: 前端路由保护

* 创建 ProtectedRoute 组件 (src/components/navigation/ProtectedRoute.tsx)

* 检查用户认证状态

* 未登录用户重定向到登录页

* 已登录用户访问登录/注册页重定向到首页（/api/subscriptions）

* 在 App.tsx 中应用路由保护

### 任务3: 全局状态管理完善

* 完善 store.ts 中的初始化逻辑

* 添加 Token 刷新机制

* 处理 Token 过期自动跳转登录页

* 添加 fetch 拦截器统一处理 401 错误

### 任务4: API 路由集成

* 在 \[\[route]].ts 中应用 auth 中间件

* 配置受保护路由（/api/subscriptions, /api/settings, /api/upload）

### 任务5: 自我检查与测试

* 验证 JWT 中间件正确验证 Token

* 验证未登录用户被正确重定向

* 验证登录后状态正确保持

* 验证 Token 过期处理逻辑

## 验收标准

1. 未登录用户访问首页被重定向到登录页
2. 登录成功后正确跳转到首页
3. API 受保护路由需要有效 JWT Token
4. Token 过期时自动跳转登录页
5. 全局状态正确持久化并恢复
6. 代码符合项目编码规范（驼峰命名、JSDoc注释、2空格缩进等）

