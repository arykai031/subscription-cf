-- 用户表
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

CREATE INDEX idx_users_email ON users(email);

-- 订阅表（提醒规则）
CREATE TABLE subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  reminder_time TEXT NOT NULL,
  is_enabled BOOLEAN DEFAULT 1,
  push_channel TEXT DEFAULT 'wechat',
  channel_config TEXT,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_time ON subscriptions(reminder_time);

-- 用户设置表
CREATE TABLE user_settings (
  user_id TEXT PRIMARY KEY,
  show_lunar BOOLEAN DEFAULT 0,
  push_enabled BOOLEAN DEFAULT 1,
  theme TEXT DEFAULT 'system',
  updated_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);