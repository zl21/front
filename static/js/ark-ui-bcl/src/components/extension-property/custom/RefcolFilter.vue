<template>
  <div>
    <Description
      v-if="showDescription"
      :option="option"
      @removeOption="removeOption"
    />

    <div class="form-group">
      <ExtentionRowItem
        is-required
        row-label="根据多个字段过滤[refcolval_custom]"
        :error-tip="validateTip"
      >
        <div class="col">
          <Input
            v-model="formData.srccols"
            placeholder="请输入来源字段"
            @on-blur="validateInput"
          />
        </div>
        <div class="col">
          <Input
            v-model="formData.url"
            placeholder="请输入接口地址,例如/p/cs"
            @on-blur="validateInput"
          />
        </div>
      </ExtentionRowItem>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Description from '../description';
  import ExtentionRowItem from '../extension-row-item';
  import deepClone from '../../../utils/deepClone';
  import { isEmptyObject } from '../../../utils/object';


  export default {
    name: 'RefcolFilter',

    components: {
      Description,
      ExtentionRowItem
    },

    data() {
      return {
        formData: {
          srccols: '',
          url: ''
        },
        validateTip: ''
      };
    },

    props: {
      option: {
        type: Object,
        default: () => ({})
      },
      defaultData: {
        type: Object,
        default: () => ({})
      },
      showDescription: {
        type: Boolean,
        default: true
      },
    },

    watch: {
      formData: {
        handler(newValue) {
          const newFormData = this.filterForm(newValue);
          if (Object.keys(newFormData).length === 0) {
            this.$emit('dataChange', { key: this.option.key, value: '' });
          } else {
            this.$emit('dataChange', { key: this.option.key, value: newFormData });
          }
        },
        deep: true
      },

      // // 清除配置
      // defaultData: {
      //   handler(newData) {
      //     if (isEmptyObject(newData)) {
      //       Object.assign(this.$data, this.$options.data.call(this));
      //     }
      //   },
      //   deep: true
      // }
    },

    methods: {
      // 清除整个配置数据
      removeOption(keyArray) {
        Object.assign(this.$data, this.$options.data.call(this));
        this.$emit('removeOption', keyArray || []);
      },

      // 过滤表单
      filterForm(data) {
        let formData = deepClone(data);
        if (formData.srccols === '' || formData.url === '') {
          formData = {};
        }

        return formData;
      },

      // 校验
      validateInput() {
        const formData = deepClone(this.formData);

        if (formData.srccols === '' || formData.url === '') {
          this.validateTip = '请确认来源字段和接口地址是否填写';
        } else {
          this.validateTip = '';
        }
      }
    },

    created() {
      const defaultData = deepClone(this.defaultData);
      if (Object.keys(defaultData).length > 0) {
        this.formData = defaultData;
      }
    }
  };
</script>

<style lang="scss" scoped>
.form-group {
  border: 1px solid #d8d8d8;
  border-radius: 4px;
  padding: 10px 20px;
  margin: 20px 5px;
}
</style>
