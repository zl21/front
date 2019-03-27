<template>
  <keep-alive
    :include="keepAliveLists"
  >
    <component
      :is="currentTable"
      :ref="currentTable"
    />
  </keep-alive>
</template>

<script>
  import Vue from 'vue';
  import { mapState } from 'vuex';
  
  export default {
    name: 'VerticalTableDetailKeepAlive',
  };
</script>
