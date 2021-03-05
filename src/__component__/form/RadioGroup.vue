<template>
  <div>
    <CheckboxGroup
      v-model="value"
      @on-change="handleChange"
    >
      <Checkbox
        v-for="item in options.combobox"
        :key="item.limitdesc"
        :circle="options.circle"
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
      props: 'selectedValues',
      event: 'change'
    },

    props: {
      selectedValues: {
        type: Array,
        default: () => []
      },
      options: {
        type: Object,
        default: () => {}
      }
    },

    data() {
      return {
        value: []
      };
    },

    methods: {
      handleChange(values) {
        const checkedList = [];
        if (values.length === 0) {
          this.$emit('change', []);
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
          
          this.value = [currentLabel];
        }
        
        console.log('提交值', checkedList.join(','));
        this.$emit('change', checkedList.join(','));
      }
    },

    mounted() {
      if (this.options.webconf && this.options.webconf.setAttributes && this.options.webconf.setAttributes.props) {
        this.options.disabled = this.options.webconf.setAttributes.props.disabled;
      }
      const checkedList = [];
      if (this.options.valuedata) {
        const selectedArr = this.options.valuedata.split(',');
        this.options.combobox.forEach((item) => {
          if (selectedArr.includes(item.limitval)) {
            checkedList.push(item.limitdesc);
          }
        });
        this.value = checkedList;
      }
    }
  };
</script>

<style lang="scss" scoped>
  
</style>
