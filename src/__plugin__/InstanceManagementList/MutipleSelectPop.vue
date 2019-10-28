<template>
  <div class="MutipleSelectPop">
    <div class="dialog_left">
      <div class="left_top">
        <Input
          v-model="tree.search"
          search
          :placeholder="tree.placeholder"
          @on-change="inputchange"
          @on-keydown="inputkeydown"
          @on-search="inputsearch"
        /></Input>
      </div>
      <div class="left_center">
        <div
          v-if="treeLoading"
          class="complex-spin-fix"
        >
          <Spin fix>
            <Icon
              type="ios-loading"
              size="30"
              class="demo-spin-icon-load" 
            />
          </Spin>
        </div>
        <Tree
          ref="Tree"
          :data="treeLists"
          show-checkbox
          :query="tree.search"
          :query-style="queryStyle"
          @on-select-change="getSelectedNodes"
          @on-check-change="getCheckedNodes"
        />
      </div>
    </div>
    <div class="dialog_center">
      <div
        v-if="tableLoading"
        class="complex-spin-fix"
      >
        <Spin fix>
          <Icon
            type="ios-loading"
            size="30"
            class="demo-spin-icon-load"
          />
        </Spin>
      </div>
      <div class="dialog_center_top">
        <div class="dialog_center_top_fix">
          <Input
            v-model="table.search"
            search
            :placeholder="table.placeholder"
            @on-change="inputchange"
            @on-keydown="inputkeydown"
            @on-search="inputsearch"
          /></Input>
        </div>
      </div>
      <div>
        <Tabs
          size="small"
          :animated="false"
          @on-click="tabClick"
        >
          <TabPane
            v-for="(item,key) in TabPaneData"
            :key="key"
            :label="item.tab"
          >
            <div class="dialog_center_page">
              <div class="dialog_p10">
                <Page
                  :total="item.total"
                  :page-size="item.pageSize"
                  :current="item.pageNum"
                  :page-size-opts="item.pageOptions"
                  show-total
                  size="small"
                  @on-change="pageChange"
                />
              </div>
              <div>
                <Table
                  ref="Table"
                  border
                  :columns="item.columns"
                  :highlight-row="true"
                  :click-timer-task="300"
                  :height="item.height"
                  :data="item.list"
                  @on-select="Onselect"
                  @on-select-cancel="onSelectCancel"
                  @on-select-all="onSelectAll"
                  @on-select-all-cancel="onSelectAllCancel"
                  @on-selection-change="onSelectChange"
                  @on-row-dblclick="rowdbClick"
                  @on-row-click="rowClick"
                />
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
    <div
      v-if="index === 0"
      class="dialog-operation"
    >
      <Button>
        <Button
          v-if="isUse"
          class="operatebtn"
          type="primary"
          ghost
          @click="operationTwo"
        >
          选择部门
        </Button>
        <Button
          class="operatebtn"
          type="primary"
          ghost
          @click="operation"
        >
          选择人员
        </Button>
      </Button>
    </div>
    <div class="dialog_right">
      <div class="left_top right_top">
        <div>已选中({{ resultMessage.total || 0 }})</div>
        <div>
          <icon
            :custom="iconDelect"
            @click="delecFun" 
          />
        </div>
      </div>
      <div class="right_center">
        <ul v-if="resultMessage.list.length>0">
          <li
            v-for="(item,index) in resultMessage.list"
            :key="index"
          >
            <p>{{ item.string }}</p>
            <i
              class="iconfont iconbj_delete2"
              @click="deleteLi(index,item)" 
            />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'Mutiple',
    props: {
      treedata: {
        type: Array,
        default() {
          return [];
        }
      },
      componentData: {
        type: Array,
        default() {
          return [];
        }
      },
      resultData: {
        type: Object,
        default() {
          return {};
        }
      },
      loading: {
        type: Boolean,
        default: false
      },
      treeLoading: {
        type: Boolean,
        default: false
      },
      tableLoading: {
        type: Boolean,
        default: false
      },
      open: {
        type: Boolean,
        default: false
      },
      iconDelect: {
        type: String,
        default: 'iconfont  iconbj_delete'
      },
      checkedList: {
        type: Array,
        default() {
          return [];
        }
      },
      tableSearch: {
        type: String,
        default: ''
      },
      isUse: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        tree: {
          placeholder: '可搜索店仓/部分',
          search: ''
        },
        table: {
          // 表格显示部分搜索
          placeholder: '直接输入人员姓名搜索',
          search: ''
        },
        columns: [],
        treeNewData: {},
        showTree: this.open,
        component: [
          {
            tab: '筛选结果',
            columns: [],
            list: [],
            pageOptions: [10, 20, 50, 100],
            height: 200
          }
        ],
        resultRightData: {
          total: 0,
          list: []
        },
        templateName: '',
        index: 0,
        queryStyle: {
          color: '#fd6442'
        }
      };
    },
    computed: {
      treeLists() {
        this.treeNewData = this.treedata;
        return this.treeNewData;
      },
      TabPaneData() {
        const data = Object.assign(this.component, this.componentData);
        return data;
      },
      resultMessage() {
        const data = Object.assign(this.resultRightData, this.resultData);
        return data;
      }
    },
    watch: {
      tableSearch: {
        handler(newValue, oldValue) {
          this.table.search = newValue;
        }
      }
    },
    methods: {
      getSelectedNodes(obj) {
        console.log(obj, '单击');
        this.$emit('on-select-tree', obj, this);
      },
      getCheckedNodes(obj) {
        this.$emit('on-change-tree', obj, this);
      },
      tabClick(index) {
        this.index = index;
        this.$emit('on-click-tab', index, this);
      },
      pageChange(index) {
        this.$emit('on-change-page', index, this);
      },
      pageChangeSize(index) {
        this.$emit('on-change-pageSize', index, this);
      },
      rowdbClick(index, row) {
        this.$emit('on-row-dblclick', index, row, this);
        setTimeout(() => {
          this.$refs.Table[0].clearCurrentRow();
        }, 200);
      },
      rowClick(index, row) {
        this.$emit('on-row-click', index, row, this);
      },
      Onselect(selection, row) {
        this.$emit('on-select', selection, row);
      },
      onSelectCancel(selection, row) {
        this.$emit('on-select-cancel', selection, row);
      },
      onSelectAll(selection) {
        this.$emit('on-select-all', selection);
      },
      onSelectAllCancel(selection) {
        this.$emit('on-select-all-cancel', selection);
      },
      onSelectChange(selection) {
        this.$emit('on-select-change', selection);
      },
      inputchange(event) {
        this.$emit('on-change', event, this);
      },
      inputkeydown(event) {
        this.$emit('on-keydown', event, this);
      },
      inputsearch(event) {
        this.$emit('on-search', event, this);
      },
      operationTwo() {
        const selectNode = this.$refs.Tree.getCheckedNodes();
        this.$emit('on-transfer-two', selectNode, this);
      },
      operation() {
        this.$emit('on-transfer', this);
      },
      deleteLi(index, tem) {
        const selectNode = this.$refs.Tree.getCheckedNodes();
        if (selectNode && selectNode.length > 0) {
          selectNode.map((inItem) => {
            if (inItem.ID === tem.ID) {
              this.$refs.Tree.handleCheck({
                checked: false,
                nodeKey: inItem.nodeKey
              });
            }
          });
        }
        const selectrow = this.TabPaneData[0].list; // 表格数据
        selectrow.map((row, Index) => {
          if (row.ID === tem.ID) {
            row._checked = false;
          }
        });
        this.$emit('on-delectli', index, tem, this);
      },
      treeOpen(checked) {
        this.showTree = !checked;
        this.treeNewData.forEach((item) => {
          item.expand = !item.expand;
        });
      },
      delecFun() {
        const selectNode = this.$refs.Tree.getCheckedNodes();
        if (selectNode && selectNode.length > 0) {
          selectNode.map((inItem) => {
            this.$refs.Tree.handleCheck({
              checked: false,
              nodeKey: inItem.nodeKey
            });
          });
        }
        const selectrow = this.TabPaneData[0].list; // 表格数据
        if (selectrow && selectrow.length > 0) {
          selectrow.map((row, Index) => {
            row._checked = false;
          });
        }

        this.$emit('on-deleBtn', this);
      }
    }
  };
