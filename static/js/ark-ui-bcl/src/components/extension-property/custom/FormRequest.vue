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
        :row-label="$t('extensionProperty.assignValues')"
        :error-tip="fieldValidateTip"
      >
        <div class="col">
          <DropDownSelectFilter
            :single="false"
            :data="dropList"
            :auto-data="searchList"
            :page-size="pageSize"
            :total-row-count="totalCount"
            :columns-key="columnsKey"
            :hidecolumns="hidecolumns"
            :placeholder="$t('extensionProperty.selectKnownField')"
            :default-selected="defaultFields"
            @on-popper-show="getSearchData"
            @on-page-change="getSearchData"
            @on-input-value-change="inputSearchData"
            @on-fkrp-selected="selectTable($event)"
            @on-clear="clearTableName"
          />
        </div>
        <div class="col">
          <Input
            v-model="formData.url"
            :placeholder="$t('extensionProperty.enterApi')"
            @on-blur="validateField"
          />
        </div>
      </ExtentionRowItem>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import i18n from '../../../utils/i18n'
import Description from '../description';
import ExtentionRowItem from '../extension-row-item';
import deepClone from '../../../utils/deepClone';
import { debounce } from '../../../utils/common';
import { isEmptyObject } from '../../../utils/object';
import { urlSearchParams } from '../../../utils/http';

export default {
  name: 'FormRequest',

  components: {
    Description,
    ExtentionRowItem,
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
    keyForm: {
      type: Object,
      default: () => ({})
    },
  },

  data() {
    return {
      formData: {
        refcolumn: '',
        url: ''
      },
      defaultFields: [], // 用类数组存默认值
      dropList: {},
      searchList: [],
      totalCount: 0,
      pageSize: 10,
      columnsKey: ['DBNAME'],
      hidecolumns: ['ID'], // 隐藏输入时下拉搜索结果列
      fieldValidateTip: ''
    };
  },

  inject: ['network'],

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
    // 过滤表单
    filterForm(data) {
      let formData = deepClone(data);
      if (formData.refcolumn === '' || formData.url === '') {
        formData = {};
      }

      return formData;
    },

    // 清除整个配置数据
    removeOption(keyArray) {
      Object.assign(this.$data, this.$options.data.call(this));
      this.$emit('removeOption', keyArray || []);
    },

    // 选择模糊查询的数据
    selectTable(data) {
      this.formData.refcolumn = data.map(item => item.Label).join(',');
      this.validateField();
    },

    // 清除选择的表名
    clearTableName() {
      this.formData.refcolumn = '';
      this.validateField();
    },

    // 校验字段
    validateField() {
      const formData = deepClone(this.formData);

      if (formData.refcolumn === '' || formData.url === '') {
        this.fieldValidateTip = this.$t('extensionProperty.confirmFieldAndAAddress');
      } else {
        this.fieldValidateTip = '';
      }
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
      const { hideColumns, displayKeys, bindId } = options;
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
      if (Object.keys(this.defaultData).length === 0) {
        return;
      }
      const dbNames = this.defaultData.refcolumn.split(',');
      const conditionCount = 10; // 查询数量。注意，如果和dbNames保持一样的数量，可能差的数据会有遗漏

      const searchdata = {
        table: 'AD_COLUMN',
        startindex: 0,
        range: conditionCount,
        fixedcolumns: {
          ISACTIVE: ['=Y'],
          DBNAME: dbNames.join(','),
          AD_TABLE_ID: [this._table_id_],
        },
        column_include_uicontroller: true,
        isolr: false
      };
      if (!this._table_id_) {
        delete searchdata.fixedcolumns.AD_TABLE_ID;
      }

      const result = (await this.getKeyList(searchdata)).row || [];

      const defaultList = [];
      dbNames.forEach((val) => {
        const item = result.find(field => field.DBNAME.val === val);
        defaultList.push(
          {
            ID: item.ID.val,
            Label: val
          }
        );
      });
      this.defaultFields = defaultList;
    },

    // 初始化数据
    init() {
      const defaultData = deepClone(this.defaultData);

      if (Object.keys(defaultData).length > 0) {
        this.formData = defaultData;
      }
    }
  },

  async created() {
    this._table_id_ = this.keyForm.AD_TABLE_ID;

    this.init();
    this.getFieldDefaultValue();
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
</style>
