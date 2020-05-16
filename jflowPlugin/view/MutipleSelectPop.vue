<template>
  <div class="MutipleSelectPop">
    <div class="dialog_left">
      <p class="label">
        部门:
      </p>
      <div class="left_top">
        <Input
          v-model="tree.search"
          search
          :placeholder="tree.placeholder"
          @on-change="organizationSearch"
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
        <!-- <Tree
          :data="treeData"
          :load-data="treeLoadData"
          show-checkbox
          ref="Tree"
          :query="tree.search"
          :queryStyle="queryStyle"
          @on-check-change="getCheckedNodes"
        ></Tree> -->
        <ZTree
          :z-nodes="treeData"
          element-id="organizationTree"
          :event="organizationEvents"
        />
      </div>
    </div>
    <div
      v-if="isUse && roleSwitch"
      class="dialog_left"
    >
      <p class="label">
        角色:
      </p>
      <div class="left_top">
        <Input
          v-model="role.search"
          search
          :placeholder="role.placeholder"
          @on-change="roleSearch"
          @on-search="() => {getRoleData()}"
        /></Input>
      </div>
      <div class="left_center">
        <div
          v-if="roleLoading"
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
        <ZTree
          :z-nodes="roleData"
          element-id="roleTree"
          :event="roleEvents"
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
          <p class="label">
            人员:
          </p>
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
            v-for="(item,key) in component"
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
      <div>
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
          v-if="isUse && roleSwitch"
          class="operatebtn"
          type="primary"
          ghost
          @click="operationRole"
        >
          选择角色
        </Button>
        <Button
          class="operatebtn"
          type="primary"
          ghost
          @click="operation"
        >
          选择人员
        </Button>
      </div>
    </div>
    <div class="dialog_right">
      <div class="left_top right_top">
        <div>已选中({{ resultRightData.total || 0 }})</div>
        <div>
          <i
            class="iconfont iconios-trash-outline"
            @click="delecFun"
          />
        </div>
      </div>
      <div class="right_center">
        <ul v-if="resultRightData.list.length>0">
          <li
            v-for="(item,index) in resultRightData.list"
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
  import { mapState } from 'vuex';
  import ZTree from '../ztree/zTree';
  import { fuzzySearch } from '../ztree/js/fuzzysearch';
  import network from '../utils/network';

  export default {
    name: 'Mutiple',
    components: { ZTree },
    props: {
      // treedata: {
      //   type: Array,
      //   default() {
      //     return [];
      //   }
      // },
      // componentData: {
      //   type: Array,
      //   default() {
      //     return [];
      //   }
      // },
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
      // treeLoading: {
      //   type: Boolean,
      //   default: false
      // },
      // tableLoading: {
      //   type: Boolean,
      //   default: false
      // },
      open: {
        type: Boolean,
        default: false
      },
      iconDelect: {
        type: String,
        default: 'iconfont  icon-bj_delete'
      },
      checkedList: {
        type: Array,
        default() {
          return [];
        }
      },
      // tableSearch: {
      //   type: String,
      //   default: ""
      // },
      isUse: { // 是否只是人员选择
        type: Boolean,
        default: true
      },
      isMutiple: {
        // 是否多选
        type: Boolean,
        default: true
      },
    // isResultShow: {
    //   //result.list是否反显
    //   type: Boolean,
    //   default: true
    // },
    },
    data() {
      return {
        load: require('../ztree/css/zTreeStyle/img/loading.gif'),
        tableLoading: false,
        // 组织树
        currentoOrganization: null, // 当前选中的组织
        treeLoading: false,
        tree: {
          placeholder: '可搜索店仓/部门',
          search: ''
        },
        treeData: [], // 组织树
        showTree: this.open,

        // 角色树
        currentoRole: null, // 当前选中的角色  -->去除不需要字段
        roleLoading: false,
        role: {
          placeholder: '可搜索角色',
          search: ''
        },
        roleData: [], // 角色树
        currentRole: {}, // 当前获取的角色

        table: {
          // 表格显示部分搜索
          placeholder: '直接输入人员姓名搜索',
          search: ''
        },
        columns: [],
        component: [
          {
            tab: '筛选结果',
            columns: [
              {
                type: 'selection',
                align: 'center',
                fixed: 'left',
                width: 30
              },
              { key: 'NAME', title: '用户名' },
              { key: 'ENAME', title: '用户姓名' }
            ],
            list: [],
            total: 0,
            pageSize: 10,
            pageNum: 1, // 当前页码
            pageOptions: [10, 20, 50, 100],
            height: 340
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
        },
        selectRow: [], // 表格选中的数据
        selectDatas: {}, // 单行选中
        obj: {}, //

        organizationEvents: {
          onCheck: async (e, treeId, treeNode) => {
            // 查询人员
            const organizationTree = $.fn.zTree.getZTreeObj('organizationTree');
            const arr = organizationTree.getCheckedNodes(true).filter(item => !item.getCheckStatus().half).map(item => item.ID);
            this.obj.CP_C_HRORG_ID = arr.join(',');
            this.obj.GROUPID = null;
            this.findUser(this.obj);

            // 加载角色树
            const tree = await this.getRoleData();
            const roleTree = $.fn.zTree.getZTreeObj('roleTree');
            roleTree.updateNode(tree);
          },
          beforeExpand: async (treeId, treeNode) => {
            if (this.asyncTree) {
              if (!(treeNode.children && treeNode.children.length > 0)) {
                const tree = await this.getTreeData(treeNode);
                const zTree = $.fn.zTree.getZTreeObj('organizationTree');
                zTree.addNodes(treeNode, tree, true);
              }
            }
          },
        },
        roleEvents: {
          onCheck: (e, treeId, treeNode) => {
            const organizationTree = $.fn.zTree.getZTreeObj('organizationTree');
            const arr = organizationTree.getCheckedNodes(true).filter(item => !item.getCheckStatus().half).map(item => item.ID);
            this.obj.CP_C_HRORG_ID = arr.join(',');

            const roleTree = $.fn.zTree.getZTreeObj('roleTree');
            const arrRole = roleTree.getCheckedNodes(true).filter(item => !item.getCheckStatus().half).map(item => item.ID);
            this.obj.GROUPID = arrRole.join(',');
            this.findUser(this.obj);
          },
          beforeExpand: async (treeId, treeNode) => {
            if (this.asyncTree) {
              if (!(treeNode.children && treeNode.children.length > 0)) {
                const zTree = $.fn.zTree.getZTreeObj('roleTree');
                const tree = await this.getRoleData(treeNode);
                zTree.addNodes(treeNode, tree, true);
              }
            }
          }
        }
      };
    },
    computed: {
      // ...mapState({
      //   roleSwitch: state => state.roleSwitch,
      //   asyncTree: state => state.asyncTree
      // })
      roleSwitch() {
        return false;
      },
      asyncTree() {
        return false;
      }
    },
    methods: {
      deepCopy(obj) {
        // 实现深拷贝
        const result = Array.isArray(obj) ? [] : {};
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
              result[key] = this.deepCopy(obj[key]); // 递归复制
            } else {
              result[key] = obj[key];
            }
          }
        }
        return result;
      },
      tabClick(index) { // tab切换
        this.index = index;
        this.$emit('on-click-tab', index, this);
      },
      pageChange(index) { // 分页
        this.$emit('on-change-page', index, this);
        this.component[0].pageNum = index;
        const param = Object.assign(this.obj, { page: index, pageSize: 10 });
        if (this.table.search !== '') {
          param.ENAME = this.table.search;
        }
        this.findUser(param);
      },
      pageChangeSize(index) { // 当前页显示数据修改
        this.$emit('on-change-pageSize', index, this);
        this.component[0].pageSize = index;
        const param = Object.assign(this.obj, { page: 1, pageSize: index });
        if (this.table.search !== '') {
          param.ENAME = this.table.search;
        }
        this.findUser(param);
      },
      rowdbClick(row, index) { // 双击表格行
        const selectObj = Object.assign({}, row);
        if (!this.isMutiple) {
          selectObj.string = selectObj.ENAME;
          if (this.resultRightData.list) {
            this.resultRightData.list = [];
            this.resultRightData.list.push(selectObj);
          } else {
            this.$set(this.resultRightData, 'list', [selectObj]);
          }
        } else {
          const selectObj = Object.assign({ approve_type: 4 }, row);
          selectObj.string = selectObj.ENAME;
          if (this.resultRightData.list && this.resultRightData.list.length > 0) {
            const flagIndex = this.resultRightData.list.findIndex(inner => (
              Number(selectObj.ID) === Number(inner.ID) || Number(selectObj.ID) === Number(inner.approve_value)
            ));
            if (flagIndex === -1) {
              // 没有找到相同的就加入
              this.resultRightData.list.push(selectObj);
            } else {
              this.$Message.warning(
                `${selectObj.ENAME}已经选择过了,请不要重复选择！`
              );
            }
          } else {
            this.$set(this.resultRightData, 'list', [selectObj]);
          }
        }
        this.resultRightData.total
          ? (this.resultRightData.total = this.resultRightData.list.length)
          : this.$set(
            this.resultRightData,
            'total',
            this.resultRightData.list.length
          );
        this.$emit('getResult', this.resultRightData);
        this.$refs.Table[0].clearCurrentRow();
        this.$emit('on-row-dblclick', row, index, this);
      },
      rowClick(row, index) { // 单击表格
        if (!this.isMutiple) {
          this.selectDatas = Object.assign(this.selectDatas, row);
        }
        this.$emit('on-row-click', row, index, this);
      },
      Onselect(selection, row) {
        if (this.isMutiple) {
          this.component[0].list.map((item) => {
            if (row.ID === item.ID) {
              item._checked = true;
            }
          });
          this.selectRow = [];
          this.selectRow = selection;
        }

        this.$emit('on-select', selection, row);
      },
      onSelectCancel(selection, row) {
        this.component[0].list.map((item) => {
          if (row.ID === item.ID) {
            item._checked = false;
          }
        });
        this.selectRow = [];
        this.selectRow = selection;
        this.$emit('on-select-cancel', selection, row);
      },
      onSelectAll(selection) {
        this.selectRow = [];
        this.component[0].list.map((item) => {
          item._checked = true;
        });
        this.selectRow = selection;
        this.$emit('on-select-all', selection);
      },
      onSelectAllCancel(selection) {
        this.component[0].list.map((item) => {
          item._checked = false;
        });
        this.selectRow = [];
        this.$emit('on-select-all-cancel', selection);
      },
      onSelectChange(selection) {
        this.$emit('on-select-change', selection);
      },
      inputchange(event) {
        // if(!this.isUse&&!this.isMutiple){
        // this.table.search = event.target.value;
        // }
        this.$emit('on-change', event, this);
      },
      inputkeydown(event) {
        this.$emit('on-keydown', event, this);
      },
      inputsearch(event) {
        const param = Object.assign(this.obj, {
          page: 1,
          pageSize: 10,
          ENAME: event
        });
        this.findUser(param);
        this.$emit('on-search', event, this);
      },

    
      operationTwo() { // 选择部门
        const organizationTree = $.fn.zTree.getZTreeObj('organizationTree');
        let selectNode = organizationTree.getCheckedNodes(true);
        selectNode = selectNode.filter((item) => {
          if (!item.getCheckStatus().half) {
            const {
              ID,
              ENAME,
              CP_C_ORGUP_ID,
              expand,
              children,
              loading,
              oldname
            } = item;
            item = {
              ID,
              ENAME,
              CP_C_ORGUP_ID,
              expand,
              children,
              loading,
              oldname
            };
            return item;
          }
        });
        if (this.isMutiple) {
          if (selectNode.length > 0) {
            this.resultRightData.total
              ? this.$set(this.resultRightData, 'total', this.resultData.total + selectNode.length)
              : this.$set(this.resultRightData, 'total', selectNode.length);
            selectNode.map((item) => {
              const selectObj = Object.assign({ approve_type: 2 }, item);
              selectObj.string = item.oldname ? item.oldname : item.ENAME;
              if (
                this.resultRightData.list
                && this.resultRightData.list.length > 0
              ) {
                const flagIndex = this.resultRightData.list.findIndex(inner => item.ID == inner.ID || item.ID == inner.approve_value);
                if (flagIndex === -1) {
                  // 没有找到相同的就加入
                  this.resultRightData.list.push(selectObj);
                } else {
                  this.$Message.warning(
                    item.oldname ? item.oldname : `${item.ENAME}已经选择过了,请不要重复选择！`
                  );
                  this.$set(this.resultRightData, 'total', --this.resultRightData.total);
                // this.$set(this.resultRightData, "total", --this.resultData.total)
                }
              } else {
                this.$set(this.resultRightData, 'list', [selectObj]);
              }
            });
          } else {
            this.$Message.warning('请选择部门');
          }
          this.getTreeData();
        }
        if (this.selectRow.length > 0) {
          // 选中状态的清除
          this.selectRow = [];
        }
        if (Object.keys(this.selectDatas).length > 0) {
          this.selectDatas = {};
        }
        this.$emit('getResult', this.resultRightData);
        this.$emit('on-transfer-two', selectNode, this);
      },
      operationRole() { // 选择角色
        const roleTree = $.fn.zTree.getZTreeObj('roleTree');
        let selectNode = roleTree.getCheckedNodes(true);
        console.log(selectNode);
        selectNode = selectNode.filter((item) => {
          if (!item.getCheckStatus().half) {
            const {
              ID,
              ENAME,
              CP_C_ORGUP_ID,
              expand,
              children,
              loading,
              oldname
            } = item;
            item = {
              ID,
              ENAME,
              CP_C_ORGUP_ID,
              expand,
              children,
              loading,
              oldname
            };
            return item;
          }
        });
        if (this.isMutiple) {
          if (selectNode.length > 0) {
            this.resultRightData.total
              ? this.$set(this.resultRightData, 'total', this.resultData.total + selectNode.length)
              : this.$set(this.resultRightData, 'total', selectNode.length);
            selectNode.map((item) => {
              const selectObj = Object.assign({ approve_type: 3 }, item);
              selectObj.string = item.oldname ? item.oldname : item.ENAME;
              if (
                this.resultRightData.list
                && this.resultRightData.list.length > 0
              ) {
                const flagIndex = this.resultRightData.list.findIndex(inner => item.ID == inner.ID || item.ID == inner.approve_value);
                if (flagIndex === -1) {
                  // 没有找到相同的就加入
                  this.resultRightData.list.push(selectObj);
                } else {
                  this.$Message.warning(
                    item.oldname ? item.oldname : `${item.ENAME}已经选择过了,请不要重复选择！`
                  );
                  this.$set(this.resultRightData, 'total', --this.resultRightData.total);
                }
              } else {
                this.$set(this.resultRightData, 'list', [selectObj]);
              }
            });
          } else {
            this.$Message.warning('请选择角色');
          }
          this.getRoleData();
        }
        if (this.selectRow.length > 0) {
          // 选中状态的清除
          this.selectRow = [];
        }
        if (Object.keys(this.selectDatas).length > 0) {
          this.selectDatas = {};
        }
        this.$emit('getResult', this.resultRightData);
      },
      operation() { // 选择人员
        if (!this.isMutiple) {
          // 单选逻辑
          if (Object.keys(this.selectDatas).length === 0) {
            this.$Message.warning('请选择人员');
            return;
          }
          this.resultRightData.total
            ? (this.resultRightData.total = 1)
            : this.$set(this.resultRightData, 'total', 1);
          const selectObj = Object.assign({}, this.selectDatas);
          selectObj.string = selectObj.ENAME;
          if (this.resultRightData.list) {
            this.resultRightData.list = [];
            this.resultRightData.list.push(selectObj);
          } else {
            this.$set(this.resultRightData, 'list', [selectObj]);
          }
        } else {
          // 多选逻辑
          if (this.selectRow.length > 0) {
            this.selectRow.map((item) => {
              const selectObj = Object.assign({ approve_type: 4 }, item);
              selectObj.string = item.ENAME;
              if (
                this.resultRightData.list
                && this.resultRightData.list.length > 0
              ) {
                const flagIndex = this.resultRightData.list.findIndex(inner => item.ID == inner.ID || item.ID == inner.approve_value);
                if (flagIndex === -1) {
                  // 没有找到相同的就加入
                  this.resultRightData.list.push(selectObj);
                } else {
                  this.$Message.warning(
                    `${item.ENAME}已经选择过了,请不要重复选择！`
                  );
                }
              } else {
                this.$set(this.resultRightData, 'list', [selectObj]);
              }
            });
            this.resultRightData.total
              ? (this.resultRightData.total = this.resultRightData.list.length)
              : this.$set(
                this.resultRightData,
                'total',
                this.resultRightData.list.length
              );
          } else {
            this.$Message.warning('请选择人员');
          }
        }
        // 刷新表格数据
        this.component[0].list.map((item) => {
          item._checked = false;
        });
        this.component[0].list = this.component[0].list.concat([]);
        if (this.selectRow.length > 0) {
          // 选中状态的清除
          this.selectRow = [];
        }
        if (Object.keys(this.selectDatas).length > 0) {
          this.selectDatas = {};
        }
        this.$emit('getResult', this.resultRightData);
        this.$emit('on-transfer', this);
      },
      deleteLi(index, tem) { // 删除
        const organizationTree = $.fn.zTree.getZTreeObj('organizationTree');
        const selectNode = organizationTree.getCheckedNodes(true);
        if (selectNode && selectNode.length > 0) {
          selectNode.map((inItem) => {
            if (inItem.ID === tem.ID) {
              organizationTree.checkNode(inItem, false, true);
            }
          });
        }

        const roleTree = $.fn.zTree.getZTreeObj('roleTree');
        const selectRoleNode = roleTree.getCheckedNodes(true);
        if (selectRoleNode && selectRoleNode.length > 0) {
          selectRoleNode.map((inItem) => {
            if (inItem.ID === tem.ID) {
              roleTree.checkNode(inItem, false, true);
            }
          });
        }

        const selectrow = this.component[0].list; // 表格数据
        selectrow.map((row, Index) => {
          if (row.ID === tem.ID) {
            row._checked = false;
          }
        });
        this.resultRightData.list.splice(index, 1);
        this.resultRightData.total = this.resultRightData.list.length;
        this.$emit('getResult', this.resultRightData);
        this.$emit('on-delectli', index, tem, this);
      },
      delecFun() {
        const organizationTree = $.fn.zTree.getZTreeObj('organizationTree');
        const selectNode = organizationTree.getCheckedNodes(true);
        if (selectNode && selectNode.length > 0) {
          selectNode.map((inItem) => {
            organizationTree.checkNode(inItem, false, true);
          });
        }

        const roleTree = $.fn.zTree.getZTreeObj('roleTree');
        const selectRoleNode = roleTree.getCheckedNodes(true);
        if (selectRoleNode && selectRoleNode.length > 0) {
          selectRoleNode.map((inItem) => {
            roleTree.checkNode(inItem, false, true);
          });
        }

        const selectrow = this.component[0].list; // 表格数据
        if (selectrow && selectrow.length > 0) {
          selectrow.map((row, Index) => {
            row._checked = false;
          });
        }
        this.$emit('on-deleBtn', this);
        this.resultRightData.total = 0;
        this.resultRightData.list = [];
        this.component[0].list.map((item) => {
          item._checked = false;
        });
        this.component[0].list = this.component[0].list.concat([]);
        this.$emit('getResult', this.resultRightData);
      },
      // 查找用户信息
      findUser(param) {
        this.tableLoading = true;
        network.post('/jflow/p/c/identity/user/list', param).then((res) => {
          this.tableLoading = false;
          const data = res.data;
          if (data.code === 0) {
            if (data.data) {
              this.transferTbody(data.data);
            }
            if (data.datas) {
              this.transferTbody(data.datas);
            }
          }
        });
      },
      // 表格体数据转化
      transferTbody(data) {
        this.component[0].total = data.totalRowCount;
        this.component[0].pageOptions = data.selectrange;
        this.component[0].list = [];
        data.row.map((item) => {
          const tem = {};
          let temval = {};
          Object.keys(item).map((inner) => {
            tem[inner] = item[inner].val;
          });
          temval = Object.assign({}, tem);
          this.component[0].list.push(tem);
        });
      },


      // 获取树数据
      async getTreeData(item) {
        this.treeLoading = true;
        let records = [];
        await network.post('/jflow/p/c/identity/org/treeload', {
          ID: item ? item.ID : null
        }).then((res) => {
          this.treeLoading = false;
          if (res.data.resultCode === 0) {
            res.data.data.records.map((item) => {
              if (this.asyncTree) {
                item.children ? item.isParent = true : item.isParent = false;
                item.children = [];
              }
              return item;
            });
            records = res.data.data.records;
            if (!item) {
              this.treeData = res.data.data.records;
            }
          }
        });
        return records;
      },
      // 组织树的模糊搜索
      organizationSearch() {
        fuzzySearch('organizationTree', this.tree.search, null, true);
      },
      // 获取角色数据
      async getRoleData(item) {
        this.roleLoading = true;
        let records = [];

        const zTree = $.fn.zTree.getZTreeObj('organizationTree');
        const arr = zTree.getCheckedNodes(true).filter(item => !item.getCheckStatus().half).map(item => item.ID);
        await network.post('/jflow/p/c/identity/groups/treeload', {
          horgIds: arr.join(','),
          roleName: this.role.search,
          ID: item ? item.ID : null
        }).then((res) => {
          this.roleLoading = false;
          if (res.data.resultCode === 0) {
            res.data.data.records.map((item) => {
              if (this.asyncTree) {
                item.children ? item.isParent = true : item.isParent = false;
                item.children = [];
              }
              return item;
            });
            records = res.data.data.records;
            if (!item) {
              this.roleData = res.data.data.records;
            }

            if (this.role.search) {
              this.roleSearch();
            }
          }
        });
        if (item) {
          return records;
        }
      },
      // 角色树检索
      roleSearch() {
        if (this.role.search) {
          fuzzySearch('roleTree', this.role.search, null, true);
        } else {
          this.getRoleData();
        }
      }
    },
    mounted() {
      // 加载组织树
      this.component[0].pageNum = 1;
      this.getTreeData();

      // 获取角色数据
      if (this.isUse && this.roleSwitch) {
        this.getRoleData();
      }
    
      if (this.resultData.list) {
        this.resultRightData = this.deepCopy(this.resultData);
      }

      // 获取人员信息
      this.findUser({});
    },
    beforeDestroy() {
      if (this.selectRow.length > 0) {
        this.selectRow = [];
      }
      if (Object.keys(this.selectDatas).length > 0) {
        this.selectDatas = {};
      }
      if (this.table.search) {
        this.table.search = '';
      }
    }
  };
</script>
<style lang="less">

.burgeon-tree-arrow-open i:after{
  left: 6px;
  height: 19px;
  top: 11px;
}

.MutipleSelectPop {
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

    .label{
      line-height: 20px;
      border-bottom: 1px solid #ccc;
      margin-bottom: 10px;
    }
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
    //box-shadow: 2px -2px 9px @shadow-color;
    padding: 10px;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-direction: column;
    flex-direction: column;

    .label{
      line-height: 20px;
      border-bottom: 1px solid #ccc;
      margin-bottom: 10px;
    }
    .dialog_p10 {
      padding: 10px 0;
    }
    .dialog_center_top {
      display: flex;
      line-height: 32px;
      vertical-align: middle;
      box-sizing: border-box;
      .dialog_center_top_fix {
        width: 100%;
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
