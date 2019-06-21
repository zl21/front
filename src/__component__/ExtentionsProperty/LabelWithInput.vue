<template>
  <div class="input-group-item">
    <div class="cell">
      <LabelForInput :item="item"></LabelForInput>
      <input class="input" :type="item.inputType === 'Number' ? 'number' : 'text'" />
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
    props: {
      item: {
        type: Object,
        default: () => ({})
      }
    }
  };
</script>

<style scoped>

</style>
