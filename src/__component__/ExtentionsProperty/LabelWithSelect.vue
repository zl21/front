<template>
  <div class="input-group-item">
    <div class="cell">
      <LabelForInput :item="item"></LabelForInput>
      <select class="select">
        <option v-for="(o, i) in item.selectOptions" :value="o.value" :key="i">{{ o.text }}</option>
      </select>
    </div>
  </div>
</template>

<script>
  import LabelForInput from './LabelForInput';
  
  export default {
    name: 'LabelWithSelect',
    components: {
      LabelForInput
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
