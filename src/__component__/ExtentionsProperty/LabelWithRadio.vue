<template>
  <div class="input-group-item">
    <div class="cell">
      <LabelForInput :for="`${item.name}-${index}`" :item="item"></LabelForInput>
      <EnumerateRadioItem :option="item" :break-line="false"></EnumerateRadioItem>
    </div>
  </div>
</template>

<script>
  import LabelForInput from './LabelForInput';
  import EnumerateRadioItem from './EnumerateRadioItem';
  
  export default {
    name: 'LabelWithRadio',
    components: {
      LabelForInput,
      EnumerateRadioItem
    },
    props: {
      item: {
        type: Object,
        default: () => ({})
      },
      index: {
        type: [String, Number],
        default: 0
      }
    }
  };
</script>

<style scoped>

</style>
