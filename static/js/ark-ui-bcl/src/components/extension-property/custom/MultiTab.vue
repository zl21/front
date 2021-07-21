<template>
  <div class="MultiTab">
    <Description
      :option="option"
      @removeOption="removeOption"
    />

    <SlickList
      v-model="sumTabs"
      axis="y"
      :lock-to-container-edges="true"
      :press-delay="600"
      helper-class="r3-slick"
      class="drag-scroll"
    >
      <SlickItem
        v-for="(item,index) in sumTabs"
        :key="index"
        :index="index"
      >
        <div
          class="tabContent"
          @mouseenter="handleEnter"
          @mouseleave="handleLeave"
        >
          <p class="label-input">
            <validate :data="item.tab_name">
              <span class="required-item ml-5">标签名：</span>
              <Input
                v-model="item.tab_name"
                class="tab-label-name"
                @input="handlerInput(index)"
              />
            </validate>
          </p>

          <!-- blank -->
          <p class="blank" />

          <div
            v-for="(temp,j) in item.tab_value"
            :key="j"
            class="colnameContent"
            :index="j"
          >
            <div class="colname">
              <p class="required-item ml-5">
                关联字段:
              </p>
              <validate
                :data="temp.col_name"
                :validate-function="validateKey"
              >
                <DropDownSelectFilter
                  single
                  :data="keyList"
                  :auto-data="searchKeyList"
                  :page-size="pageSize"
                  :total-row-count="totalCount"
                  :default-selected="defaultSelected[index][j]"
                  is-back-row-item
                  :columns-key="columnsKey"
                  placeholder="请输入表内名称"
                  @on-popper-show="getKeys"
                  @on-page-change="getKeys"
                  @on-input-value-change="getSearchKeys(index, j, $event)"
                  @on-fkrp-selected="handlerSelected(index, j, $event)"
                  @on-clear="handleClear(index, j, $event)"
                />
              </validate>
            </div>
            <div class="operator">
              <p class="required-item ml-5">
                运算符:
              </p>
              <validate :data="temp.operator">
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
              </validate>
            </div>
            <div class="contrastValue">
              <p class="required-item ml-5">
                对比值:
              </p>
              <validate :data="temp.contrast_value">
                <Input
                  v-if="!(temp.type && temp.type.toUpperCase().startsWith('DATE'))"
                  v-model="temp.contrast_value"
                  v-input-number:[temp.type]
                />
                <DatePicker
                  v-if="temp.type && temp.type.toUpperCase().startsWith('DATE')"
                  style="width: 100%;"
                  :value="temp.contrast_value"
                  :type="temp.type && temp.type.toUpperCase() === 'DATETIME' ? 'datetimerange' : 'daterange'"
                  placeholder="请选择"
                  :editable="false"
                  transfer
                  :format="temp.type && temp.type.toUpperCase() === 'DATETIME' ? 'yyyy/MM/dd HH:mm:ss' : 'yyyy/MM/dd'"
                  @on-change="handleChangeDate(index, j , $event)"
                />
              </validate>
            </div>

            <div class="oprate">
              <p />
              <button
                v-if="item.tab_value.length - 1 === Number(j)"
                class="operate-button"
                @click="addColname(item.tab_value, index)"
              >
                <i class="iconfont">&#xec3f;</i>
              </button>
              <button
                v-if="item.tab_value.length > 1"
                class="operate-button"
                @click="deleteColname(item.tab_value,index,j)"
              >
                <i class="iconfont">&#xed15;</i>
              </button>
            </div>
          </div>

          <!-- 增加配置组按钮 -->
          <button
            v-if="sumTabs.length - 1 === index"
            class="operate-button ml-10 mb-10"
            @click="addButtonClick"
          >
            <i class="iconfont">&#xec3f;</i>
          </button>
          <button
            v-if="sumTabs.length > 1"
            class="operate-button ml-10 mb-10"
            @click="removeButtonClick(index)"
          >
            <i class="iconfont">&#xed15;</i>
          </button>
        </div>
      </SlickItem>
    </SlickList>
  </div>
</template>
<script>
import { SlickList, SlickItem } from 'vue-slicksort';
import Description from '../description';
import Validate from '../validate/Validate';
import inputNumber from '../../../directive/inputNumber'
import { urlSearchParams } from '../../../utils/http';

