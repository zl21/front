<template>
  <div id="app">
    <!-- 标题 -->
    <div class="left">
      <ul>
        <li v-for="(item,i) in config"
            :key="i"
            :class="activedClass(item)">
          <router-link v-bind:to="item.path">{{item.name}}</router-link>
        </li>
      </ul>
    </div>
    <router-view class="right"></router-view>
  </div>
</template>
<script>


import config from './router/config.js';
// 动态路由
let _router = config.reduce((arr, item) => {
  arr.push({
    path: item.path,
    component: loadView(item.component)
  })
  return arr;
}, []);

function loadView (view) {
  return (resolve) => require(['./demo' + view], resolve)
}

export default {
  components: {
  },
  data () {
    return {
      config: config
    }
  },
  computed: {
    activedClass () {
      return function (item) {
        if (item.path === this.$route.path) {
          return 'actived';
        } else {
          return ''
        }
      }

    }
  },
  created () {
    console.log(this.$router.options);
    this.$router.addRoutes(_router);
    // setTimeout(()=>{
    // console.log(this.$_live_getChildComponent(this,'Header'),'111');
    // },1000)
  }
}

</script>
<style lang="less">
#app {
  padding: 20px;
  display: flex;
  h5 {
    padding-bottom: 20px;
  }
  .left {
    width: 100px;
    border: 1px solid #ddd;

    li {
      display: block;
      border-bottom: 1px solid #ddd;
      padding: 10px;
      &.actived {
        font-weight: bolder;
      }
    }
  }
  .right {
    flex: 1;
    padding: 20px;
  }
}
</style>

