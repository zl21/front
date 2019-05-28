<template>
  <div class="singleObjectButton">
    <ButtonGroup
      :data-array="dataArray"
      class="buttonGroup"
      @buttonClick="buttonClick"
    />
    <Dialog
      ref="dialogRef"
      :title="dialogConfig.title"
      :mask="dialogConfig.mask"
      :content-text="dialogConfig.contentText"
      :footer-hide="dialogConfig.footerHide"
      :confirm="dialogConfig.confirm"
    />
    <!-- 动作定义弹框定制界面 -->
    <Modal
      v-model="actionDialog.show"
      :mask="true"
      :title="actionDialog.title"
    >
      <keep-alive
        include
        exclude
      >
        <component :is="dialogComponentName" />
      </keep-alive>
    </Modal>
  </div>
</template>

<script>

  import Vue from 'vue';
  import { mapMutations, mapState } from 'vuex';
  import buttonmap from '../assets/js/buttonmap';
  import ButtonGroup from './ButtonComponent';
  import moduleName from '../__utils__/getModuleName';
  import router from '../__config__/router.config';
  import Dialog from './Dialog.vue';
  import CustomizeModule from '../__config__/customizeDialog.config';
  import { KEEP_SAVE_ITEM_TABLE_MANDATORY, STANDARD_TABLE_COMPONENT_PREFIX } from '../constants/global';

  const customizeModules = {};
  Object.keys(CustomizeModule).forEach((key) => {
    customizeModules[key.toUpperCase()] = CustomizeModule[key];
  });
  export default {
    data() {
      return {
        dialogComponentName: null,
        actionDialog: {
          show: false,
          title: ''
        }, // 按钮动作定义弹框类型定制界面
        dialogConfig: {
          title: '提示',
          mask: true,
          footerHide: false,
          contentText: '',
          confirm: () => {
          }
        }, // 弹框配置信息
        dataArray: {
          refresh: true, // 显示刷新
          back: true, // 显示返回
          printValue: false, // 是否显示打印
          actionCollection: false,
          collectiImg: false, // 是否收藏
          waListButtonsConfig: {// 自定义按钮
            waListButtons: []
          },
          buttonGroupShowConfig: {// 标准按钮
            buttonGroupShow: []
          },
          btnclick: (type, item) => {
            const self = this;
            return self.buttonClick(type, item);
          }
        },
        tableName: '', // 主表表名
        tableId: '', // 主表ID
        itemId: '', // 子表ID
        currentParameter: {},
        itemCurrentParameter: {},
        buttonShowType: '', // 判断按钮显示条件
        dynamic: {
          name: '保存',
          icon: '',
          defbutton: 'N',
          action: '',
        }, // 保存url
        defaultForCopyData: {}// 保存复制操作时所需要的当前页面的数据
      };
    },
    name: 'SingleObjectButtons',
    components: {
      ButtonGroup,
      Dialog
    },
    watch: {
      tabcmd: {
        handler(val, oldval) {
          if (JSON.stringify(val) !== JSON.stringify(oldval)) {
            this.dataArray.buttonGroupShowConfig.buttonGroupShow = [];
            setTimeout(() => {
              this.buttonsReorganization(val);
            }, 300);
          }
        },
        deep: true
      },
      tabwebact: {
        handler(val) {
          this.dataArray.waListButtonsConfig.waListButtons = [];
          if (this.objectType === 'horizontal') { // 横向布局
            if (this.itemId === 'New') { // 新增按钮渲染逻辑
            } else { // 编辑按钮渲染逻辑
              this.waListButtons(val);
            }
          } else if (this.objectType === 'vertical') {
            if (this.itemId === 'New') { // 编辑按钮渲染逻辑
            } else { // 新增按钮渲染逻辑
              this.waListButtons(val);
            }
          }
        },
        deep: true
      },
    },
    computed: {
      ...mapState('global', {
        activeTab: ({ activeTab }) => activeTab,
        keepAliveLists: ({ keepAliveLists }) => keepAliveLists,
      }),
    },
    props: {
      tabcmd: {
        type: Object,
        default: () => ({})
      },
      tabwebact: {
        type: Object,
        default: () => ({})
      },
      objectType: {
        type: String,
        default: ''
      },
      isreftabs: {
        type: Boolean,
        // default: false
      }, // 是否存在子表
      itemName: {
        type: String,
        default: ''
      },
      itemNameGroup: {
        type: Array,
        default: () => ([])
      },
      itemInfo: {// 当前子表信息
        type: Object,
        default: () => ({})
      },
    },
    methods: {
      ...mapMutations('global', ['tabHref', 'decreasekeepAliveLists']),
      buttonsReorganization(buttonData) { // 根据页面不同执行按钮渲染逻辑
        if (Object.values(buttonData).length > 0) {
          if (this.objectType === 'horizontal') { // 横向布局
            if (this.itemId === 'New') { // 编辑按钮渲染逻辑   根据copy来控制复制按钮操作后按钮的显示条件
              this.addButtonShow(buttonData);
            } else { // 新增按钮渲染逻辑
              this.getbuttonGroupData(buttonData);
            }
          } else if (this.objectType === 'vertical') {
            if (this.itemId === 'New') { // 编辑按钮渲染逻辑
              this.addButtonShow(buttonData);
            } else { // 新增按钮渲染逻辑
              this.getbuttonGroupData(buttonData);
            }
          }
          if (this.copy === true) { 
            this.dataArray.refresh = false;
            this.addButtonShow(buttonData);
            // setTimeout(() => {
            //   this.changeCopy(false);
            // }, 5000);
          }
        }
      },
      buttonClick(type, obj) { // 根据按钮类型不同执行的事件逻辑
        if (type === 'fix') {
          this.objectTabAction(obj);
        } else if (type === 'custom') {
          this.webactionClick(obj);
        } else if (type === 'Collection') {
          this.clickButtonsCollect();
        } else if (type === 'back') {
          this.clickButtonsBack();
        } else if (type === 'refresh') {
          this.clickButtonsRefresh();
        } else {
          this.searchClickData();
        }
      },
      clickButtonsRefresh() { // 按钮刷新事件
        this.updateChangeData({ tableName: this.tableName, value: {} });
        const message = '刷新成功';
        this.upData(`${message}`);
      },
      upData(message) { // 页面刷新判断逻辑
        const { tablename, refcolid, tabrelation } = this.itemInfo;
        if (this.objectType === 'horizontal') { // 横向布局
          if (this.tabCurrentIndex === 0) { // 主表
            this.getObjectTabForMainTable({ table: this.tableName, objid: this.itemId });
          } else if (tabrelation === '1:m') { // 子表
            this.getInputForitemForChildTableForm({ table: tablename });
            this.getObjectTabForChildTableButtons({ maintable: this.tableName, table: tablename, objid: this.itemId });
            this.getObjectTableItemForTableData({
              table: tablename, objid: this.itemId, refcolid, searchdata: { column_include_uicontroller: true }
            });
          } else if (tabrelation === '1:1') {
            this.getObjectTabForChildTableButtons({ maintable: this.tableName, table: tablename, objid: this.itemId });
            this.getItemObjForChildTableForm({ table: tablename, objid: this.itemId, refcolid });
          }
        } else { // 纵向布局
          this.getObjectForMainTableForm({ table: this.tableName, objid: this.itemId });
          this.getObjectTabForMainTable({ table: this.tableName, objid: this.itemId });
        }
        this.$Message.success(message);
      },
      objectTabAction(obj) { // 按钮执行事件判断逻辑
        switch (obj.eName) {
        case 'actionADD': // 新增
          this.objectAdd(obj);
          break;
        case 'actionMODIFY': // 保存
          this.objectSave(obj);
          break;
        case 'actionEXPORT': // 导出
          this.objectEXPORT();
          break;
        case 'actionGROUPSUBMIT': // 批量提交
          this.objectGROUPSUBMIT();
          break;
        case 'actionDELETE': // 删除
          this.objectTryDelete(obj);
          break;
        case 'actionSUBMIT': // 提交
          this.objectTrySubmit();
          break;
        case 'actionUNSUBMIT': // 取消提交
          this.objectTryUnSubmit();
          break;
        case 'actionVOID': // 作废
          this.objectTryVoid();
          break;
        case 'actionCANCOPY': // 复制
          this.copyFlag = true;
          this.objectCopy();

          break;
        case 'actionCopyBill':
          this.objectCopyBill();
          break;
        default:
          break;
        }
      },
      webactionClick(tab) { // 动作定义执行
        this.activeTabAction = tab;
        // console.log('action',tab)
        switch (tab.vuedisplay) {
        case 'native': // 跳转url
          location.href = tab.action;
          break;
        case 'slient':
          this.objTabActionSlient(tab);
          break;
        case 'dialog':
          this.objTabActionDialog(tab);
          break;
        case 'navbar':
          this.objTabActionNavbar(tab);
          break;
        default:
          break;
        }
      },
      objTabActionDialog(tab) { // 动作定义弹出框
        // debugger;
        this.actionDialog.show = true;
        this.actionDialog.title = tab.webdesc;
        if (tab.action.indexOf('?') >= 0) {
          this.dialogComponent = this.getCustomizeComponent(tab.action.split('/')[0]);
        } else {
          const url = tab.action;
          const index = url.lastIndexOf('\/');
          const filePath = url.substring(index + 1, url.length);
          Vue.component(filePath, CustomizeModule[filePath].omponentName);
          this.dialogComponentName = filePath;
        }
      },
      objectEXPORT() { // 导出功能

      },
      objectCopy() { // 按钮复制功能
        const id = 'New';// 修改路由,复制操作时路由为新增
        const label = `${this.activeTab.label.replace('编辑', '新增')}`;
       
        if (this.objectType === 'horizontal') { // 横向布局
          if (this.tabCurrentIndex === 0) { // 主表
            // this.savaCopyData(this.tableName);// 整合默认数据和修改过后的数据
            // const defaultCopyValue = this.updateData[this.tableName].default;
            // const changeDataCopyValue = this.updateData[this.tableName].changeData;
            // this.defaultForCopyDatas = Object.assign(defaultCopyValue, changeDataCopyValue);// 整合默认数据和修改过后的数据
            let formData = {};
            this.tabPanel.forEach((item) => {
              if (item.tablename === this.tableName) {
                formData = item.componentAttribute.panelData;
              }
            });
            this.defaultForCopyData = { ...formData };
            // this.getObjectTabForMainTable({ table: this.tableName, objid: '-1', type: 'copy' });
            // this.getObjectForMainTableForm({ table: this.tableName, objid: '-1', type: 'copy' });
            this.updateFormDataForRefshow();
            const type = 'tableDetailHorizontal';
            this.tabHref({
              type,
              tableName: this.tableName,
              tableId: this.tableId,
              label,
              id
            });
            // this.changeFormDataForCopy({ defaultForCopyData: this.defaultForCopyData, tableName: this.tableName });
            setTimeout(() => {
              // this.$store.commit(`${moduleName()}/changeFormDataForCopy`, { defaultForCopyDatas: this.defaultForCopyDatas, tableName: this.tableName });// 保存修改过的值
              this.$store.commit(`${moduleName()}/copyDefaultData`, { tableName: this.tableName });
              const copyData = { ...formData };
              this.$store.commit(`${moduleName()}/savaCopyData`, copyData);
              this.$store.commit(`${moduleName()}/updateCopyData`, this.tableName);
            }, 2000);
          }
        } else { // 纵向布局
          // this.getObjectForMainTableForm({ table: this.tableName, objid: '-1', });
          // this.getObjectTabForMainTable({ table: this.tableName, objid: '-1', type: 'copy' });
          // this.savaCopyData(this.tableName);// 整合默认数据和修改过后的数据
          // const defaultCopyValue = this.updateData[this.tableName].default;
          // const changeDataCopyValue = this.updateData[this.tableName].changeData;
          // this.defaultForCopyDatas = Object.assign(defaultCopyValue, changeDataCopyValue);// 整合默认数据和修改过后的数据
          const copyData = { ...this.mainFormInfo.formData };

          const type = 'tableDetailVertical';
          this.tabHref({
            type,
            tableName: this.tableName,
            tableId: this.tableId,
            label,
            id
          });
          setTimeout(() => {
            // this.$store.commit(`${moduleName()}/changeFormDataForCopy`, { defaultForCopyDatas: this.defaultForCopyDatas, tableName: this.tableName });// 保存修改过的值
            this.$store.commit(`${moduleName()}/copyDefaultData`, { tableName: this.tableName });
            this.$store.commit(`${moduleName()}/savaCopyData`, copyData);
            this.$store.commit(`${moduleName()}/updateCopyData`, this.tableName);
          }, 2000);
        }
        this.changeCopy(true);
      },
      clickButtonsBack() { // 按钮返回事件
        const { tableId, tableName } = this.$route.params;
        const param = {
          tableId,
          tableName,
          back: true,
        };

        this.$store.commit('global/tabHref', param);
        // const a = `${STANDARD_TABLE_COMPONENT_PREFIX}.${this.tableName}.${this.tableId}`;
      },
      getbuttonGroupData(tabcmd) { // 按钮渲染逻辑
        const tabcmdData = tabcmd;
        if (tabcmdData.cmds) {
          tabcmdData.cmds.forEach((item, index) => {
            if (item !== 'actionEXPORT') {
              if (tabcmdData.prem[index]) {
                const type = item.split('action');
                const str = `CMD_${type[1].toUpperCase()}`;
                if (str === 'CMD_PRINT') {
                  this.dataArray.printValue = true;
                } else {
                  this.buttonMap[str].eName = item;
                  const buttonConfig = JSON.stringify(this.buttonMap[str]);// 因此操作会改变store状态值，所以对象字符串之间互转，生成新对象
                  const buttonConfigInfo = JSON.parse(buttonConfig);
                  if (tabcmd.paths) {
                    buttonConfigInfo.requestUrlPath = tabcmd.paths[index];
                  }
                  this.dataArray.refresh = true;
                  this.dataArray.buttonGroupShowConfig.buttonGroupShow.push(buttonConfigInfo);
                }
              }
            }
          });
        }
        // }
      },
      waListButtons(tabwebact) { // 自定义按钮渲染逻辑
        if (tabwebact.objbutton && tabwebact.objbutton.length > 0) {
          tabwebact.objbutton.forEach((item) => {
            this.dataArray.waListButtonsConfig.waListButtons.push(item);
          });
        }
      },

      addButtonShow(tabcmd) { // 判断按钮显示的条件是否为新增
        tabcmd.cmds.forEach((item, index) => {
          if (item === 'actionADD') {
            if (tabcmd.prem[index]) {
              if (item === 'actionADD') {
                this.dynamic.editTheNewId = '-1';// 编辑新增标识
                this.dynamic.eName = 'actionMODIFY';
                this.dataArray.buttonGroupShowConfig.buttonGroupShow = [];
                if (this.tabcmd.paths) {
                  this.dynamic.requestUrlPath = this.tabcmd.paths[index];
                }
                this.dataArray.buttonGroupShowConfig.buttonGroupShow.push(this.dynamic);
              }
            }
          }
        });
      },
      objectTryDelete(obj) { // 删除
        const searchData = {
          table: this.tableName,
          startIndex: 0,
          range: 10
        };
        if (this.isreftabs) { // 存在子表
          if (this.updateData[this.itemName].delete[this.itemName].length > 0) {
            if (obj.requestUrlPath) { // 有path
              this.$refs.dialogRef.open();
              this.saveParameters();// 调用获取参数方法
              this.dialogConfig = {
                contentText: '确认执行删除?',
                confirm: () => {
                  this.performMainTableDeleteAction({
                    path: obj.requestUrlPath, table: this.tableName, objId: this.itemId, currentParameter: this.currentParameter, itemName: this.itemName, isreftabs: this.isreftabs, itemNameGroup: this.itemNameGroup, itemCurrentParameter: this.itemCurrentParameter
                  });
                  setTimeout(() => {
                    const deleteMessage = this.buttonsData.deleteData;
                    if (deleteMessage) {
                      this.$Message.success(`${deleteMessage}`);
                      // this.getObjectTableItemForTableData({
                      //   table: tablename,
                      //   objid: this.itemId,
                      //   refcolid, 
                      //   searchdata: {
                      //     column_include_uicontroller: true,
                      //     startindex: 0,
                      //     range: 10,
                      //   }
                      // });
                      const { tablename, refcolid } = this.itemInfo;
                      console.log('🍓', this.itemCurrentParameter);
                      this.getObjectTableItemForTableData({
                        table: tablename, objid: this.itemId, refcolid, searchdata: { column_include_uicontroller: true, startindex: 0, range: 10, } 
                      });
                      this.getInputForitemForChildTableForm({ table: tablename });
                      // this.clickButtonsBack();
                      // this.$store.dispatch(`${moduleName()}/getQueryListForAg`, searchData);
                    }
                  }, 1000);
                }
              };
            } else { // 没有path
              // 没有path
              this.$refs.dialogRef.open();
              this.dialogConfig = {
                contentText: '确认执行删除?',
                confirm: () => {
                  this.performMainTableDeleteAction({ table: this.tableName, objId: this.itemId });
                  setTimeout(() => {
                    const deleteMessage = this.buttonsData.deleteData;
                    this.$Message.success(`${deleteMessage}`);
                    this.clickButtonsBack();
                    this.getQueryListForAg(searchData);
                  }, 1000);
                }
              };
            }
          } else {
            const data = {
              title: '警告',
              content: `请先选择需要${obj.name}的记录！`
            };
            this.$Modal.fcWarning(data);
          }
        } else if (obj.requestUrlPath) { // 有path，没有子表
          this.$refs.dialogRef.open();
          this.dialogConfig = {
            contentText: '确认执行删除?',
            confirm: () => {
              this.performMainTableDeleteAction({ path: obj.requestUrlPath, table: this.tableName, objId: this.itemId });
              setTimeout(() => {
                const deleteMessage = this.buttonsData.deleteData;
                if (deleteMessage) {
                  this.$Message.success(`${deleteMessage}`);
                  this.clickButtonsBack();
                  this.$store.dispatch(`${moduleName()}/getQueryListForAg`, searchData);
                }
              }, 1000);
            }
          };
        } else {
          // 没有path
          this.$refs.dialogRef.open();
          this.dialogConfig = {
            contentText: '确认执行删除?',
            confirm: () => {
              this.performMainTableDeleteAction({ table: this.tableName, objId: this.itemId });
              setTimeout(() => {
                const deleteMessage = this.buttonsData.deleteData;
                if (deleteMessage) {
                  this.$Message.success(`${deleteMessage}`);
                  this.clickButtonsBack();
                  this.$store.dispatch(`${moduleName()}/getQueryListForAg`, searchData);
                }
              }, 1000);
            }
          };
        }
      },

      objectAdd() { // 新增
        const id = 'New';
        const label = `${this.activeTab.label.replace('编辑', '新增')}`;
        if (this.objectType === 'horizontal') {
          const type = 'tableDetailHorizontal';
          this.tabHref({
            type,
            tableName: this.tableName,
            tableId: this.tableId,
            label,
            id
          });
        } else if (this.objectType === 'vertical') {
          const type = 'tableDetailVertical';
          this.tabHref({
            type,
            tableName: this.tableName,
            tableId: this.tableId,
            label,
            id
          });
        }
        setTimeout(() => {
          this.$store.commit(`${moduleName()}/emptyChangeData`, this.tableName);
        }, 2000);
        // setTimeout(() => {
        //   this.getObjectTabForMainTable({ table: this.tableName, objid: 'New' });
        //   this.getObjectForMainTableForm({ table: this.tableName, objid: 'New' });
        //   this.buttonShowType = 'add';
        // }, 2000);
      },
      objectSave(obj) { // 按钮保存操作
        this.determineSaveType(obj);
      },
      determineSaveType(obj) { // 保存按钮事件逻辑
        if (this.verifyRequiredInformation()) { // 验证表单必填项
          this.saveParameters();// 调用获取参数方法
          const itemName = this.itemName;// 子表表名
          const itemCurrentParameter = this.itemCurrentParameter;
          if (this.itemId === 'New') { // 主表新增保存和编辑新增保存
            // console.log('主表新增保存和编辑新增保存');
            const type = 'add';
            const path = this.dynamic.requestUrlPath;
            const objId = -1;

            if (!this.isreftabs) { // 为false的情况下是没有子表
              // console.log('没有子表');
              if (this.dynamic.requestUrlPath) { // 配置path
                // console.log(' 主表新增保存,配置path的', this.dynamic.requestUrlPath);
                this.savaNewTable(type, path, objId);
              } else { // 没有配置path
                this.savaNewTable(type, path, objId);
              }
            }
            if (this.isreftabs) { // 存在子表
              // console.log('有子表');
              if (this.dynamic.requestUrlPath) { // 配置path
                this.savaNewTable(type, path, objId, itemName, itemCurrentParameter);
              } else { // 没有配置path
                this.savaNewTable(type, path, objId, itemName, itemCurrentParameter);
              }
            }
          } else if (this.itemId !== '-1') { // 主表编辑保存
            // console.log('主表编辑保存');
            const path = obj.requestUrlPath;
            const type = 'modify';
            if (!this.isreftabs) { // 为false的情况下是没有子表
              // console.log('没有子表',);

              if (obj.requestUrlPath) { // 配置path
                // console.log('主表编辑保存,配置path的逻辑', obj.requestUrlPath);
                this.savaNewTable(type, path, this.itemId);
              } else { // 没有配置path
                // console.log('主表编辑保存,没有配置path的逻辑');
                const objId = this.itemId;
                this.savaNewTable(type, path, objId);
              }
            }
            if (this.isreftabs) { // 为true的情况下是存在子表
              const objId = this.itemId;
              const sataType = 'itemSave';
              if (obj.requestUrlPath) { // 配置path
                this.savaNewTable(type, path, objId, itemName, itemCurrentParameter);
              } else { // 没有配置path
                this.savaNewTable(type, path, objId, itemName, itemCurrentParameter);
              }
              if (this.objectType === 'vertical') { 
                if (Object.keys(this.updateData[itemName].modify[itemName]).length > 0) {
                  this.savaNewTable(type, path, objId, itemName, itemCurrentParameter, sataType);
                }
              }
            }
          }
        }
      },
      verifyRequiredInformation() { // 验证表单必填项
        this.saveParameters();
        const checkedInfo = this.currentParameter.checkedInfo;// 主表校验信息

        if (checkedInfo) {
          const messageTip = checkedInfo.messageTip;
          if (messageTip) {
            if (messageTip.length > 0) {
              this.$Message.warning(messageTip[0]);
              checkedInfo.validateForm.focus();
              return false;
            }
          }
        }
        // if (this.objectType === 'vertical') { // 纵向结构
        if (this.isreftabs) { // 存在子表时
          const itemCheckedInfo = this.itemCurrentParameter.checkedInfo;// 子表校验信息
          if (itemCheckedInfo) {
            const itemMessageTip = itemCheckedInfo.messageTip;
            if (itemMessageTip) {
              if (itemMessageTip.length > 0) {
                this.$Message.warning(itemMessageTip[0]);
                itemCheckedInfo.validateForm.focus();
                return false;
              }
            }
          } else if (KEEP_SAVE_ITEM_TABLE_MANDATORY) { // 为true时，子表没有必填项也必须要输入值才能保存
            this.saveParameters();
            if (this.objectType === 'vertical') {
              if (this.itemId === 'New') {
                if (this.itemNameGroup.length > 0) {
                  const addInfo = this.itemCurrentParameter.add[this.itemName];
                  if (Object.values(addInfo).length < 1) {
                    this.$Message.warning('个人信息不能为空!');
                    return false;
                  }
                }
              }
            }
          }
        }
        // }
        return true;
      },
      /**
       * 主表保存参数说明
       * {
       *    type: 保存类型：新增保存/编辑保存/编辑新增保存
       *    path:有新接口
       *    objId: 明细ID
       *    itemName: 子表表名
       * }
       */
      savaNewTable(type, path, objId, itemName, itemCurrentParameter, sataType) { // 主表新增保存方法
        const tableName = this.tableName;
        const objectType = this.objectType;
        const isreftabs = this.isreftabs;
        const itemNameGroup = this.itemNameGroup;
        const parame = {
          ...this.currentParameter, // 主表信息
          itemCurrentParameter, // 子表信息
          type,
          tableName,
          objId,
          path,
          itemName,
          objectType,
          isreftabs,
          sataType,
          itemNameGroup
        };
        this.performMainTableSaveAction(parame);
        setTimeout(() => {
          if (type === 'add') { // 横向结构新增主表保存成功后跳转到编辑页面
            let types = '';
            if (this.objectType === 'horizontal') {
              types = 'tableDetailHorizontal';
            } else {
              types = 'tableDetailVertical';
            }
            const label = `${this.activeTab.label.replace('新增', '编辑')}`;
            const tab = {
              type: types,
              tableName,
              tableId: this.tableId,
              label,
              id: this.buttonsData.newMainTableSaveData.objId ? this.buttonsData.newMainTableSaveData.objId : this.itemId
            };
            this.updateChangeData({ tableName: this.tableName, value: {} });

            this.tabHref(tab);
            const message = this.buttonsData.message;
            if (message) {
              this.$Message.success(message);
            }
          } else {
            setTimeout(() => {
              const message = this.buttonsData.message;
              if (message) {
                this.upData(`${message}`);
                // this.updateChangeData({ tableName: this.tableName, value: {} });
              }
            }, 1000);
          }
          this.decreasekeepAliveLists(moduleName());
        }, 2000);
      },
      saveParameters() { // 筛选按钮保存参数逻辑
        if (this.isreftabs) { // 有子表
          Object.keys(this.updateData).reduce((obj, current) => { // 获取store储存的新增修改保存需要的参数信息
            if (current === this.itemName) {
              this.itemCurrentParameter = this.updateData[current];
            }
            return obj;
          }, {});
        }
        Object.keys(this.updateData).reduce((obj, current) => { // 获取store储存的新增修改保存需要的参数信息
          if (current === this.tableName) {
            this.currentParameter = this.updateData[current];
          }
          return obj;
        }, {});
      }

    },
    mounted() {
      this.buttonsReorganization(this.tabcmd);
      this.waListButtons(this.tabwebact);
    },
    created() {
      const { tableName, tableId, itemId } = router.currentRoute.params;
      this.tableName = tableName;
      this.tableId = tableId;
      this.itemId = itemId;
      this.buttonMap = buttonmap;
    }
  };
</script>                                              

<style lang="less">
.singleObjectButton {
  .buttonGroup {
    padding: 10px 0 5px 0;
  }
}
</style>
