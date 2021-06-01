<template>
  <div
    class="dispalyArea"
    :data-keep-alive="keepAliveContainer"
  >
    <!-- 模块页签组件 -->
    <TabLists v-if="enableTabLists" />
    <div
      id="content"
      style="height: 100%; padding: 0 15px 0;overflow: auto;position: relative"
    >
      <keep-alive :include="keepAliveContainer">
        <router-view />
      </keep-alive>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import TabLists from './TabLists';
  import { enableTabLists } from '../constants/global';

  export default {
    data() {
      return {
        enableTabLists: true
      };
    },
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
    beforeMount() {
      this.enableTabLists = enableTabLists();
    }
  };
</script>
