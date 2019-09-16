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
      :main-id="tableId"
      @confirmImport="importsuccess"
      @closeDialog="closeActionDialog"
    />
    <!-- @confirmImport="" -->
  </div>
</template>

<script>

  import { mapMutations, mapState } from 'vuex';
  import buttonmap from '../assets/js/buttonmap';
  import ButtonGroup from './ButtonComponent';
  import router from '../__config__/router.config';
  import Dialog from './Dialog.vue';
  import WaterMark from './WaterMark.vue';
  import ImportDialog from './ImportDialog';
  import { KEEP_SAVE_ITEM_TABLE_MANDATORY, Version, MODULE_COMPONENT_NAME } from '../constants/global';
  import { getGateway } from '../__utils__/network';
  import { DispatchEvent } from '../__utils__/dispatchEvent';


  export default {
    data() {
      return {
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
      tabcmd: {
        handler(val) {
          if (Object.keys(val).length > 0) {
            this.dataArray.buttonGroupShowConfig.buttonGroupShow = [];
            if (this.objectType === 'horizontal') { // 横向布局
              this.tabPanel.forEach((item) => {
                const objreadonly = item.componentAttribute.buttonsData.data.objreadonly;
                if (objreadonly) {
                  val.cmds.forEach((item, index) => {
                    if (item === 'actionMODIFY' || item === 'actionDELETE' || item === 'actionIMPORT' || item === 'actionCANCOPY') {
                      val.prem[index] = false;
                      this.clickButtonsRefresh();
                    }
                  });
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
            } else if (this.mainFormInfo.buttonsData.data.objreadonly) { // 是否为只读(当配置了只读时，以下类型按钮不显示)
              //  || item === 'actionCANCOPY'
              val.cmds.forEach((item, index) => {
                if (item === 'actionMODIFY' || item === 'actionDELETE' || item === 'actionIMPORT') {
                  val.prem[index] = false;
                  this.clickButtonsRefresh();
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
        const textMap = {
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
          void: '已作废'
        };
        if (this.watermarkimg.includes('/static/img/')) {
          const src = this.watermarkimg.split('/')[3].split('.')[0];
          return textMap[src];
        }
        return '';
      }, // 水印组件的文字
      waterMarkColor() {
        const colorMap = {
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
          void: '#979797'
        };
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
    },
    props: {
      watermarkimg: {
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
      childTableName: {// 子表表名
        type: String,
        default: ''
      },
      itemTableCheckFunc: {
        type: Function,
        default: () => {}
      },
      clearItemTableSearchValue: {
        type: Function,
        default: () => {}
      },
    },
    inject: [MODULE_COMPONENT_NAME],
    methods: {
      ...mapMutations('global', ['copyDataForSingleObject', 'tabHref', 'tabOpen', 'decreasekeepAliveLists', 'copyModifyDataForSingleObject', 'increaseLinkUrl', 'addKeepAliveLabelMaps', 'addServiceIdMap']),
      dialogComponentSaveSuccess() { // 自定义弹框执行确定按钮操作
        if (this.isrefrsh) {
          this.upData();
        }
      },
      // subtables() {
      //   if (Version() === 1.4) {
      //     if (this.isreftabs) {
      //       return true;
      //     }
      //     return false;
      //   } if (Version() === 1.3) {
      //     if (this.itemNameGroup.length > 0) {
      //       return true;
      //     }
      //     return false;
      //   }
      // },
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
        } else if (type === 'extraposition') {
          this.clickExtraposition(obj);
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
        
        this.clearEditData();
        const message = '刷新成功';
        this.upData(`${message}`);
      },
      upData(message) { // 页面刷新判断逻辑
        DispatchEvent('tabRefreshClick');
        DispatchEvent('jflowPlugin', {
          detail: {
            type: 'fresh'
          }
        });
        const {
          tablename, refcolid, tabrelation, tabinlinemode
        } = this.itemInfo;
        const tabIndex = this.tabCurrentIndex;
        if (this.objectType === 'horizontal') { // 横向布局
          if (this.tabCurrentIndex === 0) { // 主表
            this.getObjectTabForMainTable({ table: this.tableName, objid: this.itemId, tabIndex });
          } else if (tabrelation === '1:m') { // 子表
            this.getInputForitemForChildTableForm({ table: tablename, tabIndex, tabinlinemode });
            this.getObjectTabForChildTableButtons({
              maintable: this.tableName, table: tablename, objid: this.itemId, tabIndex
            });
            const searchdata = {
              column_include_uicontroller: true,
              startindex: (Number(this.tablePageInfo.currentPageIndex) - 1) * Number(this.tablePageInfo.pageSize),
              range: this.tablePageInfo.pageSize,
            };
            this.getObjectTableItemForTableData({
              table: tablename, objid: this.itemId, refcolid, searchdata, tabIndex
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
          this.getObjectForMainTableForm({ table: this.tableName, objid: this.itemId, tabIndex });
          this.getObjectTabForMainTable({ table: this.tableName, objid: this.itemId, tabIndex });
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
        case 'actionGROUPSUBMIT': // 批量提交
          this.objectGROUPSUBMIT();
          break;
        case 'actionDELETE': // 删除
          this.objectTryDelete(obj);
          break;
        case 'actionSUBMIT': // 提交
          this.objectTrySubmit(obj);
          break;
        case 'actionUNSUBMIT': // 取消提交
          this.objectTryUnSubmit();
          break;
        case 'actionVOID': // 作废
          this.objectTryVoid(obj);
          break;
        case 'actionCANCOPY': // 复制
          this.copyFlag = true;
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
        const { refcolid } = this.itemInfo;
        const tabIndex = this.tabCurrentIndex;
        const searchdata = {
          column_include_uicontroller: true,
          startindex: this.tablePageInfo.currentPageIndex - 1,
          range: this.tablePageInfo.pageSize,
        };
        this.getObjectTableItemForTableData({
          table: this.itemName, objid: this.itemId, refcolid, searchdata, tabIndex
        });
      },
      objectTrySubmit(obj) { // 按钮提交逻辑
        this.itemTableValidation = true;// 提交逻辑不需要验证子表必填项
        if (this.verifyRequiredInformation()) { // 验证表单必填项
          const data = {
            title: '警告',
            mask: true,
            showCancel: true,
            content: '确认执行提交?',
            onOk: () => {
              this.saveButtonPath = obj.requestUrlPath;
              const dom = document.getElementById('actionMODIFY');
              dom.click();
              this.saveEventAfter = 'submit';
            }
          };
          this.$Modal.fcWarning(data);
        }
      },
      objectTryUnSubmit() { // 按钮取消提交操作
        const data = {
          title: '警告',
          mask: true,
          content: '确认执行取消提交?',
          showCancel: true,
          onOk: () => {
            const promise = new Promise((resolve, reject) => {
              this.getObjectTryUnSubmit({
                objId: this.itemId, table: this.tableName, path: this.requestUrlPath, resolve, reject
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
        this.itemTableValidation = true;// 提交逻辑不需要验证子表必填项
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
      webactionClick(tab) { // 动作定义执行
        this.activeTabAction = tab;
        switch (tab.vuedisplay) {
        case 'native': // 跳转url
          // eslint-disable-next-line no-restricted-globals
          location.href = tab.action;
          break;
        case 'slient':
          this.objTabActionSlient(tab);
          break;
        case 'download':
          this.objTabActiondDownload(tab);
          break;
        case 'dialog':
          this.objTabActionDialog(tab);
          break;
        case 'navbar':
          this.objTabActionNavbar(tab);
          break;
        case 'external':
          this.objTabActionUrl(tab);
          break;
        case 'edit':
          this.objTabActionEdit(tab);
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
          id: this.itemId
        });
      },
      objTabActiondDownload(tab) {
        // const filename = tab.webname;
        const downloadId = this.itemId;
        const paths = tab.action.replace('$objid$', downloadId);
        const eleLink = document.createElement('a');
        const path = getGateway(`${paths}`);
        eleLink.setAttribute('href', path);
        eleLink.style.display = 'none';
        document.body.appendChild(eleLink);
        eleLink.click();
        document.body.removeChild(eleLink);
        // this.downFile(path, filename);
      },
      // downFile(path, filename) {
      //   // 创建隐藏的可下载链接
      //   const eleLink = document.createElement('a');
      //   eleLink.download = filename;
      //   eleLink.style.display = 'none';
      //   // 字符内容转变成blob地址
      //   const blob = new Blob([path]);
      //   eleLink.href = URL.createObjectURL(blob);
      //   // 触发点击
      //   document.body.appendChild(eleLink);
      //   eleLink.click();
      //   // 然后移除
      //   document.body.removeChild(eleLink);
      // },

      objTabActionNavbar(tab) {
        // 判断跳转到哪个页面
        const url = tab.action;
        const index = url.lastIndexOf('/');
        const customizedModuleName = url.substring(index + 1, url.length);
        const label = tab.webdesc;
        const type = 'tableDetailAction';
        const name = Object.keys(this.keepAliveLabelMaps);
        let customizedModuleId = '';
        name.forEach((item) => {
          if (item.includes(`${customizedModuleName.toUpperCase()}`)) {
            customizedModuleId = item.split(/\./)[2];
          }
        });
        // if (tab.actiontype === 'url') {
        //   this.objTabActionUrl(tab);
        // } else
        if (tab.action) {
          this.tabOpen({
            type,
            customizedModuleName,
            customizedModuleId,
            label
          });
        }
      },
      objTabActionUrl(tab) { // 外链类型
        // const linkUrl = tab.action;
        // const linkId = tab.webid;
        // this.increaseLinkUrl({ linkId, linkUrl });
        // const label = `${tab.webdesc}`;
        // const name = `L.${tab.webname.toUpperCase()}.${linkId}`;
        // this.addKeepAliveLabelMaps({ name, label });
        // const linkInfo = {
        //   linkUrl: tab.action,
        //   linkId: tab.webid,
        //   label,
        //   name
        // };
        // window.sessionStorage.setItem('linkInfo', JSON.stringify(linkInfo));
        // setTimeout(() => {
        //   this.tabOpen({
        //     type: 'tableDetailUrl',
        //     tableName: tab.webname.toUpperCase(),
        //     tableId: tab.webid,
        //     label: tab.webdesc,
        //     url: tab.action
        //   });
        // }, 500);
        const eleLink = document.createElement('a');
        eleLink.href = tab.action;
        eleLink.target = '_blank';
        document.body.appendChild(eleLink);
        eleLink.click();
        document.body.removeChild(eleLink);
      },
      objTabActionSlient(tab) { // 动作定义静默
        const self = this;
        // tab.confirm = true
        // 判断当前tab是否为空,特殊处理提示信息后调用静默前保存
        if (!tab) tab = self.activeTabAction;
        if (tab.confirm) {
          if (!(tab.confirm.indexOf('{') >= 0)) { // 静默执行提示弹框
            const data = {
              title: '警告',
              mask: true,
              content: tab.confirm,
              onOk: () => {
                this.objTabActionSlientConfirm(tab);
              }
            };
            this.$Modal.fcWarning(data);
          } else if (JSON.parse(tab.confirm).desc) {
            //            确定后执行下一步操作
            //            判断是否先执行保存
            if (JSON.parse(tab.confirm).isSave) {
              console.log('暂时未处理配置isSave的相关逻辑');
              // self.confirmAction = 'beforeObjectSubmit(this.objTabActionSlientConfirm)';
            } else {
              const data = {
                title: '警告',
                mask: true,
                showCancel: true, 
                content: JSON.parse(tab.confirm).desc,
                onOk: () => {
                  this.objTabActionSlientConfirm(tab);
                }
              };
              this.$Modal.fcWarning(data);
            }
            // self.confirmTips({
            //   action: 'confirm',
            //   title: tab.webdesc,
            //   type: 'warning',
            //   list: [],
            //   isAction: true,
            //   desc: JSON.parse(tab.confirm).desc,
            // });
            // 清除提示信息
          } else if (JSON.parse(tab.confirm).isSave) { // 静默执行保存
            self.beforeObjectSubmit(() => {
              self.objTabActionSlientConfirm(tab);
            });
          } else { // 静默直接执行
            self.objTabActionSlientConfirm(tab);
          }
        } else {
          self.objTabActionSlientConfirm(tab);
        }
      },
      // 动作定义静默执行
      objTabActionSlientConfirm(tab) {
        const params = {};
        if (this.objectType === 'vertical') { // 上下结构
          const childTableParams = [];
          if (this.subtables()) { // 有子表
            if (this.updateData[this.itemName].delete[this.itemName].length > 0) {
              childTableParams[this.itemName] = this.updateData[this.itemName].delete[this.itemName].map(d => (d));// 子表选中项
              params[this.itemName] = {
                ...childTableParams[this.itemName]
              };
            }
            params[this.tableName] = {
              ID: this.itemId
            };
          } else { // 没有子表
            params.ID = this.itemId;
          }
        } else { // 左右结构
          params[this.tableName] = {
            ID: this.itemId
          };
        }

        const promise = new Promise((resolve, reject) => {
          this.getObjTabActionSlientConfirm({
            params, path: tab.action, resolve, reject
          });
          this.$loading.show();
        });

        promise.then(() => {
          this.$loading.hide();
          const message = this.objTabActionSlientConfirmData.message;
          const data = {
            mask: true,
            title: '成功',
            content: `${message}`
          };
          this.$Modal.fcSuccess(data);
          if (this.isrefrsh) {
            this.upData();
          }
        }, () => {
          this.$loading.hide();
        });
      },
      objTabActionDialog(tab) { // 动作定义弹出框
        this.$refs.dialogRef.open();
        const title = `${tab.webdesc}`;
        this.dialogConfig = {
          title,
        };
        this.dialogConfig.footerHide = true;
        // this.actionDialog.show = true;
        // this.actionDialog.title = tab.webdesc;
        const url = tab.action;
        const index = url.lastIndexOf('/');
        const filePath = url.substring(index + 1, url.length);
        // Vue.component(filePath, CustomizeModule[filePath].component);
        this.dialogComponentName = filePath;
        // }
      },
      objectEXPORT() { // 导出功能
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
          startindex: (Number(this.tablePageInfo.currentPageIndex) - 1) * Number(this.tablePageInfo.pageSize),
          range: this.tablePageInfo.pageSize,
        };

        const OBJ = {
          searchdata: JSON.stringify(searchdatas),
          filename: tabledesc,
          menu: tabledesc,
          filetype: '.xlsx',
          showColumnName: true,
        };


        const promise = new Promise((resolve, reject) => {
          this.getExportQueryForButtons({ OBJ, resolve, reject });
        });
        promise.then(() => {
          if (this.buttonsData.exportdata) {
            const eleLink = document.createElement('a');
            const path = getGateway(`/p/cs/download?filename=${this.buttonsData.exportdata}`);
            eleLink.setAttribute('href', path);
            eleLink.style.display = 'none';
            document.body.appendChild(eleLink);
            eleLink.click();
            document.body.removeChild(eleLink);
            this.clearItemTableSearchValue();// 清除子表搜索框值
            if (this.objectType === 'horizontal') { // 横向布局
              const { tablename } = this.itemInfo;
              const tabIndex = this.tabCurrentIndex;
              const searchdata = {
                column_include_uicontroller: true,
                startindex: 0,
                range: this.tablePageInfo.pageSize,
              };
              this.getObjectTableItemForTableData({
                table: tablename, objid: this.itemId, refcolid, searchdata, tabIndex
              });
            }
            this.updateDeleteData({ tableName: this.itemName, value: {} });
          }
        }, () => {});
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
        this.changeCopy(true);
      },
      copyForHorizontal() { // 横向结构接口 请求成功后复制逻辑
        this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/savaCopyData`, { copyDatas: this.copyDatas, tableName: this.tableName, modifyData: this.modifyData });
        this.copyDataForSingleObject({});// 清除global中复制所保存的数据
      },
      copyForVertical() { // 纵向结构接口 请求成功后复制逻辑
        this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/savaCopyData`, { copyDatas: this.copyDatas, tableName: this.tableName, modifyData: this.modifyData });
        this.copyDataForSingleObject({});// 清除global中复制所保存的数据
      },
      clickButtonsBack() { // 按钮返回事件
        const { tableId, tableName } = this.$route.params;
        const param = {
          tableId,
          tableName,
          back: true,
        };
        // this.clearEditData();
        this.$store.commit('global/tabHref', param);
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
                      this.dataArray.refresh = true;
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
                      this.dataArray.refresh = true;
                      this.dataArray.buttonGroupShowConfig.buttonGroupShow.push(buttonConfigInfo);
                    }
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
                      this.dataArray.refresh = true;
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
                    this.dataArray.refresh = true;
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
        if (tabwebact.objbutton && tabwebact.objbutton.length > 0) {
          tabwebact.objbutton.forEach((item, index) => {
            if (item.ishide) {
              tabwebact.objbutton.splice(index);
            }

            this.dataArray.waListButtonsConfig.waListButtons.push(item);
            this.isrefrsh = item.isrefrsh;
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
        // const searchData = {
        //   table: this.tableName,
        //   startIndex: 0,
        //   range: 10
        // };
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
                        this.clickButtonsBack();
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
                      this.clickButtonsBack();
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
                        const searchdata = {
                          column_include_uicontroller: true,
                          startindex: this.tablePageInfo.currentPageIndex - 1,
                          range: this.tablePageInfo.pageSize,
                        };
                        this.getObjectTableItemForTableData({
                          table: tablename, objid: this.itemId, refcolid, searchdata, tabIndex
                        });
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
                        const searchdata = {
                          column_include_uicontroller: true,
                          startindex: this.tablePageInfo.currentPageIndex - 1,
                          range: this.tablePageInfo.pageSize,
                        };
                        this.getObjectTableItemForTableData({
                          table: tablename, objid: this.itemId, refcolid, searchdata, tabIndex
                        });
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
                      this.clickButtonsBack();
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
                      this.clickButtonsBack();
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
                  this.clickButtonsBack();
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
                  this.clickButtonsBack();
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
          this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/emptyChangeData`, this.tableName);
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
            if (Object.values(this.updateData[itemName].modify[itemName]).length < 1 && Object.values(this.updateData[itemName].add[itemName]).length < 1) {
              if (obj.requestUrlPath) { // 配置path
                this.savaNewTable(type, path, objId, itemName, itemCurrentParameter);
              } else { // 没有配置path    if (this.verifyRequiredInformation()) {
                this.savaNewTable(type, path, objId, itemName, itemCurrentParameter);
              }
            } else {
              let itemModify = [];
              let itemAdd = [];
              if (this.updateData[itemName].modify && this.updateData[itemName].modify[itemName]) {
                itemModify = Object.values(this.updateData[itemName].modify[itemName]);
              }
              if (this.updateData[itemName] && this.updateData[itemName].add[itemName]) {
                itemAdd = Object.values(this.updateData[itemName].add[itemName]);
              }
              if (itemModify.length > 0 && itemAdd.length < 1) { // 子表表格编辑修改
                // 校验子表表格必填项
                if (this.itemTableCheckFunc()) {
                  this.savaNewTable(type, path, objId, itemName, itemCurrentParameter, { sataType: 'modify' });
                }
              }
              // const add = Object.assign({}, this.updateData[itemName].add[itemName], this.updateData[itemName].addDefault[itemName]);// 整合子表新增和默认值数据
              if (itemAdd.length > 0 && itemModify.length < 1) { // 子表新增
                this.savaNewTable(type, path, objId, itemName, itemCurrentParameter, { sataType: 'add' });
              }
              if (itemAdd.length > 0 && itemModify.length > 0) {
                if (this.itemTableCheckFunc()) {
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
          if (modify.length > 0 && add.length < 1) {
            this.itemTableValidation = true;
          } else if (modify.length > 0 && add.length > 0) {
            this.itemTableValidation = false;
          }
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
              if (this.itemTableCheckFunc()) {
                if (this.verifyRequiredInformation()) { // 横向结构保存校验
                  this.savaNewTable(type, path, objId, itemName, itemCurrentParameter, { sataType: 'modify' });
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


              // else if (itemCheckedInfo) {
              //   const itemMessageTip = itemCheckedInfo.messageTip;
              //   if (itemMessageTip) {
              //     if (itemMessageTip.length > 0) {
              //       this.$Message.warning(itemMessageTip[0]);
              //       itemCheckedInfo.validateForm.focus();
              //       return false;
              //     }
              //   }
              // }
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
          isreftabs,
          sataType,
          itemNameGroup
        };

        const promise = new Promise((resolve, reject) => {
          this.performMainTableSaveAction({ parame, resolve, reject });
        });

        promise.then(() => {
          this.clearEditData();// 清空store update数据
          this.saveAfter(type, tableName);
        }, () => {}).then(() => {
        });
      },
      saveAfter(type, tableName) {
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
            id: this.buttonsData.newMainTableSaveData ? this.buttonsData.newMainTableSaveData.objId : this.itemId
          };

          // this.updateChangeData({ tableName: this.tableName, value: {} });

          this.tabHref(tab);
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
          this.clearEditData();// 清空store update数据
          this.saveEventAfterClick();// 保存成功后执行的事件
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
      saveEventAfterClick() { // 保存成功后执行的事件
        this.clearEditData();// 清空store update数据

        if (this.saveEventAfter === 'submit') { // 提交操作
          const promise = new Promise((resolve, reject) => {
            this.getObjectTrySubmit({
              objId: this.itemId, table: this.tableName, path: this.saveButtonPath, resolve, reject
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
          });
        } else if (this.saveEventAfter === 'invalid') {
          const promise = new Promise((resolve, reject) => {
            this.getObjectTryInvalid({
              objId: this.itemId, table: this.tableName, path: this.saveButtonPath, resolve, reject
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
          });
        } else if (this.saveEventAfter === 'invalid') {
          const promise = new Promise((resolve, reject) => {
            this.getObjectTryInvalid({
              objId: this.itemId, table: this.tableName, path: this.requestUrlPath, resolve, reject
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
          });
        } else { // 保存后的保存成功提示信息
          const message = this.buttonsData.message;
          if (message) {
            this.upData(`${message}`);
          } else {
            this.upData('保存成功');
          }
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
      // clickKeepAliveLabelMaps(buttonData) {
      //   buttonData.objbutton.map((button) => {
      //     if (button.vuedisplay === 'edit') {
      //       const editTableId = button.action.lastIndexOf('/');
      //       const editTableName = button.action.substring(0, editTableId);
      //       const label = `${this.activeTab.label.substring(2, '编辑')}虚表`;
      //       const name = `S.${editTableName}.${editTableId}`;
      //       this.addKeepAliveLabelMaps({ name, label });
      //     } else if (button.vuedisplay === 'external') {
      //       const linkUrl = button.action;
      //       const linkId = button.webid;
      //       this.increaseLinkUrl({ linkId, linkUrl });
      //       const label = `${button.webdesc}`;
      //       const name = `L.${button.webname.toUpperCase()}.${linkId}`;
      //       this.addKeepAliveLabelMaps({ name, label });
      //     }
      //     return false;
      //   });
      // }
    },  
    mounted() {
      // this.clickKeepAliveLabelMaps(this.tabwebact);
      if (this.objectType === 'horizontal') { // 横向布局
        this.tabPanel.forEach((item) => {
          if (item.tablename === this.tableName) {
            const objreadonly = item.componentAttribute.buttonsData.data.objreadonly;
            if (objreadonly) {
              if (this.tabcmd.cmds && this.tabcmd.cmds.length > 0) {
                this.tabcmd.cmds.forEach((item, index) => {
                  if (item === 'actionMODIFY' || item === 'actionDELETE' || item === 'actionIMPORT' || item === 'actionCANCOPY') {
                    this.tabcmd.prem[index] = false;
                    this.clickButtonsRefresh();
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
      this.buttonsReorganization(this.tabcmd);
      this.waListButtons(this.tabwebact);
      if (this.jflowPluginDataArray) {
        this.dataArray.jflowPluginDataArray = this.jflowPluginDataArray;
      }
    },
    beforeCreate() {
    },
    created() {
      window.addEventListener('network', this.networkEventListener);// 监听接口
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
    .submit-img { //no-active
    position: absolute;
    top: 97px;
    right: 60px;
    width: 104px;
    z-index: 1000;

    img {
      width: 100%;
    }
  }
}
</style>
