<template>
  <div class="extentionObjectGroup">
    <Description :option="option"></Description>
    <div v-for="(item, index) in option.objectInfo" :key="index">
      <LabelWithInput v-if="item.type === 'input'" :option="item"></LabelWithInput>
    </div>
  </div>
</template>

<script>
  import Description from './Description';
  import LabelWithInput from './LabelWithInput';
  
  export default {
    name: 'ExtentionObjectGroup',
    components: {
      Description,
      LabelWithInput
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

</style>
