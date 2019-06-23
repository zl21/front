<template>
  <div class="input-group-item">
    <div class="cell">
      <LabelForInput :item="item" />
      <input
        ref="input"
        class="input"
        :placeholder="`请输入[${item.name}]${item.outputValueType === 'Array' ? '，以英文逗号(,)间隔' : ''}`"
        :type="item.inputType === 'Number' ? 'number' : 'text'"
        @input="inputChange"
      >
    </div>
  </div>
</template>

<script>
  import LabelForInput from './LabelForInput';
  
  export default {
    name: 'LabelWithInput',
    components: {
      LabelForInput
    },
    methods: {
      inputChange(e) {
        this.$emit('inputValueChange', {
          key: this.item.key,
          // eslint-disable-next-line no-nested-ternary
          value: this.item.outputValueType === 'Array' && e.target.value !== '' ? e.target.value.split(',') : (this.item.inputType === 'Number' ? parseInt(e.target.value, 10) : e.target.value)
        });
      }
    },
    props: {
      item: {
        type: Object,
        default: () => ({})
      },
      defaultData: {
        type: [String, Number, Array],
        default: ''
      }
    },
    mounted() {
      this.$refs.input.value = this.defaultData;
    }
  };
</script>

<style scoped>

</style>
