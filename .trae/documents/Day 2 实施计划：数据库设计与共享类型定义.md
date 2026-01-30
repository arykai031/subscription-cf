# Day 2 实施计划：数据库设计与共享类型定义

## 一、任务目标

根据系统设计文档第 6 章数据模型，完成以下工作：
1. 创建 D1 数据库迁移文件（3 张表：users、subscriptions、user_settings）
2. 创建共享类型定义文件（TypeScript 接口）
3. 初始化本地 D1 数据库并应用迁移
4. 验证数据库结构正确性

## 二、前置条件检查

✅ Day 1 已完成：项目初始化（Bun + Vite + Hono + Tailwind）
✅ 目录结构已创建
✅ 依赖已安装
✅ wrangler.toml 已配置 D1 数据库绑定

## 三、具体实施步骤

### 步骤 1：创建数据库迁移文件（预计 30 分钟）

**文件路径**: `migrations/0000_init.sql`

**内容要求**（根据系统设计文档 6.1 节）：
- 创建 users 表（id, email, username, password_hash, phone, avatar_url, created_at, updated_at）
- 创建 subscriptions 表（id, user_id, title, reminder_time, is_enabled, push_channel, channel_config, created_at, updated_at）
- 创建 user_settings 表（user_id, show_lunar, push_enabled, theme, updated_at）
- 创建必要的索引（idx_users_email, idx_subscriptions_user_id, idx_subscriptions_time）
- 设置外键约束（ON DELETE CASCADE）

### 步骤 2：创建共享类型定义（预计 30 分钟）

**文件路径 1**: `src/shared/types/index.ts`

**内容要求**（根据系统设计文档 6.2 节）：
- User 接口
- Subscription 接口
- UserSettings 接口
- ApiResponse<T> 泛型接口
- Env 环境绑定接口

**文件路径 2**: `src/shared/types/api.ts`

**内容要求**：
- 登录/注册请求/响应类型
- 订阅 CRUD 请求/响应类型
- 设置更新请求/响应类型

**文件路径 3**: `src/shared/utils/validation.ts`

**内容要求**：
- 邮箱格式验证函数
- 手机号格式验证函数
- 用户名格式验证函数
- 时间格式验证函数（HH:MM）

**文件路径 4**: `src/shared/utils/constants.ts`

**内容要求**：
- 分页大小常量（PAGE_SIZE = 20）
- 允许的文件类型常量
- JWT 过期时间常量
- 主题选项常量

### 步骤 3：初始化本地 D1 数据库（预计 20 分钟）

**命令执行**：
```bash
# 创建本地 D1 数据库（如未创建）
bunx wrangler d1 create subscription-db-dev

# 应用迁移文件
bunx wrangler d1 migrations apply subscription-db-dev --local

# 验证表结构
bunx wrangler d1 execute subscription-db-dev --local --command ".schema"
```

### 步骤 4：验证与测试（预计 20 分钟）

**验证项**：
- 检查 3 张表是否正确创建
- 检查索引是否正确创建
- 检查外键约束是否正确设置
- 测试插入/查询/更新/删除操作

**测试命令**：
```bash
# 测试插入用户
bunx wrangler d1 execute subscription-db-dev --local --command "INSERT INTO users (id, email, username, password_hash) VALUES ('test-id', 'test@example.com', 'testuser', 'hashedpassword');"

# 测试查询
bunx wrangler d1 execute subscription-db-dev --local --command "SELECT * FROM users;"
```

## 四、风险评估与应对措施

| 风险 | 可能性 | 影响 | 应对措施 |
|------|--------|------|----------|
| wrangler CLI 版本不兼容 | 中 | 高 | 确保使用 wrangler@latest，如遇问题尝试降级到稳定版本 |
| D1 本地模式限制 | 低 | 中 | 某些高级 SQLite 特性可能不支持，需简化 SQL 语句 |
| 类型定义与数据库结构不一致 | 中 | 高 | 创建类型定义后对照 SQL 语句逐字段核对 |
| 外键约束导致测试失败 | 低 | 低 | 测试时按正确顺序插入数据（先 users 后 subscriptions） |
| 时间戳字段格式问题 | 低 | 中 | 使用 unixepoch() 函数，确保前后端时间格式一致 |

## 五、交付物清单

- [ ] `migrations/0000_init.sql` - 数据库初始化迁移文件
- [ ] `src/shared/types/index.ts` - 核心类型定义
- [ ] `src/shared/types/api.ts` - API 请求/响应类型
- [ ] `src/shared/utils/validation.ts` - 共享验证函数
- [ ] `src/shared/utils/constants.ts` - 共享常量
- [ ] 本地 D1 数据库已初始化并验证通过

## 六、与后续任务的衔接

Day 2 的交付物将直接支持：
- Day 3 的登录/注册 API 实现（依赖 users 表和验证函数）
- Day 4 的 JWT 中间件（依赖 Env 类型定义）
- Day 5-7 的订阅 CRUD（依赖 subscriptions 表和类型）
- Day 8 的设置功能（依赖 user_settings 表）

## 七、验收标准

1. 迁移文件可以成功应用到本地 D1 数据库
2. 所有表结构符合系统设计文档 6.1 节要求
3. 类型定义文件完整且与数据库结构一致
4. 验证函数通过单元测试（邮箱、手机号、时间格式）
5. 可以成功执行基本的 CRUD 操作