import store from '@/store'


const tagsViews = {
  state: {
    allViews:[],
  },

  mutations: {
    SET_VIEWS: (state, route) => {

      let addViews = true;
      for (var i = 0; i < state.allViews.length; i++) {
          if (state.allViews[i].path == route.path) {
            addViews = false
          }
      }
      if (addViews == true) {
        state.allViews.push({'name' : route.meta.title, 'path':route.path, 'routeName' :route.name})   
      }   
    },
    DEL_VIEWS: (state) => {
      state.allViews = []
    },
    REMOVE_VIEWS: (state,name) => {
        let allViews = state.allViews
        let allViewsNames = state.allViewsNames
        for (var i = 0; i < state.allViews.length; i++) {
            if (allViews[i].path == name) {
                allViews.splice(i,1)
            }
        }
        state.allViews = allViews
        state.getters.allViews = allViews
    }
  },

  actions: {
    // 登录
    delAllViews({ commit }) {
      return new Promise((resolve, reject) => {
          commit('DEL_VIEWS')
          resolve(true)
        }).catch(error => {    
          reject(error)
      })
    },
    addViews({ commit }, route) {
      return new Promise((resolve, reject) => {
          commit('SET_VIEWS', route)
          resolve(true)
        }).catch(error => {         
          reject(error)
      })
    },
    removeView({commit}, name) {
      return new Promise((resolve, reject) => {        
        commit('REMOVE_VIEWS', name)
          resolve(true)
        }).catch(error => {         
          reject(error)
      })
    }
  }
}

export default tagsViews
