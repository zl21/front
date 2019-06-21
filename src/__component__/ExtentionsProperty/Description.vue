<template>
  <div class="description">
    配置项<b style="color: orangered;">[ {{option.name}} ] </b>：
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
