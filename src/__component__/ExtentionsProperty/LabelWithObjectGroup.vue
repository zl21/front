<template>
  <div class="LabelWithObjectGroup">
    <template
      v-for="(item, index) in option.objectInfo"
    >
      <LabelWithInput v-if="item.type === 'input'" :item="item" :key="index"></LabelWithInput>
      <LabelWithRadio v-if="item.type === 'radio'" :item="item" :key="index"></LabelWithRadio>
      <LabelWithSelect v-if="item.type === 'select'" :item="item" :key="index"></LabelWithSelect>
    </template>
  </div>
</template>

<script>
  import LabelWithInput from './LabelWithInput';
  import LabelWithRadio from './LabelWithRadio';
  import LabelWithSelect from './LabelWithSelect';
  
  export default {
    name: 'LabelWithObjectGroup',
    components: {
      LabelWithInput,
      LabelWithRadio,
      LabelWithSelect
    },
    props: {
      option: {
        type: Object,
        default: () => ({})
      },
    }
  };
</script>

<style scoped>
  .LabelWithObjectGroup {
    background-color: #e298ff;
  }
</style>
