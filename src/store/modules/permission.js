import { asyncRouterMap, constantRouterMap } from '@/router';

function hasPermission(permission, route) {
  if (route.name) {
    return permission.indexOf(route.name) >= 0
  } else {
    return true
  }
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers;
      state.routers = constantRouterMap.concat(routers);
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const permission = data.data.permission;
        const role = data.data.role;
        const accessedRouters = asyncRouterMap.filter(v => {
          if (role.indexOf('super_admin') >= 0) return true;
          if (hasPermission(permission, v)) {
            if (v.children && v.children.length > 0) {
              v.children = v.children.filter(child => {
                if (hasPermission(permission, child)) {
                  return child
                }
                return false;
              });
              return v
            } else {
              return v
            }
          }
          return false;
        });
        commit('SET_ROUTERS', accessedRouters);
        resolve();
      })
    }
  }
};

export default permission;