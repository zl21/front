<template>
  <div class="R3ButtonConfig">
    <Description
      :option="option"
      @removeOption="removeOption"
    />

    <div
      v-for="(group, i) in dataList"
      :key="i"
      class="group"
    >
      <div class="row border-b pt-10">
        <div class="name required-item">
          按钮名称：
        </div>
        <div
          class="item"
          style="flex: 50% 0 0;"
        >
          <DropDownSelectFilter
            single
            :data="keyList"
            :auto-data="searchKeyList"
            :page-size="pageSize"
            :total-row-count="totalCount"
            is-back-row-item
            :columns-key="actionColumnsKey"
            :default-selected="group.defaultselected"
            placeholder="请输入按钮名称"
            @on-popper-show="getKeys($event, {
              key: 'action_id'
            })"
            @on-page-change="getKeys($event, {
              key: 'action_id'
            })"
            @on-input-value-change="getSearchKeys($event, {
              key: 'action_id'
            })"
            @on-fkrp-selected="handlerSelected($event, {
              groupIndex: i,
              key: 'action_id'
            })"
            @on-clear="handleClear('action_id', i)"
          />
        </div>
      </div>
      <div class="header">
        <p class="title required-item">
          字段
        </p>
        <p class="title required-item">
          匹配值
        </p>
      </div>
      <div
        v-for="(row, j) in group.filter"
        :key="j"
        class="row"
      >
        <div class="name">
          条件{{ j+1 }}：
        </div>
        <div class="item">
          <DropDownSelectFilter
            single
            :data="keyList"
            :auto-data="searchKeyList"
            :page-size="pageSize"
            :total-row-count="totalCount"
            is-back-row-item
            :columns-key="columnsKey"
            :default-selected="row.defaultselected"
            placeholder="请输入表内名称"
            @on-popper-show="getKeys($event, {
              key: 'filter'
            })"
            @on-page-change="getKeys($event, {
              key: 'filter'
            })"
            @on-input-value-change="getSearchKeys($event, {
              key: 'filter'
            })"
            @on-fkrp-selected="handlerSelected($event, {
              groupIndex: i,
              rowIndex: j,
              key: 'filter'
            })"
            @on-clear="handleClear('filter', i, j)"
          />
        </div>
        <div class="item">
          <Input
            v-model="row.match_value"
            placeholder="请输入匹配值（多个值时，请用逗号分隔）"
          />
        </div>

        <!-- 行操作按钮 -->
        <div class="btn-wrap">
          <button
            v-if="group.filter.length - 1 === j"
            class="operate-button"
            @click="addRow(group.filter)"
          >
            <i class="iconfont">&#xec3f;</i>
          </button>
          <button
            v-if="group.filter.length > 1"
            class="operate-button"
            @click="delRow(group.filter, j)"
          >
            <i class="iconfont">&#xed15;</i>
          </button>
        </div>
      </div>

      <!-- 组操作按钮 -->
      <div class="group-btn">
        <button
          v-if="dataList.length - 1 === i"
          class="operate-button"
          @click="addGroup"
        >
          <i class="iconfont">&#xec3f;</i>
        </button>
        <button
          v-if="dataList.length > 1"
          class="operate-button"
          @click="delGroup(i)"
        >
          <i class="iconfont">&#xed15;</i>
        </button>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Description from './Description.vue';
  import network, { urlSearchParams } from '../../__utils__/network';

  const ITEM_CONSTRUCTOR = {
    action_id: '',
    defaultselected: [],
    filter: [
      {
        col_id: '',
        match_value: '',
        defaultselected: []
      }
    ]
  };

  export default {
    name: 'R3ButtonConfig',

    components: {
      Description
    },

    props: {
      option: {
        type: Object,
        default: () => ({})
      },
      defaultData: {
        type: Array,
        default: () => ([])
      }
    },

    data() {
      return {
        keyList: {},
        searchKeyList: [],
        totalCount: 0,
        pageSize: 10,
        columnsKey: ['DBNAME'],
        dataList: [JSON.parse(JSON.stringify(ITEM_CONSTRUCTOR))],
        currentGroupIndex: 0,
        currentRowIndex: 0,
        actionColumnsKey: ['DESCRIPTION']
      };
    },

    watch: {
      dataList: {
        handler() {
          this.syncData();
        },
        deep: true
      }
    },

    async created() {
      const newData = JSON.parse(JSON.stringify(this.defaultData));
      if (this.defaultData && this.defaultData.length > 0) {
        this.dataList = newData;
      } else {
        this.dataList = [JSON.parse(JSON.stringify(ITEM_CONSTRUCTOR))];
      }
      console.log('初始值', newData);
    },

    methods: {
      // 新增条件
      addRow(rows) {
        const row = JSON.parse(JSON.stringify(ITEM_CONSTRUCTOR.filter[0]));
        rows.push(row);
      },

      // 删除条件
      delRow(rows, rowIndex) {
        rows.splice(rowIndex, 1);
      },

      // 添加组
      addGroup() {
        const group = JSON.parse(JSON.stringify(ITEM_CONSTRUCTOR));
        this.dataList.push(group);
      },

      // 删除组
      delGroup(groupIndex) {
        this.dataList.splice(groupIndex, 1);
      },

      // 清楚整个配置数据
      removeOption(keyArray) { 
        this.dataList = [JSON.parse(JSON.stringify(ITEM_CONSTRUCTOR))];
        this.$emit('removeOption', keyArray || []);
      },

      // 查询key
      async getKeys(page, options) {
        const { key } = options;
        const { itemId } = this.$route.params;
        let startindex = 0;
        let searchdata = null;
        if (typeof page === 'number') {
          startindex = (page - 1) * this.pageSize;
        }

        // 根据key决定查找哪个表
        if (key === 'action_id') {
          searchdata = {
            table: 'AD_ACTION',
            startindex,
            range: this.pageSize,
            fixedcolumns: {
              ISACTIVE: ['=Y']
            },
            column_include_uicontroller: true,
            isolr: false
          };
        }

        if (key === 'filter') {
          searchdata = {
            table: 'AD_COLUMN',
            startindex,
            range: this.pageSize,
            fixedcolumns: {
              AD_TABLE_ID: [itemId],
            },
            column_include_uicontroller: true,
            isolr: false
          };

          if (itemId === 'New') {
            delete searchdata.fixedcolumns.AD_TABLE_ID;
          }
        }

        this.keyList = await this.requestKeysData(searchdata, key);
        this.totalCount = this.keyList.totalRowCount;
      },

      // 模糊查询
      async getSearchKeys(value, options) {
        const { key } = options;
        const { itemId } = this.$route.params;
        let searchdata = null;
        if (value === '') {
          this.searchKeyList = [];
          return;
        }

        // 根据key决定查找哪个表
        if (key === 'action_id') {
          searchdata = {
            table: 'AD_ACTION',
            startindex: 0,
            fixedcolumns: {
              ISACTIVE: ['=Y'],
              DESCRIPTION: value
            },
            column_include_uicontroller: true,
            isolr: false
          };
        }

        if (key === 'filter') {
          searchdata = {
            table: 'AD_COLUMN',
            startindex: 0,
            fixedcolumns: {
              AD_TABLE_ID: [itemId],
              DBNAME: value
            },
            column_include_uicontroller: true,
            isolr: false
          };

          if (itemId === 'New') {
            delete searchdata.fixedcolumns.AD_TABLE_ID;
          }
        }

        const request = async () => {
          const result = (await this.requestKeysData(searchdata, key)).row || [];
          this.searchKeyList = result.map((keyObj) => {
            Object.keys(keyObj).forEach((k) => {
              keyObj[k] = keyObj[k].val;
            });
            return keyObj;
          });
        };

        if (this.timer) {
          clearTimeout(this.timer);
          this.timer = setTimeout(request, 200);
        } else {
          this.timer = setTimeout(request, 200);
        }
      },

      // 获取字段列表
      async requestKeysData(searchdata, dataKey) {
        return new Promise((resolve) => {
          network
            .post('/p/cs/QueryList', urlSearchParams({ searchdata }))
            .then((res) => {
              if (res.data.code === 0) {
                // 字段表过滤字段
                const keyColumns = ['ORDERNO', 'MASK', 'AD_TABLE_ID', 'AD_VERSION_ID', 'ISORDER', 'ISACTIVE', 'ISAGFILTER', 'AGFILTER', 'ISINDEXED', 'NAME', 'OBTAINMANNER', 'REF_COLUMN_ID', 'FKDISPLAY', 'SEARCHMODEL', 'ISREMOTE', 'AD_LIMITVALUE_GROUP_ID', 'DISPLAYTYPE', 'COMMENTSTP', 'MODIFIERID', 'MODIFIEDDATE'];
                // 按钮表过滤字段
                const btnColumns = ['NAME', 'PRIORITY', 'AD_VERSION_ID', 'CUSTOMIZENO', 'ISACTIVE', 'ISHIDE', 'ISREFRSH', 'AD_SUBSYSTEM_ID', 'AD_TABLECATEGORY_ID', 'FILTER', 'CUSCOMPONENT', 'PROPS', 'MODIFIERNAME', 'MODIFIEDDATE', 'AD_ACTION_ID'];
                
                const hideColumns = dataKey === 'action_id' ? btnColumns : keyColumns;
                const tabth = res.data.data.tabth;
                const row = res.data.data.row;
                for (let i = Math.max(tabth.length - 1, 0); i >= 0; i--) {
                  const item = tabth[i];
                  // 让输入框显示 表内名称 字段
                  if (item.name === '表内名称' || item.name === '显示名称') {
                    item.isak = true;
                  } else {
                    item.isak = false;
                  }

                  // 隐藏table列
                  if (hideColumns.includes(item.colname)) {
                    tabth.splice(i, 1);
                  }
                }

                // 隐藏模糊结果列
                row.forEach((item) => {
                  for (const key in item) {
                    if (hideColumns.includes(key)) {
                      delete item[key];
                    }
                  }
                });
                resolve(res.data.data);
              } else {
                resolve({});
              }
            }).catch(() => {
              resolve({});
            });
        });
      },
      // 获取选中字段
      handlerSelected(value, options) {
        const { groupIndex, rowIndex, key } = options;
        if (key === 'action_id') {
          this.dataList[groupIndex].action_id = value[0].ID;
          this.dataList[groupIndex].defaultselected = value;
        }

        if (key === 'filter') {
          this.dataList[groupIndex].filter[rowIndex].col_id = value[0].ID;
          this.dataList[groupIndex].filter[rowIndex].defaultselected = value;
        }
      },

      // 清空下拉所选
      handleClear(key, groupIndex, rowIndex) {
        if (key === 'action_id') {
          this.dataList[groupIndex].action_id = '';
          this.dataList[groupIndex].defaultselected = [];
        }

        if (key === 'filter') {
          this.dataList[groupIndex].filter[rowIndex].col_id = '';
          this.dataList[groupIndex].filter[rowIndex].defaultselected = [];
        }
      },

      // 设置展示字段
      setDisplayData(originData) {
        const cacheData = JSON.parse(JSON.stringify(originData));
        for (let i = Math.max(cacheData.length - 1, 0); i >= 0; i--) {
          const group = cacheData[i];
          delete group.defaultselected;
          for (let j = Math.max(group.filter.length - 1, 0); j >= 0; j--) {
            const row = group.filter[j];
            delete row.defaultselected;
            // 删除无效来源字段
            if (!row.col_id || !row.match_value) {
              group.filter.splice(j, 1);
            }
          }
          // 删除无效字段组配置
          if ((!group.action_id) || group.filter.length === 0) {
            cacheData.splice(i, 1);
          }
        }

        return cacheData;
      },

      // 同步数据到父组件
      syncData() {
        const cacheData = JSON.parse(JSON.stringify(this.dataList));

        const displayData = this.setDisplayData(this.dataList);
        console.log('展示字段', displayData);
        if (displayData.length === 0) {
          this.$emit('dataChange', { key: this.option.key, value: '' });
        } else {
          this.$emit('dataChange', { key: this.option.key, value: cacheData });
        }
      },
    }
  };
</script>

<style lang="scss" scoped>
.R3ButtonConfig {
    .required-item {
    position: relative;
    &::before {
      content: '*';
      color: red;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: -6px;
    }
  }

  .border-b {
    border-bottom: 1px solid #dcdee2;
  }

  .pt-10 {
    padding-top: 10px;
  }

  .pb-10 {
    padding-bottom: 10px;
  }

  .group {
    border: 1px solid #dcdee2;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }
  .header {
    padding: 10px 54px 10px 80px;
    box-sizing: border-box;
    display: flex;
    .title {
      flex: 1;
      text-align: center;
      &:last-child {
        margin-left: 10px;
      }
    }
  }

  .row {
    display: flex;
    align-items: center;
    padding-right: 10px;
    padding-bottom: 10px;

    .name {
      flex: 80px 0 0;
      text-align: right;
    }
    .item {
      flex: 1;
      &:nth-child(3) {
        margin-left: 10px;
      }
    }

    .btn-wrap {
      margin-left: 10px;
      flex: 44px 0 0;
    }
  }

  .group-btn > .operate-button:first-child {
    margin-left: 10px;
  }

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
  }
  .operate-button:hover {
    color: #000;
    cursor: pointer;
    opacity: 0.8;
  }
}
</style>
