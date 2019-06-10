
<template>
  <div
    class="singleObjectButton"
  >
    <div
      v-if="watermarkImg"
      class="submit-img"
    >
      <img
        :src="watermarkImg"
        alt="水印图标"
      >
    </div>
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
      :dialog-component-name="dialogComponentName"
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
      :tablename="tableName"
      :main-table="tableName"
      :main-id="tableId"
      @confirmImport="importsuccess"
      @closeDialog="closeDialog"
    />
    <!-- @confirmImport="" -->
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
  import ImportDialog from './ImportDialog';
  import CustomizeModule from '../__config__/customizeDialog.config';
  import { KEEP_SAVE_ITEM_TABLE_MANDATORY } from '../constants/global';
  import { getGateway } from '../__utils__/network';
  import store from '../__config__/store/global.store';

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
      };
    },
    name: 'SingleObjectButtons',
    components: {
      ButtonGroup,
      Dialog, // 定制弹框
      ImportDialog, // 导入弹框
    },
    watch: {
      tabcmd: {
        handler(val, oldval) {
          if (JSON.stringify(val) !== JSON.stringify(oldval)) {
            if (Object.keys(val).length > 0) {
              this.dataArray.buttonGroupShowConfig.buttonGroupShow = [];
              setTimeout(() => {
                if (this.objectType === 'horizontal') { // 横向布局
                  if (this.itemName !== this.tableName) {
                    const { tabrelation } = this.itemInfo;
                    if (tabrelation === '1:m') { // 子表
                      val.cmds.forEach((item, index) => {
                        if (item === 'actionEXPORT') {
                          val.prem[index] = true;
                        }
                      });
                    }
                  }
                }
                this.buttonsReorganization(val);
              }, 300);
            }
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
      watermarkImg() { // 匹配水印图片路径
        if (this.watermarkimg.includes('/static/img/')) {
          return this.watermarkimg.replace('/static/img/', '/src/assets/image/');
        }
        return this.watermarkimg;
      }
  
    },
    props: {
      watermarkimg: {
        type: String,
        default: ''
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
    },
    methods: {
      ...mapMutations('global', ['tabHref', 'decreasekeepAliveLists']),
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
          // searchdata: {"column_include_uicontroller":true,"range":10,"startindex":0,"fixedcolumns":{}}
        }
        if (message) {
          this.$Message.success(message);
        }
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
        this.importData.importDialogTitle = this.activeTab.label;
      },
      importsuccess() {
        const { refcolid } = this.itemInfo;
        this.getObjectTableItemForTableData({
          table: this.tableName, objid: this.itemId, refcolid, searchdata: { column_include_uicontroller: true }
        });
      },
      objectTrySubmit(obj) { // 按钮提交逻辑
        this.itemTableValidation = true;// 提交逻辑不需要验证子表必填项
        if (this.verifyRequiredInformation()) { // 验证表单必填项
          this.$refs.dialogRef.open();
          this.dialogConfig = {
            contentText: '确认执行提交?',
            confirm: () => {
              obj.requestUrlPath = this.saveButtonPath;
              this.determineSaveType(obj); 
              this.saveEventAfter = 'submit';
            }
          };
        }
      },
      objectTryUnSubmit() { // 按钮取消提交操作
        this.$refs.dialogRef.open();
        this.dialogConfig = {
          contentText: '确认执行取消提交?',
          confirm: () => {
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
      },
      objectTryVoid(obj) {
        this.itemTableValidation = true;// 提交逻辑不需要验证子表必填项
        if (this.verifyRequiredInformation()) { // 验证表单必填项
          this.$refs.dialogRef.open();
          this.dialogConfig = {
            contentText: '确认执行作废?',
            confirm: () => {
              obj.requestUrlPath = this.saveButtonPath;
              this.determineSaveType(obj); 
              this.saveEventAfter = 'invalid';
            }
          };
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
      objTabActionSlient(tab) { // 动作定义静默
        const self = this;
        // tab.confirm = true
        // 判断当前tab是否为空,特殊处理提示信息后调用静默前保存
        if (!tab) tab = self.activeTabAction;
        if (tab.confirm) {
          if (!(tab.confirm.indexOf('{') >= 0)) { // 静默执行提示弹框
            self.activeTabAction = tab;
            self.confirmAction = 'objTabActionSlientConfirm';
            self.confirmTips({
              action: 'confirm',
              title: tab.webdesc,
              type: 'warning',
              list: [],
              isAction: true,
              desc: tab.confirm,
            });
          } else if (JSON.parse(tab.confirm).desc) {
            //            确定后执行下一步操作
            //            判断是否先执行保存
            if (JSON.parse(tab.confirm).isSave) {
              self.confirmAction = 'beforeObjectSubmit(this.objTabActionSlientConfirm)';
            } else {
              self.confirmAction = 'objTabActionSlientConfirm';
            }
            self.confirmTips({
              action: 'confirm',
              title: tab.webdesc,
              type: 'warning',
              list: [],
              isAction: true,
              desc: JSON.parse(tab.confirm).desc,
            });
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
        console.log('🍓', this.isreftabs);
        // const promise = new Promise((resolve, reject) => {
        //   this.getObjTabActionSlientConfirm({ OBJ, resolve, reject });
        // });
        // promise.then(() => {

        // });
      
        const self = this;
        let params = {};
        const parimaryTableParams = {};
        const childTableParams = {};
  
        if (this.isreftabs) {
          if (this.itemNameGroup.length > 0) {
            params.ID = self.storageItem.id;
          }
        } else if (self.tableChooseList.length === 0) {
          // 没有勾选子表
          parimaryTableParams[self.storageItem.name] = { ID: self.storageItem.id };
          params = Object.assign({}, parimaryTableParams);
        } else {
          parimaryTableParams[self.storageItem.name] = { ID: self.storageItem.id };
          childTableParams[self.tableTab.selectItem.tablename] = self.tableChooseList.map(d => ({ ID: d }));
          params = Object.assign({}, parimaryTableParams, childTableParams);
        }
  
        // self.actionLoading = true;
        // axios({
        //   method: 'post',
        //   contentType: 'application/json',
        //   url: tab.action || '/p/cs/exeAction',
        //   data: params
        /*
          data: {
            actionid: self.activeTabAction.webid,
            webaction: null,
            param: self.activeTabAction.sourceType == 1
              ? {
                objid: self.storageItem.id,
                table: self.storageItem.name,
                menu: self.$route.query.ptitle || (self.$route.query.tabTitle && self.$route.query.tabTitle.replace('编辑', '')) || '',
                subParam: {
                  idArr: self.tableChooseList,
                  table: self.tableTab.selectItem ? self.tableTab.selectItem.tablename : '',
                },
              } : {
                table: self.tableTab.selectItem ? self.tableTab.selectItem.tablename : '',
                ids: self.tableChooseList,
                menu: self.$route.query.ptitle || (self.$route.query.tabTitle && self.$route.query.tabTitle.replace('编辑', '')) || '',
              }
          },
          */
        // }).then((res) => {
        //   let successAction = null;
        //   let errorAction = null;
        //   let refParam = null;
        //   if (res.data.data) {
        //     // 如果返回了id和tablename
        //     refParam = res.data.data;
        //   }
        //   if (self.activeTabAction.cuscomponent) {
        //     const nextOperate = JSON.parse(self.activeTabAction.cuscomponent);
        //     if (nextOperate.success) successAction = nextOperate.success;
        //     if (nextOperate.failure) errorAction = nextOperate.failure;
        //   }
        //   if (res.data.code == 0) {
        //     if (successAction) {
        //       // 如果有静默后需要执行的操作
        //       axios({
        //         method: 'post',
        //         url: '/p/cs/getAction',
        //         data: {
        //           actionid: 0,
        //           webaction: successAction,
        //         },
        //       }).then((res) => {
        //         self.actionLoading = false;
        //         if (res.data.code === 0) {
        //           const tab = res.data.data;
        //           if (refParam) {
        //             for (const key of Object.keys(refParam)) {
        //               tab.action = tab.action.replace(`\${${key}}`, refParam[key]);
        //             }
        //           }
        //           self.TryObjTabConfigAction(tab, 1);
        //         }
        //       });
        //       if (!res.data.message) {
        //         self.refreshData();
        //       }
        //     } else {
        //       self.actionLoading = false;

        //       self.$message({
        //         message: res.data.message,
        //         type: 'success',
        //       });
        //       self.refreshData();
        //     }
        //   } else if (res.data.code == -1 && !res.data.message && errorAction) {
        //     axios({
        //       method: 'post',
        //       url: '/p/cs/getAction',
        //       data: {
        //         actionid: 0,
        //         webaction: errorAction,
        //       },
        //     }).then((res) => {
        //       self.actionLoading = false;
        //       if (res.data.code === 0) {
        //         const tab = res.data.data;
        //         if (refParam) {
        //           for (const key of Object.keys(refParam)) {
        //             tab.action = tab.action.replace(`\${${key}}`, refParam[key]);
        //           }
        //         }
        //         self.TryObjTabConfigAction(tab, 1);
        //       }
        //     });
        //   } else if (res.data.data && Array.isArray(res.data.data)) {
        //     self.actionLoading = false;
        //     store.commit('errorDialog', { // 其它报错
        //       message: res.data.message,
        //     });
        //     self.tableSaveLoading.type = 'error';
        //     self.tableSaveLoading.list = res.data.data;
        //     self.tableErrorList = res.data.data;
        //     self.getObjectTableItem(self.storageItem.id, 'saveLoading');
        //   } else {
        //     self.actionLoading = false;
        //   }
        // });
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
        if (tab.action.indexOf('?') >= 0) {
          this.dialogComponent = this.getCustomizeComponent(tab.action.split('/')[0]);
        } else {
          const url = tab.action;
          const index = url.lastIndexOf('\/');
          const filePath = url.substring(index + 1, url.length);
          Vue.component(filePath, CustomizeModule[filePath].component);
          this.dialogComponentName = filePath;
        }
      },
      objectEXPORT() { // 导出功能
        const searchData = {
          table: this.tableName,
          column_include_uicontroller: true,
          fixedcolumns: { ID: this.updateData[this.itemName].delete[this.itemName] },
          range: 10,
          startindex: 0
        };
        const OBJ = {
          searchdata: searchData,
          filename: this.activeTab.label,
          filetype: '.xlsx',
          showColumnName: true,
          menu: this.activeTab.label
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
          }
        });
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
          if (this.objectType === 'horizontal') { // 横向布局
            if (this.itemName === this.tableName) { // 主表删除
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
            } else if (this.updateData[this.itemName].delete[this.itemName].length > 0) {
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
          } else if (this.objectType === 'vertical') {
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
      },
      mainTableEditorSave(obj) { // 主表编辑保存
        // console.log('主表编辑保存');
        this.saveParameters();// 调用获取参数方法
        // const itemName = this.itemName;// 子表表名
        // const itemCurrentParameter = this.itemCurrentParameter;
        const path = obj.requestUrlPath;
        const type = 'modify';
        if (!this.isreftabs) { // 为false的情况下是没有子表
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
        if (this.isreftabs) { // 为true的情况下是存在子表
          this.mainTableEditorSaveIsreftabs(obj);
        }
      },
      mainTableEditorSaveIsreftabs(obj) { // 主表编辑保存存在子表
        const itemName = this.itemName;// 子表表名
        const itemCurrentParameter = this.itemCurrentParameter;
        const path = obj.requestUrlPath;
        const type = 'modify';
        const objId = this.itemId;
        const sataType = 'itemSave';
        if (this.objectType === 'vertical') {
          this.itemTableValidation = true;
          if (this.verifyRequiredInformation()) { // 纵向结构保存校验
            if (obj.requestUrlPath) { // 配置path
              this.savaNewTable(type, path, objId, itemName, itemCurrentParameter);
            } else { // 没有配置path    if (this.verifyRequiredInformation()) {
              this.savaNewTable(type, path, objId, itemName, itemCurrentParameter);
            }
            
            if (Object.keys(this.updateData[itemName].modify[itemName]).length > 0) {
              this.savaNewTable(type, path, objId, itemName, itemCurrentParameter, sataType);
            }
          }
        } else if (this.verifyRequiredInformation()) { // 横向结构保存校验
          if (obj.requestUrlPath) { // 配置path
            this.savaNewTable(type, path, objId, itemName, itemCurrentParameter);
          } else { // 没有配置path
            this.savaNewTable(type, path, objId, itemName, itemCurrentParameter);
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
          let tabinlinemode = '';
          this.tabPanel.forEach((item) => {
            if (item.tablename === this.itemName) {
              tabinlinemode = item.tabinlinemode;
            }
          });
          if (tabinlinemode === 'Y') { // 当子表中存在form时
            if (!this.itemTableValidation) {
              const itemCheckedInfo = this.itemCurrentParameter.checkedInfo;// 子表校验信息
              if (KEEP_SAVE_ITEM_TABLE_MANDATORY) { // 为true时，子表没有必填项也必须要输入值才能保存
                this.saveParameters();
                if (this.objectType === 'vertical') {
                  if (this.itemId === 'New') {
                    if (this.itemNameGroup.length > 0) {
                      const addInfo = this.itemCurrentParameter.add[this.itemName];
                     
                      if (itemCheckedInfo) {
                        const itemMessageTip = itemCheckedInfo.messageTip;
                        if (itemMessageTip) {
                          if (itemMessageTip.length > 0) {
                            this.$Message.warning(itemMessageTip[0]);
                            itemCheckedInfo.validateForm.focus();
                            return false;
                          }
                        }
                      } else if (Object.values(addInfo).length < 1) {
                        this.$Message.warning('个人信息不能为空!');
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
        const promise = new Promise((resolve, reject) => {
          this.performMainTableSaveAction({ parame, resolve, reject });
        });
   
        promise.then(() => {
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
            this.updateChangeData({ tableName: this.tableName, value: {} });

            this.tabHref(tab);
            const message = this.buttonsData.message;
            if (message) {
              this.$Message.success(message);
            }
          } else {
            this.updateChangeData({ tableName: this.itemName, value: {} });

            this.saveEventAfterClick();// 保存成功后执行的事件
          }
         
          this.decreasekeepAliveLists(moduleName());
        });
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
      },
      saveEventAfterClick() { // 保存成功后执行的事件
        if (this.saveEventAfter === 'submit') { // 提交操作
          const promise = new Promise((resolve, reject) => {
            this.getObjectTrySubmit({
              objId: this.itemId, table: this.tableName, path: this.requestUrlPath, resolve, reject 
            });
          });
          let message = '';
          promise.then(() => {
            message = this.buttonsData.submitData.message;
          });
          if (message) {
            this.upData(`${message}`);
          } else {
            this.upData();
          }
        } else if (this.saveEventAfter === 'invalid') {
          const promise = new Promise((resolve, reject) => {
            this.getObjectTryInvalid({
              objId: this.itemId, table: this.tableName, path: this.requestUrlPath, resolve, reject 
            });
          });
          let message = '';
          promise.then(() => {
            message = this.buttonsData.invalidData.message;
          });
          if (message) {
            this.upData(`${message}`);
          } else {
            this.upData();
          }
        } else { // 保存后的保存成功提示信息
          const message = this.buttonsData.message;
          if (message) {
            this.upData(`${message}`);
          } else {
            this.upData('保存成功');
          }
        }
      },

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
