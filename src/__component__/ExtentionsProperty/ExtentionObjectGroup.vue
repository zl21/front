<template>
  <div class="extentionObjectGroup">
    <Description :option="option"></Description>
    <div class="content">
      <LabelWithObjectGroup :option="option"></LabelWithObjectGroup>
    </div>
  </div>
</template>

<script>
  import Description from './Description';
  import LabelWithObjectGroup from './LabelWithObjectGroup';
  
  export default {
    name: 'ExtentionObjectGroup',
    components: {
      Description,
      LabelWithObjectGroup,
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
  .extentionObjectGroup {
    display: flex;
    flex-direction: column;
  }
</style>
