<template>
  <div class="extentionInput">
    <Description :option="option" />
    <div class="content">
      <LabelWithInput
        :item="option"
        :default-data="defaultData"
        @inputValueChange="inputValueChange"
      />
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
      },
      defaultData: {
        type: [String, Number, Array],
        default: ''
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
