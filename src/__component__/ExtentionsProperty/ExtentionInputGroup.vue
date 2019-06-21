<template>
  <div class="extentionInputGroup">
    <Description :option="option"></Description>
    <div class="content">
      <template v-for="(item, index) in option.inputLists" >
        <LabelWithInput
          v-if="item.type === 'input'"
          :item="item"
          :key="index"
          @inputValueChange="inputValueChange"
        >
        </LabelWithInput>
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
    methods: {
      inputValueChange({ key, value }) {
        if (this.option.key === '__root__') {
          this.$emit('rootDataChange', { key, value });
          return;
        }
        if (value === '') {
          const cloneRootData = JSON.parse(JSON.stringify(this.rootData));
          delete cloneRootData[this.option.key][key];
          this.$emit('rootDataChange', { key: this.option.key, value: cloneRootData[this.option.key] });
        } else {
          this.$emit('rootDataChange', { key: this.option.key, value: Object.assign(this.rootData[this.option.key] || {}, { [key]: value }) });
        }
      },
    },
    props: {
      option: {
        type: Object,
        default: () => ({})
      },
      rootData: {
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
