<template>
  <div class="description">
    配置项 [ {{option.name}} ] ：
    {{option.description}}
  </div>
</template>

<script>
  export default {
    name: 'Description',
    props: {
      option: {
        type: Object,
        default: () => ({})
      }
    }
  };
</script>

<style scoped>

</style>
