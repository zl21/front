<template>
  <div class="ExtentionOptions">
    <Description
      v-if="showDescription"
      :option="option"
      @removeOption="removeOption"
    />
  </div>
</template>
<script>
  import Description from './Description';
  import ObjectGroupItem from './ObjectGroupItem';

  export default {
    name: 'ExtentionOptions',
    components: {
      Description
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
        type: [Array],
        default: () => []
      },
    },
    methods: {
      removeOption(keyArray) {
        this.$emit('removeOption', keyArray || []);
      },
    }
  };
</script>
<style lang="less" scoped>

</style>
