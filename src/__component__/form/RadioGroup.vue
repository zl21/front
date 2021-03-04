<template>
  <div>
    <CheckboxGroup
      v-model="value"
      @on-change="handleChange"
    >
      <Checkbox
        v-for="option in options.combobox"
        :key="option.limitdesc"
        :circle="options.circle"
        :label="option.limitdesc"
        :disabled="option.disabled"
        :size="option.size"
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
        
        
        this.$emit('change', JSON.stringify(checkedList));
      }
    },

    mounted() {
      if (this.options.value) {
        const checkedList = [];
        this.options.combobox.forEach((item) => {
          if (this.options.value.includes(item.limitval)) {
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
