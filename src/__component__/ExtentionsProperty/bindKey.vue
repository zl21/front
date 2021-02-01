<template>
  <div class="bindKey">
    <Description
      :option="option"
      @removeOption="removeOption"
    />

    <div
      v-for="(item,index) in resultList"
      :key="index"
      class="tabContent"
    >
      <p class="label-input">
        <span class="required-item ml-5">展示区域字段：</span>
      </p>
      <div class="target-key">
        <DropDownSelectFilter
          single
          :data="keyList"
          :auto-data="searchKeyList"
          :page-size="pageSize"
          :total-row-count="totalCount"
          :default-selected="item.target.defaultselected"
          placeholder="请输入表内名称"
          is-back-row-item
          :columns-key="targetColumnsKey"
          @on-popper-show="getKeys($event, 'target',{
            tableName:'AD_COLUMN'
          })"
          @on-page-change="getKeys($event, 'target',{
            tableName:'AD_COLUMN'
          })"
          @on-input-value-change="getSearchKeys($event, 'target',{
            tableName:'AD_COLUMN',
            groupIndex: index
          })"
          @on-fkrp-selected="handlerSelected(index, 'target', '', $event)"
          @on-clear="handleClear(index, 'target', '', $event)"
        />
      </div>

      <!-- blank -->
      <p class="blank" />

      <div
        v-for="(temp,j) in item.source"
        :key="j"
        class="colnameContent"
      >
        <div class="colname">
          <p class="required-item ml-5">
            来源字段:
          </p>
          <DropDownSelectFilter
            single
            :data="keyList"
            :auto-data="searchKeyList"
            :page-size="pageSize"
            :total-row-count="totalCount"
            :default-selected="temp.defaultselected.length && temp.defaultselected[0]"
            is-back-row-item
            :columns-key="targetColumnsKey"
            placeholder="请输入表内名称"
            @on-popper-show="getKeys($event, 'source',{
              tableName:'AD_COLUMN'
            })"
            @on-page-change="getKeys($event, 'source',{
              tableName:'AD_COLUMN'
            })"
            @on-input-value-change="getSearchKeys($event, 'source',{
              tableName:'AD_COLUMN',
              groupIndex: index,
              rowIndex: j
            })"
            @on-fkrp-selected="handlerSelected(index, 'source', j , $event, 0)"
            @on-clear="handleClear(index, 'source', j)"
          />
        </div>
        <div class="colname">
          <p class="required-item ml-5">
            来源字段选项组:
          </p>
          <DropDownSelectFilter
            single
            :data="keyList"
            :auto-data="searchKeyList"
            :page-size="pageSize"
            :total-row-count="totalCount"
            :default-selected="temp.defaultselected.length && temp.defaultselected[1]"
            is-back-row-item
            :columns-key="sourceColumnsKey"
            placeholder="请输入名称"
            @on-popper-show="getKeys($event, 'source',{
              tableName:'AD_LIMITVALUE_GROUP',
              deleteTableId: true
            })"
            @on-page-change="getKeys($event, 'source',{
              tableName:'AD_LIMITVALUE_GROUP',
              deleteTableId: true
            })"
            @on-input-value-change="getSearchKeys($event, 'source', {
              tableName:'AD_LIMITVALUE_GROUP',
              deleteTableId: true,
              groupIndex: index,
              rowIndex: j
            })"
            @on-fkrp-selected="handlerSelected(index, 'source', j , $event, 1)"
            @on-clear="handleClear(index, 'source', j)"
          />
        </div>


        <!-- 增加字段按钮 -->
        <div class="oprate">
          <p />
          <button
            v-if="item.source.length - 1 === Number(j)"
            class="operate-button"
            @click="(event) => {item.source = addColname(item.source)}"
          >
            <i class="iconfont">&#xec3f;</i>
          </button>
          <button
            v-if="item.source.length > 1"
            class="operate-button"
            @click="(event) => {item.source = deleteColname(item.source,j)}"
          >
            <i class="iconfont">&#xed15;</i>
          </button>
        </div>
      </div>

      <!-- 增加tab按钮 -->
      <button
        v-if="resultList.length - 1 === index"
        class="operate-button"
        @click="addButtonClick"
      >
        <i class="iconfont">&#xec3f;</i>
      </button>
      <button
        v-if="resultList.length > 1"
        class="operate-button"
        @click="removeButtonClick(index)"
      >
        <i class="iconfont">&#xed15;</i>
      </button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Description from './Description.vue';
  import network, { urlSearchParams } from '../../__utils__/network';

  const GROUP_CONSTRUCTOR = {
    target: {
      col_id: '',
      defaultselected: []
    },
    source: [
      {
        col_id: '',
        label: '',
        defaultselected: [
          [],
          []
        ]
      }
    ]
  };

  export default {
    name: 'BindKey',

    props: {
      option: {
        type: Object,
        default: () => ({})
      },
      defaultData: {
        type: [Object, Array],
        default: () => ([])
      }
    },

    components: {
      Description,
    },

    data() {
      return {
        resultList: [],
        keyList: {},
        searchKeyList: [],
        totalCount: 0,
        pageSize: 10,
        targetColumnsKey: ['DBNAME'],
        sourceColumnsKey: ['NAME']
      };
    },

    watch: {
      resultList: {
        handler() {
          this.syncData();
        },
        deep: true
      }
    },

    async created() {
      const newData = JSON.parse(JSON.stringify(this.defaultData));
      if (this.defaultData && this.defaultData.length > 0) {
        this.resultList = newData;
      } else {
        this.resultList = [JSON.parse(JSON.stringify(GROUP_CONSTRUCTOR))];
      }
    },

    methods: {
      removeOption(keyArray) { // 清楚整个配置数据
        this.resultList = [JSON.parse(JSON.stringify(GROUP_CONSTRUCTOR))];
        this.$emit('removeOption', keyArray || []);
      },

      addButtonClick() { // 新增tab配置
        const tab = JSON.parse(JSON.stringify(GROUP_CONSTRUCTOR));
        this.resultList.push(tab);
      },
      removeButtonClick(index) {
        this.resultList.splice(index, 1);
      },
      addColname(item) { // 新增字段配置
        item.push({
          col_id: '',
          label: '',
          defaultselected: [
            [],
            []
          ]
        });
        return item;
      },
      deleteColname(item, index) { // 删除字段配置
        item.splice(index, 1);
        return item;
      },


      // 查询key
      async getKeys(page, key, options) {
        const { tableName, deleteTableId } = options;
        let startindex = 0;
        if (typeof page === 'number') {
          startindex = (page - 1) * this.pageSize;
        }

        const { itemId } = this.$route.params;
        const searchdata = {
          table: tableName,
          startindex,
          range: this.pageSize,
          fixedcolumns: {
            AD_TABLE_ID: [itemId],
          },
          column_include_uicontroller: true,
          isolr: false
        };

        if (itemId === 'New' || deleteTableId) {
          delete searchdata.fixedcolumns.AD_TABLE_ID;
        }

        this.keyList = await this.requestKeysData(searchdata);
        this.totalCount = this.keyList.totalRowCount;
      },

      // 模糊查询
      async getSearchKeys(value, key, options) {
        const {
          tableName, deleteTableId
        } = options;
        if (value === '') {
          this.searchKeyList = [];
          return;
        }

        // // 对输入值进行赋值
        // if (key === 'target') {
        //   // 展示字段
        //   this.resultList[groupIndex][key].col_id = value;
        // } else if (deleteTableId) {
        //   // 如果有deleteTableId说明是选项组
        //   this.resultList[groupIndex][key][rowIndex].label = value;
        // } else {
        //   // 来源字段
        //   this.resultList[groupIndex][key][rowIndex].col_id = value;
        // }

        const { itemId } = this.$route.params;
        const searchdata = {
          table: tableName,
          startindex: 0,
          fixedcolumns: {
            AD_TABLE_ID: [itemId],
            ISACTIVE: ['=Y'],
          },
          column_include_uicontroller: true,
          isolr: false
        };

        if (tableName === 'AD_COLUMN') {
          searchdata.fixedcolumns.DBNAME = value;
        } else {
          searchdata.fixedcolumns.NAME = value;
        }

        if (itemId === 'New' || deleteTableId) {
          delete searchdata.fixedcolumns.AD_TABLE_ID;
        }

        if (this.timer) {
          clearTimeout(this.timer);
          this.timer = setTimeout(async () => {
            const result = (await this.requestKeysData(searchdata)).row || [];
            this.searchKeyList = result.map((keyObj) => {
              Object.keys(keyObj).forEach((key) => {
                keyObj[key] = keyObj[key].val;
              });
              return keyObj;
            });
          }, 200);
        } else {
          this.timer = setTimeout(async () => {
            const result = (await this.requestKeysData(searchdata)).row || [];
            this.searchKeyList = result.map((keyObj) => {
              Object.keys(keyObj).forEach((key) => {
                keyObj[key] = keyObj[key].val;
              });
              return keyObj;
            });
          }, 200);
        }
      },

      // 获取字段列表
      async requestKeysData(searchdata) {
        return new Promise((resolve) => {
          network
            .post('/p/cs/QueryList', urlSearchParams({ searchdata }))
            .then((res) => {
              if (res.data.code === 0) {
                const hideColumns = ['ORDERNO', 'MASK', 'AD_TABLE_ID', 'AD_VERSION_ID', 'ISORDER', 'ISACTIVE', 'ISAGFILTER', 'AGFILTER', 'ISINDEXED', 'OBTAINMANNER', 'REF_COLUMN_ID', 'FKDISPLAY', 'SEARCHMODEL', 'ISREMOTE', 'DISPLAYTYPE', 'COMMENTSTP', 'MODIFIERID', 'MODIFIEDDATE'];
                const tabth = res.data.data.tabth;
                const row = res.data.data.row;
                for (let i = Math.max(tabth.length - 1, 0); i >= 0; i--) {
                  const item = tabth[i];
                  // 让输入框显示 表内名称 字段
                  if (item.name === '表内名称') {
                    item.isak = true;
                  } else {
                    item.isak = false;
                  }

                  // 隐藏table列
                  if (hideColumns.includes(item.colname)) {
                    tabth.splice(i, 1);
                  }
                }

                row.forEach((item) => {
                  // item.AD_LIMITVALUE_GROUP_ID.val = item.AD_LIMITVALUE_GROUP_ID.colid;
                  for (const key in item) {
                    // 隐藏模糊结果列
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
      handlerSelected(groupIndex, key, rowIndex, value, colIndex) {
        // 选中目标字段值的情况
        if (key === 'target') {
          const selectedObj = {
            col_id: value[0].ID,
            label: value[0].Label,
            defaultselected: value
          };
          this.resultList[groupIndex][key] = selectedObj;
        } 
        if (key === 'source') {
          value[0].Label = value[0].Label ? value[0].Label : value[0].rowItem.NAME.val;
          if (colIndex === 0) {
            // 设置来源字段
            const selectedObj = {
              col_id: value[0].ID,
              defaultselected: []
            };
            const row = this.resultList[groupIndex][key][rowIndex] || GROUP_CONSTRUCTOR.source; // 第n组第n行
            selectedObj.defaultselected[0] = value;
            selectedObj.defaultselected[1] = row.defaultselected[1];
            
            this.$set(this.resultList[groupIndex][key], rowIndex, Object.assign(row, selectedObj));
          } else {
            // 设置来源字段选项组
            const selectedObj = {
              label: value[0].ID,
              defaultselected: []
            };

            const row = this.resultList[groupIndex][key][rowIndex] || GROUP_CONSTRUCTOR.source; // 第n组第n行
            selectedObj.defaultselected[0] = row.defaultselected[0];
            selectedObj.defaultselected[1] = value;
            this.$set(this.resultList[groupIndex][key], rowIndex, Object.assign(row, selectedObj));
          }
        }
      },

      // 设置展示字段
      setDisplayData(originData) {
        const cacheData = JSON.parse(JSON.stringify(originData));
        for (let i = Math.max(cacheData.length - 1, 0); i >= 0; i--) {
          const group = cacheData[i];
          delete group.target.defaultselected;
          delete group.target.label;
          for (let j = Math.max(group.source.length - 1, 0); j >= 0; j--) {
            const row = group.source[j];
            delete row.defaultselected;
            // 删除无效来源字段
            if (!row.col_id || !row.label) {
              group.source.splice(j, 1);
            }
          }
          // 删除无效字段组配置
          if ((!group.target.col_id) || group.source.length === 0) {
            cacheData.splice(i, 1);
          }
        }

        sessionStorage.setItem('key_group_conf', JSON.stringify(cacheData));
      },

      // 同步数据到父组件
      syncData() {
        const cacheData = JSON.parse(JSON.stringify(this.resultList));

        this.setDisplayData(this.resultList);

        if (cacheData.length === 0) {
          this.$emit('dataChange', { key: this.option.key, value: '' });
        } else {
          this.$emit('dataChange', { key: this.option.key, value: cacheData });
        }
      },

      // 清空下拉所选
      handleClear(groupIndex, key, rowIndex,) {
        if (key === 'target') {
          this.resultList[groupIndex][key] = {};
        } else {
          this.$set(this.resultList[groupIndex][key], rowIndex, JSON.parse(JSON.stringify(GROUP_CONSTRUCTOR.source[0])));
        }
      },
    }
  };
</script>

<style lang="scss" scoped>
.bindKey {
  .ml-5 {
    margin-left: 5px;
  }

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

  .target-key {
    display: inline-block;
    width: 240px;
  }
  .tab-label-name {
    width: 240px;
  }
  .tabContent {
    border: 1px solid #d3d3d3;
    padding: 10px;
    position: relative;
    margin-bottom: 10px;

    .label-input {
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      > span {
        display: inline-block;
        width: 100px;
        text-align: right;
      }
    }

    .blank {
      position: absolute;
      width: 100%;
      height: 1px;
      background: #d3d3d3;
      left: 0;
    }

    .colnameContent {
      display: flex;
      padding-top: 10px;
      margin-bottom: 10px;

      > div {
        flex: 1;
        margin-right: 10px;

        > p {
          height: 12px;
          margin-bottom: 4px;
        }

        &.colname {
          flex: 2;
        }

        &.oprate {
          width: 50px;
          flex: none;
        }

        &:last-child {
          margin: 0;
        }
      }
    }
  }

  .operate-button {
    background-color: transparent;
    outline: none;
    font-size: 16px;
    // padding: 5px;
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
