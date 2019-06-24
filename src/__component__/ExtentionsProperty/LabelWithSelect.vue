<template>
  <div class="input-group-item">
    <div class="cell">
      <LabelForInput :item="item" />
      <select
        class="select"
        ref="select"
        @change="selectValueChange"
      >
        <option
          v-for="(o, i) in item.selectOptions"
          :key="i"
          :value="o.value"
        >
          {{ o.text }}
        </option>
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
    methods: {
      selectValueChange(e) {
        this.$emit('selectValueChange', { key: this.item.key, value: e.target.value });
      }
    },
    props: {
      item: {
        type: Object,
        default: () => ({})
      },
      defaultData: {
        type: String,
        default: ''
      }
    },
    mounted() {
      this.$refs.select.value = this.defaultData;
    }
  };
</script>

<style scoped>

</style>