const TAB_CONSTRUCTOR = {
  tab_name: '',
  tab_value: [
    {
      col_name: '',
      operator: '',
      contrast_value: '',
      selectOptions: []
    }
  ]
};

export default {
  components: {
    Description,
    Validate,
    SlickList,
    SlickItem,
  },

  name: 'MultiTab',

  directives: { inputNumber },

  inject: ['network'],

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
  data() {
    return {
      currentTabIndex: 0,
      currentKeyIndex: 0,
      sumTabs: [JSON.parse(JSON.stringify(TAB_CONSTRUCTOR))], // 所有的tab配置
      keyList: {},
      searchKeyList: [],
      totalCount: 0,
      pageSize: 10,
      columnsKey: ['DBNAME'],
      tipStyle: '',
      defaultSelected: [
        []
      ]
    };
  },

  watch: {
    sumTabs: {
      handler() {
        this.syncData();
      },
      deep: true
    },
  },

  computed: {
    currentData() {
      return this.sumTabs[this.currentTabIndex];
    }
  },

  async created() {
    const { itemId } = this.$route.params;
    this._table_id_ = itemId
    this.initData();
    this.setHover();
  },

  methods: {
    // 设置悬浮
    setHover() {
      // 通过hook监听组件销毁钩子函数，并取消监听事件
      this.dom = document.createElement('div');
      this.dom.setAttribute('id', 'drag-tip');
      this.dom.innerText = '长按可拖拽排序';
      document.body.appendChild(this.dom);

      window.addEventListener('mousemove', this.setPos);

      this.$once('hook:beforeDestroy', () => {
        window.removeEventListener('mousemove', this.setPos);
        if (this.dom) {
          document.body.removeChild(this.dom);
        }
      });
    },

    // 设置提示位置
    setPos(e) {
      this.tipStyle = `left: ${e.clientX + 20}px;top:${e.clientY + 20}px;`;
      this.dom.style = this.tipStyle;
    },

    // 鼠标移入时显示提示
    handleEnter() {
      this.dom.classList.add('showTip');
    },

    // 鼠标移入时隐藏提示
    handleLeave() {
      this.dom.classList.remove('showTip');
    },

    // 初始化
    async initData() {
      const newData = JSON.parse(JSON.stringify(this.defaultData));

      if (this.defaultData && this.defaultData.length > 0) {
        // newData.forEach((tabObj) => {
        //   tabObj.tab_value.forEach((keyObj) => {
        // if (keyObj.type && keyObj.type.toUpperCase().startsWith('DATE')) {
        //   keyObj.contrast_value = keyObj.contrast_value.split('~');
        // }
        //   });
        // });

        const nameList = []

        // 取出所有id值
        // 加 = 号可以精确查找
        newData.forEach((group) => {
          group.tab_value.forEach((row) => {
            const name = `=${row.col_name}`
            if (!nameList.includes(name)) {
              nameList.push(name)
            }
          })
        })

        // 找回字段信息
        const searchdata = {
          table: 'AD_COLUMN',
          startindex: 0,
          range: nameList.length,
          fixedcolumns: {
            ISACTIVE: ['=Y'],
            DBNAME: nameList,
            AD_TABLE_ID: [this._table_id_],
          },
          column_include_uicontroller: true,
          isolr: false
        }
        if (!this._table_id_) {
          delete searchdata.fixedcolumns.AD_TABLE_ID;
        }

        const result = (await this.requestKeysData(searchdata)).row || [];

        // 回填默认值
        const defaultList = [];
        newData.forEach((group, groupIndex) => {
          defaultList.push([])
          group.tab_value.forEach((row, rowIndex) => {
            // 设置下拉组件默认值
            defaultList[groupIndex].push([])
            const field = result.find(item => item.DBNAME.val === row.col_name)
            defaultList[groupIndex][rowIndex] = [{
              ID: field.ID.val,
              Label: field.DBNAME.val
            }]

            // 记下字段类型
            row.type = field.COLTYPE.val
            // 记下操作符
            const options = this.getSelectItems(row.type)
            row.selectOptions = options

            // 还原日期组件值
            if (row.type && row.type.toUpperCase().startsWith('DATE')) {
              row.contrast_value = row.contrast_value.split('~');
            }
          })
        })

        this.defaultSelected = defaultList
        this.sumTabs = newData;
      } else {
        this.sumTabs = [JSON.parse(JSON.stringify(TAB_CONSTRUCTOR))];
      }
    },

    removeOption(keyArray) { // 清楚整个配置数据
      Object.assign(this.$data, this.$options.data.call(this));
      this.$emit('removeOption', keyArray || []);
    },
    addButtonClick() { // 新增tab配置
      const tab = JSON.parse(JSON.stringify(TAB_CONSTRUCTOR));
      this.sumTabs.push(tab);
      this.defaultSelected.push([[]])
    },
    removeButtonClick(index) {
      this.sumTabs.splice(index, 1);
      this.defaultSelected.splice(index, 1);
    },
    addColname(item, groupIndex) { // 新增字段配置
      item.push({
        col_name: '',
        operator: '',
        contrast_value: ''
      });
      this.defaultSelected[groupIndex].push([])
    },
    deleteColname(item, groupIndex, rowIndex) { // 删除字段配置
      item.splice(rowIndex, 1);
      this.defaultSelected[groupIndex].splice(rowIndex, 1)
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
      if (itemId === 'New') {
        delete searchdata.fixedcolumns.AD_TABLE_ID;
      }
      this.keyList = await this.requestKeysData(searchdata);
      this.totalCount = this.keyList.totalRowCount;
    },

    // 模糊查询
    async getSearchKeys(tabIndex, keyIndex, value) {
      this.currentTabIndex = tabIndex;
      this.currentKeyIndex = keyIndex;
      this.sumTabs[tabIndex].tab_value[keyIndex].col_name = value;
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
      if (itemId === 'New') {
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
        this.network
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

    // 格式化字段
    formatResult(originData) {
      const cacheData = JSON.parse(JSON.stringify(originData));
      for (let i = Math.max(cacheData.length - 1, 0); i >= 0; i--) {
        const tabIndex = i;
        const tabObj = cacheData[tabIndex];
        for (let j = Math.max(tabObj.tab_value.length - 1, 0); j >= 0; j--) {
          const keyRow = tabObj.tab_value[j];
          if (keyRow.type && keyRow.type.toUpperCase().startsWith('DATE') && keyRow.contrast_value[0] && keyRow.contrast_value[1]) {
            keyRow.contrast_value = keyRow.contrast_value.join('~');
          }
        }
      }

      return cacheData;
    },

    // 设置展示用的字段
    setDisplayData(originData) {
      const cacheData = JSON.parse(JSON.stringify(originData));
      for (let i = Math.max(cacheData.length - 1, 0); i >= 0; i--) {
        const tabIndex = i;
        const tabObj = cacheData[tabIndex];
        for (let j = Math.max(tabObj.tab_value.length - 1, 0); j >= 0; j--) {
          const keyRow = tabObj.tab_value[j];
          // 过滤不必要的字段
          delete keyRow.type;
          delete keyRow.selectOptions;
          delete keyRow.defaultSelected
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
      const cacheData = JSON.parse(JSON.stringify(this.formatResult(this.sumTabs)));

      const displayData = this.setDisplayData(cacheData);
      if (displayData.length === 0) {
        this.$emit('dataChange', { key: this.option.key, value: '' });
      } else {
        this.$emit('dataChange', { key: this.option.key, value: displayData });
      }
    },

    // 获取选中字段
    handlerSelected(tabIndex, keyIndex, value) {
      this.currentTabIndex = tabIndex;
      this.currentKeyIndex = keyIndex;
      this.sumTabs[tabIndex].tab_value[keyIndex].col_name = value[0].rowItem.DBNAME.val || value[0].rowItem.DBNAME;
      this.sumTabs[tabIndex].tab_value[keyIndex].operator = '';
      this.sumTabs[tabIndex].tab_value[keyIndex].contrast_value = '';
      this.sumTabs[tabIndex].tab_value[keyIndex].type = value[0].rowItem.COLTYPE.val || value[0].rowItem.COLTYPE;
      this.defaultSelected[tabIndex][keyIndex] = [value[0]]
    },

    // 清空下拉所选
    handleClear(tabIndex, keyIndex) {
      this.currentTabIndex = tabIndex;
      this.currentKeyIndex = keyIndex;
      this.sumTabs[tabIndex].tab_value[keyIndex].col_name = '';
      this.sumTabs[tabIndex].tab_value[keyIndex].operator = '';
    },

    // 获取下拉选项
    handleSelectExpand(tabIndex, keyIndex) {
      const typeValue = this.sumTabs[tabIndex].tab_value[keyIndex].type || '';
      const options = this.getSelectItems(typeValue)
      this.$set(this.sumTabs[tabIndex].tab_value[keyIndex], 'selectOptions', options);
    },

    // 转换类型名称
    formatType(typeValue) {
      let type;
      if (typeValue.toUpperCase().startsWith('NUMBER')) {
        type = 'NUMBER';
      } else if (typeValue.toUpperCase().startsWith('DATE')) {
        type = 'DATE';
      } else if (typeValue.toUpperCase().startsWith('CHAR') || typeValue.toUpperCase().startsWith('VARCHAR')) {
        type = 'STRING';
      }
      return type
    },

    // 设置下拉选项
    getSelectItems(typeValue) {
      let type = this.formatType(typeValue)

      switch (type) {
        case 'STRING':
          return [
            {
              value: '=',
              label: '='
            }];
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
          },
          {
            value: 'between',
            label: 'between'
          }];
      }
    },

    // 校验字段，相同tab下key不能重复
    validateKey() {
      const tabIndex = this.currentTabIndex;
      const keyIndex = this.currentKeyIndex;
      const value = this.sumTabs[tabIndex].tab_value[keyIndex].col_name;

      const result = this.sumTabs[tabIndex].tab_value.filter(keyObj => (value !== '' && value !== null && value !== undefined && keyObj.col_name === value));
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

    // 改变日期
    handleChangeDate(tabIndex, keyIndex, date) {
      this.sumTabs[tabIndex].tab_value[keyIndex].contrast_value = date;
    }
  }
};
</script>
<style lang="less" scoped>
.MultiTab {
  .ml-5 {
    margin-left: 5px;
  }

  .ml-10 {
    margin-left: 10px;
  }

  .mb-10 {
    margin-bottom: 10px;
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
  .tab-label-name {
    width: 240px;
  }
  .tabContent {
    border: 1px solid #d3d3d3;
    position: relative;
    margin-bottom: 10px;
    cursor: move;

    .label-input {
      display: flex;
      align-items: center;
      margin: 10px;

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
      padding: 10px;

      > div {
        flex: 1;
        margin-right: 10px;

        > p {
          height: 12px;
          margin-bottom: 4px;
        }

        &.colname {
          flex: 1;
        }

        &.oprate {
          width: 50px;
          flex: none;
        }

        &:last-child {
          margin: 0;
        }
      }

      .operator {
        flex: 100px 0 0;
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

::v-deep .ark-date-picker {
  .ark-select-dropdown {
    right: 72px !important;
    left: auto !important;
  }
}

// 拖拽容器滚动
.drag-scroll {
  height: 361px;
  overflow-y: auto;
}
</style>

<style lang="less">
#drag-tip {
  display: inline-block;
  padding: 4px 8px;
  box-shadow: 0px 2px 8px rgba(136, 136, 136, 0.4);
  background: #f4f4f4;
  font-size: 12px;
  position: fixed;
  z-index: 3000;
  opacity: 0;
  transition: opacity 0.3s;
}
.showTip {
  opacity: 1 !important;
}

// 拖拽时候的样式
.r3-slick {
  z-index: 2000;
  box-shadow: 0px 2px 8px rgba(136, 136, 136, 0.4);
  cursor: move;
  pointer-events: auto !important;
  z-index: 99999;
  background: #fff;

  .ml-5 {
    margin-left: 5px;
  }

  .ml-10 {
    margin-left: 10px;
  }

  .mb-10 {
    margin-bottom: 10px;
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
  .tab-label-name {
    width: 240px;
  }
  .tabContent {
    border: 1px solid #d3d3d3;
    position: relative;
    margin-bottom: 10px;
    cursor: move;

    .label-input {
      display: flex;
      align-items: center;
      margin: 10px;

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
  }

  .colnameContent {
    display: flex;
    padding: 10px;

    > div {
      flex: 1;
      margin-right: 10px;

      > p {
        height: 12px;
        margin-bottom: 4px;
      }

      &.colname {
        flex: 1;
      }

      &.oprate {
        width: 50px;
        flex: none;
      }

      &:last-child {
        margin: 0;
      }
    }

    .operator {
      flex: 100px 0 0;
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

  .ark-date-picker {
    .ark-select-dropdown {
      right: 72px !important;
      left: auto !important;
    }
  }
}
</style>