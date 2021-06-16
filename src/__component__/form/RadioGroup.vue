<template>
  <div ref="radio-container">
    <RadioGroup
      v-model="selectedValues"
      @on-change="handleChange"
    >
      <Radio
        v-for="item in options.combobox"
        :key="item.limitdesc"
        :label="item.limitdesc"
        :disabled="options.disabled"
        :size="options.size"
      ></Radio>
    </RadioGroup>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'R3RadioGroup',

  model: {
    props: 'value',
    event: 'change'
  },

  props: {
    // 双向绑定值
    value: {
      type: [String, Array],
    },
    // 外部传入的所有参数
    options: {
      type: Object,
      default: () => ({})
    },
  },

  data() {
    return {
      selectedValues: '',
    };
  },

  watch: {
    // 主表组件被隐藏时，需要清空CheckboxGroup组件的值
    'options.show'(newVal) {
      if (newVal === false) {
        this.selectedValues = '';
      }
    },
    // 子表组件被隐藏时，需要清空CheckboxGroup组件的值
    'options.showCol'(newVal) {
      if (newVal === false) {
        this.selectedValues = '';
      }
    },
    value(newVal) {
      if (newVal) {
        const option = this.options.combobox.find(option => option.limitval === newVal)
        this.selectedValues = option.limitdesc
      }
    }
  },

  methods: {
    handleChange(value) {
      const option = this.options.combobox.find(option => option.limitdesc === value)
      this.$emit('change', option.limitval)
    },
  },

  mounted() {
    const defaultData = this.options.defval || this.options.valuedata;
    this.selectedValues = defaultData
  }
};
</script>

<style lang="scss" scoped>
</style>
