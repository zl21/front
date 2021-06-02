<template>
  <div :class="classes">
    <Description
      :option="option"
      @removeOption="removeOption"
    />

    <div class="cell">
      <EnumerateRadioItem
        :option="option"
        :break-line="false"
        :default-data="value"
        @radioValueChange="radioValueChange"
      />
    </div>
    <div
      v-if="value"
      class="cell"
    >
      <LabelWithSelect
        :item="{
          key: 'is_all',
          name: '加密方式',
          selectOptions:[
            {
              text: '全隐藏',
              value: true
            },
            {
              text: '自定义隐藏',
              value: false
            }
          ]
        }"
        :default-data="selectValue"
        @selectValueChange="selectValueChange"
      />
    </div>
    <div
      v-if="value && !selectValue"
      class="cell"
    >
      <LabelWithInput
        :default-data="password_prefix_digit"
        :item="{
          key: 'password_prefix_digit',
          name: '前置隐藏位数',
          type: 'input'
        }"
        @inputValueChange="inputValueChange"
      />
    </div>
    <div
      v-if="value && !selectValue"
      class="cell"
    >
      <LabelWithInput
        :default-data="password_suffix_digit"
        :item="{
          key: 'password_suffix_digit',
          name: '后置隐藏位数',
          type: 'input'
        }"
        @inputValueChange="inputValueChange"
      />
    </div>
  </div>
</template>

<script>
  import Description from './Description.vue';
  import LabelWithSelect from './LabelWithSelect.vue';
  import EnumerateRadioItem from './EnumerateRadioItem.vue';
  import LabelWithInput from './LabelWithInput.vue';
  import { classFix } from '../../constants/global';

  export default {
    components: {
      Description,
      LabelWithSelect,
      EnumerateRadioItem,
      LabelWithInput
    },
    props: {
      option: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return {
        value: false, // 是否加密
        selectValue: true, // 加密方式
        password_prefix_digit: null,
        password_suffix_digit: null
      };
    },
    methods: {
      removeOption(keyArray) { // 清楚整个配置数据
        this.value = false;
        this.selectValue = 0;
        this.$emit('removeOption', keyArray || []);
        this.$emit('dataChange', { key: 'password_type', value: undefined });
      },
      selectValueChange({ value }) { // 修改加密方式
        this.selectValue = JSON.parse(value);
        this.$emit('dataChange', {
          key: 'password_type',
          value: {
            is_all: this.selectValue
          }
        });
      },
      radioValueChange({ key, value }) {
        if (!value) {
          value = undefined;
          this.selectValue = false;
        } else {
          this.selectValue = true;
        }
        this.value = value;

        this.$emit('dataChange', { key, value });
        if (value) {
          this.$emit('dataChange', {
            key: 'password_type',
            value: {
              is_all: this.selectValue
            }
          });
        } else {
          this.$emit('dataChange', {
            key: 'password_type',
            value: undefined
          });
        }
      },
      inputValueChange({ key, value }) {
        const obj = this.$parent.rootData ? this.$parent.rootData.password_type : {};
        obj[key] = value;
        this.$emit('dataChange', {
          key: 'password_type',
          value: obj
        });
      }
    },
    computed: {
      classes: () => `${classFix}PassWord`
    },
    created() {
      const root = this.$parent.rootData;

      if (root.ispassword) {
        this.value = root.ispassword;
      }

      if (root.password_type) {
        this.selectValue = root.password_type.is_all;
        this.password_prefix_digit = root.password_type.password_prefix_digit;
        this.password_suffix_digit = root.password_type.password_suffix_digit;
      }
    }
  };
</script>
