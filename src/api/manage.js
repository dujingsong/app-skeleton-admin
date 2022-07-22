import request from '@/utils/request'

const api = {
  user: '/user',
  role: '/role',
  service: '/service',
  permission: '/permission',
  permissionNoPager: '/permission/no-pager',
  orgTree: '/org/tree',
  // 角色相关
  findRole: '/role/find',
  addRole: '/role/add',
  editRole: '/role/edit',
  deleteRole: '/role/delete',
  batchDeleteRole: '/role/batchDelete',
  batchDisableRole: '/role/batchDisable',
  batchEnableRole: '/role/batchEnable',
  // 权限相关
  permissionTree: '/permission/tree',
  getRoleGrantedPermissions: '/rolePermission/grantedPermissions',
  grantRolePermission: '/rolePermission/grantRolePermission',
  // 用户相关
  findUser: '/user/find',
  addUser: '/user/add',
  editUser: '/user/edit',
  deleteUser: '/user/delete',
  resetUserPassword: '/user/resetPassword',
  batchDeleteUser: '/user/batchDelete',
  batchDisableUser: '/user/batchDisable',
  batchEnableUser: '/user/batchEnable',
  getUserGrantedRoles: '/userRole/grantedRoles',
  grantUserRoles: '/userRole/grantRoles'
}
export function getRoleList (parameter) {
  return request({
    url: api.role,
    method: 'get',
    params: parameter
  })
}

export function getServiceList (parameter) {
  return request({
    url: api.service,
    method: 'get',
    params: parameter
  })
}

export function getPermissions (parameter) {
  return request({
    url: api.permissionNoPager,
    method: 'get',
    params: parameter
  })
}

export function getOrgTree (parameter) {
  return request({
    url: api.orgTree,
    method: 'get',
    params: parameter
  })
}

export function findRole (parameter) {
  return request({
    url: api.findRole,
    method: 'post',
    data: parameter
  })
}

export function addRole (parameter) {
  return request({
    url: api.addRole,
    method: 'post',
    data: parameter
  })
}

export function editRole (parameter) {
  return request({
    url: api.editRole,
    method: 'post',
    data: parameter
  })
}

export function deleteRole (parameter) {
  return request({
    url: api.deleteRole,
    method: 'post',
    data: parameter
  })
}

export function batchDeleteRole (parameter) {
  return request({
    url: api.batchDeleteRole,
    method: 'post',
    data: parameter
  })
}

export function batchDisableRole (parameter) {
  return request({
    url: api.batchDisableRole,
    method: 'post',
    data: parameter
  })
}

export function batchEnableRole (parameter) {
  return request({
    url: api.batchEnableRole,
    method: 'post',
    data: parameter
  })
}

export function permissionTree (parameter) {
  return request({
    url: api.permissionTree,
    method: 'post',
    data: parameter
  })
}

export function getRoleGrantedPermissions (parameter) {
  return request({
    url: api.getRoleGrantedPermissions,
    method: 'post',
    data: parameter
  })
}

export function grantRolePermission (parameter) {
  return request({
    url: api.grantRolePermission,
    method: 'post',
    data: parameter
  })
}

export function findUser (parameter) {
  return request({
    url: api.findUser,
    method: 'post',
    data: parameter
  })
}

export function addUser (parameter) {
  return request({
    url: api.addUser,
    method: 'post',
    data: parameter
  })
}

export function editUser (parameter) {
  return request({
    url: api.editUser,
    method: 'post',
    data: parameter
  })
}

export function deleteUser (parameter) {
  return request({
    url: api.deleteUser,
    method: 'post',
    data: parameter
  })
}

export function resetUserPassword (parameter) {
  return request({
    url: api.resetUserPassword,
    method: 'post',
    data: parameter
  })
}

export function batchDeleteUser (parameter) {
  return request({
    url: api.batchDeleteUser,
    method: 'post',
    data: parameter
  })
}

export function batchDisableUser (parameter) {
  return request({
    url: api.batchDisableUser,
    method: 'post',
    data: parameter
  })
}

export function batchEnableUser (parameter) {
  return request({
    url: api.batchEnableUser,
    method: 'post',
    data: parameter
  })
}

export function getUserGrantedRoles (parameter) {
  return request({
    url: api.getUserGrantedRoles,
    method: 'post',
    data: parameter
  })
}

export function grantUserRoles (parameter) {
  return request({
    url: api.grantUserRoles,
    method: 'post',
    data: parameter
  })
}
