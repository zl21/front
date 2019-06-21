<template>
  <div class="extentionObjectGroup">
    <Description :option="option"></Description>
    <div>
    </div>
  </div>
</template>

<script>
  import Description from './Description';
  
  export default {
    name: 'ExtentionObjectGroup',
    components: {
      Description
    },
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
