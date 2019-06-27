<template>
  <div class="extentionRadio">
    <Description :option="option" />
    <div class="content">
      <EnumerateRadioItem
        :default-data="defaultData"
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
        this.$emit('dataChange', { key, value });
      }
    },
    props: {
      option: {
        type: Object,
        default: () => ({})
      },
      defaultData: {
        type: [Boolean, String],
        default: '__empty__'
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
