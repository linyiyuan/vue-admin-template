import request from '@/utils/request'
export function getHomeData(params) {
  return request({
    url:'/system/get_home_data',
    method:'get',
    params:params
  })
}
