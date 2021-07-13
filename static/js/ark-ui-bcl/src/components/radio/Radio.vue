<template>
  <RadioGroup
    v-model="formData.defaultValue"
    @on-change="radioChange"
    v-on="$listeners"
    v-bind="$attrs"
  >
    <Radio
      v-for="item in formData.selectOptions"
      :key="item.label"
      :label="item.label"
    />
  </RadioGroup>
</template>

<script type="text/ecmascript-6">
  import deepClone from "../../utils/deepClone";

  export default {
    name: 'ak-radio',

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
      radioChange(value) {
        const realValue = this.options.selectOptions.find(item => item.label === value);
        this.$emit('change', realValue);
      }
    }
  };
</script>
