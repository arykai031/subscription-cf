# Day 3 实施计划：登录/注册页面前端 + API 实现

## 一、任务目标

根据系统设计文档第 7 章 API 设计和第 8 章开发计划，完成以下工作：
1. 实现后端认证 API（注册、登录、JWT 签发）
2. 实现前端登录页面（使用 shadcn/ui 组件库）
3. 实现前端注册页面
4. 集成前后端，确保认证流程完整可用

## 二、前置条件检查

✅ Day 1 已完成：项目初始化（Bun + Vite + Hono + Tailwind）
✅ Day 2 已完成：数据库设计 + 共享类型定义
✅ 本地 D1 数据库已初始化
✅ 表结构已创建（users、subscriptions、user_settings）
✅ 共享类型和验证工具已就绪

## 三、技术栈与组件库

### 3.1 UI 组件库
- **shadcn/ui**: 基于 Radix UI 和 Tailwind CSS 的现代化组件库
- **安装命令**: `bunx shadcn@latest init -d`
- **使用的组件**:
  - `Card` - 卡片容器，用于包裹登录表单
  - `Input` - 输入框组件，支持图标前缀
  - `Button` - 按钮组件，支持加载状态
  - `Label` - 表单标签
  - `Alert` - 错误提示组件

### 3.2 图标库
- **lucide-react**: 现代化图标库
- **安装命令**: `bun add lucide-react`
- **使用的图标**:
  - `Mail` - 邮箱图标
  - `Lock` - 密码图标
  - `Loader2` - 加载动画图标
  - `AlertCircle` - 错误提示图标

## 四、具体实施步骤

### 步骤 1：初始化 shadcn/ui（新增）

#### 1.1 安装 shadcn/ui
```bash
# 初始化 shadcn/ui（使用默认配置）
bunx shadcn@latest init -d

# 安装所需组件
bunx shadcn@latest add card input button label alert

# 安装图标库
bun add lucide-react
```

#### 1.2 组件说明
| 组件 | 用途 | 特性 |
|------|------|------|
| Card | 登录表单容器 | 圆角、阴影、无边框设计 |
| Input | 邮箱/密码输入 | 支持图标前缀、错误状态样式 |
| Button | 提交按钮 | 支持加载状态、多种变体 |
| Label | 表单标签 | 与输入框关联、支持禁用状态 |
| Alert | 错误提示 | 破坏性变体、图标支持 |

### 步骤 2：实现后端认证 API（预计 90 分钟）

#### 2.1 创建认证路由文件
**文件路径**: `src/api/routes/auth.ts`

**功能要求**（根据系统设计文档 7.2 节）：
- POST `/api/auth/register` - 用户注册
  - 验证邮箱、用户名、密码格式
  - 检查邮箱和用户名是否已存在
  - 使用 bcrypt 加密密码
  - 创建用户记录
  - 创建默认用户设置
  - 生成 JWT Token
  - 返回用户信息和 Token

- POST `/api/auth/login` - 用户登录
  - 验证邮箱和密码
  - 生成 JWT Token
  - 返回用户信息和 Token

#### 2.2 实现 JWT 工具函数
**文件路径**: `src/api/utils/jwt.ts`

**功能要求**：
- `generateToken(payload)` - 生成 JWT Token（使用 jose 库）
- `verifyToken(token)` - 验证 JWT Token
- Token 有效期：15 分钟

#### 2.3 更新 API 入口文件
**文件路径**: `src/api/[[route]].ts`

**修改内容**：
- 导入并注册 auth 路由
- 添加 `app.route('/api/auth', authRouter)`

### 步骤 3：实现前端登录页面（预计 60 分钟）

#### 3.1 登录页面设计规范
**文件路径**: `src/app/login/page.tsx`

**UI 设计特点**：
- 渐变背景（slate-50 到 slate-100）
- 卡片式布局，圆角、阴影、无边框
- 图标前缀输入框（Mail、Lock）
- 加载状态动画（Loader2 旋转图标）
- 分隔线设计（"还没有账号？"）
- 响应式布局（移动端适配）

**使用的 shadcn 组件**：
```tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
```

**功能要求**：
- 邮箱输入框（带验证、图标前缀）
- 密码输入框（带图标前缀）
- 登录按钮（带加载状态、图标）
- 错误提示（Alert 组件）
- 跳转到注册页面的链接
- 表单验证（邮箱格式、密码非空）
- 调用登录 API
- 登录成功后保存 Token 并跳转首页

#### 3.2 样式优化细节
- 输入框高度统一为 h-11（44px）
- 图标使用 muted-foreground 颜色
- 错误状态使用红色边框和焦点环
- 按钮加载状态显示旋转图标
- 卡片头部居中显示，带图标装饰

### 步骤 4：实现前端注册页面（预计 60 分钟）

#### 4.1 创建注册页面组件
**文件路径**: `src/app/register/page.tsx`

**功能要求**：
- 邮箱输入框（带验证）
- 用户名输入框（带验证）
- 密码输入框（带强度提示）
- 确认密码输入框
- 注册按钮（带加载状态）
- 错误提示
- 跳转到登录页面的链接
- 表单验证（邮箱格式、用户名格式、密码强度、密码匹配）
- 调用注册 API
- 注册成功后自动登录并跳转首页

### 步骤 5：实现前端 API 封装和状态管理（预计 60 分钟）

#### 5.1 更新 API 封装
**文件路径**: `src/lib/api.ts`

**功能要求**：
- 封装 fetch 请求
- 自动携带 JWT Token
- 统一错误处理
- 认证相关 API 方法（login、register）

#### 5.2 更新 Zustand 状态管理
**文件路径**: `src/lib/store.ts`