</script>
<style lang="less">
.MutipleSelectPop {
  width: 800px;
  display: flex;
  height: 484px;
  position: relative;
  .demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
  .complex-spin-fix {
    z-index: 20;
  }
  @keyframes ani-demo-spin {
    from {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(180deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  overflow: hidden;
  .dialog_left {
    width: 170px;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-direction: column;
    flex-direction: column;
    padding: 10px;
    border: 1px solid #dcdee2;
    border-right: none;
    .left_top {
      height: 32px;
      line-height: 32px;
      box-sizing: border-box;
      border-bottom: 1px solid #e8eaec;
      font-size: 12px;
      color: #575757;
      display: flex;
      input {
        line-height: 32px;
        height: 32px;
      }

      div:first-child {
        flex: 1;
      }
      i {
        margin-right: 10px;
      }
    }
    .left_center {
      flex: 1;
      padding-top: 10px;
      position: relative;
      height: 390px;
      padding-bottom: 10px;
      width: 156px;
      overflow-y: auto;
    }
  }
  .dialog_center {
    width: 400px;
    position: relative;
    height: 484px;
    border: 1px solid #dcdee2;
    border-right: none;
    overflow: hidden;
    //box-shadow: 2px -2px 9px @shadow-color;
    padding: 10px;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-direction: column;
    flex-direction: column;
    .dialog_p10 {
      padding: 10px 0;
    }
    .dialog_center_top {
      display: flex;
      line-height: 32px;
      vertical-align: middle;
      box-sizing: border-box;
      .dialog_center_top_fix {
        width: 270px;
        box-sizing: border-box;
        padding-right: 20px;
        input {
          line-height: 32px;
          height: 32px;
        }
      }
    }
  }
  .dialog-operation {
    width: 92px;
    padding: 0px;
    border-left: 1px solid #dcdee2;
    background-color: #fff;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    div {
      text-align: center;
      .operatebtn {
        margin-bottom: 10px;
        padding: 8px 12px;
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
  .dialog_right {
    width: 220px;
    padding: 10px;
    border: 1px solid #dcdee2;
    box-sizing: border-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-direction: column;
    flex-direction: column;
    .left_top {
      height: 30px;
      line-height: 30px;
      box-sizing: border-box;
      border-bottom: 1px solid #e8eaec;
      font-size: 12px;
      color: #575757;
      display: flex;
      div:first-child {
        flex: 1;
      }
      i {
        margin-right: 10px;
      }
    }
    ul {
      height: 390px;
      overflow: auto;
      li {
        margin-bottom: 4px;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-align: center;
        align-items: center;
        background-color: #f8f8f8;
        border-radius: 2px;
        font-size: 12px;
        p {
          flex: 1;
          line-height: 18px;
          margin-left: 4px;
          box-sizing: border-box;
          border-radius: 4px;
          padding: 4px 6px;
          color: #0f8ee9;
          word-wrap: break-word;
          word-break: break-all;
        }
      }
    }
  }
  .right_center {
    flex: 1;
    padding-top: 10px;
  }
}
</style>
