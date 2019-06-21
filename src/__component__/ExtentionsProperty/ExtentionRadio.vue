<template>
  <div class="extentionRadio">
    <Description :option="option"></Description>
    <div class="content">
      <LabelWithRadio :option="option"></LabelWithRadio>
    </div>
  </div>
</template>

<script>
  import Description from './Description';
  import LabelWithRadio from './LabelWithRadio';
  
  export default {
    name: 'Radio',
    components: {
      Description,
      LabelWithRadio
    },
    props: {
      option: {
        type: Object,
        default: () => ({})
      }
    }
  };
</script>

<style lang="less">
  .extentionRadio {
    display: flex;
    flex-direction: column;
  }
</style>
