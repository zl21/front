<template>
  <div class="extentionInputGroup">
    <Description
      :option="option"
      @removeOption="removeOption"
    />
    <div class="content">
      <template v-for="(item, index) in option.inputLists">
        <LabelWithInput
          v-if="item.type === 'input'"
          :key="index"
          :item="item"
          :default-data="option.key === '__root__' ? defaultData[item.key] : (defaultData[option.key] ? defaultData[option.key][item.key] : '')"
          @inputValueChange="inputGroupValueChange"
        />
        <LabelWithRadio
          v-if="item.type === 'radio'"
          :key="index"
          :item="item"
          :index="index"
          :default-data="option.key === '__root__' ? defaultData[item.key] : (defaultData[option.key] ? defaultData[option.key][item.key] : '__empty__')"
          @radioValueChange="inputGroupValueChange"
        />
        <ExtentionObjectGroup
          v-if="item.type === 'object-group'"
          :key="index"
          :show-description="false"
          :option="item"
          :index="index"
          :default-data="option.key === '__root__' ? defaultData[item.key] : (defaultData[option.key] || {})[item.key]"
          @dataChange="objectGroupValueChange"
        />
      </template>
    </div>
  </div>
</template>

<script>
  import Description from './Description';
  import LabelWithInput from './LabelWithInput';
  import LabelWithRadio from './LabelWithRadio';
  import ExtentionObjectGroup from './ExtentionObjectGroup';
  
  export default {
    name: 'ExtentionInputGroup',
    components: {
      Description,
      LabelWithInput,
      LabelWithRadio,
      ExtentionObjectGroup
    },
    methods: {
      removeOption(keyArray) {
        this.$emit('removeOption', keyArray || []);
      },
      objectGroupValueChange({ key, value }) {
        if (this.option.key === '__root__') {
          this.$emit('dataChange', { key, value });
        } else if (this.option.key !== '__root__') {
          if (value !== '') {
            this.$emit('dataChange', {
              key: this.option.key,
              value: Object.assign(this.defaultData[this.option.key] || {}, { [key]: value })
            });
          } else {
            const copyData = this.defaultData[this.option.key];
            delete copyData[key];
            this.$emit('dataChange', {
              key: this.option.key,
              value: JSON.stringify(copyData) === '{}' ? '' : copyData
            });
          }
        }
      },
      inputGroupValueChange({ key, value }) {
        console.log(key, value);
        if (this.option.key === '__root__') {
          this.$emit('dataChange', { key, value });
          return;
        }
        if (value === '') {
          const cloneRootData = JSON.parse(JSON.stringify(this.defaultData));
          delete cloneRootData[this.option.key][key];
          this.$emit('dataChange', { key: this.option.key, value: JSON.stringify(cloneRootData[this.option.key]) === '{}' ? '' : cloneRootData[this.option.key] });
        } else {
          this.$emit('dataChange', { key: this.option.key, value: Object.assign(this.defaultData[this.option.key] || {}, { [key]: value }) });
        }
      },
    },
    props: {
      option: {
        type: Object,
        default: () => ({})
      },
      defaultData: {
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
