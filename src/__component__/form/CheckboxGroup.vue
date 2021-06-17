<template>
  <div ref="radio-container">
    <CheckboxGroup
      v-model="selectedValues"
      @on-change="handleChange"
    >
      <Checkbox
        v-for="item in options.combobox"
        :key="item.limitdesc"
        :label="item.limitdesc"
        :disabled="options.disabled"
        :size="options.size"
      />
    </CheckboxGroup>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'R3CheckboxGroup',

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
      default: () => { }
    },
  },

  data() {
    return {
      selectedValues: []
    };
  },

  watch: {
    // 主表组件被隐藏时，需要清空CheckboxGroup组件的值
    'options.show'(newVal) {
      if (newVal === false) {
        this.selectedValues = [];
      }
    },
    // 子表组件被隐藏时，需要清空CheckboxGroup组件的值
    'options.showCol'(newVal) {
      if (newVal === false) {
        this.selectedValues = [];
      }
    },
    value: {
      handler(newVal) {
        if (newVal) {
          this.selectedValues = this.getSelectedValues(newVal);
        }
      },
      immediate: true
    }
  },

  methods: {
    handleChange(values) {
      const checkedList = [];
      if (values.length === 0) {
        this.$emit('change', '');
        return;
      }

      this.options.combobox.forEach((item) => {
        if (values.includes(item.limitdesc)) {
          checkedList.push(item.limitval);
        }
      });

      this.$emit('change', checkedList.join(','));
    },

    // 获取勾选的值
    getSelectedValues(value) {
      const checkedList = [];
      const selectedArr = value.split(',');
      this.options.combobox.forEach((item) => {
        if (selectedArr.includes(item.limitval)) {
          checkedList.push(item.limitdesc);
        }
      });
      return checkedList
    }
  },
};
</script>

<style lang="scss" scoped>
</style>