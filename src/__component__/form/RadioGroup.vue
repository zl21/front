<template>
  <div ref="radio-container">
    <CheckboxGroup
      v-model="selectedValues"
      @on-change="handleChange"
    >
      <Checkbox
        v-for="item in options.combobox"
        :key="item.limitdesc"
        :circle="options.circle !== false"
        :label="item.limitdesc"
        :disabled="options.disabled"
        :size="options.size"
      />
    </CheckboxGroup>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'RadioGroup',

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
        default: () => {}
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
        if(newVal === false) {
          this.selectedValues = [];
        }
      },
      // 子表组件被隐藏时，需要清空CheckboxGroup组件的值
      'options.showCol'(newVal) {
        if(newVal === false) {
          this.selectedValues = [];
        }
      },
      value(newVal) {
        if(newVal) {
          this.selectedValues = this.getSelectedValues(newVal);
        }
      }
    },

    methods: {
      handleChange(values) {
        const checkedList = [];
        if (values.length === 0) {
          this.$emit('change', '');
          return;
        }

        if (this.options.mutiple) {
          // 多选
          // * 元数据暂时不支持通过配置，控制是多选还是单选，这里只是提前写好逻辑
          this.options.combobox.forEach((item) => {
            if (values.includes(item.limitdesc)) {
              checkedList.push(item.limitval);
            }
          });
        } else {
          // 单选，取最后一个值作为勾选值
          const currentLabel = values[values.length - 1];
          this.options.combobox.forEach((item) => {
            if (currentLabel === item.limitdesc) {
              checkedList.push(item.limitval);
            }
          });

          this.selectedValues = [currentLabel];
        }

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

    mounted() {
      const defaultData = this.options.defval || this.options.valuedata;
      if (defaultData) {
        this.selectedValues = this.getSelectedValues(defaultData);
      }
    }
  };
</script>
