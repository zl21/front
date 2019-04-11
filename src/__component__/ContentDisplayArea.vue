<template>
  <div class="dispalyArea" :data-keep-alive="keepAliveContainer">
    <!-- 模块页签组件 -->
    <TabLists />
    <keep-alive :include="keepAliveContainer">
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import TabLists from './TabLists';
  
  export default {
    name: 'ContentDisplayArea',
    computed: {
      ...mapState('global', ['keepAliveLists']),
      keepAliveContainer() {
        return Object.keys(this.keepAliveLists.map(d => d.split('.')[0]).reduce((a, c) => { a[c] = true; return a; }, {})).map(d => `${d}.Table.KeepAlive`);
      }
    },
    components: {
      TabLists
    },
  };
</script>

<style scoped>
  .dispalyArea {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
</style>
