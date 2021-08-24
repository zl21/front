<template>
  <div>
    <Description
      :option="option"
      @removeOption="removeOption"
    />

    <div
      v-if="!showConfig"
      class="tw-mt-20 form-group"
    >
      <div
        v-for="(condition, index) in formData"
        :key="index"
        class="tw-mt-10"
      >
        <div class="row">
          <div class="col row-title required-remark">
            {{$t('extensionProperty.condition')}}{{ index + 1 }}：
          </div>
          <div class="col ">
            <Select
              v-model="condition.operator"
              :placeholder="$t('extensionProperty.selectQueryConditions')"
              clearable
              @on-change="validateForm"
            >
              <Option
                v-for="item in operateOptions"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </Option>
            </Select>
          </div>
          <div class="col">
            <Input
              v-model="condition.key_value"
              class=""
              @on-blur="validateForm"
            />
          </div>
          <div class="col">
            <DropDownSelectFilter
              single
              :default-selected="dropDefaultList[condition.table_id]"
              :data="dropList"
              :auto-data="searchList"
              :page-size="pageSize"
              :total-row-count="totalCount"
              :columns-key="columnsKey"
              :hidecolumns="hidecolumns"
              :placeholder="$t('extensionProperty.selectTable')"
              @on-popper-show="getSearchData"
              @on-page-change="getSearchData"
              @on-input-value-change="inputSearchData"
              @on-fkrp-selected="selectTable($event, index)"
              @on-clear="clearTableName(index)"
            />
          </div>
          <div class="col btn-group">
            <button
              v-if="formData.length - 1 === index"
              class="operate-button"
              @click="addRow"
            >
              <i class="iconfont">&#xec3f;</i>
            </button>
            <button
              v-if="formData.length > 1"
              class="operate-button"
              @click="removeRow(index)"
            >
              <i class="iconfont">&#xed15;</i>
            </button>
          </div>
        </div>
        <div
          v-if="errorList[index]"
          class="error-tip tw-mt-10"
        >
          {{ errorList[index] }}
        </div>
      </div>
    </div>
    <div
      v-else
      class="tw-mt-20"
    >
      {{$t('extensionProperty.onlySelectType')}}
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import i18n from '../../../utils/i18n'
import Description from '../description';
import deepClone from '../../../utils/deepClone';
import { debounce } from '../../../utils/common';
import { urlSearchParams } from '../../../utils/http';
import '../../../assets/tailwindcss/index.css'


const TABLE_NAME = 'AD_TABLE';

const ITEM_CONSTRUCTOR = {
  key_value: '',
  operator: '',
  table_id: '',
};