**功能要求**：
- 用户状态（user、isAuthenticated、token）
- 登录方法
- 登出方法
- 注册方法
- 持久化存储（localStorage）

#### 5.3 更新 useAuth Hook
**文件路径**: `src/hooks/useAuth.ts`

**功能要求**：
- 封装认证相关逻辑
- 提供登录、注册、登出方法
- 提供用户信息和认证状态

### 步骤 6：更新前端路由和布局（预计 30 分钟）

#### 6.1 更新 App.tsx
**文件路径**: `src/app/App.tsx`

**修改内容**：
- 添加登录和注册路由
- 添加基础布局（Header/Footer）
- 使用 React.lazy 懒加载页面组件

#### 6.2 创建基础布局组件
**文件路径**: `src/app/layout.tsx`

**功能要求**：
- 全局导航栏
- 全局状态初始化
- 路由保护（可选，Day 4 完善）

### 步骤 7：集成测试（预计 30 分钟）

#### 7.1 启动开发服务器
```bash
bun run dev
```

#### 7.2 测试场景
- 访问登录页面（验证 UI 设计）
- 访问注册页面
- 注册新用户
- 使用新用户登录
- 验证 JWT Token 生成
- 验证用户信息存储
- 验证响应式布局（移动端、平板、桌面）

## 五、风险评估与应对措施

| 风险 | 可能性 | 影响 | 应对措施 |
|------|--------|------|----------|
| JWT 密钥未配置 | 高 | 高 | 在 wrangler.toml 中添加 JWT_SECRET 环境变量，本地开发使用默认值 |
| bcrypt 在 Workers 环境不兼容 | 中 | 高 | 使用 bcryptjs（纯 JavaScript 实现），已在依赖中安装 |
| CORS 配置问题 | 中 | 中 | 确保 CORS 中间件正确配置，允许本地开发端口 |
| 前端表单验证与后端不一致 | 中 | 中 | 使用共享的 validation.ts 中的验证函数 |
| Token 存储安全性 | 低 | 高 | 使用 httpOnly Cookie（Day 4 完善），当前先使用 localStorage |
| 数据库连接失败 | 低 | 高 | 确保 wrangler.toml 配置正确，数据库已创建 |
| shadcn/ui 组件样式冲突 | 低 | 中 | 使用 Tailwind CSS 的层叠机制，确保样式优先级正确 |

## 六、交付物清单

- [x] `src/api/routes/auth.ts` - 认证路由（注册、登录）
- [x] `src/api/utils/jwt.ts` - JWT 工具函数
- [x] `src/app/login/page.tsx` - 登录页面（shadcn/ui 重构）
- [x] `src/app/register/page.tsx` - 注册页面
- [x] `src/lib/api.ts` - API 封装（更新）
- [x] `src/lib/store.ts` - 状态管理（更新）
- [x] `src/hooks/useAuth.ts` - 认证 Hook（更新）
- [x] `src/app/App.tsx` - 应用路由（更新）
- [x] `src/app/layout.tsx` - 基础布局
- [x] `src/components/ui/` - shadcn/ui 组件（Card、Input、Button、Label、Alert）
- [x] 登录/注册功能完整可用

## 七、组件使用示例

### 7.1 Card 组件使用
```tsx
<Card className="w-full max-w-md shadow-xl border-0">
  <CardHeader className="space-y-1 text-center">
    <CardTitle>欢迎回来</CardTitle>
    <CardDescription>请输入您的账号信息</CardDescription>
  </CardHeader>
  <CardContent>{/* 表单内容 */}</CardContent>
  <CardFooter>{/* 底部操作 */}</CardFooter>
</Card>
```

### 7.2 Input 组件使用（带图标前缀）
```tsx
<div className="relative">
  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
  <Input
    className="pl-10 h-11"
    placeholder="name@example.com"
  />
</div>
```

### 7.3 Button 组件使用（加载状态）
```tsx
<Button disabled={isLoading} className="w-full h-11">
  {isLoading ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      登录中...
    </>
  ) : (
    '登录'
  )}
</Button>
```

### 7.4 Alert 组件使用（错误提示）
```tsx
<Alert variant="destructive" className="border-red-200 bg-red-50">
  <AlertCircle className="h-4 w-4" />
  <AlertDescription>{error}</AlertDescription>
</Alert>
```

## 八、与后续任务的衔接

Day 3 的交付物将直接支持：
- Day 4 的 JWT 中间件 + 前端路由保护（依赖登录功能）
- Day 4 的全局状态管理（依赖 store.ts）
- Day 5-7 的订阅功能（需要用户认证）
- 后续页面开发可复用 shadcn/ui 组件库

## 九、验收标准

1. 可以成功注册新用户（数据写入 users 表和 user_settings 表）
2. 可以使用注册的账号登录
3. 登录成功后返回 JWT Token
4. 前端可以正确存储和使用 Token
5. 表单验证正常工作（前端+后端）
6. 错误提示友好（邮箱已存在、密码错误等）
7. **页面样式美观，符合现代设计标准（使用 shadcn/ui）**
8. **响应式布局正常，适配不同设备尺寸**
9. **组件库可复用，便于后续页面开发**

## 十、开发进度记录

### 已完成
- [x] 2024-01-30: 初始化 shadcn/ui 组件库
- [x] 2024-01-30: 安装 Card、Input、Button、Label、Alert 组件
- [x] 2024-01-30: 安装 lucide-react 图标库
- [x] 2024-01-30: 重构登录页面，使用 shadcn/ui 组件
- [x] 2024-01-30: 更新实施计划文档

### 待完成
- [ ] 使用 shadcn/ui 重构注册页面（可选，保持风格一致）
- [ ] 添加更多表单功能（密码显示/隐藏切换）
- [ ] 完善响应式设计细节
