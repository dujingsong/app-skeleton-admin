import request from '@/utils/request'

const credentialApi = {
  Login: '/credential/login',
  Logout: '/credential/logout',
  UserInfo: '/credential/info',
  UserMenu: '/credential/nav'
}

/**
 * 登录
 * @param parameter 参数
 * @returns {*}
 */
export function login (parameter) {
  return request({
    url: credentialApi.Login,
    method: 'post',
    data: parameter
  })
}

/**
 * 登出
 * @returns {*}
 */
export function logout () {
  return request({
    url: credentialApi.Logout,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 获取当前登录的用户信息
 * @returns {*}
 */
export function getInfo () {
  return request({
    url: credentialApi.UserInfo,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 获取当前登录用户的菜单
 * @returns {*}
 */
export function getCurrentUserNav () {
  return request({
    url: credentialApi.UserMenu,
    method: 'get'
  })
}
