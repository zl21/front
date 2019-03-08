<template>
  <div>
    <h1>Router Info: {{ $route.path }}</h1>
    <!-- 按钮栏组件 -->
    <h2>按钮栏组件</h2>
    <div class="buttonList">
      <div class="button-group" />
    </div>


    <!-- Form 表单组件 -->
    <h2>Form 表单组件</h2>
    
    <!-- 表格组件 -->
    <h2>表格组件</h2>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';
  
  export default {
    data() {
      return {
       

      };
    },
    components: {
    },
    methods: {
      ...mapActions('global', ['updateAccessHistory'])
    },
    activated() {
      this.updateAccessHistory({ type: 'table', id: this.$route.params.tableId });
    }
  };
</script>

<style lang="less">

</style>
