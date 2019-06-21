<template>
  <div class="extentionInputGroup">
    <Description :option="option"></Description>
    <div class="content">
      <div class="input-group-item" v-for="(item, index) in option.inputLists" :key="index">
        <LabelWithInput v-if="item.type === 'input'" :item="item"></LabelWithInput>
        <LabelWithRadio v-if="item.type === 'radio'" :item="item" :index="index"></LabelWithRadio>
      </div>
    </div>
  </div>
</template>

<script>
  import Description from './Description';
  import LabelWithInput from './LabelWithInput';
  import LabelWithRadio from './LabelWithRadio';
  
  export default {
    name: 'ExtentionInputGroup',
    components: {
      Description,
      LabelWithInput,
      LabelWithRadio,
    },
    props: {
      option: {
        type: Object,
        default: () => ({})
      }
    }
  };
</script>

<style scoped lang="less">
  .extentionInputGroup {
    display: flex;
    flex-direction: column;
  }
</style>
