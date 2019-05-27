<template>
  <div class="functionPower">
    <div class="buttonGroup">
      <Button
        v-for="(item, index) in buttonsData"
        :key="index"
        type="fcdefault"
        class="Button"
        @click="btnClick(item)"
      >
        {{ item.webdesc }}
      </Button>
    </div>
    <div class="content">
      <div class="contentLeft">
        <Input
          placeholder="请输入用户名"
          clearable
          icon="ios-search"
        />
        <span slot="prepend">检索</span>
        </Input>
        <ul class="menuContainer">
          <li
            v-for="(item, index) in menuList"
            :key="index"
            class="menuList"
            :class="index === menuHighlightIndex? 'menuHighlight':''"
            @click="menuClick(index, item)"
          >
            {{ item.NAME }}
          </li>
        </ul>
      </div>
      <div class="contentRight">
        <div class="left-tree">
          <Tree
            ref="tree"
            :data="treeData"
            @on-select-change="treeChange"
          />
        </div>
        <div class="right-list">
          <div class="upper-part">
            <div class="upper-table">
              <Table
                class="table"
                :columns="columns"
                :height="true"
                :data="tableData"
              />
            </div>
          </div>
          <div class="bottom-part">
            <div class="bottom-table">
              <Table
                class="table"
                :columns="columnsBottom"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import network, { urlSearchParams } from '../../__utils__/network';

  export default {
    data() {
      return {
        buttonsData: [], // 按钮数据
        menuHighlightIndex: 0, // 菜单高亮的index
        menuList: [], // 菜单数据
        groupId: '', // 菜单id
        treeData: [], // 树数据
        adSubsystemId: '', // 树节点ID
        tableData: [], // 表格数据
        columnsBottom: [
          {
            title: '扩展功能',
            key: 'description',
            width: 200
          },
          {
            title: '功能',
            key: 'description'
          }
        ],
        columns: [
          {
            title: '功能',
            key: 'description'
          },
          {
            key: 'see',
            render: (h, params) => h('div', [
              h('Checkbox', {
                style: {},
                props: {},
                on: {}

              })
            ]),
            renderHeader: (h, params) => h('div', [
              h('Checkbox', {
                style: {},
                props: {},
                on: {}

              }),
              h('Span', '查看')
            ]),
          },
          {
            key: 'edit',
            render: (h, params) => h('div', [
              h('Checkbox', {
                style: {},
                props: {},
                on: {}

              })
            ]),
            renderHeader: (h, params) => h('div', [
              h('Checkbox', {
                style: {},
                props: {},
                on: {}

              }),
              h('Span', '编辑')
            ]),
          },
          {
            key: 'delete',
            render: (h, params) => h('div', [
              h('Checkbox', {
                style: {},
                props: {},
                on: {}

              })
            ]),
            renderHeader: (h, params) => h('div', [
              h('Checkbox', {
                style: {},
                props: {},
                on: {}

              }),
              h('Span', '删除')
            ]),
          },
          {
            key: 'toVoid',
            render: (h, params) => h('div', [
              h('Checkbox', {
                style: {},
                props: {},
                on: {}

              })
            ]),
            renderHeader: (h, params) => h('div', [
              h('Checkbox', {
                style: {},
                props: {},
                on: {}

              }),
              h('Span', '作废')
            ]),
          },
          {
            key: 'commit',
            render: (h, params) => h('div', [
              h('Checkbox', {
                style: {},
                props: {},
                on: {}

              })
            ]),
            renderHeader: (h, params) => h('div', [
              h('Checkbox', {
                style: {},
                props: {},
                on: {}

              }),
              h('Span', '提交')
            ]),
          },
          {
            key: 'unCommit',
            render: (h, params) => h('div', [
              h('Checkbox', {
                style: {},
                props: {},
                on: {}

              })
            ]),
            renderHeader: (h, params) => h('div', [
              h('Checkbox', {
                style: {},
                props: {},
                on: {}

              }),
              h('Span', '反提交')
            ]),
          },
          {
            key: 'export',
            render: (h, params) => h('div', [
              h('Checkbox', {
                style: {},
                props: {},
                on: {}

              })
            ]),
            renderHeader: (h, params) => h('div', [
              h('Checkbox', {
                style: {},
                props: {},
                on: {}

              }),
              h('Span', '导出')
            ]),
          },
          {
            key: 'print',
            render: (h, params) => h('div', [
              h('Checkbox', {
                style: {},
                props: {},
                on: {}

              })
            ]),
            renderHeader: (h, params) => h('div', [
              h('Checkbox', {
                style: {},
                props: {},
                on: {}

              }),
              h('Span', '打印')
            ]),
          },
          {
            key: 'extend',
            render: (h, params) => h('div', [
              h('Checkbox', {
                style: {},
                props: {},
                on: {}

              })
            ]),
            renderHeader: (h, params) => h('div', [
              h('Checkbox', {
                style: {},
                props: {},
                on: {}

              }),
              h('Span', '扩展')
            ]),
          }
        ], // 表格头部
      };
    },
    components: {},
    watch: {},
    computed: {},
    created() {
      this.refresh();
      this.getButtonData();
    },
    methods: {
      refresh() {
        const menuPromise = new Promise((resolve, reject) => { this.getMenuData(resolve, reject); });
        const treePromise = new Promise((resolve, reject) => { this.getTreeData(resolve, reject); });
        Promise.all([menuPromise, treePromise]).then(() => {
          this.getTableData();
        });
      }, // 刷新数据
      getButtonData() {
        network.post('/p/cs/fetchActionsInCustomizePage', { AD_ACTION_NAME: 'functionPermission' })
          .then((res) => {
            if (res.data.code === 0) {
              this.buttonsData = res.data.data;
              this.buttonsData.push({
                webdesc: '刷新'
              });
            }
          })
          .catch(() => {
          });
      }, // 获取按钮数据
      menuClick(index, item) {
        this.menuHighlightIndex = index;
        this.groupId = item.ID;
        const treePromise = new Promise((resolve, reject) => {
          this.getTreeData(resolve, reject);
        });
        treePromise.then(() => {
          this.getTableData();
        });
      },
      getTreeData(resolve, reject) {
        network.post('/p/cs/getMenuTree', urlSearchParams({}))
          .then((res) => {
            if (res.data.code === 0) {
              resolve();
              const resData = res.data.data;
              this.restructureTreeDada(resData);
              this.treeData = [...resData];
            } else {
              reject();
            }
          })
          .catch(() => {
            reject();
          });
      }, // 获取树数据
      restructureTreeDada(data) {
        data.map((item) => {
          if (item.nodeType === 'ROOT') {
            item.expand = true;
            item.selected = true;
            this.adSubsystemId = item.ad_subsystem_id;
          }
          item.title = item.description;
          if (item.children && item.children.length > 0 && item.children[0].children.length > 0) {
            this.restructureTreeDada(item.children);
          } else {
            delete item.children;
          }
        });
      }, //
      getMenuData(resolve, reject) {
        network.post('/p/cs/groupTreeload', urlSearchParams({}))
          .then((res) => {
            if (res.data.code === 0) {
              resolve();
              this.menuHighlightIndex = 0;
              this.menuList = res.data.data;
              this.groupId = this.menuList[this.menuHighlightIndex].ID;
            } else {
              reject();
            }
          })
          .catch(() => {
            reject();
          });
      }, // 获取菜单数据
      getTableData() {
        let obj = {};
        if (this.adSubsystemId) {
          obj = {
            AD_SUBSYSTEM_ID: this.adSubsystemId,
            GROUP_ID: this.groupId
          };
        } else {
          obj = {
            GROUP_ID: this.groupId
          };
        }
        network.post('/p/cs/queryMenuPermission', obj)
          .then((res) => {
            if (res.data.code === 0) {
              this.tableData = res.data.data;
            }
          })
          .catch(() => {
          });
      }, // 获取表格数据
      treeChange(val, obj) {
        this.adSubsystemId = obj.ad_subsystem_id;
        this.getTableData();
      }, // 树选中改变触发
      btnClick(item) {
        if (item.webdesc === '刷新') {
          this.refresh();
        }
      }, // 点击按钮触发
      toBin(intNum) {
        let answer = '';
        if (/\d+/.test(intNum)) {
          while (intNum !== 0) {
            answer = Math.abs(intNum % 2) + answer;
            intNum = parseInt(intNum / 2);
          }
          if (answer.length === 0) {
            answer = '0';
          }
          return answer;
        }
        return 0;
      }
    }
  };
