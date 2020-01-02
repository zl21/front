/* eslint-disable no-restricted-globals */

<template>
  <div
    class="singleObjectButton"
  >
    <div
      v-if="watermarkImg"
      class="submit-img"
    >
      <WaterMark
        :text="waterMarkText"
        :color="waterMarkColor"
      />
    </div>
    <ButtonGroup
      :data-array="dataArray"
      class="buttonGroup"
      :item-id="itemId"
      :id-array="itemName ? updateData[itemName] :{}"
      @buttonClick="buttonClick"
    />
    <Dialog
      ref="dialogRef"
      :title="dialogConfig.title"
      :mask="dialogConfig.mask"
      :content-text="dialogConfig.contentText"
      :footer-hide="dialogConfig.footerHide"
      :confirm="dialogConfig.confirm"
      :isrefrsh="isrefrsh"
      :dialog-component-name="dialogComponentName"
      :obj-list="dialogComponentName?objList:[]"
      @dialogComponentSaveSuccess="dialogComponentSaveSuccess"
      @clearDialogComponentName="clearDialogComponentName"
    />
    <!-- 动作定义弹框定制界面 -->
    <!-- <Dialog
      ref="dialogRef"
      :title="dialogConfig.title"
      :mask="true"
      :footer-hide="dialogConfig.contentText"
      :confirm="dialogConfig.confirm"
      :closable="true"
      :dialog-component-name="dialogComponentName"
      :content-text="dialogConfig.contentText"
    > -->
    <!-- <component
        :is="dialogComponentName"
        :dialog-component-name="dialogComponentName"
        @closeActionDialog="closeCustomDialog"
      /> -->
    <!-- </Dialog> -->
    <!-- <Modal
      v-model="actionDialog.show"
      :mask="true"
      :title="actionDialog.title"
      :footer-hide="true"
      :closable="true"
    >
      <component
        :is="dialogComponentName"
        :dialog-component-name="dialogComponentName"
        @closeActionDialog="closeActionDialog"
      >
        />
      </component>
    </Modal> -->
    <!-- 导入弹框 -->
    <ImportDialog
      v-if="importData.importDialog"
      :name="importData.importDialog"
      :visible="importData.importDialog"
      :show-close="true"
      :title="importData.importDialogTitle"
      :tablename="itemName"
      :main-table="tableName"
      :main-id="itemId"
      @confirmImport="importsuccess"
      @closeDialog="closeActionDialog"
      @imporSuccess="imporSuccess"
    />
    <!-- @confirmImport="" -->
  </div>
</template>

