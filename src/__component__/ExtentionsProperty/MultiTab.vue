<template>
  <div class="MultiTab">
    <Description
      :option="option"
      @removeOption="removeOption"
    />

    <div
      v-for="(item,index) in sumTabs"
      :key="index"
      class="tabContent"
    >
      <p class="label-input">
        <span>标签名：</span>
        <Input
          v-model="item.tab_name"
          class="tab-label-name"
          @input="handlerInput(index)"
        />
      </p>

      <!-- blank -->
      <p class="blank" />

      <div
        v-for="(temp,j) in item.tab_value"
        :key="j"
        class="colnameContent"
      >
        <div class="colname">
          <p>关联字段:</p>
          <div>
            <DropDownSelectFilter
              single
              :data="keyList"
              :auto-data="searchKeyList"
              :page-size="pageSize"
              :total-row-count="totalCount"
              is-back-row-item
              @on-popper-show="getKeys"
              @on-page-change="getKeys"
              @on-input-value-change="getSearchKeys"
              @on-fkrp-selected="handlerSelected(index, j, $event)"
              @on-clear="handleClear(index, j, $event)"
            />
          </div>
        </div>
        <div class="operator">
          <p>运算符:</p>
          <Select
            v-model="temp.operator"
            clearable
            @on-open-change="handleSelectExpand(index, j , $event)"
          >
            <Option
              v-for="option in temp.selectOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </Option>
          </Select>
        </div>
        <div class="contrastValue">
          <p>对比值:</p>
          <Input
            v-model="temp.contrast_value"
            v-input-number:[temp.type]
          />
        </div>

        <!-- 增加字段按钮 -->
        <div class="oprate">
          <p />
          <button
            v-if="item.tab_value.length - 1 === Number(j)"
            class="operate-button"
            @click="(event) => {item.tab_value = addColname(item.tab_value)}"
          >
            +
          </button>
          <button
            v-if="item.tab_value.length > 1"
            class="operate-button"
            @click="(event) => {item.tab_value = deleteColname(item.tab_value,j)}"
          >
            -
          </button>
        </div>
      </div>

      <!-- 增加tab按钮 -->
      <button
        v-if="sumTabs.length - 1 === index"
        class="operate-button"
        @click="addButtonClick"
      >
        +
      </button>
      <button
        v-if="sumTabs.length > 1"
        class="operate-button"
        @click="removeButtonClick(index)"
      >
        -
      </button>
    </div>
  </div>