</script>

<style lang="less">
  @import "../../../src/assets/theme/custom.less";

  .functionPower {
    position: relative;
    height: 100%;
    padding: 10px 0;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    .buttonGroup {
      display: flex;
      .Button {
        padding: 6px 8px;
        border-radius:2px;
        font-size:12px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        box-sizing: border-box;
        margin-right: 10px;
      }
    }
    .content {
      flex: 1;
      margin-top: 10px;
      display: flex;
      overflow-y: hidden;
      .contentLeft {
        width: 240px;
        height: 100%;
        padding: 10px;
        border: solid 1px #B4B4B4;
        border-radius: 6px;
        margin-right: 10px;
        .menuContainer {
          margin-top: 10px;
          .menuList {
            cursor: pointer;
            font-size: 12px;
            line-height: 26px;
          }
          .menuHighlight {
            background-color: rgb(196, 226, 255);
          }
        }
      }
      .contentRight {
        height: 100%;
        flex: 1;
        border: solid 1px #B4B4B4;
        border-radius: 6px;
        display: flex;
        width: 100%;
        .left-tree {
          width: 200px;
          padding: 10px;
          border-right: solid 1px #B4B4B4;
          .burgeon-tree-title-selected, .burgeon-tree-title-selected:hover {
            background-color: rgb(196, 226, 255);
          }
        }
        .right-list {
          flex: 1;
          height: 100%;
          width: 10px;
          .upper-part {
            height: 60%;
            padding: 10px;
            border-bottom: solid 1px #B4B4B4;
            .upper-table {
              height: 100%;
              .table {
                border: 0;
              }
            }
          }
          .bottom-part {
            height: 40%;
            padding: 10px;
            .bottom-table {
              height: 100%;
              .table {
                border: 0;
              }
            }
          }
        }
      }
    }
  }
</style>
