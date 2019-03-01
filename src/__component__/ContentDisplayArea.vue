<template>
  <div>
    <TabLists />
    <router-view />
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