</template>
<script>
  import Description from './Description.vue';
  import network, { urlSearchParams } from '../../__utils__/network';

  const TAB_CONSTRUCTOR = {
    tab_name: '',
    tab_value: [
      {
        col_name: '',
        operator: '',
        contrast_value: '',
        selectOptions: [
          {
            value: '>',
            label: '>'
          },
          {
            value: '>=',
            label: '>='
          },
          {
            value: '=',
            label: '='
          },
          {
            value: '<',
            label: '<'
          },
          {
            value: '<=',
            label: '<='
          },
          {
            value: 'in',
            label: 'in'
          },
          {
            value: 'between',
            label: 'between'
          },
        ]
      }
    ]
  };

  export default {
    components: { Description },
    props: {
      option: {
        type: Object,
        default: () => ({})
      },
      defaultData: {
        type: [Object, Array],
        default: () => ({})
      }
    },
    data() {
      return {
        currentTabIndex: 0,
        sumTabs: [JSON.parse(JSON.stringify(TAB_CONSTRUCTOR))], // 所有的tab配置
        keyList: {},
        searchKeyList: [],
        totalCount: 0,
        pageSize: 10,
      };
    },

    watch: {
      sumTabs: {
        handler(newVal) {
          this.syncData();
        },
        deep: true
      }
    },

    computed: {
      // currentDataIsEmpty() {
      //   return JSON.stringify(this.currentData) === JSON.stringify(TAB_CONSTRUCTOR);
      // },

      currentData() {
        return this.sumTabs[this.currentTabIndex];
      }
    },

    async created() {
      await this.getKeys();
      const newData = JSON.parse(JSON.stringify(this.defaultData));
    // Object.keys(newData).forEach((tabIndex) => {
    //   const tabObj = newData[tabIndex];
    //   tabObj.tab_value.forEach((keyRow) => {
    //   });
    // });
    // this.sumTabs = newData;
    // console.log('初始化', this.sumTabs);
    },

    methods: {
      removeOption(keyArray) { // 清楚整个配置数据
        this.$emit('removeOption', keyArray || []);
      },
      addButtonClick() { // 新增tab配置
        const tab = JSON.parse(JSON.stringify(TAB_CONSTRUCTOR));
        this.sumTabs.push(tab);
        console.log('新增', this.sumTabs);
      },
      removeButtonClick(index) {
        this.sumTabs.splice(index, 1);
      },
      addColname(item) { // 新增字段配置
        /*
入参: 
item:  //当前tab的字段配置数组  type array
出参:
修改后的tab配置
*/
        item.push({
          col_name: '',
          operator: '',
          contrast_value: ''
        });
        return item;
      },
      deleteColname(item, index) { // 删除字段配置
        /*
入参: 
item:  //当前tab的字段配置数组  type:Array
index:  //需要删除的配置下标 type:number
出参:
修改后的tab配置
*/
        item.splice(index, 1);
        return item;
      },

      // 查询key
      async getKeys(page) {
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
        this.keyList = await this.requestKeysData(searchdata);
        this.totalCount = this.keyList.totalRowCount;
      },

      // 模糊查询
      async getSearchKeys(value) {
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
        const result = (await this.requestKeysData(searchdata)).row || [];
        this.searchKeyList = result.map((keyObj) => {
          Object.keys(keyObj).forEach((key) => {
            keyObj[key] = keyObj[key].val;
          });
          return keyObj;
        });
      },

      // 获取字段列表
      async requestKeysData(searchdata) {
        return new Promise((resolve) => {
          network
            .post('/p/cs/QueryList', urlSearchParams({ searchdata }))
            .then((res) => {
              if (res.data.code === 0) {
                const hideColumns = ['ORDERNO', 'MASK', 'AD_TABLE_ID', 'AD_VERSION_ID', 'ISORDER', 'ISACTIVE', 'ISAGFILTER', 'AGFILTER', 'ISINDEXED', 'NAME', 'OBTAINMANNER', 'REF_COLUMN_ID', 'FKDISPLAY', 'SEARCHMODEL', 'ISREMOTE', 'AD_LIMITVALUE_GROUP_ID', 'DISPLAYTYPE', 'COMMENTSTP', 'MODIFIERID', 'MODIFIEDDATE'];
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


      // 获取输入框
      handlerInput(index) {
        this.currentTabIndex = index;
      },

      // 过滤无效字段
      filterInvalidKey(originData) {
        const cacheData = JSON.parse(JSON.stringify(originData));
        for (let i = Math.max(cacheData.length - 1, 0); i >= 0; i--) {
          const tabIndex = i;
          const tabObj = cacheData[tabIndex];
          for (let j = Math.max(tabObj.tab_value.length - 1, 0); j >= 0; j--) {
            const keyRow = tabObj.tab_value[j];
            // 过滤不必要的字段
            delete keyRow.type;
            delete keyRow.selectOptions;
            // 删除无效字段配置
            if (!keyRow.col_name || !keyRow.operator || !keyRow.contrast_value) {
              tabObj.tab_value.splice(j, 1);
            }
          }
          // 删除无效tab配置
          if (!tabObj.tab_name || tabObj.tab_value.length === 0) {
            cacheData.splice(tabIndex, 1);
          }
        }

        return cacheData;
      },

      // 把数据同步给父组件
      syncData() {
        const cacheData = this.filterInvalidKey(this.sumTabs);

        if (cacheData.length === 0) {
          this.$emit('dataChange', { key: this.option.key, value: '' });
        } else {
          this.$emit('dataChange', { key: this.option.key, value: cacheData });
        }
      },

      // 获取选中字段
      handlerSelected(tabIndex, keyIndex, value) {
        this.sumTabs[tabIndex].tab_value[keyIndex].col_name = value[0].rowItem.DBNAME.val;
        this.sumTabs[tabIndex].tab_value[keyIndex].operator = '';
        this.sumTabs[tabIndex].tab_value[keyIndex].contrast_value = '';
        this.sumTabs[tabIndex].tab_value[keyIndex].type = value[0].rowItem.COLTYPE.val;

      // this.$set(this.sumTabs[tabIndex].tab_value[keyIndex], 'selectOptions', this.handleSelectExpand(tabIndex, keyIndex));
      },

      // 清空下拉所选
      handleClear(tabIndex, keyIndex) {
        this.sumTabs[tabIndex].tab_value[keyIndex].col_name = '';
        this.sumTabs[tabIndex].tab_value[keyIndex].operator = '';
      },

      // 获取下拉选项
      handleSelectExpand(tabIndex, keyIndex) {
        const typeValue = this.sumTabs[tabIndex].tab_value[keyIndex].type || '';
        console.log('类型----', typeValue);
        let type;
        if (typeValue.toUpperCase().startsWith('NUMBER')) {
          type = 'NUMBER';
        } else if (typeValue.toUpperCase().startsWith('date')) {
          type = 'DATE';
        } else {
          type = 'STRING';
        }
        console.log('类型=====', type);

        this.$set(this.sumTabs[tabIndex].tab_value[keyIndex], 'selectOptions', this.setSelectItems(type));
      },

      // 设置下拉选项
      setSelectItems(type) {
        switch (type) {
        case 'STRING':
          return [{
                    value: 'in',
                    label: 'in'
                  },
                  {
                    value: '=',
                    label: '='
                  },];
        case 'NUMBER':
          return [{
                    value: '>',
                    label: '>'
                  },
                  {
                    value: '>=',
                    label: '>='
                  },
                  {
                    value: '=',
                    label: '='
                  },
                  {
                    value: '<',
                    label: '<'
                  },
                  {
                    value: '<=',
                    label: '<='
                  }];
        case 'DATE':
          return [{
            value: 'between',
            label: 'between'
          }, {
            value: '=',
            label: '='
          }];
        default:
          return [];
        }
      }
    }
  };
</script>
<style lang="less" scoped>
.MultiTab {
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
