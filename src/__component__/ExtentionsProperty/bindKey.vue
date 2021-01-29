<template>
  <div class="bindKey">
    <Description
      :option="option"
      @removeOption="removeOption"
    />

    <p class="label-input">
      <span class="required-item ml-5">字段：</span>
      <DropDownSelectFilter
        :single="false"
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
    </p>
  </div>
</template>

<script type="text/ecmascript-6">
  import Description from './Description.vue';
  import network, { urlSearchParams } from '../../__utils__/network';

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
      Description
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
        handler(newVal) {
          this.syncData();
        },
        deep: true
      }
    },

    async created() {
      const newData = JSON.parse(JSON.stringify(this.defaultData));
      this.resultList = newData;
      console.log('初始化', this.sumTabs);
    },

    methods: {
      removeOption(keyArray) { // 清楚整个配置数据
        this.$emit('removeOption', keyArray || []);
      },

      // 查询key
      async getKeys(page) {
        let startindex = 0;
        if (typeof page === 'number') {
          startindex = (page - 1) * this.pageSize;
        }

        const searchdata = {
          table: 'AD_COLUMN',
          startindex,
          range: this.pageSize,
          fixedcolumns: {
          },
          column_include_uicontroller: true,
          isolr: false
        };

        this.keyList = await this.requestKeysData(searchdata);
        this.totalCount = this.keyList.totalRowCount;
      },

      // 模糊查询
      async getSearchKeys(value) {
        if (value === '') {
          this.searchKeyList = [];
          return;
        }
        const searchdata = {
          table: 'AD_COLUMN',
          startindex: 0,
          fixedcolumns: {
            DBNAME: value,
            ISACTIVE: ['=Y'],
          },
          column_include_uicontroller: true,
          isolr: false
        };

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
      handlerSelected(value) {
        const arr = [];
        value.forEach((item) => {
          delete item.rowItem;
          arr.push(item);
        });
        this.resultList = arr;
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

      // 清空下拉所选
      handleClear() {
        this.resultList = [];
      },
    }
  };
</script>

<style lang="scss" scoped>
.bindKey {
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

  .tab-label-name {
    width: 240px;
  }
}
</style>
