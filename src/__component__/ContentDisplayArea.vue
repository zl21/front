<template>
  <div>
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

</style>
