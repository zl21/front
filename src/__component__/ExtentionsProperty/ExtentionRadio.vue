<template>
  <div class="extentionRadio">
    <Description :option="option" />
    <div class="content">
      <EnumerateRadioItem
        :option="option"
        @radioValueChange="radioValueChange"
      />
    </div>
  </div>
</template>

<script>
  import Description from './Description';
  import EnumerateRadioItem from './EnumerateRadioItem';
  
  export default {
    name: 'ExtentionRadio',
    components: {
      Description,
      EnumerateRadioItem
    },
    methods: {
      radioValueChange({ key, value }) {
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
  .extentionRadio {
    display: flex;
    flex-direction: column;
  }
</style>
