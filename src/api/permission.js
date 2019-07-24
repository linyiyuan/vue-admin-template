import request from '@/utils/request'
export function getPermission(params) {
  return request({
    url:'/auth/permission',
    method:'get',
    params:params
  })
}

export function createPermission(params) {
  return request({
    url:'/auth/permission',
    method:'post',
    data:params
  })
}

export function deletePermission(id) {
  return request({
    url:'/auth/permission' + '/' + id,
    method:'delete',
    data:id,
  })
}

export function updatePermission(id, params) {
  return request({
    url:'/auth/permission' + '/' + id,
    method:'put',
    data:params
  })
}