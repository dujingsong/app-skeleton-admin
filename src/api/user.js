import request from '@/utils/request'

const api = {
  updateBasicInfo: '/user/updateBasicInfo',
  updatePassword: '/user/updatePassword'
}

/**
 * 更新基本信息
 * @param parameter 参数
 * @returns {*}
 */
export function updateBasicInfo (parameter) {
  return request({
    url: api.updateBasicInfo,
    method: 'post',
    data: parameter
  })
}

/**
 * 更新密码
 * @param parameter 参数
 * @returns {*}
 */
export function updatePassword (parameter) {
  return request({
    url: api.updatePassword,
    method: 'post',
    data: parameter
  })
}
