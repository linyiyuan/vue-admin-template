import request from '@/utils/request'
export function getPhotoAlbum(params) {
  return request({
    url:'/picture_bed/photo_album',
    method:'get',
    params:params
  })
}

export function createPhotoAlbum(params) {
  return request({
    url:'/picture_bed/photo_album',
    method:'post',
    data:params
  })
}

export function updatePhotoAlbum(id, params) {
  return request({
    url:'/picture_bed/photo_album' + '/' + id,
    method:'put',
    data:params
  })
}

export function getOnePhotoAlbum(id) {
  return request({
    url:'/picture_bed/photo_album' + '/' + id + '/edit',
    method:'get',
    params:id
  })
}

export function deletePhotoAlbum(id) {
  return request({
    url:'/picture_bed/photo_album' + '/' + id,
    method:'delete',
    data:id,
  })
}
