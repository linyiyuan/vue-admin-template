import request from '@/utils/request'

export function login(username, password, code) {
  return request({
    url: '/auth/login',
    method: 'post'  ,
    data: {
      username,
      password,
      code,
    }
  })
}

export function getInfo() {
  return request({
    url: '/auth/getInfo',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}
