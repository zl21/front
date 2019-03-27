<template>
  <div>
    <h1>{{ $route.params.tableName }}</h1>
    <h1>{{ $route.params.tableId }}</h1>
    <h1>{{ $route.params.itemId }}</h1>
  </div>
</template>

<script>
  export default {
    name: 'VerticalTableDetail'
  };
</script>

<style scoped>

</style>
