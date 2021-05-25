
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
      <Button @click="back">
        返回
      </Button>
    </div>
    <div class="content">
      <div class="contentLeft">
        <Input
                placeholder="请输入用户名"
                clearable
                @on-change="searchInputChange"
                icon="ios-search"
        >
        <span slot="prepend">检索</span>
        </Input>
        <div class="menuContainer">
          <Tree
                  ref="menuTree"
                  :data="menuTreeData"
                  :query="menuTreeQuery"
                  @on-select-change="menuTreeChange"
          />
        </div>
        <!--<ul class="menuContainer">-->
        <!--<li-->
        <!--v-for="(item, index) in menuList"-->
        <!--:key="index"-->
        <!--class="menuList"-->
        <!--:class="index === menuHighlightIndex? 'menuHighlight':''"-->
        <!--@click="menuClick(index, item)"-->
        <!--&gt;-->
        <!--{{ item.NAME }}-->
        <!--</li>-->
        <!--</ul>-->
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
                      :index="tableDefaultSelectedRowIndex"
                      highlight-row
                      :height="true"
                      :data="tableData"
                      @on-row-click="tableRowClick"
              />
            </div>
          </div>
          <div class="bottom-part">
            <div class="bottom-table">
              <Table
                      class="table"
                      highlight-row
                      :height="true"
                      :data="extendTableData"
                      :columns="columnsBottom"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <Modal
            v-model="copyPermission"
            closable
            :width="420"
            mask
            footer-hide
            title="复制权限"
    >
      <div class="modalContent">
        <div class="itemContent">
          <div class="labelContent">
            <div class="labelTip">*</div>
            <div>原角色:</div>
          </div>
          <DropDownSelectFilter class="itemCom"
                                :totalRowCount="totalRowCount"
                                :pageSize="dropPageSize"
                                :AutoData="singleAutoData"
                                :columnsKey="['NAME']"
                                :hidecolumns="['ID']"
                                :defaultSelected="singleDefaultSelected"
                                @on-fkrp-selected="singleDropSelected"
                                @on-page-change="singleDropPageChange"
                                @on-popper-hide="singlePopperHide"
                                @on-clear="singleDropClear"
                                @on-input-value-change="singleInputChange"
                                :data="singleDropDownSelectFilterData">
          </DropDownSelectFilter>
        </div>
        <div class="itemContent">
          <div class="labelContent">
            <div class="labelTip">*</div>
            <div>目的角色:</div>
          </div>
          <DropDownSelectFilter :single="false"
                                class="itemCom"
                                :totalRowCount="totalRowCount"
                                :pageSize="dropPageSize"
                                :columnsKey="['NAME']"
                                :hidecolumns="['ID']"
                                :defaultSelected="multipleDefaultSelected"
                                :AutoData="multipleAutoData"
                                @on-fkrp-selected="multipleDropSelected"
                                @on-page-change="multipleDropPageChange"
                                @on-popper-hide="multiplePopperHide"
                                @on-clear="multipleDropClear"
                                @on-input-value-change="multipleInputChange"
                                :data="multipleDropDownSelectFilterData">
          </DropDownSelectFilter>
        </div>
        <div class="itemContent">
          <div class="labelContent">
            <div class="labelTip">*</div>
            <div>复制方式:</div>
          </div>
          <Select v-model="copyType" class="itemCom" placeholder="请选择复制方式">
            <Option value="cover">覆盖原有权限</Option>
            <Option value="copy">保留原有权限</Option>
          </Select>
        </div>
        <div class="modalButton">
          <Button
                  type="fcdefault"
                  class="Button"
                  @click="modalConfirm"
          >
            确定
          </Button>
          <Button
                  type="fcdefault"
                  class="Button"
                  @click="modalCancel"
          >
            取消
          </Button>
        </div>
      </div>
    </Modal>
    <Spin
            v-show="spinShow"
            fix
    >
      <Icon
              type="ios-loading"
              size="48"
              class="demo-spin-icon-load"
      />
      <div>Loading</div>
    </Spin>
  </div>
</template>

