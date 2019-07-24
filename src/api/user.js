import request from '@/utils/request'
export function userList(params) {
  return request({
    url:'/auth/user',
    method:'get',
    params:params
  })
}

export function createUser(params) {
  return request({
    url:'/auth/user',
    method:'post',
    data:params
  })
}

export function updateUser(id, params) {
  return request({
    url:'/auth/user' + '/' + id,
    method:'put',
    data:params
  })
}

export function deleteUser(id) {
  return request({
    url:'/auth/user' + '/' + id,
    method:'delete',
    data:id,
  })
}

export function resetPassword(params) {
  return request({
    url:'/auth/reset_password',
    method:'post',
    data:params,
  })
}
