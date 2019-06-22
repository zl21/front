<template>
  <div class="input-group-item">
    <div class="cell">
      <LabelForInput :item="item" />
      <input
        class="input"
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
          value: this.item.outputValueType === 'Array' && e.target.value !== '' ? e.target.value.split(',') : e.target.value
        });
      }
    },
    props: {
      item: {
        type: Object,
        default: () => ({})
      },
    }
  };
</script>

<style scoped>

</style>
