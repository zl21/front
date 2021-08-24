<template>
  <div>
    <Description
      v-if="showDescription"
      :option="option"
      @removeOption="removeOption"
    />

    <div class="form-group">
      <!-- 来源字段 -->
      <ExtentionRowItem
        :row-label="$t('extensionProperty.sourceField')"
        is-required
        row-label-class="rowLabel"
        :error-tip="fieldValidateTips"
      >
        <div class="col">
          <div class="row">
            <DropDownSelectFilter
              style="width:100%;"
              single
              :data="dropList"
              :auto-data="searchList"
              :page-size="pageSize"
              :total-row-count="totalCount"
              :columns-key="columnsKey"
              :hidecolumns="hidecolumns"
              :placeholder="$t('extensionProperty.selectSourceField')"
              :default-selected="defaultFields"
              @on-popper-show="getSearchData"
              @on-page-change="getSearchData"
              @on-input-value-change="inputSearchData"
              @on-fkrp-selected="selectValue($event)"
              @on-clear="clearTableName"
            />
          </div>
        </div>
      </ExtentionRowItem>

      <!-- 条件配置 -->
      <ExtentionRowItem
        :row-label="$t('extensionProperty.correspondence')"
        is-required
        row-label-class="rowLabel"
      >
        <div class="col">
          <div
            class="row"
            v-for="(row, index) in formData.list"
            :key="index"
          >
            <div class="col">
              <Input
                v-model="row.key"
                :placeholder="$t('extensionProperty.enterOptionKey')"
                @on-blur="validCondition"
              />
            </div>
            <div class="col">
              <Input
                v-model="row.value"
                :placeholder="$t('extensionProperty.enterOptionValue')"
                @on-blur="validCondition"
              />
            </div>

            <!-- 操作按钮 -->
            <div class="col btn-group">
              <button
                v-if="formData.list.length - 1 === index"
                class="operate-button"
                @click="addRow"
              >
                <i class="iconfont">&#xec3f;</i>
              </button>
              <button
                v-if="formData.list.length > 1"
                class="operate-button"
                @click="removeRow(index)"
              >
                <i class="iconfont">&#xed15;</i>
              </button>
            </div>
          </div>

          <div
            v-if="conditionValidateTips"
            class="tip"
          >
            {{ conditionValidateTips }}
          </div>
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
import { isEmptyObject } from '../../../utils/object';
import { debounce } from '../../../utils/common';
import { urlSearchParams } from '../../../utils/http';

const ROW_CONSTRUCTOR = {
  key: '',
  value: ''
}

const ITEM_CONSTRUCTOR = {
  col: '',
  map: {},
  list: [ROW_CONSTRUCTOR],
};

export default {
  name: 'FilterColVal',

  inject: ['network'],

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
    ExtentionRowItem
  },

  watch: {
    formData: {
      handler(newValue) {
        const newFormData = this.filterForm(newValue);
        if (isEmptyObject(newFormData)) {
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

  data() {
    return {
      formData: deepClone(ITEM_CONSTRUCTOR),
      fieldValidateTips: '',
      conditionValidateTips: '',
      defaultFields: [],
      dropList: {},
      searchList: [],
      totalCount: 0,
      pageSize: 10,
      columnsKey: ['DBNAME'],
      hidecolumns: ['ID'], // 隐藏输入时下拉搜索结果列
      fieldValidateTip: ''
    };
  },

  methods: {
    // 过滤表单
    filterForm(data) {
      const originData = deepClone(data);

      const map = {}
      originData.list.forEach((row) => {
        if (row.key && row.value) {
          map[row.key] = row.value.split(',')
        }
      });
      if (!originData.col || isEmptyObject(map)) {
        return {};
      }

      originData.map = map
      delete originData.list

      return originData;
    },

    // 清除整个配置数据
    removeOption(keyArray) {
      Object.assign(this.$data, this.$options.data.call(this));
      this.$emit('removeOption', keyArray || []);
    },

    // 添加行
    addRow() {
      this.formData.list.push(deepClone(ROW_CONSTRUCTOR));
    },

    // 删除行
    removeRow(rowIndex) {
      this.formData.list.splice(rowIndex, 1);
    },

    // 校验来源字段是否有值
    validField() {
      if (this.formData.col) {
        this.fieldValidateTips = ''
      } else {
        this.fieldValidateTips = this.$t('extensionProperty.enterSourceField')
      }
    },

    // 校验条件
    validCondition() {
      const isValid = this.formData.list.some((item) => {
        return item.key && item.value
      })
      this.conditionValidateTips = isValid ? '' : this.$t('extensionProperty.correspondenceIsRequired')
    },

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
          OBTAINMANNER: ['select']
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

    // 选择模糊查询的数据
    selectValue(data) {
      this.formData.col = data.map(item => item.Label).join(',');
      this.validField();
    },

    // 清除选择的表名
    clearTableName() {
      this.formData.col = '';
      this.validField();
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
          OBTAINMANNER: ['select']
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

    // 回填字段值
    async getFieldDefaultValue() {
      const dbNames = this.defaultData.col;

      const searchdata = {
        table: 'AD_COLUMN',
        startindex: 0,
        range: 1,
        fixedcolumns: {
          ISACTIVE: ['=Y'],
          DBNAME: dbNames,
          AD_TABLE_ID: [this._table_id_],
          OBTAINMANNER: ['select']
        },
        column_include_uicontroller: true,
        isolr: false
      };
      if (!this._table_id_) {
        delete searchdata.fixedcolumns.AD_TABLE_ID;
      }

      const result = (await this.getKeyList(searchdata)).row || [];

      this.defaultFields = [{
        ID: result[0].ID.val,
        Label: result[0].DBNAME.val
      }]
    },

    init() {
      const defaultData = deepClone(this.defaultData);
      if (isEmptyObject(defaultData)) {
        return;
      }

      const list = [];
      Object.keys(defaultData.map).forEach((key) => {
        list.push({
          key,
          value: defaultData.map[key].join(',')
        });
      });
      defaultData.list = list
      this.formData = defaultData;

      this.getFieldDefaultValue();
    }
  },

  created() {
    this._table_id_ = this.keyForm.AD_TABLE_ID;
    this.init();
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

.tip {
  margin-top: 10px;
  color: red;
}
</style>

<style lang="scss">
.form-group {
  .rowLabel {
    flex: 60px 0 0;
  }
}
</style>
