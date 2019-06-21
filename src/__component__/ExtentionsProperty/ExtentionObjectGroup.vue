<template>
  <div class="extentionObjectGroup">
    <Description :option="option"></Description>
    <div class="content">
      <div
        class="input-group-item"
        v-for="(item, index) in option.objectInfo"
        :key="index"
      >
        <LabelWithInput v-if="item.type === 'input'" :item="item"></LabelWithInput>
        <LabelWithRadio v-if="item.type === 'radio'" :item="item"></LabelWithRadio>
        <LabelWithSelect v-if="item.type === 'select'" :item="item"></LabelWithSelect>
      </div>
    </div>
  </div>
</template>

<script>
  import Description from './Description';
  import LabelWithInput from './LabelWithInput';
  import LabelWithRadio from './LabelWithRadio';
  import LabelWithSelect from './LabelWithSelect';
  
  export default {
    name: 'ExtentionObjectGroup',
    components: {
      Description,
      LabelWithInput,
      LabelWithRadio,
      LabelWithSelect
    },
    props: {
      option: {
        type: Object,
        default: () => ({})
      }
    }
  };
</script>

<style scoped>
  .extentionObjectGroup {
    display: flex;
    flex-direction: column;
  }
</style>
