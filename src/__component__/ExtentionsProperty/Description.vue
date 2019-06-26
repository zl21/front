<template>
  <div class="description">
    <span class="fieldName">
       {{ option.name }} ：
    </span>
    <span class="content">{{ option.description }}</span>
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
