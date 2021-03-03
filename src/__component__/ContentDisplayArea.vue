<template>
  <div
    class="dispalyArea"
    :data-keep-alive="keepAliveContainer"
  >
    <!-- 模块页签组件 -->
    <TabLists v-show="enableTabLists&&openedMenuLists.length>0&&!flag" />
    <div
      v-show="(openedMenuLists.length>0&&!flag)||!getDashboardConfig"
      id="content"
      style="height: 100%; padding: 0 15px 0;overflow: auto;position: relative"
    >
      <keep-alive :include="keepAliveContainer">
        <router-view />
      </keep-alive>
    </div>
    <div
      v-show="getDashboardConfig&&flag"
      id="content"
      style="height: 100%; padding: 0 15px 0;overflow: auto;position: relative"
    >
      <component
        :is="getDashboardConfig.compontent"
        v-if="getDashboardConfig&&getDashboardConfig.compontent"
      />
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import TabLists from './TabLists';
  import { enableTabLists, dashboardConfig } from '../constants/global';
  
  export default {
    data() {
      return {
        enableTabLists: true,
        flag: false
      };
    },
    name: 'ContentDisplayArea',
    watch: {
      $route(to) {
        if (to.path === '/') {
          this.flag = true;
        } else {
          this.flag = false;
        }
      },
      isShowDashboardPage(val) {
        if (val) {
          this.flag = true;
        } else {
          this.flag = false;
        }
      }
    },
    mounted() {
      if (this.$router.currentRoute.path === '/') {
        this.flag = true;
      }
    },
    computed: {
      ...mapState('global', ['keepAliveLists', 'openedMenuLists', 'isShowDashboardPage']),

      keepAliveContainer() {
        return Object.keys(this.keepAliveLists.map(d => d.split('.')[0]).reduce((a, c) => { a[c] = true; return a; }, {})).map(d => `${d}.Table.KeepAlive`);
      },
      getDashboardConfig() {
        if (dashboardConfig()) {
          return dashboardConfig();
        }
        return null;
      },
    },
    components: {
      TabLists
    },
    beforeMount() {
      this.enableTabLists = enableTabLists();
    }
  };
</script>

<style scoped>
  .dispalyArea {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
</style>
