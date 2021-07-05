<template>
  <div class="ak-hidden-subtable">
    <Description
      :option="option"
      @removeOption="removeOption"
    />

    <template v-if="Object.keys(formData).length > 0">
      <div
        class="form-group"
        v-for="(table, tableName) in formData"
        :key="table.tableId"
      >
        <h4>子表-{{tableName}}</h4>

        <ExtentionRowItem
          v-for="(condition, rowIndex) in table"
          :key="rowIndex"
          :row-index="rowIndex"
          :row-count="table.length"
          :row-label="`条件${rowIndex}`"
          show-operation-button
          @addRow="addRow(table, ROW_ITEM)"
          @removeRow="removeRow(table, rowIndex)"
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
              :default-selected="defaultFields[tableName] ? defaultFields[tableName][rowIndex]:undefined"
              placeholder="请选择固定在左侧的字段"
              @on-popper-show="getSearchData"
              @on-page-change="getSearchData"
              @on-input-value-change="inputSearchData"
              @on-fkrp-selected="selectValue($event, condition, 'colName', 'Label')"
              @on-clear="clearValue(condition, 'colName')"
            />
          </div>
          <div class="col">
            <Input
              v-model="condition.value"
              placeholder="请输入字段值"
            />
          </div>
        </ExtentionRowItem>
      </div>
    </template>
    <template v-else>
      <h2 class="text-center">暂无子表可配，请先关联子表</h2>
    </template>
  </div>
</template>

<script type="text/ecmascript-6">
import { urlSearchParams } from '../../../utils/http';
import commonExtension from '../mixins/common-extension'
import deepClone from '../../../utils/deepClone';
import { debounce } from '../../../utils/common';

const ROW_ITEM = {
  colName: '',
  value: ''
}

export default {
  name: 'HiddenSubtable',

  mixins: [commonExtension],

  data() {
    return {
      formData: [],
      ROW_ITEM,
      defaultFields: {}
    }
  },

  watch: {
    formData: {
      handler(newValue) {
        const newFormData = this.filterForm(newValue);
        if (newFormData === '') {
          this.$emit('dataChange', { key: this.option.key, value: '' });
        } else {
          this.$emit('dataChange', { key: this.option.key, value: newFormData });
        }
      },
      deep: true
    },
  },

  methods: {
    // 初始化
    async init() {
      const data = await this.getSubTables()

      if (!this.defaultData) {
        this.formData = data
        return
      }
      // 获取初始值里所有的字段名
      const columnNames = []
      for (let tableName in this.defaultData) {
        const conditions = this.defaultData[tableName]
        conditions.forEach(condition => {
          if (condition.colName) {
            // 加= 可以精确查询
            columnNames.push(`=${condition.colName}`)
          }
        })
      }

      // 请求接口，找回字段信息
      const searchdata = {
        table: 'AD_COLUMN',
        startindex: 0,
        range: columnNames.length,
        fixedcolumns: {
          ISACTIVE: ['=Y'],
          DBNAME: columnNames,
          AD_TABLE_ID: [this._table_id_],
        },
        column_include_uicontroller: true,
        isolr: false
      }
      if (!this._table_id_) {
        delete searchdata.fixedcolumns.AD_TABLE_ID;
      }

      const result = (await this.getKeyList(searchdata)).row || [];

      // 回填数据
      const defaultData = {}
      for (let tableName in this.defaultData) {
        const conditions = this.defaultData[tableName]
        defaultData[tableName] = {}
        conditions.forEach((condition, i) => {
          if (condition.colName) {
            const field = result.find(item => item.DBNAME.val === condition.colName)
            defaultData[tableName][i] = [{
              Label: condition.colName,
              columnObj: field.ID.val,
            }]
          }
        })
      }

      this.formData = deepClone(this.defaultData)
      this.defaultFields = defaultData
    },

    // 清空配置项
    async removeOption(keyArray) {
      // 清楚整个配置数据
      Object.assign(this.$data, this.$options.data.call(this))
      this.$emit('removeOption', keyArray || [])
      this.formData = await this.getSubTables()
    },

    // 过滤表单
    filterForm(newValue) {
      const form = deepClone(newValue);
      if (Object.keys(form).length === 0) {
        return ''
      }

      for (let key in form) {
        const conditions = form[key]
        // 如果条件里两个值有一个没填就视为无效条件
        for (let j = conditions.length - 1; j >= 0; j--) {
          const condition = conditions[j]
          if (!condition.colName || !condition.value) {
            conditions.splice(j, 1)
          }
        }

        if (conditions.length === 0) {
          delete form[key]
        }
      }
      return Object.keys(form).length === 0 ? '' : form
    },

    // 获取子表
    async getSubTables() {
      const api = '/p/cs/objectTab'
      const searchdata = {
        table: this._table_name_,
        objid: -1,
        ismaintable: 'y'
      }
      const data = await this.network.post(api, urlSearchParams(searchdata)).then((res) => {
        const subTables = res.data.data.reftabs
        const data = {}
        subTables.forEach(table => {
          data[table.tablename] = [deepClone(ROW_ITEM)]
        })
        return data
      })
      return data
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

    // 请求接口
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
  },

  created() {
    this._table_name_ = this.keyForm.NAME
    this._table_id_ = this.$route.params.itemId === 'New' ? null : this.$route.params.itemId;
    if (this._table_name_) {
      this.init();
    }
  }
}
</script>

<style lang="scss" scoped>
.form-group {
  border: 1px solid #d8d8d8;
  border-radius: 4px;
  padding: 10px 20px;
  margin: 20px 5px;
}

.text-center {
  text-align: center
}
</style>

<style lang="scss">
.ak-hidden-subtable {
  .row-title {
    flex: 70px 0 0;
  }
}
</style>