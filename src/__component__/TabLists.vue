<template>
  <div class="tab-lists">
    <div
      class="tab-item"
      v-for="(tab, tabIndex) in openedMenuLists"
      :key="`tab-list-${tabIndex}`"
    >
      {{ tab.label }}
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  
  export default {
    name: 'TabLists',
    computed: {
      ...mapState('global', {
        openedMenuLists: ({ openedMenuLists }) => openedMenuLists
      })
    },
  };
  
</script>

<style scoped lang="less">
  .tab-lists {
    display: flex;
    
    .tab-item {
      border: 1px solid black;
      min-width: 100px;
    }
  }
</style>