<script>
  /* eslint-disable arrow-parens,no-lonely-if,no-empty */
  // import network, { urlSearchParams } from '../../__utils__/network';
  import { Version } from '../../constants/global';

  const functionPowerActions = () => require(`../../__config__/actions/version_${Version()}/functionPower.actions.js`);


  export default {
    data() {
      return {
        spinShow: false, // loading是否显示

        copyPermission: false, // 复制权限弹框
        copyType: '', // 复制权限弹框  复制方式
        singlePermissionId: null, // 复制权限外键单选id
        multiplePermissionId: null, // 复制权限外键多选id
        backupsDropData: [], // 备份复制权限外键数据
        singleDropDownSelectFilterData: {}, // 复制权限外键单选数据
        singleAutoData: [], // 复制权限外键单选模糊搜索数据
        singleDefaultSelected: [], // 复制权限单选默认数据
        multipleDefaultSelected: [], // 复制权限多选默认数据
        multipleDropDownSelectFilterData: {}, // 复制权限外键多选数据
        multipleAutoData: [], // 复制权限外键多选模糊搜索数据
        totalRowCount: 0, // 复制权限外键数据的totalRowCount
        dropPageSize: 10, // 复制权限外键数据的pageSize

        buttonsData: [], // 按钮数据
        menuHighlightIndex: 0, // 菜单高亮的index
        menuList: [], // 菜单数据
        groupId: '', // 菜单id
        newGroupId: '', // 切换菜单时，当前切换的id

        menuTreeData: [], // 菜单树数据
        menuTreeQuery: '', // 菜单树检索的值

        treeData: [], // 树数据
        adSubsystemId: '', // 树节点ID
        adTableCateId: null, // 树子节点ID
        newAdSubsystemId: '', // 树节点ID
        newAdTableCateId: null, // 树子节点ID

        tableDefaultSelectedRowIndex: 0, // 表格默认选中的行的index
        tableData: [], // 表格数据
        backupsTableData: [], // 备份表格数据
        tableSaveData: [], // 表格修改后要保存的数据
        columns: [
          {
            title: '功能',
            key: 'description'
          },
          {
            key: 'see',
            seeValue: false,
            render: (h, params) => h('div', [
              h('Checkbox', {
                style: {},
                props: {
                  disabled: params.row.seeDisabled,
                  value: params.row.seeValue,
                },
                // nativeOn: {
                //   click: (e) => {
                //     e.stopPropagation();
                //   }
                // },
                on: {
                  'on-change': (currentValue) => {
                    this.rowCheckboxChange(currentValue, params);
                  }
                }

              })
            ]),
            renderHeader: (h, params) => {
              return h('div', [
                h('Checkbox', {
                  style: {},
                  attrs: {
                    dataChecked: params.column.seeValue
                  },
                  props: {
                    value: params.column.seeValue
                  },
                  on: {
                    'on-change': (currentValue) => this.tabthCheckboxChange(currentValue, params)
                  }
                }),
                h('Span', '查看')
              ]);
            },
          },
          {
            key: 'edit',
            editValue: false,
            render: (h, params) => h('div', [
              h('Checkbox', {
                style: {},
                props: {
                  disabled: params.row.editDisabled,
                  value: params.row.editValue,
                },
                // nativeOn: {
                //   click: (e) => {
                //     e.stopPropagation();
                //   }
                // },
                on: {
                  'on-change': (currentValue) => this.rowCheckboxChange(currentValue, params)
                }
              })
            ]),
            renderHeader: (h, params) => h('div', [
              h('Checkbox', {
                style: {},
                props: {
                  value: params.column.editValue
                },
                on: {
                  'on-change': (currentValue) => this.tabthCheckboxChange(currentValue, params)
                }
              }),
              h('Span', '编辑')
            ]),
          },
          {
            key: 'delete',
            deleteValue: false,
            render: (h, params) => h('div', [
              h('Checkbox', {
                style: {},
                props: {
                  disabled: params.row.deleteDisabled,
                  value: params.row.deleteValue,
                },
                // nativeOn: {
                //   click: (e) => {
                //     e.stopPropagation();
                //   }
                // },
                on: {
                  'on-change': (currentValue) => this.rowCheckboxChange(currentValue, params)
                }
              })
            ]),
            renderHeader: (h, params) => h('div', [
              h('Checkbox', {
                style: {},
                props: {
                  value: params.column.deleteValue
                },
                on: {
                  'on-change': (currentValue) => this.tabthCheckboxChange(currentValue, params)
                }
              }),
              h('Span', '删除')
            ]),
          },
          {
            key: 'toVoid',
            toVoidValue: false,
            render: (h, params) => h('div', [
              h('Checkbox', {
                style: {},
                props: {
                  disabled: params.row.toVoidDisabled,
                  value: params.row.toVoidValue,
                },
                // nativeOn: {
                //   click: (e) => {
                //     e.stopPropagation();
                //   }
                // },
                on: {
                  'on-change': (currentValue) => this.rowCheckboxChange(currentValue, params)
                }
              })
            ]),
            renderHeader: (h, params) => h('div', [
              h('Checkbox', {
                style: {},
                props: {
                  value: params.column.toVoidValue
                },
                on: {
                  'on-change': (currentValue) => this.tabthCheckboxChange(currentValue, params)
                }
              }),
              h('Span', '作废')
            ]),
          },
          {
            key: 'commit',
            commitValue: false,
            render: (h, params) => h('div', [
              h('Checkbox', {
                style: {},
                props: {
                  disabled: params.row.commitDisabled,
                  value: params.row.commitValue,
                },
                // nativeOn: {
                //   click: (e) => {
                //     e.stopPropagation();
                //   }
                // },
                on: {
                  'on-change': (currentValue) => this.rowCheckboxChange(currentValue, params)
                }
              })
            ]),
            renderHeader: (h, params) => h('div', [
              h('Checkbox', {
                style: {},
                props: {
                  value: params.column.commitValue
                },
                on: {
                  'on-change': (currentValue) => this.tabthCheckboxChange(currentValue, params)
                }
              }),
              h('Span', '提交')
            ]),
          },
          {
            key: 'unCommit',
            unCommitValue: false,
            render: (h, params) => h('div', [
              h('Checkbox', {
                style: {},
                props: {
                  disabled: params.row.unCommitDisabled,
                  value: params.row.unCommitValue,
                },
                // nativeOn: {
                //   click: (e) => {
                //     e.stopPropagation();
                //   }
                // },
                on: {
                  'on-change': (currentValue) => this.rowCheckboxChange(currentValue, params)
                }
              })
            ]),
            renderHeader: (h, params) => h('div', [
              h('Checkbox', {
                style: {},
                props: {
                  value: params.column.unCommitValue
                },
                on: {
                  'on-change': (currentValue) => this.tabthCheckboxChange(currentValue, params)
                }
              }),
              h('Span', '反提交')
            ]),
          },
          {
            key: 'export',
            exportValue: false,
            render: (h, params) => h('div', [
              h('Checkbox', {
                style: {},
                props: {
                  disabled: params.row.exportDisabled,
                  value: params.row.exportValue,
                },
                // nativeOn: {
                //   click: (e) => {
                //     e.stopPropagation();
                //   }
                // },
                on: {
                  'on-change': (currentValue) => this.rowCheckboxChange(currentValue, params)
                }
              })
            ]),
            renderHeader: (h, params) => h('div', [
              h('Checkbox', {
                style: {},
                props: {
                  value: params.column.exportValue
                },
                on: {
                  'on-change': (currentValue) => this.tabthCheckboxChange(currentValue, params)
                }
              }),
              h('Span', '导出')
            ]),
          },
          {
            key: 'print',
            printValue: false,
            render: (h, params) => h('div', [
              h('Checkbox', {
                style: {},
                props: {
                  disabled: params.row.printDisabled,
                  value: params.row.printValue,
                },
                // nativeOn: {
                //   click: (e) => {
                //     e.stopPropagation();
                //   }
                // },
                on: {
                  'on-change': (currentValue) => this.rowCheckboxChange(currentValue, params)
                }
              })
            ]),
            renderHeader: (h, params) => h('div', [
              h('Checkbox', {
                style: {},
                props: {
                  value: params.column.printValue
                },
                on: {
                  'on-change': (currentValue) => this.tabthCheckboxChange(currentValue, params)
                }
              }),
              h('Span', '打印')
            ]),
          },
          {
            key: 'extend',
            extendValue: false,
            render: (h, params) => h('div', [
              h('Checkbox', {
                style: {},
                props: {
                  disabled: params.row.extendDisabled,
                  value: params.row.extendValue,
                },
                on: {
                  'on-change': (currentValue) => {
                    setTimeout(() => {
                      this.extendRowCheckboxChange(currentValue, params);
                    }, 100);
                  }
                }
              })
            ]),
            renderHeader: (h, params) => h('div', [
              h('Checkbox', {
                style: {},
                props: {
                  value: params.column.extendValue
                },
                on: {
                  'on-change': (currentValue) => this.tabthCheckboxChange(currentValue, params)
                }
              }),
              h('Span', '扩展')
            ]),
          }
        ], // 表格头部,
        extendTableData: [], // 扩展功能表格数据
        columnsBottom: [
          {
            title: '扩展功能',
            key: 'extendFunction',
            width: 200,
            render: (h, params) => h('div', [
              h('Checkbox', {
                style: {},
                props: {
                  value: params.row.permission === 128
                },
                on: {
                  'on-change': (val) => this.extendFunctionCheckboxChange(val, params)
                }
              }, params.row.description)
            ]),
          },
          {
            title: '功能',
            key: 'function',
            render: (h, params) => h('div', [
              h(params.row.children.length > 0 ? 'Checkbox' : '', {
                style: {},
                props: {
                  value: params.row.children && params.row.children.length > 0 ? params.row.children[0].permission === 128 : false
                },
                on: {
                  'on-change': (val) => this.functionCheckboxChange(val, params)
                }
              }, params.row.children.length > 0 ? params.row.children[0].description : '',)
            ]),
          }
        ], // 扩展功能表格头部
      };
    },
    components: {},
    watch: {
      copyPermission(val) {
        if (val) {
          this.getCopyPermissionData();
        } else {
          this.singleDefaultSelected = [];
          this.multipleDefaultSelected = [];
          this.singleAutoData = [];
          this.multipleAutoData = [];
          this.copyType = '';
        }
      }
    },
    computed: {
    },
    created() {
      this.refresh();
      this.getButtonData();
    },
    methods: {
      back(){
        this.$store.commit('global/tabOpen', {
          // type: 'S',
          // tableName:'T_V_OMSONLINEORDER',
          // tableId:'10883',
          url: '/SYSTEM/TABLE/V_ORDER_INFO/24503',
          back: true
        });

      },
      refresh() {
        this.spinShow = true;
        const menuPromise = new Promise((resolve, reject) => { this.getMenuData(resolve, reject); });
        const treePromise = new Promise((resolve, reject) => { this.getTreeData(resolve, reject); });
        Promise.all([menuPromise, treePromise]).then(() => {
          this.getTableData();
        });
      }, // 刷新数据
      refreshButtonClick() {
        if (this.checkNoSaveData('refresh')) {
        } else {
          this.refresh();
        }
      }, // 刷新按钮
      checkNoSaveData(type) {
        this.getSaveData();
        if (this.tableSaveData.length > 0) {
          this.$Modal.fcWarning({
            title: '提示',
            mask: true,
            showCancel: true,
            content: '是否保存修改的数据！',
            onOk: () => {
              this.savePermission(type);
            },
            onCancel: () => {
              if (type === 'refresh') {
                this.refresh();
              } else {
                this.groupId = this.newGroupId;
                this.adSubsystemId = this.newAdSubsystemId;
                this.adTableCateId = this.newAdTableCateId;
                this.getTableData();
              }
            }
          });
          return true;
        }
        return false;
      }, // 校验是否有未保存的数据
      getButtonData() {
        const params = { AD_ACTION_NAME: 'functionPermission' };
        functionPowerActions().fetchActionsInCustomizePage({
          params,
          success: (res) => {
            if (res.data.code === 0) {
              this.buttonsData = res.data.data;
              if (Version() === '1.4') {
                this.buttonsData.push({
                  webdesc: '刷新'
                });
              }
            }
          }
        });
        // network.post('/p/cs/fetchActionsInCustomizePage', { AD_ACTION_NAME: 'functionPermission' })
        //   .then((res) => {
        //     if (res.data.code === 0) {
        //       this.buttonsData = res.data.data;
        //       this.buttonsData.push({
        //         webdesc: '刷新'
        //       });
        //     }
        //   })
        //   .catch((err) => {
        //     throw err;
        //   });
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
      }, // 点击左侧的菜单
      searchInputChange(e) {
        this.menuTreeQuery = e.target.value;
      }, // 检索输入框值改变
      menuTreeChange(val, item) {
        this.newGroupId = item.ID;
        if (this.checkNoSaveData()) {
        } else {
          this.spinShow = true;
          this.groupId = item.ID;
          const treePromise = new Promise((resolve, reject) => {
            this.getTreeData(resolve, reject);
          });
          treePromise.then(() => {
            this.getTableData();
          });
        }
      }, // 左侧树点击
      getTreeData(resolve, reject) {
        functionPowerActions().getMenuTree({
          success: (res) => {
            if (res.data.code === 0) {
              resolve();
              const resData = res.data.data;
              this.restructureTreeDada(resData);
              this.treeData = [...resData];
            } else {
              reject();
            }
          }
        });
        // network.post('/p/cs/getMenuTree', urlSearchParams({}))
        //   .then((res) => {
        //     if (res.data.code === 0) {
        //       resolve();
        //       const resData = res.data.data;
        //       this.restructureTreeDada(resData);
        //       this.treeData = [...resData];
        //     } else {
        //       reject();
        //     }
        //   })
        //   .catch((err) => {
        //     reject();
        //     throw err;
        //   });
      }, // 获取树数据
      restructureTreeDada(data) {
        data.map((item) => {
          if (item.nodeType === 'ROOT') {
            item.expand = true;
            item.selected = true;
            this.adSubsystemId = item.ad_subsystem_id;
            this.adTableCateId = item.ad_tablecategory_id;
          }
          item.title = item.description;
          if (item.children && item.children.length > 0 && item.children.find(cur => cur.children.length > 0)) {
            this.restructureTreeDada(item.children);
          } else {
            delete item.children;
          }
          return item;
        });
      }, //  整合树数据
      getMenuData(resolve, reject) {
        functionPowerActions().groupTreeload({
          success: (res) => {
            if (res.data.code === 0) {
              resolve();
              this.groupId = res.data.data[0].ID;
              this.newGroupId = res.data.data[0].ID;
              this.menuTreeData = this.restructureMenuTreeData(res.data.data, true);
            } else {
              reject();
            }
          }
        });
        // network.post('/p/cs/groupTreeload', urlSearchParams({}))
        //   .then((res) => {
        //     if (res.data.code === 0) {
        //       resolve();
        //       // this.menuHighlightIndex = 0;
        //       // this.menuList = res.data.data;
        //       // this.groupId = this.menuList[this.menuHighlightIndex].ID;
        //
        //       this.groupId = res.data.data[0].ID;
        //       this.newGroupId = res.data.data[0].ID;
        //       this.menuTreeData = this.restructureMenuTreeData(res.data.data, true);
        //     } else {
        //       reject();
        //     }
        //   })
        //   .catch((err) => {
        //     reject();
        //     throw err;
        //   });
      }, // 获取菜单数据
      restructureMenuTreeData(data, first) {
        return data.map((item, idx) => {
          item.title = item.NAME;
          if (first && idx === 0) {
            item.selected = true;
          }
          if (item.children && item.children.length > 0) {
            this.restructureMenuTreeData(item.children);
          }
          return item;
        });
      }, // 重构树数据
      getTableData() {
        this.tableSaveData = []; // 清空保存的数据
        let obj = {};
        if (this.adSubsystemId) {
          obj = {
            AD_SUBSYSTEM_ID: this.adSubsystemId,
            AD_TABLECATE_ID: this.adTableCateId,
            GROUP_ID: this.groupId
          };
        } else {
          obj = {
            GROUP_ID: this.groupId
          };
        }
        functionPowerActions().queryMenuPermission({
          params: obj,
          success: (res) => {
            this.spinShow = false;
            if (res.data.code === 0) {
              if (res.data.data) {
                const resData = res.data.data;
                this.tableData = resData.reduce((acc, cur) => {
                  const disabledArr = cur.mask.split('');
                  const valueArr = this.toBin(cur.permission).split('');
                  // 查看
                  cur.seeDisabled = disabledArr[0] === '0';
                  cur.seeValue = valueArr[0] === '1';

                  // 编辑
                  cur.editDisabled = disabledArr[1] === '0';
                  cur.editValue = valueArr[1] === '1';

                  // 删除
                  cur.deleteDisabled = disabledArr[2] === '0';
                  cur.deleteValue = valueArr[2] === '1';

                  // 作废
                  cur.toVoidDisabled = disabledArr[3] === '0';
                  cur.toVoidValue = valueArr[3] === '1';

                  // 提交
                  cur.commitDisabled = disabledArr[4] === '0';
                  cur.commitValue = valueArr[4] === '1';

                  // 反提交
                  cur.unCommitDisabled = disabledArr[5] === '0';
                  cur.unCommitValue = valueArr[5] === '1';

                  // 导出
                  cur.exportDisabled = disabledArr[6] === '0';
                  cur.exportValue = valueArr[6] === '1';

                  // 打印
                  cur.printDisabled = disabledArr[7] === '0';
                  cur.printValue = valueArr[7] === '1';

                  // 扩展
                  cur.extendDisabled = cur.actionList.length === 0;
                  cur.extendValue = cur.actionList.length > 0 ? this.getExtendValue(cur.actionList) : false;

                  acc.push(cur);
                  return acc;
                }, []);
                this.getExtendTableData(this.tableData[0], 0);
                this.backupsTableData = JSON.parse(JSON.stringify(this.tableData));
                this.tableDefaultSelectedRowIndex = 0;

                this.allTabthSelected();
              } else {
                this.$Modal.fcWarning({
                  title: '提示',
                  mask: true,
                  content: res.data.message,
                });
              }
            }
          }
        });
        // network.post('/p/cs/queryMenuPermission', obj)
        //   .then((res) => {
        //     this.spinShow = false;
        //     if (res.data.code === 0) {
        //       if (res.data.data) {
        //         const resData = res.data.data;
        //         this.tableData = resData.reduce((acc, cur) => {
        //           const disabledArr = cur.mask.split('');
        //           const valueArr = this.toBin(cur.permission).split('');
        //           // 查看
        //           cur.seeDisabled = disabledArr[0] === '0';
        //           cur.seeValue = valueArr[0] === '1';
        //
        //           // 编辑
        //           cur.editDisabled = disabledArr[1] === '0';
        //           cur.editValue = valueArr[1] === '1';
        //
        //           // 删除
        //           cur.deleteDisabled = disabledArr[2] === '0';
        //           cur.deleteValue = valueArr[2] === '1';
        //
        //           // 作废
        //           cur.toVoidDisabled = disabledArr[3] === '0';
        //           cur.toVoidValue = valueArr[3] === '1';
        //
        //           // 提交
        //           cur.commitDisabled = disabledArr[4] === '0';
        //           cur.commitValue = valueArr[4] === '1';
        //
        //           // 反提交
        //           cur.unCommitDisabled = disabledArr[5] === '0';
        //           cur.unCommitValue = valueArr[5] === '1';
        //
        //           // 导出
        //           cur.exportDisabled = disabledArr[6] === '0';
        //           cur.exportValue = valueArr[6] === '1';
        //
        //           // 打印
        //           cur.printDisabled = disabledArr[7] === '0';
        //           cur.printValue = valueArr[7] === '1';
        //
        //           // 扩展
        //           cur.extendDisabled = cur.actionList.length === 0;
        //           cur.extendValue = cur.actionList.length > 0 ? this.getExtendValue(cur.actionList) : false;
        //
        //           acc.push(cur);
        //           return acc;
        //         }, []);
        //         this.getExtendTableData(this.tableData[0], 0);
        //         this.backupsTableData = JSON.parse(JSON.stringify(this.tableData));
        //         this.tableDefaultSelectedRowIndex = 0;
        //
        //         this.allTabthSelected();
        //       } else {
        //         this.$Modal.fcWarning({
        //           title: '提示',
        //           mask: true,
        //           content: res.data.message,
        //         });
        //       }
        //     }
        //   })
        //   .catch((err) => {
        //     this.spinShow = false;
        //     throw err;
        //   });
      }, // 获取表格数据
      getExtendValue(data) {
        const arr = data.reduce((acc, cur) => {
          if (cur.permission === 0) {
            acc.push(cur.permission);
          }
          if (cur.children.length > 0 && cur.children[0].permission === 0) {
            acc.push(cur.children[0].permission);
          }
          return acc;
        }, []);
        if (arr.length > 0) {
          return false;
        }
        return true;
      }, // 获取表格里的扩展是否选中
      treeChange(val, obj) {
        this.newAdSubsystemId = obj.ad_subsystem_id;
        this.newAdTableCateId = obj.ad_tablecategory_id;
        if (this.checkNoSaveData()) {
        } else {
          this.spinShow = true;
          this.adSubsystemId = obj.ad_subsystem_id;
          this.adTableCateId = obj.ad_tablecategory_id;
          this.getTableData();
        }
      }, // 树选中改变触发
      btnClick(item) {
        if (item.webdesc === '刷新') {
          this.refreshButtonClick();
        } else if (item.webdesc === '复制权限') {
          this.copyPerm();
        } else if (item.webdesc === '保存') {
          this.savePermission();
        }
      }, // 点击按钮触发
      copyPerm() {
        this.copyPermission = true;
      }, // 复制权限
      tableRowClick(row, index) {
        this.tableDefaultSelectedRowIndex = index;
        this.getExtendTableData(this.tableData[index], index);
      }, // 表格单击某一行
      getExtendTableData(row, index) {
        if (row && row.actionList && row.actionList.length > 0) {
          this.extendTableData = row.actionList.reduce((acc, cur) => {
            cur.extendIndex = index;
            acc.push(cur);
            return acc;
          }, []);
        } else {
          this.extendTableData = [];
        }
      }, // 获取扩展功能表格的数据，也就是下边表格的数据
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
          if (answer.length < 8) {
            return (Array(8).join('0') + answer).slice(-8);
          }
          return answer;
        }
        return '0';
      }, // 十进制转二进制
      modalCancel() {
        this.copyPermission = false;
      }, // 复制权限弹框取消按钮
      modalConfirm() {
        if (this.singlePermissionId === null) {
          this.$Message.warning({
            content: '请选择原角色！'
          });
          return;
        }
        if (this.multiplePermissionId === null) {
          this.$Message.warning({
            content: '请选择目的角色！'
          });
          return;
        }
        if (this.multiplePermissionId.indexOf(this.singlePermissionId.toString()) !== -1) {
          this.$Message.warning({
            content: '目的角色不能包含源角色，请重新选择！'
          });
          return;
        }
        if (this.copyType === '') {
          this.$Message.warning({
            content: '请选择复制方式！'
          });
          return;
        }
        this.copyPermission = false;
        const obj = {
          sourceid: this.singlePermissionId,
          targetids: this.multiplePermissionId,
          type: this.copyType
        };
        functionPowerActions().copyPermission({
          params: obj,
          success: (res) => {
            if (res.data.code === 0) {
              this.singlePermissionId = null;
              this.multiplePermissionId = null;
              this.copyType = '';
              this.getTableData();
              this.$Message.success({
                content: res.data.message
              });
            }
          }
        });
        // network.post('/p/cs/copyPermission', obj)
        //   .then((res) => {
        //     if (res.data.code === 0) {
        //       this.singlePermissionId = null;
        //       this.multiplePermissionId = null;
        //       this.copyType = '';
        //       this.getTableData();
        //       this.$Message.success({
        //         content: res.data.message
        //       });
        //     }
        //   })
        //   .catch((err) => {
        //     throw err;
        //   });
      }, // 复制权限弹框确定按钮
      rowCheckboxChange(currentValue, params) {
        // 选中该行数据
        params.row[`${params.column.key}Value`] = currentValue;
        this.tableData[params.index] = params.row;

        // 修改要保存的数据
        // this.editSaveData(currentValue, params);

        // 判断该列是否全选
        this.tabthCheckboxSelected(params.column, params.column.key);


        if (params.column.key === 'see') {
          // 如果该列是查看列，当取消选中的时候将该行都取消选中
          if (!currentValue) {
            this.cancelRowSelected(params);
          }
        } else {
          // 如果该列不是查看列，并且查看列的没有选中，将查看列选中
          this.selectedSeeColumn(params, currentValue);
        }
      }, // 表格单元格的checkbox改变时触发
      cancelRowSelected(params) {
        // 取消上边表格整行的选中状态
        this.columns.reduce((acc, cur, idx) => {
            if (idx > 1) {
              acc.push(cur.key);
            }
            return acc;
          }, [])
          .forEach((item) => {
            params.row[`${item}Value`] = false;
          });
        // 表头取消选中
        this.columns.forEach((item) => {
          this.tabthCheckboxSelected(item, item.key);
        });
        // 如果该行有扩展功能的表格的数据，取消下边表格的选中状态
        if (params.row.actionList && params.row.actionList.length > 0) {
          params.row.actionList.map((item) => {
            item.permission = 0;
            if (item.children && item.children.length > 0) {
              item.children.map((tem) => {
                tem.permission = 0;
                return tem;
              });
            }
            return item;
          });
          this.cancelExtendTableAllSelected();
        }
        const findIndex = this.tableData.findIndex(item => item.ad_table_id === params.row.ad_table_id);
        this.tableData[findIndex] = params.row;
      }, // 取消整行的选中
      selectedSeeColumn(params, currentValue) {
        if (currentValue) {
          this.tableData[params.index].seeValue = currentValue;
        }
        this.tabthCheckboxSelected(this.columns[1], 'see');
      }, // 选中查看列
      editSaveData(currentValue, params) {
        if (currentValue === this.backupsTableData[params.index][`${params.column.key}Value`]) {
          const findIndex = this.tableSaveData.findIndex(item => item.AD_MENU_ID === params.row.ad_menu_id);
          if (findIndex !== -1) {
            this.tableSaveData.splice(findIndex, 1);
          }
        } else {
          this.tableSaveData.push({
            AD_MENU_ID: params.row.ad_menu_id,
            DATA_SOURCE: params.row.data_source,
            ID: params.row.id,
            PERMISSION: this.getSavePermission(params.index)
          });
        }
      }, // 修改上边表格的保存数据
      getExtendTableSaveData(currentValue, row) {
        const tableObj = this.backupsTableData.find(item => item.ad_table_id === row.ad_table_id);
        if (tableObj.actionList && tableObj.actionList.length > 0) {
          const val = tableObj.actionList.find(item => item.ad_action_id === row.ad_action_id).permission === 128;
          if (currentValue === val) {
            const findIndex = this.tableSaveData.findIndex(item => item.AD_ACTION_ID === row.ad_action_id);
            if (findIndex !== -1) {
              this.tableSaveData.splice(findIndex, 1);
            }
          } else {
            this.tableSaveData.push({
              AD_ACTION_ID: row.ad_action_id,
              ID: row.id,
              PERMISSION: currentValue === true ? 1 : 0
            });
          }
        }
      }, // 获取下边表格的保存数据
      editTableExtendData(permission, row) {
        // const tableIndex = this.tableData.findIndex(item => item.ad_table_id === row.ad_table_id);
        // const tableObj = this.tableData.find(item => item.ad_table_id === row.ad_table_id);
        const tableObj = this.tableData[row.extendIndex];
        if (tableObj.actionList && tableObj.actionList.length > 0) {
          const actionListIndex = tableObj.actionList.findIndex(item => item.ad_action_id === row.ad_action_id);
          tableObj.actionList[actionListIndex].permission = permission;
          this.tableData[row.extendIndex] = tableObj;
        }
      }, // 下边表格扩展功能数据修改
      editTableDataForFunction(permission, row) {
        // const tableIndex = this.tableData.findIndex(item => item.ad_table_id === row.ad_table_id);
        // const tableObj = this.tableData.find(item => item.ad_table_id === row.ad_table_id);
        const tableObj = this.tableData[row.extendIndex];
        if (tableObj.actionList && tableObj.actionList.length > 0) {
          const actionListIndex = tableObj.actionList.findIndex(item => item.ad_action_id === row.ad_action_id);
          tableObj.actionList[actionListIndex].children[0].permission = permission;
          this.tableData[row.extendIndex] = tableObj;
        }
      }, // 下边表格功能数据修改
      getSavePermission(index) {
        const arr = this.columns.reduce((acc, cur, idx) => {
          if (idx > 0 && idx !== 9) {
            if (this.tableData[index][`${cur.key}Value`]) {
              acc.push('1');
            } else {
              acc.push('0');
            }
          }
          return acc;
        }, []);
        return arr.join('');
      }, // 获取保存数据的权限的二进制数据
      allTabthSelected() {
        this.columns.forEach((item) => {
          this.tabthCheckboxSelected(item, item.key);
          // if (item.key !== 'see') {  // 注释掉的这个代码是默认的查看列没有选中
          //   this.tabthCheckboxSelected(item, item.key);
          // }
        });
      }, // 判断所有表头是不是应该选中
      tabthCheckboxSelected(column, columnKey) {
        if (this.tableData.length > 0) {
          const disabledArr = [];
          const arr = this.tableData.reduce((acc, cur, idx) => {
            if (cur[`${columnKey}Disabled`]) {
              disabledArr.push(idx);
            }
            if (cur[`${columnKey}Disabled`] === false && cur[`${columnKey}Value`] === false) {
              acc.push(idx);
            }
            return acc;
          }, []);
          if (arr.length === 0) {
            if (disabledArr.length === this.tableData.length) {
              column[`${columnKey}Value`] = false;
            } else {
              const findIndex = this.columns.findIndex(item => item.key === columnKey);
              if (!column[`${columnKey}Value`]) {
                column[`${columnKey}Value`] = true;
                this.columns[findIndex] = column;
                // this.columns[findIndex][`${columnKey}Value`] = true;
              }
            }
          } else {
            const findIndex = this.columns.findIndex(item => item.key === columnKey);
            if (column[`${columnKey}Value`]) {
              column[`${columnKey}Value`] = false;
              this.columns[findIndex] = column;
              // this.columns[findIndex][`${columnKey}Value`] = false;
            }
          }
          this.columns = this.columns.concat([]);
        }
      }, // 判断是否将表头选中
      tabthCheckboxChange(currentValue, params) {
        // 如果点击的不是查看列，将查看列选中
        if (params.column.key !== 'see') {
          if (currentValue) {
            this.columns[1].seeValue = true;
            this.tableData.map((item) => {
              if (!item.seeDisabled) {
                item.seeValue = true;
              }
              return item;
            });
          }
          const findColumnIndex = this.columns.findIndex((item) => item.key === params.column.key);
          this.columns[findColumnIndex][`${params.column.key}Value`] = currentValue;
        }
        // 点击查看列的表头，并且是取消选中的状态
        if (params.column.key === 'see' && currentValue === false) {
          this.columns[1].seeValue = false;
          this.columns = [].concat(this.columns);
          this.cancelAllSelected();
        }

        // 点击查看列的表头，并且是选中的状态
        if (params.column.key === 'see' && currentValue === true) {
          this.columns[1].seeValue = true;
        }

        // 选中表头以及表体里的数据
        params.column[`${params.column.key}Value`] = currentValue;
        this.tableData.map((item) => {
          if (!item[`${params.column.key}Disabled`]) {
            item[`${params.column.key}Value`] = currentValue;
          }
          return item;
        });

        // 选中扩展的表头
        if (params.column.key === 'extend') {
          this.selectedExtendTabth(currentValue);
        }
      }, // 表格表头的checkbox改变时触发
      cancelAllSelected() {
        this.columns.reduce((acc, cur, idx) => {
            if (idx > 1) {
              acc.push(cur.key);
            }
            return acc;
          }, [])
          .forEach((key) => {
            // const columns = this.columns.map((item) => {
            //   if (item[`${key}Value`]) {
            //     item[`${key}Value`] = false;
            //   }
            //   return item;
            // });
            // this.columns = columns.concat([]).concat([]);
            this.tableData.map((item) => {
              item[`${key}Value`] = false;
              if (item.actionList && item.actionList.length > 0) {
                item.actionList.map((tem) => {
                  tem.permission = 0;
                  if (tem.children && tem.children.length > 0) {
                    tem.children.map((cur) => {
                      cur.permission = 0;
                      return cur;
                    });
                  }
                  return tem;
                });
              }
              return item;
            });
          });
        this.allTabthSelected();
        // 下边表格取消选中
        this.cancelExtendTableAllSelected();
      }, // 取消所有选中
      cancelExtendTableAllSelected() {
        this.extendTableData.map((item) => {
          item.permission = 0;
          if (item.children && item.children.length > 0) {
            item.children.forEach((tem) => {
              tem.permission = 0;
              return tem;
            });
          }
          return item;
        });
      }, // 取消下边表格所有选中状态
      selectedExtendTabth(currentValue) {
        this.editExtendTableData(currentValue);
        this.tableData.map((cur) => {
          if (cur.actionList && cur.actionList.length > 0) {
            cur.actionList.map((item) => {
              if (currentValue) {
                item.permission = 128;
              } else {
                item.permission = 0;
              }
              if (item.children && item.children.length > 0) {
                item.children.map((tem) => {
                  if (currentValue) {
                    tem.permission = 128;
                  } else {
                    tem.permission = 0;
                  }
                  return tem;
                });
              }
              return item;
            });
          }
          return cur;
        });
      }, // 选中扩展列表头
      extendRowCheckboxChange(currentValue, params) {
        if (params) {
          params.row[`${params.column.key}Value`] = currentValue;
          if (params.row.actionList && params.row.actionList.length > 0) {
            params.row.actionList.map((item) => {
              if (currentValue) {
                item.permission = 128;
              } else {
                item.permission = 0;
              }
              if (item.children && item.children.length > 0) {
                item.children.map((tem) => {
                  if (currentValue) {
                    tem.permission = 128;
                  } else {
                    tem.permission = 0;
                  }
                  return tem;
                });
              }
              return item;
            });
          }
          this.tableData[params.index] = params.row;
          // 判断该列是否全部选中
          this.tabthCheckboxSelected(params.column, 'extend');
        }

        // 判断下边表格选中还是不选中
        this.editExtendTableData(currentValue);

        // 将查看列选中
        this.selectedSeeColumn(params.index, currentValue);
      }, // 扩展一列的checkbox点击的时候触发
      editExtendTableData(currentValue) {
        if (this.extendTableData.length > 0) {
          this.extendTableData.map((item) => {
            if (currentValue) {
              item.permission = 128;
            } else {
              item.permission = 0;
            }
            if (item.children && item.children.length > 0) {
              item.children.map((tep) => {
                if (currentValue) {
                  tep.permission = 128;
                } else {
                  tep.permission = 0;
                }
                return tep;
              });
            }
            return item;
          });
        }
      }, // 根据传入的值判断下边的表格是否全部选中或者不选中
      extendFunctionCheckboxChange(val, params) {
        // 判断是否选中
        if (val) {
          params.row.permission = 128;
          this.editTableExtendData(128, params.row);
        } else {
          params.row.permission = 0;
          this.editTableExtendData(0, params.row);
        }
        this.extendTableData[params.index] = params.row;

        // 判断下边表格中是否全部选中，如果有没有选中的就存到数组里
        const arr = this.extendTableData.reduce((acc, cur) => {
          if (cur.permission === 0) {
            acc.push(cur.permission);
          }
          if (cur.children && cur.children.length > 0) {
            cur.children.forEach((item) => {
              if (item.permission === 0) {
                acc.push(item.permission);
              }
            });
          }
          return acc;
        }, []);
        // 如果下边表格里全部选中，将上边表格对应的扩展选中，如果没有全部选中就取消选中
        // const findIndex = this.tableData.findIndex(item => item.ad_table_id === params.row.ad_table_id);
        const findIndex = params.row.extendIndex;
        if (arr.length > 0) {
          if (findIndex > -1) {
            this.tableData[findIndex].extendValue = false;
            this.selectedSeeColumn(findIndex, false);
          }
        } else {
          if (findIndex > -1) {
            this.tableData[findIndex].extendValue = true;
            this.selectedSeeColumn(findIndex, true);
          }
        }

        // 判断扩展该列是否全选
        this.tabthCheckboxSelected(this.columns[9], 'extend');

        // 调保存修改数据的方法
        // this.getExtendTableSaveData(val, params.row);
      }, // 下边表格扩展功能的checkbox改变时触发
      functionCheckboxChange(val, params) {
        // 判断是否选中
        if (val) {
          params.row.children[0].permission = 128;
          this.editTableDataForFunction(128, params.row);
        } else {
          params.row.children[0].permission = 0;
          this.editTableDataForFunction(0, params.row);
        }
        this.extendTableData[params.index] = params.row;

        // 判断下边表格中是否全部选中，如果有没有选中的就存到数组里
        const arr = this.extendTableData.reduce((acc, cur) => {
          if (cur.permission === 0) {
            acc.push(cur.permission);
          }
          if (cur.children && cur.children.length > 0) {
            cur.children.forEach((item) => {
              if (item.permission === 0) {
                acc.push(item.permission);
              }
            });
          }
          return acc;
        }, []);
        // 如果下边表格里全部选中，将上边表格对应的扩展选中，如果没有全部选中就取消选中
        // const findIndex = this.tableData.findIndex(item => item.ad_table_id === params.row.ad_table_id);
        const findIndex = params.row.extendIndex;
        if (arr.length > 0) {
          if (findIndex > -1) {
            this.tableData[findIndex].extendValue = false;
            this.selectedSeeColumn(findIndex, false);
          }
        } else {
          if (findIndex > -1) {
            this.tableData[findIndex].extendValue = true;
            this.selectedSeeColumn(findIndex, true);
          }
        }

        // 判断扩展该列是否全选
        this.tabthCheckboxSelected(this.columns[9], 'extend');
      }, // 下边表格功能列checkbox改变时触发
      savePermission(type) {
        this.getSaveData();
        if (this.tableSaveData.length === 0) {
          this.$Message.info({
            content: '没有更改'
          });
        } else {
          const obj = {
            GROUPID: this.groupId,
            CP_C_GROUPPERM: this.tableSaveData
          };
          functionPowerActions().savePermission({
            params: obj,
            success: (res) => {
              if (res.data.code === 0) {
                if (type === 'refresh') {
                  this.refresh();
                } else {
                  this.groupId = this.newGroupId;
                  this.adSubsystemId = this.newAdSubsystemId;
                  this.adTableCateId = this.newAdTableCateId;
                  this.getTableData();
                }
                this.$Message.success({
                  content: res.data.message
                });
              }
            }
          });
          // network.post('/p/cs/savePermission', obj)
          //   .then((res) => {
          //     if (res.data.code === 0) {
          //       if (type === 'refresh') {
          //         this.refresh();
          //       } else {
          //         this.groupId = this.newGroupId;
          //         this.adSubsystemId = this.newAdSubsystemId;
          //         this.adTableCateId = this.newAdTableCateId;
          //         this.getTableData();
          //       }
          //       this.$Message.success({
          //         content: res.data.message
          //       });
          //     }
          //   })
          //   .catch((err) => {
          //     throw err;
          //   });
        }
      }, // 保存数据
      getSaveData() {
        this.tableSaveData = this.tableData.reduce((acc, cur, idx) => {
          if (cur.ad_menu_id === this.backupsTableData[idx].ad_menu_id && this.getSavePermission(idx) !== this.toBin(this.backupsTableData[idx].permission)) {
            acc.push({
              AD_MENU_ID: cur.ad_menu_id,
              DATA_SOURCE: cur.data_source,
              ID: cur.id,
              PERMISSION: this.getSavePermission(idx)
            });
          }
          if (cur.actionList && cur.actionList.length > 0) {
            cur.actionList.forEach((item, index) => {
              if (item.permission !== this.backupsTableData[idx].actionList[index].permission) {
                acc.push({
                  AD_ACTION_ID: item.ad_action_id,
                  ID: item.id,
                  PERMISSION: item.permission === 128 ? 1 : 0
                });
              }
              if (item.children && item.children.length > 0) {
                item.children.forEach((tem, temIndex) => {
                  if (tem.permission !== this.backupsTableData[idx].actionList[index].children[temIndex].permission) {
                    acc.push({
                      AD_ACTION_ID: tem.ad_action_id,
                      ID: tem.id,
                      PERMISSION: tem.permission === 128 ? 1 : 0
                    });
                  }
                });
              }
            });
          }
          return acc;
        }, []);
      }, // 获得保存的数据
      getCopyPermissionData() {
        functionPowerActions().cgroupsquery({
          params: { NAME: '' },
          success: (res) => {
            if (res.data.code === 0) {
              this.backupsDropData = res.data.data;
              this.totalRowCount = res.data.data.length;
              this.getSingleDropSelectData(1, res.data.data);
              this.getMultipleDropSelectData(1, res.data.data);
            }
          }
        });
        // network.post('/p/cs/cgroupsquery', { NAME: '' })
        //   .then((res) => {
        //     if (res.data.code === 0) {
        //       this.backupsDropData = res.data.data;
        //       this.totalRowCount = res.data.data.length;
        //       this.getSingleDropSelectData(1, res.data.data);
        //       this.getMultipleDropSelectData(1, res.data.data);
        //     }
        //   })
        //   .catch((err) => {
        //     throw err;
        //   });
      }, // 获取复制权限外键的数据
      getSingleDropSelectData(pageValue, data) {
        const start = (pageValue - 1) * this.dropPageSize;
        const tabth = [
          {
            colname: 'ID',
            name: 'ID',
            isak: false
          },
          {
            colname: 'NAME',
            name: '角色',
            isak: true
          }
        ];
        const row = data.slice(start, start + this.dropPageSize)
          .reduce((acc, cur) => {
            const obj = {
              ID: {
                val: cur.ID,
              },
              NAME: {
                val: cur.NAME
              }
            };
            acc.push(obj);
            return acc;
          }, []);
        this.singleDropDownSelectFilterData = {
          start,
          tabth,
          row
        };
      }, // 整合复制权限外键单选数据
      getMultipleDropSelectData(pageValue, data) {
        const start = (pageValue - 1) * this.dropPageSize;
        const tabth = [
          {
            colname: 'ID',
            name: 'ID',
            isak: false
          },
          {
            colname: 'NAME',
            name: '角色',
            isak: true
          }
        ];
        const row = data.slice(start, start + this.dropPageSize)
          .reduce((acc, cur) => {
            const obj = {
              ID: {
                val: cur.ID,
              },
              NAME: {
                val: cur.NAME
              }
            };
            acc.push(obj);
            return acc;
          }, []);
        this.multipleDropDownSelectFilterData = {
          start,
          tabth,
          row
        };
      }, // 整合复制权限外键多选数据
      singleDropSelected(val) {
        this.singlePermissionId = val[0].ID;
      }, // 外键单选，选中触发
      singleDropPageChange(val) {
        this.getSingleDropSelectData(val, this.backupsDropData);
      }, // 外键单选分页改变触发
      singlePopperHide() {
        this.getSingleDropSelectData(1, this.backupsDropData);
      }, // 外键单选popper隐藏时触发
      singleDropClear() {
        this.singlePermissionId = null;
      }, // 单选清空时触发
      singleInputChange(val) {
        if (val) {
          this.singleAutoData = this.backupsDropData.reduce((acc, cur) => {
            if (cur.NAME && cur.NAME.indexOf(val) !== -1) {
              acc.push({ ID: cur.ID, NAME: cur.NAME });
            }
            return acc;
          }, []);
        } else {
          this.singleAutoData = [];
        }
      }, // 外键单选输入框值改变时触发
      multipleDropSelected(val) {
        this.multiplePermissionId = val.reduce((acc, cur) => {
          acc.push(cur.ID);
          return acc;
        }, []).join(',');
      }, // 外键多选，选中触发
      multipleDropPageChange(val) {
        this.getMultipleDropSelectData(val, this.backupsDropData);
      }, // 外键多选分页改变触发
      multiplePopperHide() {
        this.getMultipleDropSelectData(1, this.backupsDropData);
      }, // 外键多选popper隐藏时触发
      multipleDropClear() {
        this.multiplePermissionId = null;
      }, // 多选清空时触发
      multipleInputChange(val) {
        if (val) {
          this.multipleAutoData = this.backupsDropData.reduce((acc, cur) => {
            if (cur.NAME && cur.NAME.indexOf(val) !== -1) {
              acc.push({ ID: cur.ID, NAME: cur.NAME });
            }
            return acc;
          }, []);
        } else {
          this.multipleAutoData = [];
        }
      }, // 复制权限外键多选输入时触发
    }
  };
