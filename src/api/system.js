import request from '@/utils/request'
export function getSystemConfig() {
  return request({
    url:'/system/get_config',
    method:'get',
  })
}