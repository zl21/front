<template>
  <div>
    <Description
      v-if="showDescription"
      :option="option"
      @removeOption="removeOption"
    />

    <div class="form-group">
      <ExtentionRowItem
        row-label="目标字段是否不可编辑"
      >
        <div class="col">
          <R3Radio
            :options="disabledConfig"
            @change="getRadioValue($event, disabledConfig.key)"
          />
        </div>
      </ExtentionRowItem>

      <ExtentionRowItem
        row-label="目标字段是否必填"
        :error-tip="radioValidateTip"
      >
        <div class="col">
          <R3Radio
            :options="requiredConfig"
            @change="getRadioValue($event, requiredConfig.key)"
          />
        </div>
      </ExtentionRowItem>

      <ExtentionRowItem
        v-for="(keyInfo, index) in formData.field"
        :key="index"
        :row-index="index"
        :row-count="formData.field.length"
        row-label="来源字段"
        show-operation-button
        is-required
        :error-tip="fieldValidateTip[index]"
        @addRow="addRow"
        @removeRow="removeRow(index)"
      >
        <div class="col">
          <DropDownSelectFilter
            single
            :data="dropList"
            :auto-data="searchList"
            :page-size="pageSize"
            :total-row-count="totalCount"
            :columns-key="columnsKey"
            :hidecolumns="hidecolumns"
            :default-selected="defaultFields[keyInfo.refcolumn]"
            placeholder="请选择字段"
            @on-popper-show="getSearchData"
            @on-page-change="getSearchData"
            @on-input-value-change="inputSearchData"
            @on-fkrp-selected="selectTable($event, index)"
            @on-clear="clearTableName(index)"
          />
        </div>
        <div class="col">
          <Input
            v-model="formData.field[index].refval"
            placeholder="请输入字段值"
            @on-blur="validateField"
          />
        </div>
      </ExtentionRowItem>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import R3Radio from '../../radio';
  import Description from '../description';
  import ExtentionRowItem from '../extension-row-item';
  import deepClone from '../../../utils/deepClone';
  import { debounce } from '../../../utils/common';
  import { getValueOfItem } from '../../../utils/array';
  import { urlSearchParams } from '../../../utils/http';

  const FIELD_CONSTRUCTOR = {
    refcolumn: '',
    refval: ''
  };

  export default {
    name: 'StaticRules',

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
      keyForm: {
        type: Object,
        default: () => ({})
      },
    },

    components: {
      Description,
      R3Radio,
      ExtentionRowItem
    },

    inject: ['network'],

    data() {
      return {
        formData: {
          field: [deepClone(FIELD_CONSTRUCTOR)],
          props: { disabled: undefined, required: undefined }
        },
        disabledConfig: {
          key: 'disabled',
          defaultValue: '清除此配置项',
          selectOptions: [
            {
              value: true,
              label: '是'
            },
            {
              value: false,
              label: '否'
            },
            {
              value: undefined,
              label: '清除此配置项'
            },
          ]
        },
        requiredConfig: {
          defaultValue: '清除此配置项',
          key: 'required',
          selectOptions: [
            {
              value: true,
              label: '是'
            },
            {
              value: false,
              label: '否'
            },
            {
              value: undefined,
              label: '清除此配置项'
            },
          ]
        },
        defaultFields: {}, // 用类数组存默认值
        dropList: {},
        searchList: [],
        totalCount: 0,
        pageSize: 10,
        columnsKey: ['DBNAME'],
        hidecolumns: ['ID'], // 隐藏输入时下拉搜索结果列
        radioValidateTip: '',
        fieldValidateTip: []
      };
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
    },

    methods: {
      // 过滤表单
      filterForm(data) {
        const formData = deepClone(data);
        if (Object.keys(formData.props).length === 0) {
          delete formData.props;
        }
        // 字段是否必填和是否不可编辑至少开启其中一个。否则视为无效配置
        const isValidProp = formData.props && ((formData.props.required !== undefined) || (formData.props.disabled !==undefined))
        if (isValidProp) {
          for (let i = formData.field.length - 1; i >= 0; i--) {
            const condition = formData.field[i];
            if (condition.refcolumn === '') {
              formData.field.splice(i, 1);
            }
          }
          // field没值也是无效的
          if (Object.keys(formData.field).length === 0) {
            return {};
          }
          return formData;
        } 
        return {};
      },

      // 添加行
      addRow() {
        this.formData.field.push(deepClone(FIELD_CONSTRUCTOR));
      },

      // 删除行
      removeRow(rowIndex) {
        this.formData.field.splice(rowIndex, 1);
      },

      // 清除整个配置数据
      removeOption(keyArray) {
        Object.assign(this.$data, this.$options.data.call(this));
        this.$emit('removeOption', keyArray || []);
      },

      // 获取单选框字段的值
      getRadioValue(value, key) {
        this.formChange({
          key,
          value
        });
        this.validateRadio();
      },

      // 校验单选框
      // 规则: 必填和不可编辑 至少选择一个
      validateRadio() {
        if (this.formData.props.required === undefined && this.formData.props.disabled === undefined) {
          this.radioValidateTip = '字段是否必填和是否不可编辑至少开启其中一个';
        } else {
          this.radioValidateTip = '';
        }
      },

      // 校验字段
      validateField() {
        const formData = deepClone(this.formData);
        if (formData.length === 0) {
          this.fieldValidateTip = [];
          return;
        }
        this.fieldValidateTip = [];
        formData.field.forEach((condition) => {
          if (condition.refcolumn === '') {
            this.fieldValidateTip.push('请确认字段是否填写');
          } else {
            this.fieldValidateTip.push('');
          }
        });
      },

      // 表单变化
      formChange(formValue) {
        const oldForm = deepClone(this.formData);
        const fieldKey = formValue.key;
        switch (fieldKey) {
        case 'disabled':
        case 'required':
          oldForm.props[fieldKey] = formValue.value.value;
          break;
        default:
          break;
        }
        this.formData = oldForm;
      },

      // 选择模糊查询的数据
      selectTable(data, rowIndex) {
        this.formData.field[rowIndex].refcolumn = data[0].Label;
        this.validateField();
      },

      // 清除选择的表名
      clearTableName(rowIndex) {
        this.formData.field[rowIndex].refcolumn = '';
        this.validateField();
      },

      // 查询字段
      async getSearchData(page) {
        let startindex = 0;
        if (typeof page === 'number') {
          startindex = (page - 1) * this.pageSize;
        }

        const searchdata = {
          table: 'AD_COLUMN',
          startindex,
          range: 10,
          fixedcolumns: {
            ISACTIVE: ['=Y'],
            AD_TABLE_ID: [this._table_id_],
          },
          column_include_uicontroller: true,
          isolr: false
        };
        if (!this._table_id_) {
          delete searchdata.fixedcolumns.AD_TABLE_ID;
        }

        this.dropList = await this.getKeyList(searchdata);
        this.totalCount = this.dropList.totalRowCount;
      },

      // 输入表名时进行模糊查询
      inputSearchData: debounce(function (value) {
        if (value === '') {
          this.searchList = [];
          return;
        }

        const searchdata = {
          table: 'AD_COLUMN',
          startindex: 0,
          range: 10,
          fixedcolumns: {
            ISACTIVE: ['=Y'],
            DBNAME: value,
            AD_TABLE_ID: [this._table_id_],
          },
          column_include_uicontroller: true,
          isolr: false
        };
        if (!this._table_id_) {
          delete searchdata.fixedcolumns.AD_TABLE_ID;
        }

        this.getKeyList(searchdata).then((data) => {
          const result = data.row || [];

          // 格式化好了，将字段值转大写与输入值对比，进行手动过滤
          this.searchList = result.map((keyObj) => {
            Object.keys(keyObj).forEach((key) => {
              keyObj[key] = keyObj[key].val;
            });
            return keyObj;
          });

          this.totalCount = this.dropList.totalRowCount;
        });
      }),

      commonApi(api, searchdata, options) {
        const { hideColumns, displayKeys } = options;
        return new Promise((resolve) => {
          this.network
            .post(api, urlSearchParams(searchdata))
            .then((res) => {
              if (res.data.code === 0) {
                const tabth = res.data.data.tabth;
                const row = res.data.data.row;

                for (let i = Math.max(tabth.length - 1, 0); i >= 0; i--) {
                  const item = tabth[i];
                  // 让输入框显示 表名称 字段
                  if (displayKeys.includes(item.name)) {
                    item.isak = true;
                  } else {
                    item.isak = false;
                  }

                  // 隐藏table列
                  if (hideColumns.includes(item.colname)) {
                    tabth.splice(i, 1);
                  }
                }

                if (hideColumns.length > 0) {
                  row.forEach((item) => {
                    for (const key in item) {
                      // 隐藏模糊结果列
                      if (hideColumns.includes(key)) {
                        delete item[key];
                      }
                    }
                  });
                }

                resolve(res.data.data);
              } else {
                resolve({});
              }
            }).catch(() => {
              resolve({});
            });
        });
      },

      async getKeyList(searchdata) {
        return new Promise((resolve) => {
          const hideColumns = ['ORDERNO', 'MASK', 'AD_TABLE_ID', 'AD_VERSION_ID', 'ISORDER', 'ISACTIVE', 'ISAGFILTER', 'AGFILTER', 'ISINDEXED', 'NAME', 'OBTAINMANNER', 'REF_COLUMN_ID', 'FKDISPLAY', 'SEARCHMODEL', 'ISREMOTE', 'AD_LIMITVALUE_GROUP_ID', 'DISPLAYTYPE', 'COMMENTSTP', 'MODIFIERID', 'MODIFIEDDATE'];
          const api = '/p/cs/QueryList';
          const result = this.commonApi(api, { searchdata }, {
            hideColumns,
            displayKeys: ['表内名称'],
          });
          resolve(result);
        });
      },

      // 回填字段值
      async getFieldDefaultValue() {
        const defaultData = this.defaultData.field || [];
        const conditionCount = defaultData.length;
        if (conditionCount === 0) {
          return;
        }

        const dbNames = defaultData.map(item => item.refcolumn).join(',');

        const searchdata = {
          table: 'AD_COLUMN',
          startindex: 0,
          range: 20,
          fixedcolumns: {
            ISACTIVE: ['=Y'],
            DBNAME: dbNames,
            AD_TABLE_ID: [this._table_id_],
          },
          column_include_uicontroller: true,
          isolr: false
        };
        if (!this._table_id_) {
          delete searchdata.fixedcolumns.AD_TABLE_ID;
        }

        const result = (await this.getKeyList(searchdata)).row || [];

        defaultData.forEach((row) => {
          const item = result.find(field => field.DBNAME.val === row.refcolumn);
          this.$set(this.defaultFields, row.refcolumn, [{
            ID: item.ID.val,
            Label: item.DBNAME.val
          }]);
        });
      },

      // 初始化数据
      init() {
        const defaultData = deepClone(this.defaultData);
        if (defaultData.props) {
          this.disabledConfig.defaultValue = getValueOfItem('label', this.disabledConfig.selectOptions, item => item.value === defaultData.props.disabled);
          this.requiredConfig.defaultValue = getValueOfItem('label', this.requiredConfig.selectOptions, item => item.value === defaultData.props.required);
        }

        if (Object.keys(defaultData).length > 0) {
          if (!defaultData.field) {
            this.formData = Object.assign({
              field: [deepClone(FIELD_CONSTRUCTOR)]
            }, defaultData);
          } else {
            this.formData = defaultData;
          }
        }
      }
    },

    async created() {
      this._table_id_ = this.keyForm.AD_TABLE_ID;

      this.init();
      this.getFieldDefaultValue();
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
