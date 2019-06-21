<template>
  <div class="extentionInput">
    <Description :option="option"></Description>
    <div class="content">
      <div class="input-group-item">
        <div class="cell">
          <LabelForInput :for="'extentionInputElement'" :item="option"></LabelForInput>
          <input class="input" id="extentionInputElement" :type="option.inputType === 'Number' ? 'number' : 'text'" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Description from './Description';
  import LabelForInput from './LabelForInput';
  
  export default {
    name: 'Input',
    components: {
      Description,
      LabelForInput
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
  .extentionInput {
    display: flex;
    flex-direction: column;
  }
</style>
