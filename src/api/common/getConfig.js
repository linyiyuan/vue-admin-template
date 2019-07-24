import request from '@/utils/request'
export function getGoodItem(params) {
  return request({
    url:'/common/get_good_item',
    method:'get',
    params:params
  })
}

export function getPropItem(params) {
  return request({
    url:'/common/get_prop_item',
    method:'get',
    params:params
  })
}

export function getPayTypeConf(params) {
  return request({
    url:'/common/get_pay_type_conf',
    method:'get',
    params:params
  })
}
