import request from '@/utils/request'
export function getOperateLog(params) {
  return request({
    url:'/system/get_operate_log',
    method:'get',
    params:params
  })
}