<script>

  import { mapMutations, mapState, mapActions } from 'vuex';
  import buttonmap from '../assets/js/buttonmap';
  import ButtonGroup from './ButtonComponent';
  import router from '../__config__/router.config';
  import Dialog from './Dialog.vue';
  import WaterMark from './WaterMark.vue';
  import ImportDialog from './ImportDialog';
  import {
    KEEP_SAVE_ITEM_TABLE_MANDATORY, Version, MODULE_COMPONENT_NAME, LINK_MODULE_COMPONENT_PREFIX, CUSTOMIZED_MODULE_COMPONENT_PREFIX, enableJflow, getCustomizeWaterMark
  } from '../constants/global';
  import { getGateway } from '../__utils__/network';

  import { DispatchEvent } from '../__utils__/dispatchEvent';
  import { getKeepAliveModuleName } from '../__config__/router.navigation.guard';

  import ChineseDictionary from '../assets/js/ChineseDictionary';
  import { getSeesionObject, updateSessionObject, deleteFromSessionObject } from '../__utils__/sessionStorage';

  export default {
    data() {
      return {
        temporaryStorage: false, // 是否开启暂存
        temporaryStoragePath: '',
        loading: true,
        importData: {
          importDialog: '',
          importDialogTitle: ''
        },
        dialogComponentName: null,
        // actionDialog: {
        //   show: false,
        //   title: ''
        // }, // 按钮动作定义弹框类型定制界面
        dialogConfig: {
          title: '提示',
          mask: true,
          footerHide: false,
          contentText: '',
          confirm: () => {
          }
        }, // 弹框配置信息
        dataArray: {
          refresh: false, // 显示刷新
          back: true, // 显示返回
          temporaryStorage: false, // 显示暂存
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
        defaultForCopyData: {}, // 保存复制操作时所需要的当前页面的数据
        itemTableValidation: false, // 控制提交按钮操作时子表form必填项不进行验证
        saveButtonPath: '', // 类型为保存的按钮path
        saveEventAfter: '', // 保存事件执行完成后的操作
        submitImage: '', // 提交操作完成后接口会返回提交成功图标
        savaCopy: false,
        isrefrsh: ''// 控制自定义类型按钮执行后是否刷新
      };
    },
    components: {
      ButtonGroup,
      Dialog, // 定制弹框
      ImportDialog, // 导入弹框
      WaterMark, // 水印组件
    },
    watch: {
      jflowPluginDataArray: {
        handler(val) {
          if (val) {
            this.dataArray.jflowPluginDataArray = this.jflowPluginDataArray;
          }
        }
      },
      refreshButtons: {
        handler(val) {
          this.dataArray.refresh = val;
        }
      },    
      tabcmd: {
        handler(val) {
          this.hideBackButton();
          if (Object.keys(val).length > 0) {
            this.dataArray.buttonGroupShowConfig.buttonGroupShow = [];
            if (this.objectType === 'horizontal') { // 横向布局
              if (this.itemName !== this.tableName) { // 以下配置仅控制子表
                this.tabPanel.forEach((item) => {
                  const objreadonly = item.componentAttribute.buttonsData.data.objreadonly;
                  if (objreadonly) {
                    val.cmds.forEach((item, index) => {
                      if (item === 'actionMODIFY' || item === 'actionDELETE' || item === 'actionIMPORT' || item === 'actionCANCOPY') {
                        val.prem[index] = false;
                      }
                    });
                  }
                  if (Version() === '1.4' && this.itemInfo && this.itemInfo.tabrelation === '1:1') { // 1对1的只有modify和export根据prem来，其他几个按钮就默认不显示
                    if (this.tabcmd.cmds && this.tabcmd.cmds.length > 0) {
                      this.tabcmd.cmds.forEach((item, index) => {
                        if (item !== 'actionMODIFY' && item !== 'actionEXPORT') {
                          this.tabcmd.prem[index] = false;
                        }
                      });
                    }
                  }
                });
                if (this.itemName !== this.tableName) { // 子表
                  const { tabrelation } = this.itemInfo;
                  if (tabrelation === '1:m') { // 子表
                    val.cmds.forEach((item, index) => {
                      if (item === 'actionEXPORT') {
                        val.prem[index] = true;
                      }
                    });
                  }
                }
                if (this.disableExport) {
                  if (this.tabcmd.cmds && this.tabcmd.cmds.length > 0) {
                    this.tabcmd.cmds.forEach((item, index) => {
                      if (item === 'actionEXPORT') {
                        this.tabcmd.prem[index] = false;
                      }
                    });
                  }
                }
                const { tabinlinemode } = this.itemInfo;
                if (tabinlinemode === 'N') {
                  if (this.tabcmd.cmds && this.tabcmd.cmds.length > 0) {
                    this.tabcmd.cmds.forEach((item, index) => {
                      if (item === 'actionMODIFY' || item === 'actionDELETE' || item === 'actionIMPORT') {
                        this.tabcmd.prem[index] = false;
                      }
                    });
                  }
                }
              }
            } else if (this.mainFormInfo.buttonsData.data.objreadonly) { // 是否为只读(当配置了只读时，以下类型按钮不显示)
              //  || item === 'actionCANCOPY'
              val.cmds.forEach((item, index) => {
                if (item === 'actionMODIFY' || item === 'actionDELETE' || item === 'actionIMPORT') {
                  val.prem[index] = false;
                }
              });
            }
            this.buttonsReorganization(val);
          }
        },
        deep: true
      },
      tabwebact: {
        handler(val) {
          this.hideBackButton();
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
        keepAliveLabelMaps: ({ keepAliveLabelMaps }) => keepAliveLabelMaps,
        copyDatas: ({ copyDatas }) => copyDatas,
        modifyData: ({ modifyData }) => modifyData,
        serviceIdMap: ({ serviceIdMap }) => serviceIdMap,
        LinkUrl: ({ LinkUrl }) => LinkUrl,
        exportTasks: ({ exportTasks }) => exportTasks
      }),
      watermarkImg() { // 匹配水印图片路径
        // if (this.watermarkimg.includes('/static/img/')) {
        //   // const src = this.watermarkimg.replace('/static/img/', '../assets/image/watermark/');
        //   const src = this.watermarkimg.split('/')[3];
        //   return require(`../assets/image/watermark/${src}`);
        // }
        return this.watermarkimg;
      },
      waterMarkText() {
        const customizeWaterMark = getCustomizeWaterMark();
        const textMap = Object.assign({
          accepet: '已验收',
          back: '已退回',
          box: '已装箱',
          boxing: '装箱中',
          charge: '已记账',
          check: '已收银',
          completed: '已完成',
          confirm: '已确认',
          execute: '已执行',
          executing: '执行中',
          extremely: '异常终止',
          Inventory: '已盈亏',
          send: '已发出',
          submit: '已提交',
          system: '系统',
          terminate: '已终止',
          examine: '审批中',
          void: '已作废',
          agreement: '已同意',
          reject: '已驳回',
        }, Object.keys(customizeWaterMark).reduce((a, c) => {
          a[c] = customizeWaterMark[c].text;
          return a;
        }, {}));
        if (this.watermarkimg.includes('/static/img/')) {
          const src = this.watermarkimg.split('/')[3].split('.')[0];
          return textMap[src];
        }
        return '';
      }, // 水印组件的文字
      waterMarkColor() {
        const customizeWaterMark = getCustomizeWaterMark();
        const colorMap = Object.assign({
          accepet: '#e80000',
          back: '#979797',
          box: '#e80000',
          boxing: '#09a155',
          charge: '#e80000',
          check: '#e80000',
          completed: '#e80000',
          confirm: '#e80000',
          execute: '#e80000',
          executing: '#09a155',
          extremely: '#979797',
          Inventory: '#e80000',
          send: '#e80000',
          submit: '#e80000',
          system: '#e80000',
          terminate: '#e80000',
          void: '#979797',
          examine: '#FF9900',
          agreement: '#09A155',
          reject: '#ED4014',
        }, Object.keys(customizeWaterMark).reduce((a, c) => {
          a[c] = customizeWaterMark[c].color;
          return a;
        }, {}));
        if (this.watermarkimg.includes('/static/img/')) {
          const src = this.watermarkimg.split('/')[3].split('.')[0];
          return colorMap[src];
        }
        return '';
      }, // 水印组件的颜色
      objList() { // 返回克隆表定制弹框所需数据
        if (this.objectType === 'horizontal') { // 横向布局
          return this.itemInfo.componentAttribute.panelData.data.addcolums;
        } if (this.objectType === 'vertical') {
          if (this.mainFormInfo.formData.data) {
            return this.mainFormInfo.formData.data.addcolums;
          }
        }
        return [];
      },
      refreshButtons() {
        // this.refresh = this.refreshButton;
        return this.refreshButton;
      },
      tablePage() {
        let page = {};
        if (this.objectType === 'horizontal') { // 横向布局
          this.tabPanel.every((item) => {
            if (this.itemName !== this.tableName && item.tablename === this.itemName) {
              page = item.tablePageInfo;
              return false;
            }
            return true;
          });
        } else {
          this.tabPanel.every((item) => {
            if (item.tablename === this.itemName) {
              page = item.tablePageInfo;
              return false;
            }
            return true;
          });
        }
        return page;
      },
      tempStorage() {
        return this.WebConf;
      }
    },
    props: {
      watermarkimg: {// 水印
        type: String,
        default: ''
      },
      disableExport: {
        type: Boolean,
      },
      isactive: {
        type: Boolean,
        default: false
      }, // 是否显示水印图标
      tabcmd: {// 标准类型按钮
        type: Object,
        default: () => ({})
      },
      tabwebact: {// 自定义类型按钮
        type: Object,
        default: () => ({})
      },
      objectType: {// 单对象类型
        type: String,
        default: ''
      },
      isreftabs: {
        type: Boolean,
        // default: false
      }, // 是否存在子表
      itemName: {// 当前表名
        type: String,
        default: ''
      },
      itemNameGroup: {// 所有子表表名
        type: Array,
        default: () => ([])
      },
      itemInfo: {// 当前子表信息
        type: Object,
        default: () => ({})
      },
      childTableName: {// 子表表名
        type: String,
        default: ''
      },
      itemTableCheckFunc: {// 子表明细校验
        type: Function,
        default: () => {}
      },
      clearItemTableSearchValue: {// 清空子表搜索框内容
        type: Function,
        default: () => {}
      },
    },
    inject: [MODULE_COMPONENT_NAME],
    methods: {
      ...mapActions('global', ['getExportedState', 'updataTaskMessageCount']),

      ...mapMutations('global', ['tabCloseAppoint', 'decreasekeepAliveLists', 'copyDataForSingleObject', 'tabHref', 'tabOpen', 'copyModifyDataForSingleObject', 'increaseLinkUrl', 'addKeepAliveLabelMaps', 'addServiceIdMap']),
      imporSuccess(id) {
        if (Version() === '1.3') {
          if (id) {
            const promises = new Promise((resolve, reject) => {
              this.getExportedState({
                objid: id, id, resolve, reject 
              });
            });
            promises.then(() => {
              this.$loading.hide(this.tableName);
              this.closeActionDialog();
              if (this.exportTasks.dialog) {
                const message = {
                  mask: true,
                  title: '提醒',
                  content: ' 本次操作已后台处理，是否至[我的任务]查看',
                  showCancel: true,
                  onOk: () => {
                    const type = 'tableDetailVertical';
                    const tab = {
                      type,
                      tableName: 'CP_C_TASK',
                      tableId: '24386',
                      id
                    };
                    this.updataTaskMessageCount({ id, stopUpdataQuantity: true });
                    this.tabOpen(tab);
                  }
                };
                this.$Modal.fcWarning(message);
              }
              if (this.exportTasks.successMsg) {
                const data = {
                  mask: true,
                  title: '成功',
                  content: this.exportTasks.resultMsg
                };
                this.$Modal.fcSuccess(data);
              }
            }, () => {
              // if (this.exportTasks.warningMsg) {
              //   const data = {
              //     mask: true,
              //     title: '错误',
              //     content: `${this.exportTasks.resultMsg}`
              //   };
              //   this.$Modal.fcError(data);
              // }
              this.closeActionDialog();
              this.$loading.hide(this.tableName);
            });
          }
        } else {
          this.$loading.hide(this.tableName);
        }
      },
      dialogComponentSaveSuccess() { // 自定义弹框执行确定按钮操作
        if (this.isrefrsh) {
          this.upData();
        }
      },
     
      subtables() {
        if (Version() === '1.4') {
          if (this.isreftabs) {
            return true;
          }
          return false;
        } if (this.itemNameGroup.length > 0) {
          return true;
        }
        return false;
      },
      clearDialogComponentName() {
        this.dialogComponentName = null;
      },
      closeActionDialog() { // 关闭导入弹框
        this.importData.importDialog = false;
      },
      buttonsReorganization(buttonData) { // 根据页面不同执行按钮渲染逻辑
        if (Object.values(buttonData).length > 0) {
          // if (this.objectType === 'horizontal') { // 横向布局
          if (this.itemId === 'New') { // 编辑按钮渲染逻辑   根据copy来控制复制按钮操作后按钮的显示条件
            this.addButtonShow(buttonData);
          } else { // 新增按钮渲染逻辑
            this.getbuttonGroupData(buttonData);
          }
          // } else if (this.objectType === 'vertical') {
          //   if (this.itemId === 'New') { // 编辑按钮渲染逻辑
          //     this.addButtonShow(buttonData);
          //   } else { // 新增按钮渲染逻辑
          //     this.getbuttonGroupData(buttonData);
          //   }
          // }
          if (this.copy === true) {
            this.updateRefreshButton(false);
            this.addButtonShow(buttonData);
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
        } else if (type === 'temporaryStorage') {
          this.clickButtonsTemporaryStorage();
        } else if (type === 'refresh') {
          this.clickButtonsRefresh();
        } else if (type === 'extraposition') {
          this.clickExtraposition(obj);
        }
      },
      clickButtonsTemporaryStorage() { // 暂存事件
        this.temporaryStorage = true;
        if (this.tempStorage && this.tempStorage.temp_storage && this.tempStorage.temp_storage.isenable) {
          if (this.tempStorage.temp_storage.path) {
            this.temporaryStoragePath = this.tempStorage.temp_storage.path;
            const dom = document.getElementById('actionMODIFY');
            const myEvent = new Event('click');
            dom.dispatchEvent(myEvent);    
          } else {
            const data = {
              mask: true,
              title: '警告',
              content: '请设置暂存path配置'
            };
            this.$Modal.fcWarning(data);
          }
        }
      },
      clickExtraposition(obj) { // jflow方法
        DispatchEvent('jflowPlugin', {
          detail: {
            obj
          }
        });
      },
      clickButtonsRefresh() { // 按钮刷新事件
        // DispatchEvent('tabRefreshClick', {
        //   detail: {
        //     a: '刷新'
        //   }
        // });
        // window.addEventListener('tabRefreshClick', (event) => {

        //   console.log(event.detail);
        // }, false);
      
        if (this.itemInfo.webact) { // 兼容半定制界面
          const webactType = this.itemInfo.webact.substring(0, this.itemInfo.webact.lastIndexOf('/'));
          if (webactType !== 'order') {
            DispatchEvent('customizeClick', {
              detail: {
                type: 'refresh'
              }
            });
            this.upData();
            // this.clearEditData();
          }
        } else {
          this.clearEditData();
          const message = '刷新成功';
          this.upData(`${message}`);
        }
      },
      upData(message) { // 页面刷新判断逻辑
        DispatchEvent('tabRefreshClick');
        // DispatchEvent('jflowPlugin', {
        //   detail: {
        //     type: 'fresh'
        //   }
        // });
        let page = {};
        if (this.objectType === 'horizontal') { // 横向布局
          this.tabPanel.every((item) => {
            if (this.itemName !== this.tableName && item.tablename === this.itemName) {
              page = item.tablePageInfo;
              return false;
            }
            return true;
          });
        } else {
          this.tabPanel.every((item) => {
            if (item.tablename === this.itemName) {
              page = item.tablePageInfo;
              return false;
            }
            return true;
          });
        }
        const {
          tablename, refcolid, tabrelation, tabinlinemode
        } = this.itemInfo;
        const tabIndex = this.tabCurrentIndex;
        if (this.objectType === 'horizontal') { // 横向布局
          if (this.tabCurrentIndex === 0) { // 主表
            this.getObjectTabForMainTable({
              table: this.tableName, objid: this.itemId, tabIndex, itemTabelPageInfo: page 
            });
          } else if (tabrelation === '1:m') { // 子表
            this.getInputForitemForChildTableForm({ table: tablename, tabIndex, tabinlinemode });
            const promise = new Promise((resolve, reject) => {
              this.getObjectTabForChildTableButtons({
                maintable: this.tableName, table: tablename, objid: this.itemId, tabIndex, resolve, reject
              });
            });

            promise.then(() => {
              const searchdata = {
                column_include_uicontroller: true,
                startindex: (Number(page.currentPageIndex) - 1) * Number(page.pageSize),
                range: page.pageSize,
                fixedcolumns: this.itemInfo.tableSearchData.selectedValue ? { [this.itemInfo.tableSearchData.selectedValue]: `${this.itemInfo.tableSearchData.inputValue}` } : this.itemInfo.tableDefaultFixedcolumns
              };
              this.getObjectTableItemForTableData({
                table: tablename, objid: this.itemId, refcolid, searchdata, tabIndex
              });
            });
          } else if (tabrelation === '1:1') {
            this.getObjectTabForChildTableButtons({
              maintable: this.tableName, table: tablename, objid: this.itemId, tabIndex
            });
            this.getItemObjForChildTableForm({
              table: tablename, objid: this.itemId, refcolid, tabIndex
            });
          }
        } else { // 纵向布局
          this.getObjectForMainTableForm({
            table: this.tableName, objid: this.itemId, tabIndex
          });
          this.getObjectTabForMainTable({
            table: this.tableName, objid: this.itemId, tabIndex, itemTabelPageInfo: page 
          });
        }
        setTimeout(() => {
          if (message) {
            this.$Message.success(message);
          }
        }, 500);
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
        case 'actionDELETE': // 删除
          this.objectTryDelete(obj);
          break;
        case 'actionSUBMIT': // 提交
          this.objectTrySubmit(obj);
          break;
        case 'actionUNSUBMIT': // 取消提交
          this.objectTryUnSubmit(obj);
          break;
        case 'actionVOID': // 作废
          this.objectTryVoid(obj);
          break;
        case 'actionCANCOPY': // 复制
          // this.copyFlag = true;
          this.objectCopy();
          break;
        case 'actionCopyBill':
          this.objectCopyBill();
          break;
        case 'actionIMPORT':// 导入
          this.objectIMPORT();
          break;
        default:
          break;
        }
      },
      objectIMPORT() { // 导入
        this.importData.importDialog = true;
        this.importData.importDialogTitle = this.itemInfo.tabledesc;
      },
      importsuccess() {
        let page = {};
        if (this.objectType === 'horizontal') { // 横向布局
          this.tabPanel.every((item) => {
            if (this.itemName !== this.tableName && item.tablename === this.itemName) {
              page = item.tablePageInfo;
              return false;
            }
            return true;
          });
        } else {
          this.tabPanel.every((item) => {
            if (item.tablename === this.itemName) {
              page = item.tablePageInfo;
              return false;
            }
            return true;
          });
        }
        const { refcolid } = this.itemInfo;
        const tabIndex = this.tabCurrentIndex;
        const searchdata = {
          column_include_uicontroller: true,
          startindex: (page.currentPageIndex - 1) * page.pageSize,
          range: page.pageSize,
        };
        this.getObjectTableItemForTableData({
          table: this.itemName, objid: this.itemId, refcolid, searchdata, tabIndex
        });
      },
      objectTrySubmit(obj) { // 按钮提交逻辑
        // this.itemTableValidation = true;// 提交逻辑不需要验证子表必填项
        if (this.verifyRequiredInformation()) { // 验证表单必填项
          const data = {
            title: '警告',
            mask: true,
            showCancel: true,
            content: '确认执行提交?',
            onOk: () => {
              this.saveButtonPath = obj.requestUrlPath;
              const dom = document.getElementById('actionMODIFY');
              const myEvent = new Event('click');
              dom.dispatchEvent(myEvent);
              this.saveEventAfter = 'submit';
            }
          };
          this.$Modal.fcWarning(data);
        }
      },
      objectTryUnSubmit(obj) { // 按钮取消提交操作
        const data = {
          title: '警告',
          mask: true,
          content: '确认执行取消提交?',
          showCancel: true,
          onOk: () => {
            this.saveButtonPath = obj.requestUrlPath;
            const promise = new Promise((resolve, reject) => {
              this.getObjectTryUnSubmit({
                objId: this.itemId, table: this.tableName, path: this.saveButtonPath, isreftabs: this.isreftabs, resolve, reject
              });
            });
            promise.then(() => {
              const message = this.buttonsData.unSubmitData.message;
              if (message) {
                this.upData(`${message}`);
              }
            });
          }
        };
        this.$Modal.fcWarning(data);
      },
      objectTryVoid(obj) {
        // this.itemTableValidation = true;// 提交逻辑不需要验证子表必填项
        if (this.verifyRequiredInformation()) { // 验证表单必填项
          const data = {
            title: '警告',
            mask: true,
            showCancel: true,
            content: '确认执行作废?',
            onOk: () => {
              this.saveButtonPath = obj.requestUrlPath;
              const dom = document.getElementById('actionMODIFY');
              dom.click();
              this.saveEventAfter = 'invalid';
            }
          };
          this.$Modal.fcWarning(data);
        }
      },
      webactionClick(obj) { // 动作定义执行
        if (obj.confirm) {
          // 有提示
          let selete = [];
          if (this.updateData && this.updateData[this.itemName] && this.updateData[this.itemName].delete && this.updateData[this.itemName].delete[this.itemName]) {
            selete = this.updateData[this.itemName].delete[this.itemName];
            if (Object.keys(selete).length === 0) {
              selete = [];
            }
          }

          if (obj.confirm.indexOf('{') >= 0) {
            if (JSON.parse(obj.confirm).isselect) {
              if (selete.length === 0) {
                const contentText = `${JSON.parse(obj.confirm).nodesc}`;
                const title = this.ChineseDictionary.WARNING;
                const data = {
                  mask: true,
                  title,
                  content: contentText
                };
                this.$Modal.fcWarning(data);
              } else if (
                JSON.parse(obj.confirm).isradio
                && selete.length !== 1
              ) {
                const title = this.ChineseDictionary.WARNING;
                const contentText = `${JSON.parse(obj.confirm).radiodesc}`;
                const data = {
                  mask: true,
                  title,
                  content: contentText
                };
                this.$Modal.fcWarning(data);
              } else if (JSON.parse(obj.confirm).desc) {
                const title = this.ChineseDictionary.WARNING;
                const content = `${JSON.parse(obj.confirm).desc}`;
                let contentText = '';
                const confirm = JSON.parse(obj.confirm);
                if (content.indexOf('{isselect}') !== '-1') {
                  contentText = `${confirm.desc.replace('{isselect}', selete.length)}`;
                } else {
                  contentText = `${JSON.parse(obj.confirm).desc}`;
                  console.log(contentText);
                }
                this.dialogMessage(title, contentText, obj);
              } else {
                this.buttonEvent(obj);
              }
            } else if (JSON.parse(obj.confirm).desc) {
              const title = this.ChineseDictionary.WARNING;
              const contentText = `${JSON.parse(obj.confirm).desc}`;
              this.dialogMessage(title, contentText, obj);
            }
          } else {
            const title = this.ChineseDictionary.WARNING;
            const contentText = `${obj.confirm}`;
            this.dialogMessage(title, contentText, obj);
          }
        } else {
          this.buttonEvent(obj);
        }
      },
      dialogMessage(title, contentText, obj) {
        const data = {
          mask: true,
          title,
          content: contentText,
          showCancel: true,
          onOk: () => {
            this.errorconfirmDialog(obj);
          }
        };
        this.$Modal.fcWarning(data);
      },
      errorconfirmDialog(obj) {
        this.buttonEvent(obj);
      },
      buttonEvent(obj) {
        this.activeTabAction = obj;
        switch (obj.vuedisplay) {
        case 'slient':
          this.objTabActionSlient(obj);
          break;
        case 'download':
          this.objTabActiondDownload(obj);
          break;
        case 'dialog':
          this.objTabActionDialog(obj);
          break;
        case 'navbar':
          this.objTabActionNavbar(obj);
          break;
        // case 'external':
        //   this.objTabActionUrl(tab);
        //   break;
        case 'edit':
          this.objTabActionEdit(obj);
          break;
        default:
          break;
        }
      },
      objTabActionEdit(tab) {
        const editTableId = tab.action.lastIndexOf('/');
        const editTableName = tab.action.substring(0, editTableId);
        const label = `${this.activeTab.label.substring(2, '编辑')}虚表`;
        const name = `S.${editTableName}.${editTableId}`;
        this.addKeepAliveLabelMaps({ name, label });
        const gateWay = this.serviceIdMap[this.tableName];
        this.addServiceIdMap({ tableName: editTableName.toUpperCase(), gateWay });
        const serviceIdMap = JSON.parse(window.sessionStorage.getItem('serviceIdMap'));
        serviceIdMap[editTableName.toUpperCase()] = `${gateWay}`;
        window.sessionStorage.setItem('serviceIdMap', JSON.stringify(serviceIdMap));
        this.tabHref({
          type: 'tableDetailVertical',
          tableName: editTableName,
          tableId: editTableId,
          label: 'this.activeTab.label',
          id: this.itemId,
        });
      },
      objTabActiondDownload(tab) {
        if (this.objectType === 'horizontal') { // 左右结构
          if (this.itemName === this.tableName) { // 主表
            this.downLoad(tab.action, this.itemId);
          } else { // 子表
            let id = '';
            if (this.updateData && this.updateData[this.itemName] && this.updateData[this.itemName].delete && this.updateData[this.itemName].delete[this.itemName] && this.updateData[this.itemName].delete[this.itemName].length > 0) {
              id = this.updateData[this.itemName].delete[this.itemName].map(item => parseInt(item.ID));
            }
            this.downLoad(tab.action, id);
          }
        } else { // 左右结构主表
          this.downLoad(tab.action, this.itemId);
        }
      },
      downLoad(action, downloadId) {
        const paths = action.replace('$objid$', downloadId);
        const eleLink = document.createElement('a');
        const path = getGateway(`${paths}`);
        eleLink.setAttribute('href', path);
        eleLink.style.display = 'none';
        document.body.appendChild(eleLink);
        eleLink.click();
        document.body.removeChild(eleLink);
      },
      objTabActionNavbar(tab) {
        if (tab.action) {
          if (this.objectType === 'horizontal') { // 左右结构
            if (this.itemName === this.tableName) { // 主表
              this.routingHop(tab, this.itemId);// 主表使用明细ID
            } else { // 子表   
              let id = [];
              if (this.updateData && this.updateData[this.itemName] && this.updateData[this.itemName].delete && this.updateData[this.itemName].delete[this.itemName] && this.updateData[this.itemName].delete[this.itemName].length > 0) {
                id = this.updateData[this.itemName].delete[this.itemName].map(item => parseInt(item.ID));
              }
              if (id.length === 0) {
                this.$Message.warning('请勾选ID');
                return;
              } if (id.length > 1) {
                this.$Message.warning('只能勾选单个ID');
                return;
              }
              this.routingHop(tab, id);// 主表使用明细ID
            }
          } else { // 上下结构主表
            this.routingHop(tab, this.itemId);
          }
        }
      },
      routingHop(tab, id) {
        const actionType = tab.action.substring(0, tab.action.indexOf('/'));
        const singleEditType = tab.action.substring(tab.action.lastIndexOf('/') + 1, tab.action.length);
        if (actionType === 'SYSTEM') {
          if (singleEditType === ':itemId') {
            const path = `/${tab.action.replace(/:itemId/, id)}`;
            router.push(
              path
            );
          } else {
            const path = `/${tab.action}`;
            router.push(
              path
            );
          }
        } else if (actionType === 'https:' || actionType === 'http:') {
          const name = `${LINK_MODULE_COMPONENT_PREFIX}.${tab.webname.toUpperCase()}.${tab.webid}`;     
          this.addKeepAliveLabelMaps({ name, label: tab.webdesc });
          const linkUrl = tab.action;
          const linkId = tab.webid;
          if (!this.LinkUrl[linkId]) {
            this.increaseLinkUrl({ linkId, linkUrl });
          }
          const obj = {
            linkName: tab.webname,
            linkId: tab.webid,
            linkUrl,
            linkLabel: tab.webdesc
          };
          window.sessionStorage.setItem('tableDetailUrlMessage', JSON.stringify(obj));
          const type = 'tableDetailUrl';
          this.tabOpen({
            type,
            linkName: tab.webname,
            linkId: tab.webid
          });
        } else if (actionType.toUpperCase() === 'CUSTOMIZED') {
          const customizedName = tab.action.substring(tab.action.lastIndexOf('/') + 1, tab.action.length);
          const name = `${CUSTOMIZED_MODULE_COMPONENT_PREFIX}.${customizedName.toUpperCase()}.${tab.webid}`;     
          this.addKeepAliveLabelMaps({ name, label: tab.webdesc });
          const path = `/${tab.action.toUpperCase()}/${tab.webid}`;
          const obj = {
            customizedName: name,
            customizedLabel: tab.webdesc
          };
          window.sessionStorage.setItem('customizedMessageForbutton', JSON.stringify(obj));
          router.push(
            path
          );
        } 
      },

      // // 判断跳转到哪个页面
      // const url = tab.action;
      // const index = url.lastIndexOf('/');
      // const customizedModuleName = url.substring(index + 1, url.length);
      // const label = tab.webdesc;
      // const type = 'tableDetailAction';
      // const name = Object.keys(this.keepAliveLabelMaps);
      // let customizedModuleId = '';
      // name.forEach((item) => {
      //   if (item.includes(`${customizedModuleName.toUpperCase()}`)) {
      //     customizedModuleId = item.split(/\./)[2];
      //   }
      // });
      // // if (tab.actiontype === 'url') {
      // //   this.objTabActionUrl(tab);
      // // } else
      // if (tab.action) {
      //   this.tabOpen({
      //     type,
      //     customizedModuleName,
      //     customizedModuleId,
      //     label
      //   });
      // }
      // objTabActionUrl(tab) { // 外链类型
      //   // const linkUrl = tab.action;
      //   // const linkId = tab.webid;
      //   // this.increaseLinkUrl({ linkId, linkUrl });
      //   // const label = `${tab.webdesc}`;
      //   // const name = `L.${tab.webname.toUpperCase()}.${linkId}`;
      //   // this.addKeepAliveLabelMaps({ name, label });
      //   // const linkInfo = {
      //   //   linkUrl: tab.action,
      //   //   linkId: tab.webid,
      //   //   label,
      //   //   name
      //   // };
      //   // window.sessionStorage.setItem('linkInfo', JSON.stringify(linkInfo));
      //   // setTimeout(() => {
      //   //   this.tabOpen({
      //   //     type: 'tableDetailUrl',
      //   //     tableName: tab.webname.toUpperCase(),
      //   //     tableId: tab.webid,
      //   //     label: tab.webdesc,
      //   //     url: tab.action
      //   //   });
      //   // }, 500);
      //   const eleLink = document.createElement('a');
      //   eleLink.href = tab.action;
      //   eleLink.target = '_blank';
      //   document.body.appendChild(eleLink);
      //   eleLink.click();
      //   document.body.removeChild(eleLink);
      // },
      objTabActionSlient(tab) { // 动作定义静默
        this.objTabActionSlientConfirm(tab);
        // tab.confirm = true
        // 判断当前tab是否为空,特殊处理提示信息后调用静默前保存
        // if (!tab) tab = self.activeTabAction;
        // if (tab.confirm) {
        //   if (!(tab.confirm.indexOf('{') >= 0)) { // 静默执行提示弹框
        //     const data = {
        //       title: '警告',
        //       mask: true,
        //       content: tab.confirm,
        //       onOk: () => {
        //         this.objTabActionSlientConfirm(tab);
        //       }
        //     };
        //     this.$Modal.fcWarning(data);
        //   } else if (JSON.parse(tab.confirm).desc) {
        //     //            确定后执行下一步操作
        //     //            判断是否先执行保存
        //     if (JSON.parse(tab.confirm).isSave) {
        //       console.log('暂时未处理配置isSave的相关逻辑');
        //       // self.confirmAction = 'beforeObjectSubmit(this.objTabActionSlientConfirm)';
        //     } else {
        //       const data = {
        //         title: '警告',
        //         mask: true,
        //         showCancel: true, 
        //         content: JSON.parse(tab.confirm).desc,
        //         onOk: () => {
        //           this.objTabActionSlientConfirm(tab);
        //         }
        //       };
        //       this.$Modal.fcWarning(data);
        //     }
        //     // self.confirmTips({
        //     //   action: 'confirm',
        //     //   title: tab.webdesc,
        //     //   type: 'warning',
        //     //   list: [],
        //     //   isAction: true,
        //     //   desc: JSON.parse(tab.confirm).desc,
        //     // });
        //     // 清除提示信息
        //   } else if (JSON.parse(tab.confirm).isSave) { // 静默执行保存
        //     self.beforeObjectSubmit(() => {
        //       self.objTabActionSlientConfirm(tab);
        //     });
        //   } else { // 静默直接执行
        //     self.objTabActionSlientConfirm(tab);
        //   }
        // } else {
        //   self.objTabActionSlientConfirm(tab);
        // }
      },
      // 动作定义静默执行
      objTabActionSlientConfirm(tab) {
        let params = {};
        const label = `${this.activeTab.label.replace('编辑', '')}`;
        let ids = [];// 子表勾选1.4ID格式
        let idsOld = [];// 1.3ID格式
        let idsOldTypeNumber = [];// 1.3ID格式,number类型

        if (this.updateData && this.updateData[this.itemName] && this.updateData[this.itemName].delete && this.updateData[this.itemName].delete[this.itemName] && this.updateData[this.itemName].delete[this.itemName].length > 0) {
          ids = this.updateData[this.itemName].delete[this.itemName].map(item => parseInt(item.ID));
          idsOldTypeNumber = this.updateData[this.itemName].delete[this.itemName].map(item => Number(item.ID));
          idsOld = this.updateData[this.itemName].delete[this.itemName].map(item => item.ID);

          // ids = this.updateData[this.itemName].delete[this.itemName];
        }
        if (Version() === '1.3') { // 1.3类型
          if (tab.action.search('/') === -1) {
            const obj = {// param层动态参数
              objid: this.itemId,
              table: this.tableName,
              menu: label,
            };
            if (this.objectType === 'vertical') { // 上下结构
              // if (idsOld.length > 0) { // 勾选了明细传subparam
              obj.subParam = {// 上下结构主表参数结构
                idArr: idsOld, // 子表勾选ID
                table: this.itemName // 子表表名
              };
              // }
            } else if (this.subtables()) { // 有子表   左右结构
              if (this.itemName === this.tableName) { // 主表
                // 无
              } else { // 子表勾选了明细传subparam
                obj.data = JSON.stringify({
                  [this.itemName]: idsOldTypeNumber
                });      
              }
            }
            params = obj;
          } else {
            //  console.log('请检查静默类型按钮action配置，例如:action:com.jackrain.nea.oc.oms.api.OcbOrderMergeMenuCmd:1.0:oms-fi);
          }
        } else if (Version() === '1.4') { // 1.4上下结构
          let obj = {};
          if (this.objectType === 'vertical') { // 上下结构
            if (this.subtables()) { // 有子表
              obj[this.tableName] = {
                ID: this.itemId
              };
            } else { // 没有子表
              obj = {
                ID: this.itemId
              };
            }
          } else if (this.subtables()) { // 有子表   左右结构
            if (this.itemName === this.tableName) { // 主表静默逻辑  走保存的逻辑
              obj[this.tableName] = {
                ID: this.itemId
              };
            } else if (this.itemInfo.tabrelation === '1:1') { // 子表静默逻辑    // 没有表格
              obj = {
                tableName: this.itemName, // 子表表名
                ids
              };
            } else { // 有表格
              obj = {
                tableName: this.itemName, // 子表表名
                ids
              };
            }
          }
          params = obj;
        }
       

        const promise = new Promise((resolve, reject) => {
          this.getObjTabActionSlientConfirm({
            tab, params, path: tab.action, resolve, reject 
          });
          this.$loading.show();
        });
        promise.then(() => {
          this.$loading.hide(this.tableName);
          const message = this.objTabActionSlientConfirmData.message;
          const data = {
            mask: true,
            title: '成功',
            content: `${message}`
          };
          this.$Modal.fcSuccess(data);
          if (tab.isrefrsh) {
            this.upData();
          }
        }, () => {
          this.$loading.hide(this.tableName);
        });
      },
      objTabActionDialog(tab) { // 动作定义弹出框
        this.$refs.dialogRef.open();
        const title = `${tab.webdesc}`;
        this.isrefrsh = tab.isrefrsh;
        this.dialogConfig = {
          title,
        };
        this.dialogConfig.footerHide = true;
        const url = tab.action;
        const index = url.lastIndexOf('/');
        const filePath = url.substring(index + 1, url.length);
        this.dialogComponentName = filePath;
      },
      objectEXPORT() { // 导出功能
        let page = {};
        if (this.objectType === 'horizontal') { // 横向布局
          this.tabPanel.every((item) => {
            if (this.itemName !== this.tableName && item.tablename === this.itemName) {
              page = item.tablePageInfo;
              return false;
            }
            return true;
          });
        } else {
          this.tabPanel.every((item) => {
            if (item.tablename === this.itemName) {
              page = item.tablePageInfo;
              return false;
            }
            return true;
          });
        }
        const { refcolid, tabledesc } = this.itemInfo;
        const itemSelected = Object.values(this.updateData[this.itemName].delete[this.itemName]).reduce((item, obj) => {
          item.push(obj.ID);
          return item;
        }, []);
        const selectedId = {
          ID: itemSelected
        };
        const searchdatas = {
          table: this.itemName,
          objectIds: `${refcolid}=${this.itemId}`,
          column_include_uicontroller: true,
          fixedcolumns: Object.values(this.updateData[this.itemName].delete[this.itemName]).length === 0 ? { ID: null } : selectedId,
          startindex: (Number(page.currentPageIndex) - 1) * Number(page.pageSize),
          range: page.pageSize,
        };

        const OBJ = {
          searchdata: JSON.stringify(searchdatas),
          filename: tabledesc,
          menu: tabledesc,
          filetype: '.xlsx',
          showColumnName: true,
        };


        const promise = new Promise((resolve, reject) => {
          this.$loading.show();
          this.getExportQueryForButtons({ OBJ, resolve, reject });
        });
        promise.then(() => {
          if (this.buttonsData.exportdata) {
            if (Version() === '1.4') {
              this.$loading.hide(this.tableName);
              const eleLink = document.createElement('a');
              const path = getGateway(`/p/cs/download?filename=${this.buttonsData.exportdata}`);
              eleLink.setAttribute('href', path);
              eleLink.style.display = 'none';
              document.body.appendChild(eleLink);
              eleLink.click();
              document.body.removeChild(eleLink);
            } else {
              const promises = new Promise((resolve, reject) => {
                this.getExportedState({
                  objid: this.buttonsData.exportdata, id: this.buttonsData.exportdata, resolve, reject 
                });
              });
              promises.then(() => {
                this.$loading.hide(this.tableName);
                if (this.exportTasks.dialog) {
                  const message = {
                    mask: true,
                    title: '提醒',
                    content: ' 本次操作已后台处理，是否至[我的任务]查看',
                    showCancel: true,
                    onOk: () => {
                      const type = 'tableDetailVertical';
                      const tab = {
                        type,
                        tableName: 'CP_C_TASK',
                        tableId: '24386',
                        id: this.buttonsData.exportdata
                      };
                      this.tabOpen(tab);
                      this.updataTaskMessageCount({ id: this.buttonsData.exportdata, stopUpdataQuantity: true });
                    }
                  };
                  this.$Modal.fcWarning(message);
                }
                if (this.exportTasks.successMsg) {
                  const data = {
                    mask: true,
                    title: '成功',
                    content: this.exportTasks.resultMsg
                  };
                  this.$Modal.fcSuccess(data);
                }
              }, () => {
                this.$loading.hide(this.tableName);
                if (this.exportTasks.warningMsg) {
                  this.$Modal.fcError({
                    mask: true,
                    title: '错误',
                    content: `${this.exportTasks.resultMsg}`
                  });
                }
              });
            }
           
            this.clearItemTableSearchValue();// 清除子表搜索框值
            if (this.objectType === 'horizontal') { // 横向布局
              let page = {};
              this.tabPanel.every((item) => {
                if (this.itemName !== this.tableName && item.tablename === this.itemName) {
                  page = item.tablePageInfo;
                  return false;
                }
                return true;
              });
              const { tablename } = this.itemInfo;
              const tabIndex = this.tabCurrentIndex;
              const searchdata = {
                column_include_uicontroller: true,
                startindex: 0,
                range: page.pageSize,
              };
              this.getObjectTableItemForTableData({
                table: tablename, objid: this.itemId, refcolid, searchdata, tabIndex
              });
            }
            this.updateDeleteData({ tableName: this.itemName, value: {} });
          } else {
            this.$loading.hide(this.tableName);
          }
        }, () => {
          this.$loading.hide(this.tableName);
        });
      },
      objectCopy() { // 按钮复制功能
        const id = 'New';// 修改路由,复制操作时路由为新增
        const label = `${this.activeTab.label.replace('编辑', '新增')}`;
        if (this.objectType === 'horizontal') { // 横向布局
          if (this.tabCurrentIndex === 0) { // 主表
            let formData = {};
            this.tabPanel.forEach((item) => {
              if (item.tablename === this.tableName) {
                formData = item.componentAttribute.panelData;
              }
            });
            const copyData = { ...formData };
            const modifyData = this.updateData[this.tableName].changeData;// 取changeData值，因外键形式需要lable和ID
            this.copyDataForSingleObject({ copyData });// 将复制所保存的数据存到global中
            this.copyModifyDataForSingleObject(modifyData);// 将复制修改过所保存的数据存到global中
            this.updateFormDataForRefshow();
            const type = 'tableDetailHorizontal';
            this.tabHref({// 跳转路由，复制是新增逻辑
              type,
              tableName: this.tableName,
              tableId: this.tableId,
              label,
              id
            });
          }
        } else { // 纵向布局
          const copyData = { ...this.mainFormInfo.formData };
          this.copyDataForSingleObject({ copyData });// 将复制所保存的数据存到global中
          const modifyData = this.updateData[this.tableName].changeData;// 取changeData值，因外键形式需要lable和ID
          // this.copyDataForSingleObject({ copyData });// 将复制所保存的数据存到global中
          this.copyModifyDataForSingleObject(modifyData);// 将复制修改过所保存的数据存到global中
          const type = 'tableDetailVertical';
          this.tabHref({
            type,
            tableName: this.tableName,
            tableId: this.tableId,
            label,
            id
          });
        }
        this.updataGlobalLoading(true);
        this.changeCopy(true);
      },
      copyForHorizontal() { // 横向结构接口 请求成功后复制逻辑
        this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/savaCopyData`, { copyDatas: this.copyDatas, tableName: this.tableName, modifyData: this.modifyData });
        this.copyDataForSingleObject({});// 清除global中复制所保存的数据
        this.$loading.show();
      },
      copyForVertical() { // 纵向结构接口 请求成功后复制逻辑
        this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/savaCopyData`, { copyDatas: this.copyDatas, tableName: this.tableName, modifyData: this.modifyData });
        this.copyDataForSingleObject({});// 清除global中复制所保存的数据
        this.$loading.show();
      },
      clickButtonsBack() { // 按钮返回事件   
        const { tableId, tableName } = this.$route.params;
        // 列表界面配置动态路由
        const routeMapRecord = getSeesionObject('routeMapRecord');
        const currentRoute = this.activeTab.routeFullPath;
        const keepAliveModuleName = getKeepAliveModuleName(this.$router.currentRoute);
        const tabUrl = keepAliveModuleName.substring(0, 1);
     

        // 单对象界面配置动态路由
        const routeMapRecordForSingleObject = getSeesionObject('routeMapRecordForSingleObject');
        const routeMapRecordForNew = getSeesionObject('routeMapRecord');

        const currentPath = this.$router.currentRoute.path;

       
        const SinglePageRouteNew = currentPath.substring(currentPath.indexOf('/') + 1, currentPath.lastIndexOf('/'));  
        const newListPageRouteNew = keepAliveModuleName.substring(currentPath.indexOf('.') + 1, currentPath.lastIndexOf('.'));        

        let routeMapRecordForSingleObjectNew = '';
        const routeMapRecordForListNew = {
          to: '',
          from: ''
        };

        if (this.itemId === 'New') { // 单对象界面配置动态路由时，由动态路由界面跳转的新增单对象界面，点击返回时需回到维护的关系中对应的路由
          Object.keys(routeMapRecordForSingleObject).map((item) => {
            if (item.indexOf(SinglePageRouteNew) > -1) {
              routeMapRecordForSingleObjectNew = item;
            }
          });
          Object.keys(routeMapRecordForNew).map((item) => {
            if (item.indexOf(newListPageRouteNew) > -1) {
              routeMapRecordForListNew.to = item;
              routeMapRecordForListNew.from = routeMapRecordForNew[item];
            }
          });
        }
        if (routeMapRecord[keepAliveModuleName]) {
          const param = {
            type: tabUrl,
            url: routeMapRecord[keepAliveModuleName]
          };
          this.tabOpen(param);
          const deleteValue = {
            k: 'keepAliveModuleName',
            v: keepAliveModuleName
          };
          updateSessionObject('dynamicRoutingIsBackForDelete', deleteValue);
          window.sessionStorage.setItem('dynamicRoutingIsBack', true);// 添加是动态路由返回列表界面标记
          // deleteFromSessionObject('routeMapRecord', keepAliveModuleName);
          this.decreasekeepAliveLists(keepAliveModuleName);
          this.tabCloseAppoint({ routeFullPath: currentRoute, stopRouterPush: true });
        } else if (routeMapRecordForSingleObject[currentPath]) {
          router.push(routeMapRecordForSingleObject[currentPath]);
          this.decreasekeepAliveLists(keepAliveModuleName);
          this.tabCloseAppoint({ routeFullPath: currentPath, stopRouterPush: true });
          this.clickButtonsRefresh();
        } else if (routeMapRecordForSingleObjectNew) {
          router.push(routeMapRecordForSingleObject[routeMapRecordForSingleObjectNew]);
          this.decreasekeepAliveLists(keepAliveModuleName);
          this.tabCloseAppoint({ routeFullPath: currentPath, stopRouterPush: true });
          this.clickButtonsRefresh();
        } else if (routeMapRecordForListNew.to) { // 动态路由（新增返回）
          const param = {
            type: tabUrl,
            url: routeMapRecordForListNew.from
          };
          this.tabOpen(param);
          if (routeMapRecordForListNew.from.indexOf('SYSTEM') > -1) { // 返回列表界面
            const deleteValue = {
              k: 'keepAliveModuleName',
              v: routeMapRecordForListNew.to
            };
            updateSessionObject('dynamicRoutingIsBackForDelete', deleteValue);
          } else {
            deleteFromSessionObject('routeMapRecord', routeMapRecordForListNew.to);// 清除动态路由对应关系
          }
          window.sessionStorage.setItem('dynamicRoutingIsBack', true);// 添加是动态路由返回列表界面标记
          this.decreasekeepAliveLists(keepAliveModuleName);
          this.tabCloseAppoint({ routeFullPath: currentRoute, stopRouterPush: true });
        } else {
          const param = {
            tableId,
            tableName,
            back: true,
          };
          this.tabHref(param);
        }
      },
      getbuttonGroupData(tabcmd) { // 按钮渲染逻辑
        const tabcmdData = tabcmd;
        if (tabcmdData.cmds) {
          // tabcmdData.cmds.forEach((item, index) => {
          if (this.objectType === 'horizontal') { // 横向布局
            if (this.itemName !== this.tableName) { // 子表
              const { tabrelation } = this.itemInfo;
              if (tabrelation === '1:m') { // 子表1:m显示导入按钮
                tabcmdData.cmds.forEach((item, index) => {
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
                        if (item === 'actionMODIFY') {
                          this.saveButtonPath = tabcmd.paths[index];
                        }
                      }
                      if (!this.instanceId) { // jflow开启时instanceId有值，刷新按钮不显示
                        this.updateRefreshButton(true);
                      }
                      if (this.tempStorage && this.tempStorage.temp_storage && this.tempStorage.temp_storage.isenable) {
                        this.dataArray.temporaryStorage = true;// 新增配置保存按钮时，显示暂存按钮
                      }
                      this.dataArray.refresh = this.refreshButtons;
                      this.dataArray.buttonGroupShowConfig.buttonGroupShow.push(buttonConfigInfo);
                    }
                  }
                });
              } else { // 纵向结构主表不显示导入  //1:1不显示导入按钮
                tabcmdData.cmds.forEach((item, index) => {
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
                        if (item === 'actionMODIFY') {
                          this.saveButtonPath = tabcmd.paths[index];
                        }
                      }
                      if (!this.instanceId) { // jflow开启时instanceId有值，刷新按钮不显示
                        this.updateRefreshButton(true);
                      }
                      if (this.tempStorage && this.tempStorage.temp_storage && this.tempStorage.temp_storage.isenable) {
                        this.dataArray.temporaryStorage = true;// 新增配置保存按钮时，显示暂存按钮
                      }
                      this.dataArray.refresh = this.refreshButtons;
                      this.dataArray.buttonGroupShowConfig.buttonGroupShow.push(buttonConfigInfo);
                    }
                  } else {
                    if (!this.instanceId) { // jflow开启时instanceId有值，刷新按钮不显示
                      this.updateRefreshButton(true);
                    }
                    this.dataArray.refresh = this.refreshButtons;
                  }
                });
              }
            } else { // 横向布局主表不显示导入
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
                        if (item === 'actionMODIFY') {
                          this.saveButtonPath = tabcmd.paths[index];
                        }
                      }
                      if (!this.instanceId) { // jflow开启时instanceId有值，刷新按钮不显示
                        this.updateRefreshButton(true);
                      }
                      if (this.tempStorage && this.tempStorage.temp_storage && this.tempStorage.temp_storage.isenable) {
                        this.dataArray.temporaryStorage = true;// 新增配置保存按钮时，显示暂存按钮
                      }
                      this.dataArray.refresh = this.refreshButtons;
                      this.dataArray.buttonGroupShowConfig.buttonGroupShow.push(buttonConfigInfo);
                    }
                  }
                }
              });
            }
          } else { // 纵向结构主表不显示导入
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
                      if (item === 'actionMODIFY') {
                        this.saveButtonPath = tabcmd.paths[index];
                      }
                    }
                    if (!this.instanceId) { // jflow开启时instanceId有值，刷新按钮不显示
                      this.updateRefreshButton(true);
                    }
                    if (this.tempStorage && this.tempStorage.temp_storage && this.tempStorage.temp_storage.isenable) {
                      this.dataArray.temporaryStorage = true;// 新增配置保存按钮时，显示暂存按钮
                    }
                    this.dataArray.refresh = this.refreshButtons;
                    this.dataArray.buttonGroupShowConfig.buttonGroupShow.push(buttonConfigInfo);
                  }
                }
              }
            });
          }
          //
        }
        // }
      },
      waListButtons(tabwebact) { // 自定义按钮渲染逻辑
        // if (tabwebact.objbutton && tabwebact.objbutton.length > 0) {
        //   this.webactButton(tabwebact.objbutton);
        // } else 
        if 
          (tabwebact.objtabbutton && tabwebact.objtabbutton.length > 0) {
          this.webactButton(tabwebact.objtabbutton);
        }
      },
      webactButton(buttonData) { // 自定义按钮渲染
        if (buttonData && buttonData.length > 0) {
          buttonData.forEach((item, index) => {
            if (item.ishide) {
              buttonData.splice(index);
            }
            this.dataArray.waListButtonsConfig.waListButtons.push(item);
          });
        }
      },
      addButtonShow(tabcmd) { // 判断按钮显示的条件是否为新增
        tabcmd.cmds.forEach((item, index) => {
          if (item === 'actionADD') {
            if (tabcmd.prem[index]) {
              if (this.tempStorage && this.tempStorage.temp_storage && this.tempStorage.temp_storage.isenable) {
                this.dataArray.temporaryStorage = true;// 新增配置保存按钮时，显示暂存按钮
              }
              this.dynamic.eName = 'actionMODIFY';
              this.dataArray.buttonGroupShowConfig.buttonGroupShow = [];
              if (this.tabcmd.paths) {
                this.dynamic.requestUrlPath = this.tabcmd.paths[index];
              }
              this.dataArray.buttonGroupShowConfig.buttonGroupShow.push(this.dynamic);
            }
          }
        });
      },
      objectTryDelete(obj) { // 删除
        // const searchData = {
        //   table: this.tableName,
        //   startIndex: 0,
        //   range: 10
        // };
        let page = {};
        if (this.objectType === 'horizontal') { // 横向布局
          this.tabPanel.every((item) => {
            if (this.itemName !== this.tableName && item.tablename === this.itemName) {
              page = item.tablePageInfo;
              return false;
            }
            return true;
          });
        } else {
          this.tabPanel.every((item) => {
            if (item.tablename === this.itemName) {
              page = item.tablePageInfo;
              return false;
            }
            return true;
          });
        }
        const tabIndex = this.tabCurrentIndex;
        if (this.subtables()) { // 存在子表
          if (this.objectType === 'horizontal') { // 横向布局
            if (this.itemName === this.tableName) { // 主表删除
              if (obj.requestUrlPath) { // 有path
                this.saveParameters();// 调用获取参数方法
                const data = {
                  title: '警告',
                  mask: true,
                  content: '确认执行删除?',
                  showCancel: true,
                  onOk: () => {
                    const promise = new Promise((resolve, reject) => {
                      this.performMainTableDeleteAction({
                        path: obj.requestUrlPath,
                        table: this.tableName,
                        objId: this.itemId,
                        currentParameter: this.currentParameter,
                        itemName: this.itemName,
                        isreftabs: this.subtables(),
                        itemNameGroup: this.itemNameGroup,
                        itemCurrentParameter: this.itemCurrentParameter,
                        tabIndex,
                        resolve,
                        reject
                      });
                    });

                    promise.then(() => {
                      const deleteMessage = this.buttonsData.deleteData;
                      if (deleteMessage) {
                        this.$Message.success(`${deleteMessage}`);
                        this.deleteSuccessEvent();
                        // this.$store.dispatch(`${this[MODULE_COMPONENT_NAME]}/getQueryListForAg`, searchData);
                        // this.clickButtonsBack();
                      }
                    }, () => {
                      const deleteMessage = this.buttonsData.deleteData;
                      if (deleteMessage) {
                        this.$Message.success(`${deleteMessage}`);
                      }
                    });
                  }
                };
                this.$Modal.fcWarning(data);
              } else { // 没有path
                // 没有path
                const data = {
                  title: '警告',
                  mask: true,
                  content: '确认执行删除?',
                  showCancel: true,
                  onOk: () => {
                    const promise = new Promise((resolve, reject) => {
                      this.performMainTableDeleteAction({
                        table: this.tableName, objId: this.itemId, resolve, reject
                      });
                    });
                    promise.then(() => {
                      const deleteMessage = this.buttonsData.deleteData;
                      this.$Message.success(`${deleteMessage}`);
                      this.deleteSuccessEvent();
                      // this.$store.dispatch(`${this[MODULE_COMPONENT_NAME]}/getQueryListForAg`, searchData);
                    }, () => {
                      const deleteMessage = this.buttonsData.deleteData;
                      if (deleteMessage) {
                        this.$Message.success(`${deleteMessage}`);
                      }
                    });
                  }
                };
                this.$Modal.fcWarning(data);
              }
            } else if (this.updateData[this.itemName].delete[this.itemName].length > 0) { // 子表删除
              this.saveParameters();// 调用获取参数方法
              if (obj.requestUrlPath) { // 有path
                this.saveParameters();// 调用获取参数方法
                const data = {
                  title: '警告',
                  mask: true,
                  content: '确认执行删除?',
                  showCancel: true,
                  onOk: () => {
                    const promise = new Promise((resolve, reject) => {
                      this.performMainTableDeleteAction({
                        path: obj.requestUrlPath,
                        table: this.tableName,
                        objId: this.itemId,
                        currentParameter: this.currentParameter,
                        itemName: this.itemName,
                        isreftabs: this.subtables(),
                        itemNameGroup: this.itemNameGroup,
                        itemCurrentParameter: this.itemCurrentParameter,
                        tabIndex,
                        resolve,
                        reject
                      });
                    });
                    promise.then(() => {
                      const deleteMessage = this.buttonsData.deleteData;
                      if (deleteMessage) {
                        this.$Message.success(`${deleteMessage}`);
                        const { tablename, refcolid, tabinlinemode } = this.itemInfo;
                        DispatchEvent('changePageForSelete');
                        // const searchdata = {
                        //   column_include_uicontroller: true,
                        //   startindex: (page.currentPageIndex - 1) * page.pageSize,
                        //   range: page.pageSize,
                        // };
                        // this.getObjectTableItemForTableData({
                        //   table: tablename, objid: this.itemId, refcolid, searchdata, tabIndex
                        // });
                        this.getInputForitemForChildTableForm({ table: tablename, tabIndex, tabinlinemode });
                        this.updateDeleteData({ tableName: this.itemName, value: {} });
                        this.updateDeleteData({ tableName: this.itemName, value: {} });
                        // this.clickButtonsBack();
                        // this.$store.dispatch(`${this[MODULE_COMPONENT_NAME]}/getQueryListForAg`, searchData);
                      }
                    }, () => {
                      const deleteMessage = this.buttonsData.deleteData;
                      if (deleteMessage) {
                        this.$Message.success(`${deleteMessage}`);
                      }
                    });
                  }
                };
                this.$Modal.fcWarning(data);
              } else { // 没有path
                // 没有path
                const data = {
                  title: '警告',
                  mask: true,
                  content: '确认执行删除?',
                  showCancel: true,
                  onOk: () => {
                    const promise = new Promise((resolve, reject) => {
                      this.performMainTableDeleteAction({
                        path: obj.requestUrlPath,
                        table: this.tableName,
                        objId: this.itemId,
                        currentParameter: this.currentParameter,
                        itemName: this.itemName,
                        isreftabs: this.subtables(),
                        itemNameGroup: this.itemNameGroup,
                        itemCurrentParameter: this.itemCurrentParameter,
                        tabIndex,
                        resolve,
                        reject
                      });
                    });
                    promise.then(() => {
                      const deleteMessage = this.buttonsData.deleteData;
                      if (deleteMessage) {
                        this.$Message.success(`${deleteMessage}`);
                        // this.clickButtonsBack();
                        // this.getQueryListForAg(searchData);
                        const { tablename, refcolid, tabinlinemode } = this.itemInfo;
                        DispatchEvent('changePageForSelete');
                        // const searchdata = {
                        //   column_include_uicontroller: true,
                        //   startindex: (page.currentPageIndex - 1) * page.pageSize,
                        //   range: page.pageSize,
                        // };
                        // this.getObjectTableItemForTableData({
                        //   table: tablename, objid: this.itemId, refcolid, searchdata, tabIndex
                        // });
                        this.getInputForitemForChildTableForm({ table: tablename, tabIndex, tabinlinemode });
                        this.updateDeleteData({ tableName: this.itemName, value: {} });
                      }
                    }, () => {
                      const deleteMessage = this.buttonsData.deleteData;
                      if (deleteMessage) {
                        this.$Message.success(`${deleteMessage}`);
                      }
                    });
                  }
                };
                this.$Modal.fcWarning(data);
              }
            } else {
              const data = {
                mask: true,
                title: '警告',
                content: `请先选择需要${obj.name}的记录！`
              };
              this.$Modal.fcWarning(data);
            }
          } else if (this.objectType === 'vertical') {
            if (obj.requestUrlPath) { // 有path
              this.saveParameters();// 调用获取参数方法
              const data = {
                title: '警告',
                mask: true,
                content: '确认执行删除?',
                showCancel: true,
                onOk: () => {
                  const promise = new Promise((resolve, reject) => {
                    this.performMainTableDeleteAction({
                      path: obj.requestUrlPath,
                      table: this.tableName,
                      objId: this.itemId,
                      currentParameter: this.currentParameter,
                      itemName: this.itemName,
                      isreftabs: this.subtables(),
                      itemNameGroup: this.itemNameGroup,
                      itemCurrentParameter: this.itemCurrentParameter,
                      resolve,
                      reject
                    });
                  });
                  promise.then(() => {
                    const deleteMessage = this.buttonsData.deleteData;
                    if (deleteMessage) {
                      this.$Message.success(`${deleteMessage}`);
                      this.deleteSuccessEvent();
                      // this.$store.dispatch(`${this[MODULE_COMPONENT_NAME]}/getQueryListForAg`, searchData);
                    }
                  }, () => {
                    const deleteMessage = this.buttonsData.deleteData;
                    if (deleteMessage) {
                      this.$Message.success(`${deleteMessage}`);
                    }
                  });
                }
              };
              this.$Modal.fcWarning(data);
            } else { // 没有path
              // 没有path
              const data = {
                title: '警告',
                mask: true,
                content: '确认执行删除?',
                showCancel: true,
                onOk: () => {
                  const promise = new Promise((resolve, reject) => {
                    this.performMainTableDeleteAction({
                      table: this.tableName, objId: this.itemId, resolve, reject
                    });
                  });
                  promise.then(() => {
                    const deleteMessage = this.buttonsData.deleteData;
                    if (deleteMessage) {
                      this.$Message.success(`${deleteMessage}`);
                      this.deleteSuccessEvent();
                      // this.$store.dispatch(`${this[MODULE_COMPONENT_NAME]}/getQueryListForAg`, searchData);
                    }
                  }, () => {
                    const deleteMessage = this.buttonsData.deleteData;
                    if (deleteMessage) {
                      this.$Message.success(`${deleteMessage}`);
                    }
                  });
                }
              };
              this.$Modal.fcWarning(data);
            }
          }
        } else if (obj.requestUrlPath) { // 有path，没有子表
          const data = {
            title: '警告',
            mask: true,
            content: '确认执行删除?',
            showCancel: true,
            onOk: () => {
              const promise = new Promise((resolve, reject) => {
                this.performMainTableDeleteAction({
                  path: obj.requestUrlPath, table: this.tableName, objId: this.itemId, resolve, reject
                });
              });
              promise.then(() => {
                const deleteMessage = this.buttonsData.deleteData;
                if (deleteMessage) {
                  this.$Message.success(`${deleteMessage}`);
                  this.deleteSuccessEvent();
                  // this.$store.dispatch(`${this[MODULE_COMPONENT_NAME]}/getQueryListForAg`, searchData);
                }
              }, () => {
                const deleteMessage = this.buttonsData.deleteData;
                if (deleteMessage) {
                  this.$Message.success(`${deleteMessage}`);
                }
              });
            }
          };
          this.$Modal.fcWarning(data);
        } else {
          // 没有path
          const data = {
            title: '警告',
            mask: true,
            content: '确认执行删除?',
            showCancel: true,
            onOk: () => {
              const promise = new Promise((resolve, reject) => {
                this.performMainTableDeleteAction({
                  table: this.tableName, objId: this.itemId, resolve, reject
                });
              });
              promise.then(() => {
                const deleteMessage = this.buttonsData.deleteData;
                if (deleteMessage) {
                  this.$Message.success(`${deleteMessage}`);
                  this.deleteSuccessEvent();
                  // this.$store.dispatch(`${this[MODULE_COMPONENT_NAME]}/getQueryListForAg`, searchData);
                }
              }, () => {
                const deleteMessage = this.buttonsData.deleteData;
                if (deleteMessage) {
                  this.$Message.success(`${deleteMessage}`);
                }
              });
            }
          };
          this.$Modal.fcWarning(data);
        }
        if (this.itemInfo.webact) { // 兼容半定制界面
          DispatchEvent('customizeClick', {
            detail: {
              type: 'delete'
            }
          });
        }
      },
      deleteSuccessEvent() {
        const value = this.hideBackButton();
        if (value) {
          const keepAliveModuleName = this.activeTab.keepAliveModuleName;
          const currentRoute = this.$router.currentRoute.path;
          this.decreasekeepAliveLists(keepAliveModuleName);
          this.tabCloseAppoint({ tableName: this.tableName, routeFullPath: currentRoute });
        } else {
          this.clickButtonsBack();
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
        // setTimeout(() => {
        //   // this.emptyChangeData(this.tableName);
        //   // this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/emptyChangeData`, this.tableName);
        // }, 2000);
        // setTimeout(() => {
        //   this.getObjectTabForMainTable({ table: this.tableName, objid: 'New' });
        //   this.getObjectForMainTableForm({ table: this.tableName, objid: 'New' });
        //   this.buttonShowType = 'add';
        // }, 2000);
      },
      objectSave(obj) { // 保存按钮事件逻辑
        if (this.itemId === 'New') { // 主表新增保存和编辑新增保存
          if (this.verifyRequiredInformation()) {
            this.mainTableNewSaveAndEditorNewSave();
          }
        } else if (this.itemId !== '-1') { // 主表编辑保存
          this.mainTableEditorSave(obj);
        }
      },
      mainTableNewSaveAndEditorNewSave() { // 主表新增保存和编辑新增保存
        this.saveParameters();// 调用获取参数方法
        const itemName = this.itemName;// 子表表名
        const itemCurrentParameter = this.itemCurrentParameter;
        // console.log('主表新增保存和编辑新增保存');
        const type = 'add';
        const path = this.dynamic.requestUrlPath;
        const objId = -1;

        if (!this.subtables()) { // 为false的情况下是没有子表
          // console.log('没有子表');
          if (this.dynamic.requestUrlPath) { // 配置path
            // console.log(' 主表新增保存,配置path的', this.dynamic.requestUrlPath);
            this.savaNewTable(type, path, objId);
          } else { // 没有配置path
            this.savaNewTable(type, path, objId);
          }
        }
        if (this.subtables()) { // 存在子表
          // console.log('有子表');
          if (this.dynamic.requestUrlPath) { // 配置path
            this.savaNewTable(type, path, objId, itemName, itemCurrentParameter);
          } else { // 没有配置path
            this.savaNewTable(type, path, objId, itemName, itemCurrentParameter);
          }
        }
      },
      mainTableEditorSave(obj) { // 主表编辑保存
        // console.log('主表编辑保存');
        this.saveParameters();// 调用获取参数方法
        // const itemName = this.itemName;// 子表表名
        // const itemCurrentParameter = this.itemCurrentParameter;
        const path = obj.requestUrlPath;
        const type = 'modify';
        if (!this.subtables()) { // 为false的情况下是没有子表
          // console.log('没有子表',);
          if (this.verifyRequiredInformation()) {
            if (obj.requestUrlPath) { // 配置path
              // console.log('主表编辑保存,配置path的逻辑', obj.requestUrlPath);
              this.savaNewTable(type, path, this.itemId);
            } else { // 没有配置path
              // console.log('主表编辑保存,没有配置path的逻辑');
              const objId = this.itemId;
              this.savaNewTable(type, path, objId);
            }
          }
        }
        if (this.subtables()) { // 为true的情况下是存在子表
          this.mainTableEditorSaveIsreftabs(obj);
        }
      },
    
      mainTableEditorSaveIsreftabs(obj) { // 主表编辑保存存在子表
        const itemName = this.itemName;// 子表表名
        const itemCurrentParameter = this.itemCurrentParameter;
        const path = obj.requestUrlPath;
        const type = 'modify';
        const objId = this.itemId;
        if (this.objectType === 'vertical') {
          // if (Object.values(this.updateData[itemName].add[itemName]).length < 1) {
          // } else {
          //   this.itemTableValidation = true;
          // }
          if (this.verifyRequiredInformation()) { // 纵向结构保存校验
            let itemModify = [];
            let itemAdd = [];
            if (this.updateData[itemName].modify && this.updateData[itemName].modify[itemName]) {
              itemModify = Object.values(this.updateData[itemName].modify[itemName]);
            }
            if (this.updateData[itemName] && this.updateData[itemName].add[itemName]) {
              itemAdd = Object.values(this.updateData[itemName].add[itemName]);
            }
            // if (this.updateData[itemName] && this.updateData[itemName].modify[itemName] && Object.values(this.updateData[itemName].modify[itemName]).length === 0 && Object.values(this.updateData[itemName].add[itemName]).length === 0) {
            if (itemModify.length === 0 && itemAdd.length === 0) {
              // if (!this.updateData[itemName].modify[itemName] && !this.updateData[itemName].add[itemName]) { // 主表修改保存（判断子表无新增且无修改）
              if (obj.requestUrlPath) { // 配置path
                this.savaNewTable(type, path, objId, itemName, itemCurrentParameter);
              } else { // 没有配置path    if (this.verifyRequiredInformation()) {
                this.savaNewTable(type, path, objId, itemName, itemCurrentParameter);
              }
              // }
            } else {
              if (itemModify.length > 0 && itemAdd.length < 1) { // 子表表格编辑修改
                // 校验子表表格必填项
               
                if (this.tempStorage && this.tempStorage.temp_storage && this.tempStorage.temp_storage.isenable && this.temporaryStoragePath) {
                  this.savaNewTable(type, path, objId, itemName, itemCurrentParameter, { sataType: 'modify' });
                } else if (this.itemTableCheckFunc()) {
                  this.savaNewTable(type, path, objId, itemName, itemCurrentParameter, { sataType: 'modify' });
                }
              }
              // const add = Object.assign({}, this.updateData[itemName].add[itemName], this.updateData[itemName].addDefault[itemName]);// 整合子表新增和默认值数据
              if (itemAdd.length > 0 && itemModify.length < 1) { // 子表新增
                this.savaNewTable(type, path, objId, itemName, itemCurrentParameter, { sataType: 'add' });
              }
              if (itemAdd.length > 0 && itemModify.length > 0) {
                if (this.tempStorage && this.tempStorage.temp_storage && this.tempStorage.temp_storage.isenable && this.temporaryStoragePath) {
                  this.savaNewTable(type, path, objId, itemName, itemCurrentParameter, { sataType: 'addAndModify' });
                } else if (this.itemTableCheckFunc()) {
                  this.savaNewTable(type, path, objId, itemName, itemCurrentParameter, { sataType: 'addAndModify' });
                }
              }
            }
          }
        } else { // 横向结构
          let modify = [];
          let add = [];
          if (this.updateData[itemName].modify && this.updateData[itemName].modify[itemName]) {
            modify = Object.values(this.updateData[itemName].modify[itemName]);
          }
          if (this.updateData[itemName].add && this.updateData[itemName].add[itemName]) {
            add = Object.keys(this.updateData[itemName].add[itemName]);
          }
          // if (modify.length > 0 && add.length < 1) {
          //   this.itemTableValidation = true;
          // } else if (modify.length > 0 && add.length > 0) {
          //   this.itemTableValidation = false;
          // }
          if (itemName === this.tableName) {
            if (this.verifyRequiredInformation()) { // 横向结构保存校验
              if (obj.requestUrlPath) { // 配置path
                this.savaNewTable(type, path, objId, itemName, itemCurrentParameter);
              } else { // 没有配置path
                this.savaNewTable(type, path, objId, itemName, itemCurrentParameter);
              }
            }
          } else {
            let itemModify = [];
            let itemAdd = [];
            if (this.updateData[itemName].modify && this.updateData[itemName].modify[itemName]) {
              itemModify = Object.values(this.updateData[itemName].modify[itemName]);
            }
            if (this.updateData[itemName].add && this.updateData[itemName].add[itemName]) {
              itemAdd = Object.values(this.updateData[itemName].add[itemName]);
            }
            if (itemAdd.length > 0 && itemModify.length > 0) {
              if (this.verifyRequiredInformation()) { // 横向结构保存校验
                this.savaNewTable(type, path, objId, itemName, itemCurrentParameter, { sataType: 'addAndModify' });
              }
            }
            if (itemAdd.length > 0 && itemModify.length < 1) {
              if (this.verifyRequiredInformation()) { // 横向结构保存校验
                this.savaNewTable(type, path, objId, itemName, itemCurrentParameter, { sataType: 'add' });
              }
            }
            if (itemModify.length > 0 && itemAdd.length < 1) { // 子表表格编辑修改
              // this.itemTableCheckFunc();// 校验子表表格必填项
              

              if (this.tempStorage && this.tempStorage.temp_storage && this.tempStorage.temp_storage.isenable && this.temporaryStoragePath) {
                this.savaNewTable(type, path, objId, itemName, itemCurrentParameter, { sataType: 'modify' });
              } else if (this.itemTableCheckFunc()) {
                if (this.verifyRequiredInformation()) { // 横向结构保存校验
                  this.savaNewTable(type, path, objId, itemName, itemCurrentParameter, { sataType: 'modify' });
                }
              }
            }

            // if (Version() === '1.3') {
            //   let mainModify = [];
            //   if (this.updateData && this.updateData[this.tableName] && this.updateData[this.tableName].modify) {
            //     mainModify = Object.values(this.updateData[this.tableName].modify[this.tableName]);
            //   }
            //   if (mainModify.length > 0) {
            //     this.savaNewTable(type, path, objId, itemName, itemCurrentParameter);
            //   }
            // }
          }
        }
      },
      verifyRequiredInformation() { // 验证表单必填项
        if (this.temporaryStorage) {
          this.temporaryStorage = false;
          return true;
        }
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
        if (this.subtables()) { // 存在子表时
          let tabinlinemode = '';
          this.tabPanel.forEach((item) => {
            if (item.tablename === this.itemName) {
              tabinlinemode = item.tabinlinemode;
            }
          });
          if (tabinlinemode === 'Y') { // 当子表中存在form时
            if (!this.itemTableValidation) {
              const itemCheckedInfo = this.itemCurrentParameter.checkedInfo;// 子表校验信息
              this.saveParameters();
              if (this.objectType === 'vertical') {
                if (this.itemId === 'New') {
                  if (this.itemNameGroup.length > 0) { // 有子表
                    if (KEEP_SAVE_ITEM_TABLE_MANDATORY) { // 为true时，子表没有必填项也必须要输入值才能保存
                      const addInfo = this.itemCurrentParameter.add[this.itemName];
                      if (itemCheckedInfo) {
                        const itemMessageTip = itemCheckedInfo.messageTip;
                        if (itemMessageTip) {
                          if (itemMessageTip.length > 0) {
                            this.$Message.warning(itemMessageTip[0]);
                            itemCheckedInfo.validateForm.focus();
                            return false;
                          }
                        } if (Object.values(addInfo).length < 1) {
                          this.$Message.warning('个人信息不能为空!');

                          return false;
                        }
                      }
                    } else if (itemCheckedInfo) {
                      const itemMessageTip = itemCheckedInfo.messageTip;
                      if (itemMessageTip) {
                        if (itemMessageTip.length > 0) {
                          this.$Message.warning(itemMessageTip[0]);
                          itemCheckedInfo.validateForm.focus();
                          return false;
                        }
                      }
                    }
                  }
                } else if (Object.values(this.itemCurrentParameter.add[this.itemName]).length > 0) { // 处理当子表填入一个必填项值时，其余必填项必须填写
                  const itemMessageTip = itemCheckedInfo.messageTip;
                  if (itemMessageTip) {
                    if (itemMessageTip.length > 0) {
                      this.$Message.warning(itemMessageTip[0]);
                      itemCheckedInfo.validateForm.focus();
                      return false;
                    }
                  }
                }
              } else if (itemCheckedInfo) {
                const itemMessageTip = itemCheckedInfo.messageTip;
                if (itemMessageTip) {
                  if (itemMessageTip.length > 0) {
                    this.$Message.warning(itemMessageTip[0]);
                    itemCheckedInfo.validateForm.focus();
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
        const isreftabs = this.subtables();
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
          isreftabs: this.temporaryStoragePath ? false : isreftabs,
          sataType,
          itemNameGroup,
          temporaryStoragePath: this.temporaryStoragePath
        };
        const promise = new Promise((resolve, reject) => {
          this.performMainTableSaveAction({ parame, resolve, reject });
        });
        this.temporaryStoragePath = '';
        let stop = false;
        let removeMessage = false;
        promise.then(() => {
          this.clearEditData();// 清空store update数据
          stop = false;
          removeMessage = false;
          this.saveAfter(type, tableName, stop, removeMessage);
          if (this.itemInfo.webact) { // 兼容半定制界面，保存成功时通知外部
            DispatchEvent('customizeClick', {
              detail: {
                type: 'save',
                mainTableParame: this.currentParameter,
                itemTableParame: this.itemCurrentParameter
              }
            });
          }
          if (enableJflow()) { // jflow开启时，保存成功需通知
            DispatchEvent('jflowPlugin', {
              detail: {
                obj: {
                  button: 'save'
                }
              }
            });
          }
        }, () => {
          stop = true;
          removeMessage = true;
          this.saveAfter(type, tableName, stop, removeMessage);
        }).then(() => {

        });
      },
      saveAfter(type, tableName, stop, removeMessage) {
        if (!stop) { // 保存失败时，不清空store里面存的参数，
          this.clearEditData();// 清空store update数据
        } else { // 保存失败不执行任何逻辑
          this.saveEventAfter = '';
          return;
        }
        if (type === 'add') { // 横向结构新增主表保存成功后跳转到编辑页面
          // this.updateChangeData({ tableName: this.tableName, value: {} });
          if (!stop) { // 如果保存失败，不执行以下操作
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
              id: this.buttonsData.newMainTableSaveData ? this.buttonsData.newMainTableSaveData.objId : this.itemId
            };

            this.tabHref(tab);
          }
          const message = this.buttonsData.message;
          const data = {
            title: '成功',
            content: `${message}`
          };
          if (message) {
            this.$Message.success(data);
          }
          this.decreasekeepAliveLists(this[MODULE_COMPONENT_NAME]);
        } else {
          this.saveEventAfterClick(stop, removeMessage);// 保存成功后执行的事件
        }
      },
      clearEditData() {
        if (this.objectType === 'vertical') {
          if (this.subtables() && this.itemNameGroup.length > 0) {
            this.clearMainEditData();
            this.clearItemEditData();
          } else {
            this.clearMainEditData();
          }
        } else if (this.itemName === this.tableName) {
          this.clearMainEditData();
        } else {
          this.clearItemEditData();
        }
      },
      clearMainEditData() {
        this.updateChangeData({ tableName: this.tableName, value: {} });
        this.updateModifyData({ tableName: this.tableName, value: {} });
        this.updateAddDefaultData({ tableName: this.tableName, value: {} });
        this.updateAddData({ tableName: this.tableName, value: {} });
        this.updateDeleteData({ tableName: this.tableName, value: {} });
      },
      clearItemEditData() {
        this.updateChangeData({ tableName: this.itemName, value: {} });
        this.updateModifyData({ tableName: this.itemName, value: {} });
        this.updateAddDefaultData({ tableName: this.itemName, value: {} });
        this.updateAddData({ tableName: this.itemName, value: { } });
        this.updateDeleteData({ tableName: this.itemName, value: {} });
      },
      saveParameters() { // 筛选按钮保存参数逻辑
        if (this.subtables()) { // 有子表
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
      },
      saveEventAfterClick(stop, removeMessage) { // 保存成功后执行的事件
        this.clearEditData();// 清空store update数据
        if (!stop) {
          if (this.saveEventAfter === 'submit') { // 提交操作
            const promise = new Promise((resolve, reject) => {
              this.getObjectTrySubmit({
                objId: this.itemId, table: this.tableName, path: this.saveButtonPath, isreftabs: this.isreftabs, resolve, reject
              });
            });
            // let message = '';
            promise.then(() => {
                           const message = this.buttonsData.submitData.message;
                           if (message) {
                             this.upData(`${message}`);
                           } else {
                             this.upData();
                           }
                           this.saveEventAfter = '';
                         },
                         () => { // 状态为rejected时执行
                           this.upData();
                           this.saveEventAfter = '';
                         });
          } else if (this.saveEventAfter === 'invalid') {
            const promise = new Promise((resolve, reject) => {
              this.getObjectTryInvalid({
                objId: this.itemId, table: this.tableName, path: this.saveButtonPath, isreftabs: this.isreftabs, resolve, reject
              });
            });
            // let message = '';
            promise.then(() => {
              const message = this.buttonsData.invalidData.message;
              if (message) {
                this.upData(`${message}`);
              } else {
                this.upData();
              }
              this.saveEventAfter = '';
            }, () => { // 状态为rejected时执行
              this.upData();
              this.saveEventAfter = '';
            });
          } else { // 保存后的保存成功提示信息
            const message = this.buttonsData.message;
            if (message) {
              this.upData(`${message}`);
            } else if (removeMessage) {
              this.upData();
            } else {
              this.upData('保存成功');
            }
          }
        } else {
          this.upData();
        }
      },
      networkEventListener(event) {
        const { detail } = event;
        const { response } = detail;
        const url = '/p/cs/getObject';
        if (!this._inactive && url === detail.url) {
          if (response && response.data && response.data.code === 0) {
            if (this.copyDatas) {
              if (this.objectType === 'vertical') {
                this.copyForVertical();
              } else {
                this.copyForHorizontal();
              }
            }
          }
        }
      },
      jflowClick(event) {
        if (event.detail.type === 'submit') {
          const promise = new Promise((resolve, reject) => {
            const submitButtonPath = (Version() === '1.4') ? this.defaultButtonData.tabcmd.paths[this.defaultButtonData.tabcmd.cmds.indexOf('actionSUBMIT')] : null;
            this.getObjectTrySubmit({
              objId: this.itemId, table: this.tableName, path: submitButtonPath, isreftabs: this.isreftabs, resolve, reject
            });
          });
          // promise.then(() => {
          //                const message = this.buttonsData.submitData.message;
          //                if (message) {
          //                  this.upData(`${message}`);
          //                } else {
          //                  this.upData();
          //                }
          //                this.saveEventAfter = '';
          //              },
          //              () => { // 状态为rejected时执行
          //                this.upData();
          //                this.saveEventAfter = '';
          //              });
        }

        if (event.detail.type === 'refresh') {
          this.clickButtonsRefresh();
        }

        if (event.detail.type === 'clearSubmit') {
          this.saveEventAfter = '';
        }
      },
      hideBackButton() {
        const clickMenuAddSingleObjectData = getSeesionObject('clickMenuAddSingleObject');
        const currentRoute = this.$router.currentRoute.path;
        if (this.itemId === 'New') {
          if (clickMenuAddSingleObjectData[currentRoute]) { // 不显示返回按钮
            this.dataArray.back = false;
            // deleteFromSessionObject('clickMenuAddSingleObject', currentRoute);
            // updateSessionObject('clickMenuAddSingleObject', clickMenuAddSingleObjectData);
            return true;
          }
          return false;
        } 
        const addRouteToEditorData = getSeesionObject('addRouteToEditor');
        let flag = false;
        Object.keys(addRouteToEditorData).some((a) => { // 菜单跳转单对象新增，保存后跳转到编辑界面，满足记录规则三维护的关系中存在当前菜单跳转新增界面匹配的对应关系，不显示返回按钮
          if (addRouteToEditorData[a] === clickMenuAddSingleObjectData[a] && currentRoute.indexOf(clickMenuAddSingleObjectData[a]) !== -1) {
            flag = true;
          }
        });


        if (flag) {
          this.dataArray.back = false;
          deleteFromSessionObject('clickMenuAddSingleObject', currentRoute);
          return true;
        }
        let flagForRouteMapRecord = false;
        const routeFullPath = this.activeTab.routeFullPath;
        const routeMapRecordForHideBackButtonData = getSeesionObject('routeMapRecordForHideBackButton');
        Object.keys(routeMapRecordForHideBackButtonData).map((item) => {
          if (routeFullPath === item) {
            flagForRouteMapRecord = true;
          }
        });
        if (flagForRouteMapRecord) {
          this.dataArray.back = false;
          // deleteFromSessionObject('routeMapRecordForHideBackButton', keepAliveModuleName);
          return true;
        }

        return false;
      },
      hideLoading(value) {
        const currentTableName = this[MODULE_COMPONENT_NAME].split('.')[1];
        // const dom = document.querySelector(`#${currentTableName}-loading`);
        if (value.detail.hideCopyLoading || value.detail.hideLoadingForButton) {
          this.$loading.hide(currentTableName);
        }
      }
    },  
    beforeDestroy() {
      window.removeEventListener('jflowClick', this.jflowClick);
      window.removeEventListener('network', this.networkEventListener);
      window.addEventListener('globalNoticeCopy', this.hideLoading);
      window.removeEventListener(`${this[MODULE_COMPONENT_NAME]}globaVerifyMessageClosed`, this.hideLoading);
    },
    mounted() {
      this.hideBackButton();
      if (!this.itemNameGroup.map(c => c.tableName).includes(this.itemName)) { // 子表不添加loading
        this.$loading.show();
      }
      if (!this._inactive) {
        window.addEventListener('jflowClick', this.jflowClick);
        window.addEventListener(`${this[MODULE_COMPONENT_NAME]}globaVerifyMessageClosed`, this.hideLoading);
        window.addEventListener('globalNoticeCopy', this.hideLoading);
        window.addEventListener('network', this.networkEventListener);// 监听接口
      }
      if (this.objectType === 'horizontal') { // 横向布局
        this.tabPanel.forEach((item) => {
          if (this.itemName !== this.tableName) {
            const objreadonly = item.componentAttribute.buttonsData.data.objreadonly;
            if (objreadonly) {
              if (this.tabcmd.cmds && this.tabcmd.cmds.length > 0) {
                this.tabcmd.cmds.forEach((item, index) => {
                  if (item === 'actionMODIFY' || item === 'actionDELETE' || item === 'actionIMPORT' || item === 'actionCANCOPY') {
                    this.tabcmd.prem[index] = false;
                  }
                });
              }
            }
            if (Version() === '1.4' && this.itemInfo && this.itemInfo.tabrelation === '1:1') { // 1对1的只有modify和export根据prem来，其他几个按钮就默认不显示
              if (this.tabcmd.cmds && this.tabcmd.cmds.length > 0) {
                this.tabcmd.cmds.forEach((item, index) => {
                  if (item !== 'actionMODIFY' || item !== 'actionEXPORT') {
                    this.tabcmd.prem[index] = false;
                  }
                });
              }
            }
        
            const { tabinlinemode } = this.itemInfo;
            if (tabinlinemode === 'N') {
              if (this.tabcmd.cmds && this.tabcmd.cmds.length > 0) {
                this.tabcmd.cmds.forEach((item, index) => {
                  if (item === 'actionMODIFY' || item === 'actionDELETE' || item === 'actionIMPORT') {
                    this.tabcmd.prem[index] = false;
                  }
                });
              }
            }
            if (this.disableExport) {
              if (this.tabcmd.cmds && this.tabcmd.cmds.length > 0) {
                this.tabcmd.cmds.forEach((item, index) => {
                  if (item === 'actionEXPORT') {
                    this.tabcmd.prem[index] = false;
                  }
                });
              }
            }
          }
        });
      }
      
      if (this.tabcmd.cmds && this.tabcmd.cmds.length > 0) {
        this.buttonsReorganization(this.tabcmd);
      }
      this.waListButtons(this.tabwebact);
      if (this.jflowPluginDataArray) {
        this.dataArray.jflowPluginDataArray = this.jflowPluginDataArray;
      }
    },
    created() {
      this.ChineseDictionary = ChineseDictionary;
      const { tableName, tableId, itemId } = router.currentRoute.params;
      this.tableName = tableName;
      this.tableId = tableId;
      this.itemId = itemId;
      this.buttonMap = buttonmap;
    },
    activated() {
    }
  };
</script>

<style lang="less">
.singleObjectButton {
  .buttonGroup {
    padding: 10px 0 5px 0;
  }
    .submit-img { //no-active
    position: absolute;
    top: 30px;
    right: 60px;
    width: 104px;
    z-index: 1000;

    img {
      width: 100%;
    }
  }
}
</style>
