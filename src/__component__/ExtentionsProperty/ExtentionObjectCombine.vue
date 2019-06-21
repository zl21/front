<template>
  <div class="extentionObjectCombine">
    <Description :option="option"></Description>
    <div class="content">
      <template v-for="(o, i) in option.objectInfo">
        <LabelWithObjectGroup v-if="o.type === 'object-group'" :option="o" :key="i"></LabelWithObjectGroup>
        <LabelWithInput v-if="o.type === 'input'" :item="o" :key="i"></LabelWithInput>
      </template>
    </div>
  </div>
</template>

<script>
  import Description from './Description';
  import LabelWithObjectGroup from './LabelWithObjectGroup';
  import LabelWithInput from './LabelWithInput';
  
  export default {
    name: 'ExtentionObjectCombine',
    components: {
      Description,
      LabelWithObjectGroup,
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
