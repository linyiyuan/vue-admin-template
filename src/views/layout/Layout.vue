<template>
  <div class="app-wrapper" :class="classObj">
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <navbar></navbar>
      <el-tabs  type="card" v-model="activeRoute" @tab-click="changeTags" closable @tab-remove="removeTags">
          <el-tab-pane
            v-for="(item, index) in allViews"
            :label="item.name"
            :name="item.path"
            :key="item.path"
          >
          </el-tab-pane>
        </el-tabs>
      <app-main></app-main>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  data () {
    return {
      
    }
  },
  methods: {
    changeTags(tab,event) {
      this.$router.push(tab.name)
    },
    removeTags(name,event){
      this.$store.dispatch('removeView', name).then(res => { // 移除tags

      }).catch((err) => {
      
      })
    }
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    },
    activeRoute: {
      get () {
        return this.$route.path
      },
      set (val) {
          
      }
    },
    allViews: {
      get () {
        return this.$store.getters.allViews
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
  }
</style>
