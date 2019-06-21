<template>
  <label class="label" :for="labelFor">{{item.name}}：<br/>[ {{item.key}} ] &nbsp;&nbsp;</label>
</template>

<script>
  export default {
    name: 'Label',
    props: {
      item: {
        type: Object,
        default: () => ({})
      },
      labelFor: {
        type: String,
        default: ''
      }
    }
  };
</script>

<style scoped>

</style>
