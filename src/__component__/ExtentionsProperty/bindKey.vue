<template>
  <div class="bindKey">
    <Description
      :option="option"
      @removeOption="removeOption"
    />

    <!-- <p class="label-input">
      <span class="required-item ml-5">字段：</span>
      <DropDownSelectFilter
        :single="true"
        :data="keyList"
        :auto-data="searchKeyList"
        :page-size="pageSize"
        :total-row-count="totalCount"
        :default-selected="resultList"
        placeholder="请输入表内名称"
        is-back-row-item
        :columns-key="columnsKey"
        @on-popper-show="getKeys"
        @on-page-change="getKeys"
        @on-input-value-change="getSearchKeys"
        @on-fkrp-selected="handlerSelected"
        @on-clear="handleClear"
      />
    </p> -->

    <div
      v-for="(item,index) in resultList"
      :key="index"
      class="tabContent"
    >
      <p class="label-input">
        <validate :data="item.target">
          <span class="required-item ml-5">目标字段：</span>
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
              :columns-key="columnsKey"
              @on-popper-show="getKeys"
              @on-page-change="getKeys"
              @on-input-value-change="getSearchKeys"
              @on-fkrp-selected="handlerSelected(index, 'target', '', $event)"
              @on-clear="handleClear(index, 'target', '', $event)"
            />
          </div>
        </validate>
      </p>

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
          <validate
            :data="temp.defaultselected"
            :validate-function="validateKey"
          >
            <DropDownSelectFilter
              single
              :data="keyList"
              :auto-data="searchKeyList"
              :page-size="pageSize"
              :total-row-count="totalCount"
              :default-selected="temp.defaultselected"
              is-back-row-item
              :columns-key="columnsKey"
              placeholder="请输入表内名称"
              @on-popper-show="getKeys($event, 'source')"
              @on-page-change="getKeys($event, 'source')"
              @on-input-value-change="getSearchKeys($event, 'source')"
              @on-fkrp-selected="handlerSelected(index, 'source', j , $event)"
              @on-clear="handleClear(index, 'source', j)"
            />
          </validate>
        </div>

        <!-- 增加字段按钮 -->
        <div class="oprate">
          <p />
          <button
            v-if="item.source.length - 1 === Number(j)"
            class="operate-button"
            @click="(event) => {item.source = addColname(item.source)}"
          >
            +
          </button>
          <button
            v-if="item.source.length > 1"
            class="operate-button"
            @click="(event) => {item.source = deleteColname(item.source,j)}"
          >
            -
          </button>
        </div>
      </div>

      <!-- 增加tab按钮 -->
      <button
        v-if="resultList.length - 1 === index"
        class="operate-button"
        @click="addButtonClick"
      >
        +
      </button>
      <button
        v-if="resultList.length > 1"
        class="operate-button"
        @click="removeButtonClick(index)"
      >
        -
      </button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Description from './Description.vue';
  import Validate from '../form/Validate.vue';
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
        defaultselected: []
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
      Validate
    },

    data() {
      return {
        resultList: [],
        keyList: {},
        searchKeyList: [],
        totalCount: 0,
        pageSize: 10,
        columnsKey: ['DBNAME']
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
      console.log('初始化', this.resultList);
    },

    methods: {
      removeOption(keyArray) { // 清楚整个配置数据
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
          id: '',
          label: '',
          defaultselected: []
        });
        return item;
      },
      deleteColname(item, index) { // 删除字段配置
        item.splice(index, 1);
        return item;
      },


      // 查询key
      async getKeys(page, key) {
        let startindex = 0;
        if (typeof page === 'number') {
          startindex = (page - 1) * this.pageSize;
        }

        const { itemId } = this.$route.params;
        const searchdata = {
          table: 'AD_COLUMN',
          startindex,
          range: this.pageSize,
          fixedcolumns: {
            AD_TABLE_ID: [itemId],
          },
          column_include_uicontroller: true,
          isolr: false
        };

        if (itemId === 'New' || key === 'source') {
          delete searchdata.fixedcolumns.AD_TABLE_ID;
        }

        this.keyList = await this.requestKeysData(searchdata);
        this.totalCount = this.keyList.totalRowCount;
      },

      // 模糊查询
      async getSearchKeys(value, key) {
        if (value === '') {
          this.searchKeyList = [];
          return;
        }

        const { itemId } = this.$route.params;
        const searchdata = {
          table: 'AD_COLUMN',
          startindex: 0,
          fixedcolumns: {
            AD_TABLE_ID: [itemId],
            DBNAME: value,
            ISACTIVE: ['=Y'],
          },
          column_include_uicontroller: true,
          isolr: false
        };

        if (itemId === 'New' || key === 'source') {
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
                const hideColumns = ['ORDERNO', 'MASK', 'AD_TABLE_ID', 'AD_VERSION_ID', 'ISORDER', 'ISACTIVE', 'ISAGFILTER', 'AGFILTER', 'ISINDEXED', 'NAME', 'OBTAINMANNER', 'REF_COLUMN_ID', 'FKDISPLAY', 'SEARCHMODEL', 'ISREMOTE', 'DISPLAYTYPE', 'COMMENTSTP', 'MODIFIERID', 'MODIFIEDDATE'];
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
      handlerSelected(groupIndex, key, rowIndex, value) {
        const selectedObj = {
          col_id: value[0].ID,
          label: value[0].Label,
          defaultselected: value
        };

        // 选中目标字段值的情况
        if (key === 'target') {
          this.resultList[groupIndex][key] = selectedObj;
        } else {
          this.$set(this.resultList[groupIndex][key], rowIndex, selectedObj);
        }
      },

      // 同步数据到父组件
      syncData() {
        const cacheData = JSON.parse(JSON.stringify(this.resultList));
        if (cacheData.length === 0) {
          this.$emit('dataChange', { key: this.option.key, value: '' });
        } else {
          this.$emit('dataChange', { key: this.option.key, value: cacheData });
        }
      },

      // 校验字段，相同tab下key不能重复
      validateKey() {
        // const tabIndex = this.currentTabIndex;
        // const keyIndex = this.currentKeyIndex;
        // const value = this.sumTabs[tabIndex].source[keyIndex].col_name;

        const result = [];
        if (result.length > 1) {
          return {
            isPass: false,
            msg: '已存在相同字段，请修改'
          };
        }
        return {
          isPass: true,
          msg: ''
        };
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
