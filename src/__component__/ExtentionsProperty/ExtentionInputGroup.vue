<template>
  <div class="extentionInputGroup">
    <Description :option="option"></Description>
    <div class="content">
      <div class="input-group-item" v-for="(item, index) in option.inputLists" :key="index">
        <div
          class="cell"
          :for="`${item.name}-${index}`"
          v-if="item.type === 'input'"
        >
          <LabelForInput :for="`${item.name}-${index}`" :item="item"></LabelForInput>
          <input
            class="input"
            :id="`${item.name}-${index}`"
            :type="item.InputType === 'Number' ? 'number' : 'text'"
          />
        </div>
        <div class="cell" v-if="item.type === 'radio'">
          <LabelForInput :for="`${item.name}-${index}`" :item="item"></LabelForInput>
          <LableWithRadio :option="item" :break-line="false"></LableWithRadio>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Description from './Description';
  import LabelForInput from './LabelForInput';
  import LableWithRadio from './LabelWithRadio';
  
  export default {
    name: 'InputGroup',
    components: {
      Description,
      LabelForInput,
      LableWithRadio
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
