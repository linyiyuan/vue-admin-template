import request from '@/utils/request'
export function getHomeData(params) {
  return request({
    url:'/system/get_home_data',
    method:'get',
    params:params
  })
}

export function getNetraffic(params) {
  return request({
    url:'/system/get_netraffic',
    method:'get',
    params:params
  })
}

export function getWebSiteList(params) {
  return request({
    url:'/system/get_web_siteList',
    method:'get',
    params:params
  })
}