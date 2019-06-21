<template>
  <div class="extentionInputGroup">
    <Description :option="option"></Description>
    <div class="content">
      <template v-for="(item, index) in option.inputLists" >
        <LabelWithInput v-if="item.type === 'input'" :item="item" :key="index"></LabelWithInput>
        <LabelWithRadio v-if="item.type === 'radio'" :item="item" :index="index" :key="index"></LabelWithRadio>
      </template>
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
