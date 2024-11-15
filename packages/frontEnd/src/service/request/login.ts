import { whaleRequset as req } from '..'

/**
 * 获取邮箱验证码
 * @param email 邮箱
 * @returns
 */
export const sendEmail = (email: string, type: 'register' | 'forget') => {
  return req.request({
    method: 'post',
    url: '/auth/email_code',
    data: { email, type },
  })
}

// 图形验证码
export const getCodeImg = () => {
  const time = new Date().getTime()
  // 遗留的问题：req.get(`/whale/v1/auth/img_code?time=${time}`)
  return `/api/auth/img_code?time=${time}`
}

// 注册
export const register = (data: any) => {
  return req.request({
    method: 'post',
    url: '/auth/register',
    data,
  })
}

// 登录
export const login = (data: any) => {
  return req.request({
    method: 'post',
    url: '/auth/login',
    data,
  })
}

// 忘记密码
export const forgetPassword = (data: any) => {
  return req.request({
    method: 'post',
    url: '/auth/forget',
    data,
  })
}