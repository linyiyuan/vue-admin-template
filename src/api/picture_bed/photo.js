import request from '@/utils/request'
export function getPhoto(params) {
  return request({
    url:'/picture_bed/photo',
    method:'get',
    params:params
  })
}

export function createPhoto(params) {
  return request({
    url:'/picture_bed/photo',
    method:'post',
    data:params
  })
}

export function updatePhoto(id, params) {
  return request({
    url:'/picture_bed/photo' + '/' + id,
    method:'put',
    data:params
  })
}

export function getOnePhoto(id) {
  return request({
    url:'/picture_bed/photo' + '/' + id + '/edit',
    method:'get',
    params:id
  })
}

export function deletePhoto(id) {
  return request({
    url:'/picture_bed/photo' + '/' + id,
    method:'delete',
    data:id,
  })
}
