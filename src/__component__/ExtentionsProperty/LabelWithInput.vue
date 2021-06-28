<template>
  <div class="input-group-item">
    <div class="cell">
      <LabelForInput :item="item" />
      <input
        ref="input"
        class="input"
        :placeholder="`请输入[${item.name}]${item.outputValueType === 'Array' ? '，以英文逗号(,)间隔' : ''}`"
        :type="item.inputType === 'Number' ? 'number' : 'text'"
        @input="inputChange"
        @blur="inputBlur"
      >
    </div>
    <div
      v-if="logInfo !== ''"
      class="logInfo"
    >
      {{ logInfo }}
    </div>
  </div>
</template>

<script>
  import LabelForInput from './LabelForInput';

  export default {
    name: 'LabelWithInput',
    components: {
      LabelForInput
    },
    methods: {
      inputBlur(e) {
        let value = '';
        if (this.item.outputValueType === 'Array' && e.target.value !== '') {
          value = e.target.value.split(',');
        } else if (this.item.outputValueType === 'JSON' && e.target.value !== '') {
          try {
            value = JSON.parse(e.target.value);
            this.logInfo = '';
          } catch (exception) {
            this.logInfo = `JSON格式错误：${exception}`;
            return;
          }
        } else if (this.item.inputType === 'Number') {
          value = parseInt(e.target.value, 10);
        } else {
          value = e.target.value;
        }
        this.$emit('inputBlur', {
          key: this.item.key,
          value
        });
      },
      inputChange(e) {
        let value = '';
        if (this.item.outputValueType === 'Array' && e.target.value !== '') {
          value = e.target.value.split(',');
        } else if (this.item.outputValueType === 'JSON' && e.target.value !== '') {
          try {
            value = JSON.parse(e.target.value);
            this.logInfo = '';
          } catch (exception) {
            this.logInfo = `JSON格式错误：${exception}`;
            return;
          }
        } else if (this.item.inputType === 'Number') {
          value = parseInt(e.target.value, 10);
        } else {
          value = e.target.value;
        }
        this.$emit('inputValueChange', {
          key: this.item.key,
          value
        });
      }
    },
    data() {
      return {
        logInfo: ''
      };
    },
    props: {
      item: {
        type: Object,
        default: () => ({})
      },
      defaultData: {
        type: [String, Number, Array, Object],
        default: ''
      }
    },
    mounted() {
      if (this.item.outputValueType === 'JSON' && this.defaultData !== '') {
        this.$refs.input.value = JSON.stringify(this.defaultData);
      } else {
        this.$refs.input.value = this.defaultData;
      }
    }
  };
</script>