export default {
  name: 'TableQuery',

  props: {
    option: {
      type: Object,
      default: () => ({})
    },
    defaultData: {
      type: [Object, Array],
      default: () => ([])
    },
    keyForm: {
      type: Object,
      default: () => ({})
    },
  },

  components: {
    Description,
  },

  inject: ['network'],

  data() {
    return {
      formData: [
        deepClone(ITEM_CONSTRUCTOR)
      ],
      dropList: {},
      searchList: [],
      totalCount: 0,
      pageSize: 10,
      columnsKey: ['AD_REFBY_TABLE_ID'],
      hidecolumns: ['ID'], // 隐藏输入时下拉搜索结果列
      tableIdOfKey: '',
      displayTypeOfKey: '',
      typeOfKey: '',
      operateOptions: [],
      dropDefaultList: {}, // id作为key存储默认值。用数组会有其他bug
      errorList: []
    };
  },

  computed: {
    showConfig() {
      return this.tableIdOfKey && this.displayTypeOfKey.includes('select');
    }
  },

  watch: {
    formData: {
      handler() {
        this.submitData();
      },
      deep: true
    }
  },

  methods: {
    // 校验表单每个条件是否都填完了
    validateForm() {
      const formData = deepClone(this.formData);
      if (formData.length === 0) {
        this.errorList = [];
        return;
      }
      this.errorList = [];
      formData.forEach((condition, index) => {
        if (condition.key_value === '' || !condition.operator || !condition.table_id) {
          this.errorList.push(this.$t('extensionProperty.checkCondition', { row: index + 1 }));
        } else {
          this.errorList.push('');
        }
      });
    },

    // 清除整个配置数据
    removeOption(keyArray) {
      Object.assign(this.$data, this.$options.data.call(this));
      this.$emit('removeOption', keyArray || []);
    },

    // 添加条件
    addRow() {
      this.formData.push(deepClone(ITEM_CONSTRUCTOR));
    },

    // 删除条件
    removeRow(rowIndex) {
      this.formData.splice(rowIndex, 1);
    },

    // 清除选择的表名
    clearTableName(rowIndex) {
      this.formData[rowIndex].table_id = '';
      this.validateForm();
    },

    // 获取下拉选项
    getOperateOptions(type) {
      return [
        {
          value: '=',
          label: '='
        }];
    },

    // 查询子表
    async getSearchData(page) {
      let startindex = 0;
      if (typeof page === 'number') {
        startindex = (page - 1) * this.pageSize;
      }

      const searchdata = {
        table: 'AD_REFBYTABLE',
        objid: this._table_id_,
        refcolid: 99443,
        searchdata: {
          column_include_uicontroller: true,
          startindex,
          range: this.pageSize,
          fixedcolumns: {
            ISACTIVE: ['=Y'],
          },
        }
      };

      this.dropList = await this.getRelativeTable(searchdata, {
        targetKey: 'AD_REFBY_TABLE_ID.refobjid'
      });
      this.totalCount = this.dropList.totalRowCount;
    },

    // 输入表名时进行模糊查询
    inputSearchData: debounce(function (value) {
      if (value === '') {
        this.searchList = [];
        return;
      }
      const searchdata = {
        table: 'AD_REFBYTABLE',
        objid: this._table_id_,
        refcolid: 99443,
        searchdata: {
          column_include_uicontroller: true,
          startindex: 0,
          range: this.pageSize,
          fixedcolumns: {
            ISACTIVE: ['=Y'],
          },
        }
      };

      this.getRelativeTable(searchdata, {
        targetKey: 'AD_REFBY_TABLE_ID.refobjid'
      }).then((data) => {
        const result = data.row || [];

        // 格式化好了，将字段值转大写与输入值对比，进行手动过滤
        this.searchList = result.map((keyObj) => {
          Object.keys(keyObj).forEach((key) => {
            keyObj[key] = keyObj[key].val;
          });
          return keyObj;
        }).filter(item => item.AD_REFBY_TABLE_ID.toUpperCase().includes(value.toUpperCase()));

        this.totalCount = this.dropList.totalRowCount;
      });
    }),

    // 选择模糊查询的数据
    selectTable(data, rowIndex) {
      this.formData[rowIndex].table_id = data[0].ID;
      this.validateForm();
    },

    commonApi(api, searchdata, options) {
      const { hideColumns, displayKeys, bindId } = options;
      return new Promise((resolve) => {
        this.network
          .post(api, urlSearchParams(searchdata))
          .then((res) => {
            if (res.data.code === 0) {
              // 'NAME', 
              const tabth = res.data.data.tabth;
              const row = res.data.data.row;

              // 重新调整id的映射
              if (bindId) {
                row.forEach((item) => {
                  const [key1, key2] = bindId.targetKey.split('.');
                  item.ID.val = item[key1][key2];
                });
              }
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

    // api获取表数据
    async requestKeysData(searchdata) {
      return new Promise((resolve) => {
        const hideColumns = ['ORDERNO', 'MASK', 'AD_VERSION_ID', 'ISACTIVE', 'MODIFIERNAME', 'MODIFIEDDATE', 'REALTABLE_ID', 'AD_TABLECATEGORY_ID', 'AD_OBJUICONF_ID', 'FILTER', 'PROPS', 'ISDISPATCHABLE', 'PROC_SUBMIT', 'URL', 'CUSTOMIZENO', 'DISP_COLUMN_ID', 'ISTREE'];
        const api = '/p/cs/QueryList';
        const result = this.commonApi(api, searchdata, {
          hideColumns,
          displayKeys: ['名称'],
        });
        resolve(result);
      });
    },

    // 获取关联表数据
    async getRelativeTable(searchdata, bindId) {
      return new Promise((resolve) => {
        const hideColumns = ['ISACTIVE', 'ORDERNO', 'AD_REFBY_COLUMN_ID', 'FILTER', 'ASSOCTYPE', 'INLINEMODE', 'AD_VERSION_ID', 'MODIFIERNAME', 'MODIFIEDDATE'];
        const api = '/p/cs/objectTableItem';
        const result = this.commonApi(api, searchdata, {
          hideColumns,
          displayKeys: ['关联表', '描述'],
          bindId
        });
        resolve(result);
      });
    },

    // 初始化数据
    initData() {
      const { DISPLAYTYPE, AD_TABLE_ID, COLTYPE, AD_TABLE_ID_LABEL } = this.keyForm || {};
      this._table_id_ = AD_TABLE_ID;
      this.displayTypeOfKey = DISPLAYTYPE; // 字段展示类型
      this.tableIdOfKey = AD_TABLE_ID_LABEL; // 字段所在表label
      this.typeOfKey = COLTYPE; // 字段类型
      this.operateOptions = this.getOperateOptions(this.typeOfKey); // 获取操作符下拉选项

      const newData = deepClone(this.defaultData);
      if (this.defaultData && this.defaultData.length > 0) {
        this.formData = newData;
      }
    },

    // 过滤表单
    filterForm() {
      const formData = deepClone(this.formData);
      for (let i = formData.length - 1; i >= 0; i--) {
        const condition = formData[i];
        if (condition.key_value === '' || !condition.operator || !condition.table_id) {
          formData.splice(i, 1);
        }
      }
      return formData;
    },

    // 提交数据
    submitData() {
      const cacheData = this.filterForm();
      if (cacheData.length === 0) {
        this.$emit('dataChange', { key: this.option.key, value: '' });
      } else {
        this.$emit('dataChange', { key: this.option.key, value: cacheData });
      }
    },

    // 回填数据
    async restoreFormData() {
      const defaultData = this.defaultData;
      const conditionCount = defaultData.length;
      if (conditionCount === 0) {
        return;
      }
      const tableIds = defaultData.map(item => item.table_id);

      const searchdata = {
        searchdata: {
          table: TABLE_NAME,
          startindex: 0,
          range: conditionCount,
          fixedcolumns: {
            ID: tableIds,
            ISACTIVE: ['=Y'],
          },
          column_include_uicontroller: true,
          isolr: false
        }
      };

      const result = (await this.requestKeysData(searchdata)).row || [];

      defaultData.forEach((row) => {
        const item = result.find(tableInfo => Number(tableInfo.ID.val) === Number(row.table_id));
        this.$set(this.dropDefaultList, row.table_id, [{
          ID: row.table_id,
          Label: item.NAME.val
        }]);
      });
    }
  },

  created() {
    this.initData();
    this.restoreFormData();
  },

  beforeCreate() {
    this.$t = i18n.t.bind(i18n)
  },
};
</script>

<style lang="scss" scoped>
.form-group {
  border: 1px solid #d8d8d8;
  border-radius: 4px;
  padding: 10px 20px;
  margin: 20px 5px;
}

.row {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 5px;
  &:first-child {
    margin-top: 0px;
  }
  .col {
    flex: 1;
    margin-right: 5px;
  }

  .row-title {
    flex: 50px 0 0;
  }

  .btn-group {
    flex: 50px 0 0;
    .operate-button {
      background-color: transparent;
      outline: none;
      font-size: 16px;
      border: 1px solid lightgrey;
      width: 20px;
      display: inline-block;
      height: 20px;
      line-height: -1px;
      border-radius: 50%;
      color: grey;
      &:hover {
        color: #000;
        cursor: pointer;
        opacity: 0.8;
      }
    }
  }
}

.error-tip {
  color: red;
  padding-left: 56px;
}

.required-remark {
  position: relative;
  &::before {
    content: '*';
    color: red;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: -8px;
  }
}
</style>
