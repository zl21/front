<template>
  <div class="ExtentionOptions">
    <Description
      v-if="showDescription"
      :option="option"
      @removeOption="removeOption"
    />
    <LabelWithInput
      :item="option"
      :default-data="defaultData"
      @inputValueChange="inputValueChange"
    />
  </div>
</template>
<script>
  import Description from './Description';
  import ObjectGroupItem from './ObjectGroupItem';
  import LabelWithInput from './LabelWithInput';

  export default {
    name: 'ExtentionOptions',
    components: {
      Description,
      LabelWithInput
    },
    props: {
      showDescription: {
        type: Boolean,
        default: true
      },
      option: {
        type: Object,
        default: () => ({})
      },
      defaultData: {
        type: [String],
        default: () => []
      },
    },
    methods: {
      removeOption(keyArray) {
        this.$emit('removeOption', keyArray || []);
      },
      inputValueChange({ key, value }) {
        this.$emit('dataChange', { key, value });
      }
    }
  };
</script>
<style lang="less" scoped>

</style>
