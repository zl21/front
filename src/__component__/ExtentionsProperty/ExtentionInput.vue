<template>
  <div class="extentionInput">
    <Description :option="option"></Description>
    <div class="content">
      <LabelWithInput
        :item="option"
        @inputValueChange="inputValueChange"
      >
      </LabelWithInput>
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
    methods: {
      inputValueChange({ key, value }) {
        this.$emit('rootDataChange', { key, value });
      }
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
