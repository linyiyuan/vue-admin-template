import request from '@/utils/request'
export function sendPhoneCode(params) {
  return request({
    url:'/common/send_phone_code',
    method:'get',
    params:params
  })
}
