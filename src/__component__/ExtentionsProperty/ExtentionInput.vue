<template>
  <div class="extentionInput">
    <Description :option="option"></Description>
    <div class="content">
      <div class="input-group-item">
        <LabelWithInput :option="option"></LabelWithInput>
      </div>
    </div>
  </div>
</template>

<script>
  import Description from './Description';
  import LabelWithInput from './LabelWithInput';
  
  export default {
    name: 'ExtentionInput',
    components: {
      Description,
      LabelWithInput
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
  .extentionInput {
    display: flex;
    flex-direction: column;
  }
</style>
