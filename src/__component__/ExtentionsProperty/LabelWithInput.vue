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
        let value = '';
        if (this.item.outputValueType === 'Array' && e.target.value !== '') {
          value = e.target.value.split(',');
        } else if (this.item.outputValueType === 'JSON' && e.target.value !== '') {
          try {
            value = JSON.parse(e.target.value);
          } catch {
            return;
          }
        } else if (this.item.inputType === 'Number') {
          value = parseInt(e.target.value, 10);
        } else {
          value = e.target.value;
        }
        this.$emit('inputValueChange', {
          key: this.item.key,
          value
        });
      }
    },
    props: {
      item: {
        type: Object,
        default: () => ({})
      },
      defaultData: {
        type: [String, Number, Array, Object],
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