</script>

<style lang="less">
  .ark-spin-fix{
    z-index: 999;
    .demo-spin-icon-load{
      animation: ani-demo-spin 1s linear infinite;
    }
    @keyframes ani-demo-spin {
      from { transform: rotate(0deg);}
      50%  { transform: rotate(180deg);}
      to   { transform: rotate(360deg);}
    }
  }

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
        min-width: 0;
        padding: 0 8px;
        border-radius:2px;
        font-size:12px;
        font-weight:400;
        box-sizing: border-box;
        margin-right: 10px;
        height: 22px;
        span {
          vertical-align: initial;
        }
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
        border: solid 1px #d8d8d8;
        border-radius: 6px;
        margin-right: 10px;
        display: flex;
        flex-direction: column;
        .menuContainer {
          flex: 1;
          margin-top: 10px;
          overflow-y: auto;

          .ark-tree-title {
            width: 100%;
            font-size: 12px;
            line-height: 26px;
          }
          .ark-tree-title-selected, .ark-tree-title-selected:hover {
            background-color: rgb(196, 226, 255);
          }

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
        border: solid 1px #d8d8d8;
        border-radius: 6px;
        display: flex;
        width: 100%;
        .left-tree {
          width: 200px;
          padding: 10px;
          border-right: solid 1px #d8d8d8;
          overflow: auto;
          .ark-tree-title-selected, .ark-tree-title-selected:hover {
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
            border-bottom: solid 1px #d8d8d8;
            .upper-table {
              height: 100%;
              .table {
                border: 0;
                tbody tr.ark-table-row-hover td{
                  background-color: #ecf0f1;
                }
                .ark-table-row-highlight {
                  background-color: rgb(196, 226, 255);
                }
              }
            }
          }
          .bottom-part {
            height: 40%;
            padding: 10px;
            .bottom-table {
              height: 100%;
              .table {
                height: 100%;
                border: 0;
              }
            }
          }
        }
      }
    }
  }
  .modalContent {
    .itemContent {
      display: flex;
      margin-bottom: 10px;
      overflow: hidden;
      .labelContent {
        margin-right: 4px;
        width: 100px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .labelTip {
          font-size: 16px;
          height: 10px;
          color: red;
          margin-right: 4px;
        }
      }
      .itemCom {
        width: 220px;
      }
    }
    .modalButton {
      width: 324px;
      display: flex;
      justify-content: flex-end;
      .Button {
        margin-left: 10px;
        min-width: 0;
        padding: 0 8px;
        border-radius:2px;
        font-size:12px;
        font-weight:400;
        box-sizing: border-box;
        height: 22px;
        span {
          vertical-align: initial;
        }
      }
    }
  }
</style>
