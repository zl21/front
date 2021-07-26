<template>
  <div>
    <Description
      :option="option"
      @removeOption="removeOption"
    />

    <div class="form-group">
      <h4>表格左侧固定列</h4>

      <!-- <SlickList
        v-model="formData.leftPinnedColumns"
        axis="y"
        :lock-to-container-edges="true"
        :press-delay="600"
        helper-class="r3-slick"
        @sort-end="sortEnd($event, 'leftPinnedColumns')"
      >
        <SlickItem
          v-for="(keyInfo,index) in formData.leftPinnedColumns"
          :key="index"
          :index="index"
        >
        </SlickItem>
      </SlickList> -->

      <ExtentionRowItem
        v-for="(keyInfo,index) in formData.leftPinnedColumns"
        :key="index"
        :row-index="index"
        :row-count="formData.leftPinnedColumns.length"
        row-label="字段"
        show-operation-button
        @addRow="addRow('leftPinnedColumns')"
        @removeRow="removeRow('leftPinnedColumns', index)"
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
            :default-selected="defaultFields.leftPinnedColumns[index]"
            placeholder="请选择固定在左侧的字段"
            @on-popper-show="getSearchData"
            @on-page-change="getSearchData"
            @on-input-value-change="inputSearchData"
            @on-fkrp-selected="selectValue($event, 'leftPinnedColumns', index)"
            @on-clear="clearValue('leftPinnedColumns', index)"
          />
        </div>
      </ExtentionRowItem>
    </div>

    <div class="form-group">
      <h4>表格右侧固定列</h4>
      <!-- <SlickList
        v-model="formData.rightPinnedColumns"
        axis="y"
        :lock-to-container-edges="true"
        :press-delay="600"
        helper-class="r3-slick"
        @sort-end="sortEnd($event, 'rightPinnedColumns')"
      >
        <SlickItem
          v-for="(keyInfo,index) in formData.rightPinnedColumns"
          :key="index"
          :index="index"
        >

        </SlickItem>
      </SlickList> -->

      <ExtentionRowItem
        v-for="(keyInfo,index) in formData.rightPinnedColumns"
        :key="index"
        :row-index="index"
        :row-count="formData.rightPinnedColumns.length"
        row-label="字段"
        show-operation-button
        @addRow="addRow('rightPinnedColumns')"
        @removeRow="removeRow('rightPinnedColumns', index)"
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
            :default-selected="defaultFields.rightPinnedColumns[index]"
            placeholder="请选择固定在右侧的字段"
            @on-popper-show="getSearchData"
            @on-page-change="getSearchData"
            @on-input-value-change="inputSearchData"
            @on-fkrp-selected="selectValue($event, 'rightPinnedColumns', index)"
            @on-clear="clearValue('rightPinnedColumns', index)"
          />
        </div>
      </ExtentionRowItem>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
// import { SlickList, SlickItem } from 'vue-slicksort';
import Description from '../description';
import ExtentionRowItem from '../extension-row-item';
import { urlSearchParams } from '../../../utils/http';
import { debounce } from '../../../utils/common';

export default {
  name: 'PinnedColumns',

  inject: ['network'],

  components: {
    Description,
    // SlickList,
    // SlickItem,
    ExtentionRowItem
  },

  props: {
    option: {
      type: Object,
      default: () => ({})
    },
    defaultData: {
      type: String,
      default: ''
    },
    keyForm: {
      type: Object,
      default: () => ({})
    },
  },

  data() {
    return {
      formData: {
        leftPinnedColumns: [''],
        rightPinnedColumns: ['']
      },
      dropList: {},
      searchList: [],
      totalCount: 0,
      pageSize: 10,
      columnsKey: ['DBNAME'],
      hidecolumns: ['ID'], // 隐藏输入时下拉搜索结果列
      defaultFields: {
        leftPinnedColumns: [],
        rightPinnedColumns: []
      }, // 用类数组存默认值
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
    // 过滤表单
    filterForm() {
      const left = this.formData.leftPinnedColumns.filter(item => item !== '').join(',')
      const right = this.formData.rightPinnedColumns.filter(item => item !== '').join(',')
      return `${left}${right ? '|' + right : ''}`
    },

    // 清空配置项
    removeOption(keyArray) { // 清楚整个配置数据
      Object.assign(this.$data, this.$options.data.call(this));
      this.$emit('removeOption', keyArray || []);
    },

    // 添加行
    addRow(field) {
      this.formData[field].push('');
    },

    // 删除行
    removeRow(field, rowIndex) {
      this.formData[field].splice(rowIndex, 1);
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

    // 选择模糊查询的数据
    selectValue(data, field, rowIndex) {
      this.$set(this.formData[field], rowIndex, data[0].Label)
    },

    // 清除选择的表名
    clearValue(field, rowIndex) {
      this.$set(this.formData[field], rowIndex, '')
    },

    // sortEnd(e, field) {
    //   const { newIndex, oldIndex } = e
    //   const columns = this.defaultFields[field]
    //   const temp = columns[newIndex]
    //   this.$set(columns, newIndex, columns[oldIndex])
    //   this.$set(columns, oldIndex, temp)
    // },

    // 回填初始值
    async init() {
      if (!this.defaultData) {
        return
      }

      // 将字段提取出来
      const [left, right] = this.defaultData.split('|')
      let leftColumns = []
      let rightColumns = []
      // 字段前加 = 可以支持精确查找
      if (left) {
        leftColumns = left.split(',').map(colname => `=${colname}`)
      }
      if (right) {
        rightColumns = right.split(',').map(colname => `=${colname}`)
      }
      const columns = leftColumns.concat(rightColumns)

      const searchdata = {
        table: 'AD_COLUMN',
        startindex: 0,
        range: columns.length,
        fixedcolumns: {
          ISACTIVE: ['=Y'],
          DBNAME: columns,
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
      result.forEach(columnObj => {
        const column = `=${columnObj.DBNAME.val}`
        const leftIndex = leftColumns.findIndex(item => item === column)
        if (leftIndex > -1) {
          this.$set(this.formData.leftPinnedColumns, leftIndex, columnObj.DBNAME.val)
          this.$set(this.defaultFields.leftPinnedColumns, leftIndex, [{
            Label: columnObj.DBNAME.val,
            ID: columnObj.ID.val,
          }])
        } else {
          const rightIndex = rightColumns.findIndex(item => item === column)
          this.$set(this.formData.rightPinnedColumns, rightIndex, columnObj.DBNAME.val)
          this.$set(this.defaultFields.rightPinnedColumns, rightIndex, [{
            Label: columnObj.DBNAME.val,
            ID: columnObj.ID.val,
          }])
        }
      })
    },
  },

  async created() {
    this._table_id_ = this.$route.params.itemId === 'New' ? null : this.$route.params.itemId;
    this.init();
  }
}
</script>
