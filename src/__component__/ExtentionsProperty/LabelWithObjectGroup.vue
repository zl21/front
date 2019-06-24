<template>
  <div class="labelWithObjectGroup">
    <template
      v-for="(item, index) in option.objectInfo"
    >
      <LabelWithInput
        v-if="item.type === 'input'"
        :key="index"
        :item="item"
        :default-data="defaultData[item.key]"
        @inputValueChange="objectGroupValueChange"
      />
      <LabelWithRadio
        v-if="item.type === 'radio'"
        :key="index"
        :item="item"
        :default-data="defaultData[item.key]"
        @radioValueChange="objectGroupValueChange"
      />
      <LabelWithSelect
        v-if="item.type === 'select'"
        :key="index"
        :item="item"
        :default-data="defaultData[item.key]"
        @selectValueChange="objectGroupValueChange"
      />
    </template>
    <button
      v-if="showAddButton"
      @click="addButtonClick"
    >
      +
    </button>
    <button
      v-if="showMinusButton"
      @click="minusButtonClick"
    >
      -
    </button>
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
    methods: {
      objectGroupValueChange({ key, value }) {
        this.$emit('objectGroupItemChange', this.objectGroupIndex, { key, value, belongKey: this.option.key });
      },
      addButtonClick() {
        this.$emit('addButtonClick', { belongKey: this.option.key });
      },
      minusButtonClick() {
        this.$emit('minusButtonClick', { belongKey: this.option.key });
      },
    },
    props: {
      option: {
        type: Object,
        default: () => ({})
      },
      data: {
        type: Object,
        default: () => ({})
      },
      showAddButton: {
        type: Boolean,
        default: false
      },
      showMinusButton: {
        type: Boolean,
        default: false
      },
      objectGroupIndex: {
        type: Number,
        default: 0
      },
      defaultData: {
        type: Object,
        default: () => ({})
      }
    }
  };
</script>

<style scoped>
</style>
