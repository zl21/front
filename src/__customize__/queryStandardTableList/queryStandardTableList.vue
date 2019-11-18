<template>
  <div class="queryStandardTableList">
    <Input
      search
      placeholder="请输入机构编号或名称"
    />
    <StandardTableList />
  </div>
</template>
<script>

  import StandardTableList from '../../__component__/StandardTableList';

  export default {
    components: {
      StandardTableList
    }
  };
</script>
<style scoped>

</style>
