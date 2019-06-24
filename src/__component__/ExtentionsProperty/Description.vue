<template>
  <div class="description">
    <span class="fieldName">
       {{ option.name }} ：
    </span>
    {{ option.description }}
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
