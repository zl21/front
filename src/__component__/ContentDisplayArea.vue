<template>
  <div class="dispalyArea">
    <!-- 模块页签组件 -->
    <TabLists />
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
  import TabLists from './TabLists';

  export default {
    name: 'ContentDisplayArea',
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
