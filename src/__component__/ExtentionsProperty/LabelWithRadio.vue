<template>
  <div class="input-group-item">
    <div class="cell">
      <LabelForInput :item="item" />
      <EnumerateRadioItem
        :option="item"
        :break-line="false"
        @radioValueChange="radioValueChange"
      />
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
    methods: {
      radioValueChange({ key, value }) {
        this.$emit('radioValueChange', { key, value });
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
