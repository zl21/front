<template>
  <div class="LabelWithObjectGroup">
    <template
      v-for="(item, index) in option.objectInfo"
    >
      <LabelWithInput
        v-if="item.type === 'input'"
        :item="item"
        :key="index"
        @inputValueChange="objectGroupValueChange"
      ></LabelWithInput>
      <LabelWithRadio
        v-if="item.type === 'radio'"
        :item="item"
        :key="index"
        @radioValueChange="objectGroupValueChange"
      ></LabelWithRadio>
      <LabelWithSelect
        v-if="item.type === 'select'"
        :item="item"
        :key="index"
        @selectValueChange="objectGroupValueChange"
      ></LabelWithSelect>
    </template>
    <button v-if="showAddButton" @click="addButtonClick"> + </button>
    <button v-if="showMinusButton" @click="minusButtonClick"> - </button>
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
        this.$emit('addButtonClick');
      },
      minusButtonClick() {
        this.$emit('minusButtonClick');
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
      }
    }
  };
</script>

<style scoped>
  .LabelWithObjectGroup {
    margin: 5px;
    background-color: #e298ff;
  }
</style>
