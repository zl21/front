<template>
  <div>
    <Description
      v-if="showDescription"
      :option="option"
      @removeOption="removeOption"
    />

    <div
      v-for="(row, index) in formData"
      :key="index"
      class="form-group"
    >
      <ExtentionRowItem
        :row-index="index"
        :row-count="formData.length"
        :row-label="`条件${index+1}`"
        show-operation-button
        row-label-class="rowLabel"
        is-required
        :error-tip="validateTips[index]"
        @addRow="addRow"
        @removeRow="removeRow(index)"
      >
        <div class="col">
          <div class="row ">
            <div class="col">
              <span class="label">已知条件字段是否在主表上：</span>
              <R3Radio
                :options="row.radioConfig"
                @change="getRadioValue($event, index)"
              />
            </div>
          </div>

          <div class="row">
            <div class="col">
              <Input
                v-model="row.srccol"
                placeholder="已知条件字段"
                @on-blur="validateForm"
              />
            </div>
          </div>

          <div class="row">
            <div class="col">
              <Input
                v-model="row.fixcolumn"
                placeholder="外键关联表中需要筛选的字段"
                @on-blur="validateForm"
              />
            </div>
          </div>
        </div>
      </ExtentionRowItem>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Description from '../description';
import deepClone from '../../../utils/deepClone';
import R3Radio from '../../radio';
import ExtentionRowItem from '../extension-row-item';
import { isEmptyArray } from '../../../utils/array';

const RADIO_CONFIG = {
  defaultValue: '否',
  label: '来源字段是否在主表上',
  selectOptions: [
    {
      value: true,
      label: '是'
    },
    {
      value: false,
      label: '否'
    },
  ]
}

const ITEM_CONSTRUCTOR = {
  srccol: '',
  fixcolumn: '',
  maintable: false,
  radioConfig: deepClone(RADIO_CONFIG)
};

export default {
  name: 'RefcolSearch',

  components: {
    Description,
    ExtentionRowItem,
    R3Radio
  },

  props: {
    option: {
      type: Object,
      default: () => ({})
    },
    defaultData: {
      type: Array,
      default: () => []
    },
    showDescription: {
      type: Boolean,
      default: true
    },
  },

  data() {
    return {
      formData: [deepClone(ITEM_CONSTRUCTOR)],
      defaultFields: {}, // 用类数组存默认值
      dropList: {},
      searchList: [],
      totalCount: 0,
      pageSize: 10,
      columnsKey: ['DBNAME'],
      hidecolumns: ['ID'], // 隐藏输入时下拉搜索结果列
      radioValidateTip: '',
      fieldValidateTip: [],
      validateTips: []
    };
  },

  watch: {
    formData: {
      handler(newValue) {
        const newFormData = this.filterForm(newValue);
        if (newFormData.length === 0) {
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
    //     if (isEmptyArray(newData)) {
    //       Object.assign(this.$data, this.$options.data.call(this));
    //     }
    //   },
    //   deep: true
    // }
  },

  methods: {
    // 过滤表单
    filterForm(data) {
      const formData = deepClone(data);
      if (formData.length === 0) {
        return [];
      }
      const invalidDataIndex = []
      formData.forEach((item, index) => {
        delete item.radioConfig
        if (item.srccol === '' || item.fixcolumn === '') {
          invalidDataIndex.push(index)
        }
      });

      // 从后往前删除无效数据
      for(let i = invalidDataIndex.length - 1; i > -1; i--) {
        formData.splice(invalidDataIndex[i], 1)
      }

      return formData;
    },

    // 校验
    validateForm() {
      const result = [];

      this.formData.forEach((item) => {
        if (item.srccol === '' || item.fixcolumn === '') {
          result.push('请确认是否填写条件字段和筛选字段');
        } else {
          result.push('');
        }
      });

      this.validateTips = result;
    },

    // 清除整个配置数据
    removeOption(keyArray) {
      Object.assign(this.$data, this.$options.data.call(this));
      this.$emit('removeOption', keyArray || []);
    },

    // 添加行
    addRow() {
      this.formData.push(deepClone(ITEM_CONSTRUCTOR));
    },

    // 删除行
    removeRow(rowIndex) {
      this.formData.splice(rowIndex, 1);
    },

    // 获取单选框字段的值
    getRadioValue(e, rowIndex) {
      this.formData[rowIndex].maintable = e.value;
    },

    init() {
      const defaultData = deepClone(this.defaultData);

      if (Object.keys(defaultData).length > 0) {
        defaultData.forEach((item) => {
          item.radioConfig = deepClone(RADIO_CONFIG)
          item.radioConfig.defaultValue =  item.maintable ? '是' : '否'
          // 兼容老数据缺失maintable字段
          if(item.maintable === undefined) {
            item.maintable = false
          }
        })
        this.formData = defaultData;
      }
    }
  },

  created() {
    this.init();
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

<style lang="scss">
.form-group {
  .rowLabel {
    flex: 60px 0 0;
  }
}
</style>
