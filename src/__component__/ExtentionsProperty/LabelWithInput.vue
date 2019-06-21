<template>
  <div class="cell">
    <LabelForInput :item="option"></LabelForInput>
    <input class="input" :type="option.inputType === 'Number' ? 'number' : 'text'" />
  </div>
</template>

<script>
  import LabelForInput from './LabelForInput';
  
  export default {
    name: 'LabelWithInput',
    components: {
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

<style scoped>

</style>
