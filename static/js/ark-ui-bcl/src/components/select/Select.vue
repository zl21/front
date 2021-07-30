<template>
  <Select
    v-model="formData.defaultValue"
    :placeholder="formData.placeholder"
    clearable
    v-on="$listeners"
    v-bind="$attrs"
  >
    <Option
      v-for="item in formData.selectOptions"
      :key="item.value"
      :value="item.value"
    >
      {{ item.label }}
    </Option>
  </Select>
</template>

<script type="text/ecmascript-6">
  import deepClone from "../../utils/deepClone";

  export default {
    name: 'ak-select',

    inheritAttrs: false,

    props: {
      options: {
        type: Object,
        default: () => ({})
      }
    },

    watch: {
      options: {
        handler(newVal) {
          this.formData = deepClone(newVal);
        },
        deep: true,
        immediate: true
      }
    },

    data() {
      return {
        formData: {}
      };
    },

    methods: {
    }
  };
</script>

<style lang="scss" scoped>
  
</style>
