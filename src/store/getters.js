const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  userId: state => state.user.userId,
  permissions: state => state.user.permissions,
  // phoneCode: state => state.user.phoneCode,
  routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  downLoadUrl: state => state.user.downLoadUrl,
  allViews: state => state.tagsViews.allViews,
  allViewsNames: state => state.tagsViews.allViewsNames,
}
export default getters
