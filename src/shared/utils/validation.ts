/**
 * 验证邮箱格式
 * @param email 邮箱地址
 * @returns 是否有效
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 验证手机号格式（中国大陆）
 * @param phone 手机号
 * @returns 是否有效
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
}

/**
 * 验证用户名格式
 * @param username 用户名
 * @returns 是否有效
 */
export function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_\u4e00-\u9fa5]{2,20}$/;
  return usernameRegex.test(username);
}

/**
 * 验证时间格式（HH:MM）
 * @param time 时间字符串
 * @returns 是否有效
 */
export function isValidTimeFormat(time: string): boolean {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
}

/**
 * 验证密码强度
 * @param password 密码
 * @returns 是否有效（至少6位）
 */
export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}

/**
 * 验证主题值
 * @param theme 主题值
 * @returns 是否有效
 */
export function isValidTheme(theme: string): boolean {
  return ['light', 'dark', 'system'].includes(theme);
}

/**
 * 验证推送渠道值
 * @param channel 渠道值
 * @returns 是否有效
 */
export function isValidPushChannel(channel: string): boolean {
  return ['wechat', 'qywechat', 'none'].includes(channel);
}