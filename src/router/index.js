import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../views/layout/Layout'

Vue.use(Router)

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },

  {
    path: '',
    component: Layout,
    redirect: '/home',
    children: [{
        path: 'home',
        name: 'home',
        component: () => import('@/views/home/index'),
        meta: { title: '首页', icon: 'home' }
      },
      { path: '/401', component: () => import('@/views/error/401'), hidden: true },
      { path: '/404', component: () => import('@/views/error/404'), hidden: true },

    ]
  },



]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})


/**
 * 需要过滤动态加载的路由
 **/
export const asyncRouterMap = [{
    path: '/auth',
    component: Layout,
    name: 'Api:auth',
    alwaysShow: true,
    meta: { title: '用户模块', icon: 'user' },
    children: [{
        path: 'user',
        name: 'Api:auth/user-index',
        component: () => import('@/views/user/users/index'),
        meta: { title: '用户列表', icon: 'product-list' }
      },
      {
        path: 'user/create',
        name: 'Api:auth/user-store',
        component: () => import('@/views/user/users/create'),
        meta: { title: ' 添加用户', icon: 'product-add' },
        hidden: true
      },
      {
        path: 'user/update',
        name: 'Api:auth/user-update',
        component: () => import('@/views/user/users/update'),
        meta: { title: '修改用户', icon: 'product-add' },
        hidden: true
      },
      {
        path: 'role',
        name: 'Api:auth/role-index',
        component: () => import('@/views/user/role/index'),
        meta: { title: '角色列表', icon: 'role' },
      },
      {
        path: 'permission',
        name: 'Api:auth/permission-index',
        component: () => import('@/views/user/permission/index'),
        meta: { title: '权限管理', icon: 'permission' },
      },
    ]
  },
  {
    path: '/picture_bed',
    component: Layout,
    name: 'Api:picture_bed',
    redirect: '/picture_bed/photo_album',
    alwaysShow: true,
    meta: { title: '图床管理', icon: 'picture_bed' },
    children: [{
        path: 'photo_album',
        name: 'Api:picture_bed/photo_album-index',
        component: () => import('@/views/picture_bed/photo_album/index'),
        meta: { title: '相册管理', icon: 'photo_album' }
      },
      {
        path: 'photo_album/create',
        name: 'Api:picture_bed/photo_album-store',
        component: () => import('@/views/picture_bed/photo_album/create'),
        meta: { title: ' 添加相册', icon: 'product-add' },
        hidden: true
      },
      {
        path: 'photo_album/update',
        name: 'Api:picture_bed/photo_album-update',
        component: () => import('@/views/picture_bed/photo_album/update'),
        meta: { title: '修改相册', icon: 'product-add' },
        hidden: true
      },
      {
        path: 'photo',
        name: 'Api:picture_bed/photo-index',
        component: () => import('@/views/picture_bed/photo/index'),
        meta: { title: '图片管理', icon: 'photo_upload' },
      },
      {
        path: 'photo/create',
        name: 'Api:picture_bed/photo-store',
        component: () => import('@/views/picture_bed/photo/create'),
        meta: { title: '图片上传', icon: 'photo_upload' },
        hidden: true
      },
    ]
  },
  {
    path: '/system',
    component: Layout,
    name: 'Api:system',
    redirect: '/system/getConfig',
    alwaysShow: true,
    meta: { title: '系统管理', icon: 'tools' },
    children: [{
        path: 'getConfig',
        name: 'Api:system/get_config-getConfig',
        component: () => import('@/views/system/index/'),
        meta: { title: '系统配置', icon: 'product-list' }
      },
      {
        path: 'getLog',
        name: 'Api:system/get_operate_log-getList',
        component: () => import('@/views/system/operateLog/'),
        meta: { title: '操作日志', icon: 'log' }
      },
      {
        path: 'getNetraffic',
        name: 'Api:system/get_netraffic-netraffic',
        component: () => import('@/views/system/netraffic/'),
        meta: { title: '流量监控', icon: 'netraffic' }
      },
    ]
  },

  { path: '*', redirect: '/404', hidden: true }

]
