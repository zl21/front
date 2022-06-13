/* eslint-disable no-restricted-globals */

<template>
  <div
    :class="classes"
    :style="{'margin-left': isItemTableVertical ? '17px' : '0px' }"
  >
    <div
      v-if="watermarkImg"
      class="submit-img"
      ref="watermark"
    >
      <WaterMark
        :text="waterMarkText"
        :color="waterMarkColor"
        :top="waterMarkTop"
        :left="waterMarkLeft"
        :width="waterMarkWidth" 
        @hook:mounted="getTransferDom"
      />
    </div>
    <ButtonGroup
      :data-array="dataArray"
      class="buttonGroup"
      :item-id="itemId"
      :id-array="itemName && updateData? updateData[itemName] :{}"
      @buttonClick="buttonClick"
    />
    <Dialog
      ref="dialogRef"
      :title="dialogConfig.title"
      :mask="dialogConfig.mask"
      :content-text="dialogConfig.contentText"
      :footer-hide="dialogConfig.footerHide"
      :confirm="dialogConfig.confirm"
      :action-id="actionId"
      :obj-tab-action-dialog-config="objTabActionDialogConfig"
      :dialog-component-name="dialogComponentName"
      :obj-list="dialogComponentName?objList:[]"
      @dialogComponentSaveSuccess="dialogComponentSaveSuccess"
      @clearDialogComponentName="clearDialogComponentName"
    />

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
      :action-id="actionId"
      @confirmImport="importsuccess"
      @closeDialog="closeActionDialog"
      @imporSuccess="imporSuccess"
    />
  </div>
</template>

<script>

  import { mapMutations, mapState, mapActions } from 'vuex';
  import buttonmap from '../assets/js/buttonmap';
  import ButtonGroup from './ButtonComponent.vue';
  // import router from '../__config__/router.config';
  import Dialog from './Dialog.vue';
  import WaterMark from './WaterMark.vue';
  import ImportDialog from './ImportDialog.vue';
  import {
    PLUGIN_MODULE_PREFIX,
    CUSTOMIZED_MODULE_PREFIX,
    VERTICAL_TABLE_DETAIL_PREFIX,
    HORIZONTAL_TABLE_DETAIL_PREFIX,
    STANDARD_TABLE_LIST_PREFIX,
    enableRestrictSave,
    isItemTableNewValidation,
    INSTANCE_ROUTE,
    KEEP_SAVE_ITEM_TABLE_MANDATORY,
    Version, MODULE_COMPONENT_NAME,
    INSTANCE_ROUTE_QUERY,
    LINK_MODULE_COMPONENT_PREFIX,
    getCustomizeWaterMark,
    enableActivateSameCustomizePage,
    classFix,
    enableOpenNewTab,
    messageSwitch,
    enableTaskNotice,
    enableAsyncTaskTip,
    asyncTaskScheme
  } from '../constants/global';
  import { getGateway } from '../__utils__/network';
  import { getUrl, getLabel } from '../__utils__/url';

  import { DispatchEvent, R3_EXPORT } from '../__utils__/dispatchEvent';
  import { getKeepAliveModuleName } from '../__config__/router.navigation.guard';
  import getUserenv from '../__utils__/getUserenv';
  import ChineseDictionary from '../assets/js/ChineseDictionary';
  import { getSessionObject, updateSessionObject, deleteFromSessionObject } from '../__utils__/sessionStorage';
  import {FindInstance ,FindInstanceAll} from './ExtendedAttributes/common.js'
import RouterPush from '../__utils__/routerback';

  export default {
    data() {
      return {
        saveCallBack: null, // 保存成功后回调
        saveButtonJflowPath: '',
        objTabActionDialogConfig: {}, // 自定义按钮配置
        actionId: null, // 自定义按钮ID
        temporaryStorage: false, // 是否开启暂存
        temporaryStoragePath: '', // 扩展属性暂存配置，path
        loading: true,
        importData: {
          importDialog: false, // 是否开启导入弹框
          importDialogTitle: ''// 设置弹框title
        },
        dialogComponentName: null, // 弹框内引入的组件名称
        dialogConfig: {// 自定义弹框配置
          title: this.$t('feedback.alert'),
          mask: true,
          footerHide: false,
          contentText: '',
          confirm: () => {}
        }, // 弹框配置信息
        dataArray: {
          refresh: true, // 显示刷新
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
          saveMainType:true, // 是否只保存主表
          jflowButton: [], // jflow配置按钮
          btnclick: (type, item) => {
            const self = this;
            return self.buttonClick(type, item);
          }
        },
        tableName: '', // 主表表名
        tableId: '', // 主表ID
        itemId: '', // 子表ID
        currentParameter: {}, // 当前主表用于保存的参数
        itemCurrentParameter: {}, // 当前子表用于保存的参数
        buttonShowType: '', // 判断按钮显示条件
        dynamic: {// 暂存按钮渲染信息
          name: this.$t('buttons.save'),
          icon: '',
          defbutton: 'N',
          action: '',
        }, // 保存url
        defaultForCopyData: {}, // 保存复制操作时所需要的当前页面的数据
        itemTableValidation: false, // 控制提交按钮操作时子表form必填项不进行验证
        saveButtonPath: '', // 类型为保存的按钮path
        saveEventAfter: '', // 保存事件执行完成后的操作
        objTabActionSlientData: {}, // 静默程序配置字段
        submitImage: '', // 提交操作完成后接口会返回提交成功图标
        isrefrsh: '', // 控制自定义类型按钮执行后是否刷新
        isValue: null, // 用于判断界面是否修改过值的标记
      };
    },
    components: {
      ButtonGroup,
      Dialog, // 定制弹框
      ImportDialog, // 导入弹框
      WaterMark, // 水印组件
    },
    watch: {
      // $route() {
      //   console.log(3333, this.$route.params.itemId === 'New' , this.sameNewPage , !this._inactive);

      //   setTimeout(() => {
      //     if (this.$route.params.itemId === 'New' && this.sameNewPage && !this._inactive) {
      //       debugger;
      //       // this.upData();
      //       const dom = document.getElementById('refresh');
      //       if (dom) {
      //         const event = document.createEvent('HTMLEvents');
      //         event.initEvent('click', false, true);
      //         dom.dispatchEvent(event);
      //         this.$store.commit('global/updataNewTagForNewTab', false);
      //       }
      //     }
      //   }, 1000);
      // },
      isItemTable: {// 当前操作的表是否是子表
        // 此逻辑用于控制jflow按钮，当前组件在上下结构子表时，不需展示刷新与返回按钮
        handler(val) {
          if (val) {
            this.dataArray.refresh = false;// 隐藏刷新按钮
            this.dataArray.back = false;// 隐藏返回按钮
          }
        }
      },
      isHideTempStorage: {// jflow控制暂存按钮显示
        // 需要根据jflow配置控制暂存按钮是否显示，
        // 检查了代码，控制该值的方法未被调用
        handler(val) {
          if (val) {
            this.dataArray.temporaryStorage = false;
          }
        }
      },
      jflowButton: {// 接收jflow按钮元数据配置
        handler(val) {
          // this.dataArray.jflowPluginDataArray = [];
          this.dataArray.jflowButton = val;
        }
      },
      tabcmd: {
        handler(val) {
          this.hideBackButton();// 先执行是否隐藏返回按钮逻辑，该逻辑会根据一些判断条件控制返回按钮是否显示

          if (Object.keys(val).length > 0) {
            this.dataArray.buttonGroupShowConfig.buttonGroupShow = [];// 每次重新获取元数据配置时，清除上一次配置
            if (this.objectType === 'horizontal') { // 横向布局
              if (this.itemName !== this.tableName) { // 以下配置仅控制子表，控制子表按钮是否显示
                this.tabPanel.forEach((item) => {
                  const objreadonly = item.componentAttribute.buttonsData.data.objreadonly;
                  if (objreadonly) { // 当前表配置了只读，以下几个按钮不显示，按钮对应的prem设置为false即可
                    val.cmds.forEach((item, index) => {
                      if (item === 'actionMODIFY' || item === 'actionDELETE' || item === 'actionIMPORT' || item === 'actionCANCOPY') {
                        val.prem[index] = false;
                      }
                    });
                  }
                  if (this.itemInfo && this.getCurrentItemInfo().tabrelation === '1:1') { // 1对1的只有modify和export根据prem来，其他几个按钮默认不显示
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
                  const { tabrelation } = this.getCurrentItemInfo();
                  if (tabrelation === '1:m') { // 子表
                    val.cmds.forEach((item, index) => {
                      if (item === 'actionEXPORT') {
                        val.prem[index] = true;
                      }
                    });
                  }
                }
                if (this.disableExport) { // 扩展属性支持配置是否隐藏导出按钮，当disableExport配置为true时，隐藏导出按钮
                  if (this.tabcmd.cmds && this.tabcmd.cmds.length > 0) {
                    this.tabcmd.cmds.forEach((item, index) => {
                      if (item === 'actionEXPORT') {
                        this.tabcmd.prem[index] = false;
                      }
                    });
                  }
                }
                const { tabinlinemode } = this.getCurrentItemInfo();// 获取当前表的模型tabinlinemode，配置模型为N，隐藏以下几个按钮
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
              // if(this.itemInfo)
            }
            this.setDisableButtons();// 执行通过扩展属性配置控制是否隐藏导入导出按钮逻辑
            this.buttonsReorganization(val);// 执行根据元数据配置展示按钮逻辑
          }
        },
        deep: true
      },
      tabwebact: {// 自定义按钮数据
        handler(val) {
          this.hideBackButton();// 先执行是否隐藏返回按钮逻辑，该逻辑会根据一些判断条件控制返回按钮是否显示
          this.dataArray.waListButtonsConfig.waListButtons = [];
          this.waListButtons(val);// 整合自定义按钮数据
        },
        deep: true
      },
    },
    computed: {
      ...mapState('global', {
        activeTab: ({ activeTab }) => activeTab,// 当前表基本数据，包含路由信息，表名，ID等
        keepAliveLists: ({ keepAliveLists }) => keepAliveLists,// 当前已被缓存的表名
        keepAliveLabelMaps: ({ keepAliveLabelMaps }) => keepAliveLabelMaps,
        copyDatas: ({ copyDatas }) => copyDatas,// 复制逻辑用到的复制来源的数据
        modifyData: ({ modifyData }) => modifyData,// 当前界面组件向上抛出的，修改的值，所有页面修改过后的值都会存入该对象
        serviceIdMap: ({ serviceIdMap }) => serviceIdMap,
        LinkUrl: ({ LinkUrl }) => LinkUrl,// 当前外链表对应的外链地址，为解决刷新后地址丢失问题维护的数据
        exportTasks: ({ exportTasks }) => exportTasks,// 导出任务数据
        currentLoading: ({ currentLoading }) => currentLoading,// 当前正在loading状态的表
        userInfo: ({ userInfo }) => userInfo,// 登陆用户信息
        allMenu: ({ allMenu }) => allMenu,
      }),
      getCurrentItemTableRef() { // 当前子表明细表格实例
        return this.$_live_getChildComponent(window.vm, 'H.SHANGPIN.24445.5.TableDetailCollection') ? this.$_live_getChildComponent(window.vm, 'H.SHANGPIN.24445.5.TableDetailCollection') : null;
      },
      currentTabIndex() { // 获取当前tab索引
        return this.tabCurrentIndex;
      },
      watermarkImg() { // 匹配水印图片路径
        return this.watermarkimg;
      },
      isCurrentItemTab() { // 当前表是否为子表
        const itemNames = this.itemNameGroup.map((c) => {
          if (c.tableName !== this.tableName) {
            return c.tableName;
          }
        });
        if (itemNames.includes(this.itemName)) {
          return true;
        }
        return false;
      },
      waterMarkTop() {
        const customizeWaterMark = getCustomizeWaterMark();
        const src = this.watermarkimg.split('/')[3].split('.')[0];
        if (customizeWaterMark[src] && customizeWaterMark[src].top) {
          return customizeWaterMark[src].top;
        }
        return '42px';
      },
      waterMarkLeft() {
        const customizeWaterMark = getCustomizeWaterMark();
        const src = this.watermarkimg.split('/')[3].split('.')[0];
        if (customizeWaterMark[src] && customizeWaterMark[src].left) {
          return customizeWaterMark[src].left;
        }
        return '11px';
      },
      waterMarkWidth() {
        const customizeWaterMark = getCustomizeWaterMark();
        const src = this.watermarkimg.split('/')[3].split('.')[0];
        if (customizeWaterMark[src] && customizeWaterMark[src].width) {
          return customizeWaterMark[src].width;
        }
        return '80px';
      },
      classes: () => `${classFix}singleObjectButton`,
      waterMarkText() {
        const customizeWaterMark = getCustomizeWaterMark();
        const textMap = Object.assign({
          accepet: this.$t('tips.accepted'),
          back: this.$t('tips.returned'),
          box: this.$t('tips.boxed'),
          boxing: this.$t('tips.boxing'),
          charge: this.$t('tips.charged'),
          check: this.$t('tips.cashed'),
          completed: this.$t('tips.completed'),
          confirm: this.$t('tips.confirmed'),
          execute: this.$t('tips.executed'),
          executing: this.$t('tips.executing'),
          extremely: this.$t('tips.abnormalTermination'),
          Inventory: this.$t('tips.profitable'),
          send: this.$t('tips.sent'),
          submit: this.$t('tips.submitted'),
          system: this.$t('tips.system'),
          terminate: this.$t('tips.terminated'),
          examine: this.$t('tips.approving'),
          void: this.$t('tips.invalid'),
          agreement: this.$t('tips.approved'),
          reject: this.$t('tips.rejected'),
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
      tablePage() { // 获取当前子表分页信息
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
      tempStorage() { // 获取当前暂存扩展属性配置
        return this.WebConf;
      }
    },
    props: {
      isItemTable: {// 是否是子表
        type: Boolean,
        default: false
      },
      isItemTableVertical: {// 当前按钮组组件是否在上下结构子表上，该数据为jflow逻辑使用，jflow逻辑会有按钮组在子表的情况，用该标记将一些新增返回刷新按钮隐藏，子表不需要这些按钮
        type: Boolean,
        default: false
      }, // 当前是否在1:1面板上下结构子表
      isMainForm: {// 当前主表是否存在表单组件
        type: [Array, Object],
        default: () => {}
      },
      watermarkimg: {// 水印
        type: String,
        default: ''
      },
      disableExport: {// 是否将导出按钮隐藏
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

      jflowButton: {// jflow配置按钮
        type: Array,
        default: () => ([])
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
      itemInfo: {// 当前表信息
        type: Object,
        default: () => ({})
      },
      webConfSingle: {// 当前子表webConf
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
    inject: [MODULE_COMPONENT_NAME, INSTANCE_ROUTE_QUERY, INSTANCE_ROUTE],
    methods: {
      ...mapActions('global', ['getExportedState', 'updataTaskMessageCount']),
      ...mapMutations('global', ['directionalRouter', 'updateCustomizeMessage', 'deleteLoading', 'tabCloseAppoint', 'decreasekeepAliveLists', 'copyDataForSingleObject', 'tabOpen', 'copyModifyDataForSingleObject', 'increaseLinkUrl', 'addKeepAliveLabelMaps', 'addServiceIdMap']),
      
      // 转移水印
      getTransferDom() {
        let value = ''
        if(window.ProjectConfig.domPortal && window.ProjectConfig.domPortal.waterMark) {
          value = window.ProjectConfig.domPortal.waterMark({
            fromComponent: 'SingleObjectButtons', // 用于区别哪个组件的水印
            type: this.objectType
          })
        }

        if(value) {
          const dom = document.querySelector(value)
          if(dom) {
            dom.appendChild(this.$refs.watermark)
          }
        }
      },
      
      updataCurrentTableDetailInfo() { // 更新当前单对象信息
        if (this[INSTANCE_ROUTE_QUERY].tableName === this.$route.params.tableName && this.$route.meta.routePrefix.includes('/SYSTEM/TABLE_DETAIL/')) { // 当前路由包含单对象标记
          // 将当前单对象方法挂在到window
          // 更新单对象界面信息
          this.updataCurrentTableDetailMethods();
        }
      },
      updataCurrentTableDetailMethods() { // 更新单对象挂载window的方法（保持当前激活的单对象界面）
        window.updataClickSave = event => this.clickSave({ event });
        window.testUpdataValue = () => this.testUpdata();
        window.updataVerifyRequiredInformation = () => this.verifyRequiredInformation();
      },
      imporSuccess(id) { // 导入成功后执行事件
        if (Version() === '1.3') {
          if (id) {
            const promises = new Promise((resolve, reject) => {
              this.getExportedState({
                objid: id, id, resolve, reject
              });
            });
            promises.then(() => {
              this.$R3loading.hide(this.loadingName);
              this.closeActionDialog();// 关闭导入弹框
              if (this.exportTasks.dialog) {// 开启我的任务弹框
                const message = {
                  mask: true,
                  title: this.$t('feedback.alert'),
                  content: this.$t('messages.asyncImportSuccess'),
                  showCancel: true,
                  onOk: () => {
                    // 导入后会进入异步任务，会弹出提示框，点击确定后进入我的任务表，同时更新任务图标上的数字
                    const type = 'tableDetailVertical';
                    const tab = {
                      type,
                      tableName: Version() === '1.3' ? 'CP_C_TASK' : 'U_NOTE',
                      tableId: Version() === '1.3' ? 24386 : 963,
                      id
                    };
                    this.updataTaskMessageCount({ id, stopUpdataQuantity: true });// 更新小铃铛数量
                    this.tabOpen(tab);// 跳转到我的任务表
                  }
                };
                this.$Modal.fcWarning(message);
              }
              if (this.exportTasks.successMsg) {
                const data = {
                  mask: true,
                  title: this.$t('feedback.success'),
                  content: this.exportTasks.resultMsg
                };
                this.$Modal.fcSuccess(data);
              }
            }, () => {
              this.closeActionDialog();
              this.$R3loading.hide(this.loadingName);
            });
          }
        } else {
          this.$R3loading.hide(this.loadingName);
        }
      },
      dialogComponentSaveSuccess(value) { // 自定义弹框执行确定按钮操作
        if (this.isrefrsh) {
          this.upData();
        }
      },

      subtables() { 
        // 判断实际是否有子表
        if (Version() === '1.4') {
          if (this.isreftabs && this.itemNameGroup.length>0) {
            return true;
          }
          return false;
        } if (this.itemNameGroup.length > 0) {
          return true;
        }
        return false;
      },
      socureIsreftabs() { 
        // 判断后端传参是否有子表
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
      clearDialogComponentName() { // 清除自定义弹框内的组件
        this.dialogComponentName = null;
      },
      closeActionDialog() { // 关闭导入弹框
        this.importData.importDialog = false;
      },
      buttonsReorganization(buttonData) { // 根据页面不同执行按钮渲染逻辑
        if (Object.values(buttonData).length > 0) {
          // if (this.objectType === 'horizontal') { // 横向布局
          if (this.itemId === 'New') { // 新增界面按钮渲染逻辑   根据copy来控制复制按钮操作后按钮的显示条件
            this.addButtonShow(buttonData);
          } else { // 编辑界面按钮渲染逻辑
            this.getbuttonGroupData(buttonData);
          }
          // } else if (this.objectType === 'vertical') {
          //   if (this.itemId === 'New') { // 编辑按钮渲染逻辑
          //     this.addButtonShow(buttonData);
          //   } else { // 新增按钮渲染逻辑
          //     this.getbuttonGroupData(buttonData);
          //   }
          // }
          if (this.copy === true && this[MODULE_COMPONENT_NAME].includes('New')) {// 通过点击复制按钮打开的界面，需将刷新按钮去除
            this.updateRefreshButton(false);
            this.addButtonShow(buttonData);// 复制即为新增，将按钮置为新增状态，只显示新增状态该显示的按钮
          }
        }
      },
      buttonClick(type, obj) { // 根据按钮类型不同执行的事件逻辑
        DispatchEvent('R3SingleButtonClick', {// 所有点击过的按钮都会向上派发事件，将当前按钮的元数据配置信息作为参数
          detail: {
            type, obj
          }
        });
        if (type === 'fix') {
          // 处理存储过程逻辑，配置的path中带有sp|时则走框架的标准逻辑，不走定制path
          if (obj && obj.requestUrlPath && obj.requestUrlPath.includes('sp|')) {
            obj.requestUrlPath = null;
          }
          this.objectTabAction(obj);// 标准按钮执行方法
        } else if (type === 'custom') {
          this.webactionClick(obj);// 自定义按钮执行方法
        } else if (type === 'Collection') {
          this.clickButtonsCollect();// 收藏按钮执行方法
        } else if (type === 'back') {
          this.clickButtonsBack({ type, obj });// 返回按钮执行方法
        } else if (type === 'temporaryStorage') {
          this.clickButtonsTemporaryStorage();// 暂存按钮执行方法(暂存按钮根据webConf配置显示，同时与保存按钮显示逻辑相同)
        } else if (type === 'refresh') {
          this.clickButtonsRefresh(type);// 刷新按钮执行方法
          // DispatchEvent('clickButtonsRefresh');
        } else if (type === 'extraposition') {
          this.clickExtraposition(obj);// jflow按钮执行方法
        }
      },
      clickButtonsTemporaryStorage() { // 暂存事件
        this.temporaryStorage = true;
        if (this.tempStorage && this.tempStorage.temp_storage && this.tempStorage.temp_storage.isenable) { // 扩展属性配置暂存按钮信息，则模拟点击保存按钮的dom节点，暂存和保存的区别为，暂存不做任何校验
          if (this.tempStorage.temp_storage.path) { // 暂存按钮为扩展属性配置，跟随保存按钮权限，可配置path,执行逻辑为模拟点击保存按钮，将配置的path存入全局，保存逻辑
            this.temporaryStoragePath = this.tempStorage.temp_storage.path;
            const dom = document.getElementById('actionMODIFY');
            if (dom) {
              const event = document.createEvent('HTMLEvents');
              event.initEvent('click', false, true);
              dom.dispatchEvent(event);
            }
          } else {
            const data = {
              mask: true,
              title: this.$t('feedback.warning'),
              content: this.$t('messages.setPathConfig')
            };
            this.$Modal.fcWarning(data);
          }
        }
      },
      clickExtraposition(obj) { // jflow方法，实际事件执行方为jflow代码逻辑，框架只是将jflow所需的一些参数
        let currentItemInfo = {};
        if (this.objectType === 'horizontal') {
          if (this.itemInfo) {
            currentItemInfo = {
              tableId: this.tableId, // 主表ID
              tableName: this.tableName, // 主表表名
              itemId: this.itemId, // 主表明细ID
              currentTableId: this.itemInfo.id ? this.itemInfo.id : this.itemInfo.tableid, // 当前表表ID
              currentTableName: this.itemInfo.id ? this.tableName : this.itemInfo.tablename,
              currentItemId: this.itemInfo.id ? this.itemId : this.itemObjId// 当前表明细ID
            };
          }
        } else if (this.itemInfo) { // 有jflowButton则认为编辑的表
          let objId = '';
          let currentTableId = '';
          let currentTableName = '';
          if (this.itemInfo.tableid !== this.tableId) {
            objId = this.itemObjId;
            currentTableId = this.getCurrentItemInfo().tableid;
            currentTableName = this.getCurrentItemInfo().tablename;
          } else {
            objId = this.itemId;
            currentTableId = this.tableId;
            currentTableName = this.tableName;
          }
          currentItemInfo = {
            tableId: this.tableId, // 主表ID
            tableName: this.tableName, // 主表表名
            itemId: this.itemId, // 主表明细ID
            currentTableId, // 当前表表ID
            currentTableName,
            // currentItemId: this.itemObjId// 当前表明细ID
            currentItemId: objId
          };
        }

        // if (this.objectType === 'horizontal') {
        //   currentItemInfo = this.itemInfo;
        // } else if (this.isItemTable) {
        //   currentItemInfo = this.itemInfo;
        // }
        let eventName = 'jflowPlugin';
        if (obj && obj.jflowType && obj.jflowType === 'jflowLaunch') {
          eventName = 'jflowLaunch';
        }  
        if(obj.name === this.$t('buttons.submit')){
            const data = {
            mask: true,
            title: this.$t('feedback.warning'),
            showCancel:true,
            content: this.$t('messages.confirmSubmit'),
             onOk: () => {
               DispatchEvent(eventName, {
                detail: {
                  obj,
                  currentItemInfo, // 当前操作的子表或主表信息
                }
              });

             }
          };
          this.$Modal.fcWarning(data);

        }else{
          DispatchEvent(eventName, {
                detail: {
                  obj,
                  currentItemInfo, // 当前操作的子表或主表信息
                }
              });
        }
        
      },
      testUpdata() { // 校验是否修改过值
        // 校验逻辑为判断单对象各个组件向当前状态模块内抛出的修改后的值，如果该表名对应的对象内有值，则认为该表修改了值
        if (!enableRestrictSave()) { // 该配置为false,则不进行是否修改值的校验
          return true;
        }
        this.isValue = null;
        const itemNames = this.itemNameGroup.map((c) => {
          if (c.tableName !== this.tableName) {
            return c.tableName;
          }
        });// 因左右结构itemNameGroup包含主表，上下结构不包括
        const name = '';
        if (this.itemId === 'New') {
          if (
            (itemNames.includes(this.itemName) && this.updateData[this.itemName]
            && this.updateData[this.itemName].default
            && this.updateData[this.itemName].default[this.itemName]
            && Object.keys(this.updateData[this.itemName].default[this.itemName]).length)
            || (itemNames.includes(this.itemName) && this.updateData[this.itemName]
            && this.updateData[this.itemName].add
            && this.updateData[this.itemName].add[this.itemName]
            && Object.keys(this.updateData[this.itemName].add[this.itemName]).length)
            || (this.updateData[this.tableName]
            && this.updateData[this.tableName].default
            && this.updateData[this.tableName].default[this.tableName]
            && Object.keys(this.updateData[this.tableName].default[this.tableName]).length)
            || (this.updateData[this.tableName]
            && this.updateData[this.tableName].add
            && this.updateData[this.tableName].add[this.tableName]
            && Object.keys(this.updateData[this.tableName].add[this.tableName]).length)
            || (this.updateData[this.tableName]
            && (!this.updateData[this.tableName].default || !this.updateData[this.tableName].default[this.tableName])
            && this.updateData[this.tableName].add
            && this.updateData[this.tableName].add[this.tableName]
            && Object.keys(this.updateData[this.tableName].add[this.tableName]).length)
            || (
              itemNames.includes(this.itemName) && this.updateData[this.itemName]
            && (!this.updateData[this.itemName].default || !this.updateData[this.itemName].default[this.itemName])
            && this.updateData[this.itemName].add
            && this.updateData[this.itemName].add[this.itemName]
            && Object.keys(this.updateData[this.itemName].add[this.itemName]).length)
          ) {
            // 新增时，主子表add中的值>default的值，说明除了默认值之外有新增的值
            // 新增时，主子表add中的值=default的值,说明修改了默认值
            const defaultItemDataLength = itemNames.includes(this.itemName) && this.updateData[this.itemName].default[this.itemName];
            const addItemDataLength = itemNames.includes(this.itemName) && this.updateData[this.itemName].add[this.itemName];
            const defaultMainDataLength = this.updateData[this.tableName].default[this.tableName];
            const addMainDataLength = this.updateData[this.tableName].add[this.tableName];
          
            if (defaultItemDataLength && Object.keys(defaultItemDataLength).length > 0) {
              if (Object.keys(defaultItemDataLength).length
                < Object.keys(addItemDataLength).length// 子表add>default
              ) {
                this.isValue = true;// 新增时，子表add>default,修改了值
                return true;
              } if (JSON.stringify(defaultItemDataLength) !== JSON.stringify(addItemDataLength)) {
                this.isValue = true;// 左右结构，主表或子表修改了值。新增时，主表或子表add=default,修改了默认值
                return true;
              }
              if (addMainDataLength && Object.keys(addMainDataLength).length > 0) {
                if (Object.keys(defaultMainDataLength).length < Object.keys(addMainDataLength).length) { // 主表add>default
                  this.isValue = true;// 主表修改了值
                  return true;
                  console.log('新增时，主表add>default,修改了值');
                } if (JSON.stringify(defaultMainDataLength) !== JSON.stringify(addMainDataLength)) {
                  this.isValue = true;// 主表修改了值
                  return true;
                  console.log('新增时，主表add=default,修改了默认值');
                } 
              
              }


            } else if (defaultMainDataLength && Object.keys(defaultMainDataLength).length > 0) {
              if (Object.keys(defaultMainDataLength).length < Object.keys(addMainDataLength).length) { // 主表add>default
                this.isValue = true;// 主表修改了值。新增时，主表add>default,修改了值
                return true;
              } if (JSON.stringify(defaultMainDataLength) !== JSON.stringify(addMainDataLength)) {
                this.isValue = true;// 主表修改了值。新增时，主表add=default,修改了默认值
                return true;
              } if (addItemDataLength && Object.keys(addItemDataLength).length > 0) {
                this.isValue = true;// 主表修改了值。新增时，子表修改了值
                return true;
              }
              
            } else if (addItemDataLength && Object.keys(addItemDataLength).length > 0) {
              this.isValue = true;// 新增时，子表修改了值
              return true;
            } else if (addMainDataLength && Object.keys(addMainDataLength).length > 0) {
              this.isValue = true;// 新增时，主表修改了值
              return true;
            }

          }
        } else if (this.objectType === 'horizontal') { // 横向布局
          if (itemNames.includes(this.itemName)) { // 子表
            if ((this.updateData[this.itemName] && this.updateData[this.itemName].modify[this.itemName] && Object.keys(this.updateData[this.itemName].modify[this.itemName]).length > 0)
              || (this.updateData[this.itemName].add[this.itemName] && Object.keys(this.updateData[this.itemName].add[this.itemName]).length > 0)) { // 子表新增及修改
              this.isValue = true;// 子表修改了值
              return true;
            }
          } else if (this.updateData[this.tableName].modify[this.tableName] && Object.keys(this.updateData[this.tableName].modify[this.tableName]).length > 0
            || this.updateData[this.tableName].add[this.tableName] && Object.keys(this.updateData[this.tableName].add[this.tableName]).length > 0
          ) {
            this.isValue = true;// 左右主表修改了值
            return true;
          }
        } else if ((this.updateData[this.tableName]
          && this.updateData[this.tableName].modify
          && this.updateData[this.tableName].modify[this.tableName]
          && Object.keys(this.updateData[this.tableName].modify[this.tableName]).length > 0)
          || (this.updateData[this.itemName] && this.updateData[this.itemName].modify[this.itemName]
          && Object.keys(this.updateData[this.itemName].modify[this.itemName]).length > 0)

          || (this.updateData[this.itemName] && this.updateData[this.itemName].add[this.itemName]
          && Object.keys(this.updateData[this.itemName].add[this.itemName]).length > 0)
        ) { // 子表新增及修改
          this.isValue = true;// 主表修改了值。编辑时，修改时上下主或子表修改了值
          return true;
        }
        return false;
      },

      clickButtonsRefresh(type) { // 按钮刷新事件
        if (type === 'jflow') { // jflow调用的刷新，因需要读取jflow传入的回调，则无法执行清空页面状态，则通过收到jflow刷新通知，单独在刷新前执行清空页面状态值逻辑
          this.clearEditData();// 清空store update数据
        }
        this.testUpdata();
        if (this.isValue) {
          this.Warning(this.$t('messages.confirmRefresh'), () => {
            this.refresh(type);
          });
        } else {
          this.refresh(type);
          this.isValue = null;
        }
      },

      Warning(content, callback) {
        const data = {
          title: this.$t('feedback.warning'),
          mask: true,
          content,
          showCancel: true,
          onOk: () => {
            callback();
            this.isValue = null;
          }
        };
        this.$Modal.fcWarning(data);
      },
      refresh(type) {
        if (this.itemInfo.vuedisplay === 'TabItem') { // 兼容半定制界面
          // const webactType = this.itemInfo.webact.substring(0, this.itemInfo.webact.lastIndexOf('/'));
          const webact = this.getCurrentItemInfo().webact;
          if (this.objectType === 'vertical' && webact) {
            DispatchEvent('customizeClick', {
              detail: {
                type: 'refresh'
              }
            });
            this.upData();// 执行刷新事件
            this.clearEditData();// 刷新后将该表状态内存储的数据删除
          } else {
            this.clearEditData();
            const message = this.$t('feedback.refreshSuccess');
            this.clearItemEditData();// 刷新后将该表的子表状态内存储的数据删除
            this.upData(`${message}`);
          }
        } else {
          this.clearEditData();
          const message = this.$t('feedback.refreshSuccess');
          this.clearItemEditData();
          this.upData(`${message}`);
        }
      },
      upData(message) { // 页面刷新判断逻辑
        // 如果不在当前界面就不刷新,不然点重载再返回界面会导致按钮丢失
        if(this.tableName !== this.$route.params.tableName) {
          return
        }
        // this.emptyTestData();
        const webact = this.getCurrentItemInfo().webact;// 定制子表配置
        if (this.objectType === 'vertical' && webact) { // 兼容半定制界面，保存成功时通知外部
          DispatchEvent('tabRefreshClick');
          DispatchEvent('customizeClick', {
            detail: {
              type: 'refresh',
            }
          });
        }
        // DispatchEvent('jflowPlugin', {
        //   detail: {
        //     type: 'fresh'
        //   }
        // });
        let page = {};// 获取当前子表分页参数
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
        } = this.getCurrentItemInfo();

        // 通知表格刷新
        DispatchEvent('tabRefreshClick');// 主表刷新后，需要通知表格将分页参数清除，以便下一次获取的正确
        if (this.objectType === 'horizontal') { // 横向布局
          if (this.currentTabIndex === 0) { // 主表
            this.emptyTestData();// 清空记录的当前表的tab是否点击过的记录，该逻辑对应切换当前表tab时只请求一次，不会重新请求
            new Promise((resolve, reject) => {
              this.getObjectTabForMainTable({
                itemInfo: this.itemInfo, table: this.tableName, objid: this.itemId, tabIndex: this.currentTabIndex, itemTabelPageInfo: page, moduleName: this[MODULE_COMPONENT_NAME], resolve, reject
              });
            }).then(() => {
              if (message) {
                this.$Message.success(message);
              }
            });
          } else if (tabrelation === '1:m') { // 子表
            this.getInputForitemForChildTableForm({ table: tablename, tabIndex: this.currentTabIndex, tabinlinemode });
            const promise = new Promise((resolve, reject) => {
              this.getObjectTabForChildTableButtons({
                itemInfo: this.itemInfo, maintable: this.tableName, table: tablename, objid: this.itemId, tabIndex: this.currentTabIndex, resolve, reject
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
                table: tablename, objid: this.itemId, refcolid, searchdata, tabIndex: this.currentTabIndex
              });
              if (message) {
                this.$Message.success(message);
              }
            });
          } else if (tabrelation === '1:1') {
            const promise = new Promise((resolve, reject) => {
              this.getObjectTabForChildTableButtons({
                itemInfo: this.itemInfo, maintable: this.tableName, table: tablename, objid: this.itemId, tabIndex: this.currentTabIndex, resolve, reject
              });
            });


            this.getItemObjForChildTableForm({
              itemInfo: this.itemInfo, table: tablename, objid: this.itemId, refcolid, tabIndex: this.currentTabIndex
            });
            promise.then(() => {
              if (message) {
                this.$Message.success(message);
              }
            });
          }
        } else { // 纵向布局
          this.emptyTestData();// 清空记录的当前表的tab是否点击过的记录
          this.getObjectForMainTableForm({// 获取主表表单
            table: this.tableName, objid: this.itemId, tabIndex: this.currentTabIndex
          });

          new Promise((resolve, reject) => {
            this.getObjectTabForMainTable({
              itemInfo: this.itemInfo, table: this.tableName, objid: this.itemId, tabIndex: this.currentTabIndex, itemTabelPageInfo: page, moduleName: this[MODULE_COMPONENT_NAME], resolve, reject
            });
          }).then(() => {
            if (message) {
              this.$Message.success(message);
            }
          });
        }

      },
      objectTabAction(obj) { // 按钮执行事件判断逻辑
        switch (obj.eName) {
        case 'actionADD': // 新增
          this.objectAdd(obj);
          break;
        case 'actionMODIFY': // 保存
          // if (!this.testUpdata() && this.objectType === 'vertical') { // 主表无改动，通知自定义tab
          //   const webact = this.getCurrentItemInfo().webact;
          //   if (webact) { // 兼容半定制界面，保存成功时通知外部
          //     DispatchEvent('customizeClick', {
          //       detail: {
          //         type: 'save',
          //       }
          //     });
          //   }
          // }

          // 无条件的派发事件
          DispatchEvent('customizeClick', {
            detail: {
              type: 'save',
            }
          });
          this.objectSave(obj);
          break;

        case 'actionEXPORT': // 导出
          if (this.R3_openedApi_export && typeof this.R3_openedApi_export === 'function') {
            this.R3_openedApi_export();
          } else {
            this.objectEXPORT();
          }
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
      importsuccess() { // 导入成功后执行的事件
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
          tablename, refcolid, tabrelation
        } = this.getCurrentItemInfo();

        const searchdata = {
          column_include_uicontroller: true,
          startindex: (page.currentPageIndex - 1) * page.pageSize,
          range: page.pageSize,
        };

        if (tabrelation === '1:1') {
          const promise = new Promise((resolve, reject) => {
            this.getObjectTabForChildTableButtons({
              itemInfo: this.itemInfo, maintable: this.tableName, table: tablename, objid: this.itemId, tabIndex: this.currentTabIndex, resolve, reject
            });
          });


          this.getItemObjForChildTableForm({
            itemInfo: this.itemInfo, table: tablename, objid: this.itemId, refcolid, tabIndex: this.currentTabIndex
          });
        } else {
          this.getObjectTableItemForTableData({
            table: this.itemName, objid: this.itemId, refcolid, searchdata, tabIndex: this.currentTabIndex
          });
        }
      },

      objectTrySubmit(obj) { // 按钮提交逻辑
        // this.itemTableValidation = true;// 提交逻辑不需要验证子表必填项
        if (this.verifyRequiredInformation()) { // 验证表单必填项
          const data = {
            title: this.$t('feedback.warning'),
            mask: true,
            showCancel: true,
            content: this.$t('messages.confirmSubmit'),
            onOk: () => {
              // this.saveButtonPath = obj.requestUrlPath;
              // const dom = document.getElementById('actionMODIFY');
              // const myEvent = new Event('click');
              // dom.dispatchEvent(myEvent);
              // this.saveEventAfter = 'submit';
              this.clickSave({ requestUrlPath: obj.requestUrlPath, type: 'submit' });// 提交前需先执行保存动作，保存成功后调用提交
            }
          };
          this.$Modal.fcWarning(data);
        }
      },
      objectTryUnSubmit(obj) { // 按钮取消提交操作
        const data = {
          title: this.$t('feedback.warning'),
          mask: true,
          content: this.$t('messages.confirmCancelSubmission'),
          showCancel: true,
          onOk: () => {
            this.saveButtonPath = obj.requestUrlPath;// 保存按钮元数据配置的path
            const promise = new Promise((resolve, reject) => {
              this.getObjectTryUnSubmit({
                buttonInfo: obj, objId: this.itemId, table: this.tableName, path: this.saveButtonPath, isreftabs: this.isreftabs, resolve, reject
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
        // if (this.verifyRequiredInformation()) { // 验证表单必填项
        const data = {
          title: this.$t('feedback.warning'),
          mask: true,
          showCancel: true,
          content: this.$t('messages.confirmVoid'),
          onOk: () => {
            // this.saveButtonPath = obj.requestUrlPath;
            // const dom = document.getElementById('actionMODIFY');
            // dom.click();
            // this.saveEventAfter = 'invalid';

            // 去除作废前调用保存逻辑
            // this.clickSave({ requestUrlPath: obj.requestUrlPath, type: 'invalid' });
            this.invalid(obj);
          }
        };
        this.$Modal.fcWarning(data);
        // }
      },
      invalid(obj) { // 作废逻辑
        const promise = new Promise((resolve, reject) => {
          this.getObjectTryInvalid({
            buttonInfo: obj, objId: this.itemId, table: this.tableName, path: obj.requestUrlPath, isreftabs: this.isreftabs, resolve, reject
          });
        });

        this.saveEventAfter = '';
        const saveEventAfterData = {
          k: 'type',
          v: {}
        };
        updateSessionObject('saveEventAfter', saveEventAfterData);

        promise.then(() => {
          // 若配置了暂存按钮，作废后需将按钮去除
          this.temporaryStorage = false;
          this.dataArray.temporaryStorage = false;
          const message = this.buttonsData.invalidData.message;
          if (message) {
            this.upData(`${message}`);
          } else {
            this.upData();
          }
        }, () => { // 状态为rejected时执行
          // this.upData();
        });
      },
      webactionClick(obj) { // 动作定义执行'
        if (obj.confirm) {
          // 有提示
          let selete = [];// 筛选出当前子表明细勾选的数据
          let type = '';
          if (this.updateData && this.updateData[this.itemName] && this.updateData[this.itemName].delete && this.updateData[this.itemName].delete[this.itemName]) {
            selete = this.updateData[this.itemName].delete[this.itemName];
            if (Object.keys(selete).length === 0) {
              selete = [];
            }
          }

          if (obj.confirm.indexOf('{') >= 0) { // 配置了confirm提示信息
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
                }
                this.dialogMessage(title, contentText, obj);
              } else {
                this.buttonEvent(obj);// 无提示信息，直接执行自定义按钮逻辑
              }
            } else if (JSON.parse(obj.confirm).desc) { // 配置了desc提示信息，按配置弹出提示框，确定后执行自定义按钮逻辑
              const objRes = JSON.parse(JSON.stringify(obj));
              // if (JSON.parse(obj.confirm).isSave && this.testUpdata()) { // 配置isSave以及界面有修改
              //   // objRes.isrefrsh = false;
              //   // type = 'objTabActionSlient';
              //   // this.objTabActionSlientData = obj;
              //   // this.clickSave({ type });
              // }
              const title = this.ChineseDictionary.WARNING;
              const contentText = `${JSON.parse(obj.confirm).desc}`;
              this.dialogMessage(title, contentText, objRes);
            } else if (JSON.parse(obj.confirm).isSave && this.testUpdata()) {
              // 静默执行保存，当前自定义按钮配置了isSave,界面修改了值，则先调用保存逻辑，保存成功后执行自定义按钮逻辑，未修改值则执行自定义按钮逻辑
              type = 'objTabActionSlient';// 静默类型按钮标
              this.objTabActionSlientData = obj;// 存入当前自定义按钮元数据配置，供保存成功后调用自定义按钮逻辑使用
              this.clickSave({ type });// 调用保存事件
            } else {
              this.buttonEvent(obj);
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
      dialogMessage(title, contentText, obj) { // 配置提示信息时点击确认按钮执行的动作
        const data = {
          mask: true,
          title,
          content: contentText,
          showCancel: true,
          onOk: () => {
            if (obj.confirm && obj.confirm.indexOf('{') !== '-1') {
              let verifyRequiredInformation = null;
              try {
                if (JSON.parse(obj.confirm) && JSON.parse(obj.confirm).isSave) {
                  verifyRequiredInformation = this.verifyRequiredInformation();
                  if (verifyRequiredInformation) {
                    if (this.testUpdata()) {
                      const type = 'objTabActionSlient';
                      this.objTabActionSlientData = obj;
                      this.clickSave({ type });
                    } else {
                      this.errorconfirmDialog(obj);
                    }
                  } else {
                    return;
                  }
                } else { // 无修改值时
                  this.errorconfirmDialog(obj);
                }
              } catch (error) {
                this.errorconfirmDialog(obj);
              }
            } else {
              this.errorconfirmDialog(obj);
            }
          }
        };
        this.$Modal.fcWarning(data);
      },
      errorconfirmDialog(obj) {
        this.buttonEvent(obj);
      },
      buttonEvent(obj) {
        const webact = this.getCurrentItemInfo().webact;
        if (this.objectType === 'vertical' && webact) { // 兼容半定制界面，保存成功时通知外部
          DispatchEvent('objTabAction', {
            detail: {
              data: obj
            }
          });
        }

        this.activeTabAction = obj;
        switch (obj.vuedisplay) {
        case 'slient':
        case 'slient_custom':
          this.objTabActionSlient(obj);
          break;
        case 'jflow_trigger':
          this.jflowLaunch(obj);
          break;
        case 'download':// 应该是没有这个配置了，需要确认一下
          this.objTabActiondDownload(obj);
          break;
        case 'dialog':
          this.objTabActionDialog(obj);
          break;
        case 'js':
          if (obj.action && this.$parent[obj.action] && typeof this.$parent[obj.action] === 'function') {
            this.$parent[obj.action](obj);
          }
          break;
        case 'navbar':
          this.objTabActionNavbar(obj);
          break;
        // case 'external':
        //   this.objTabActionUrl(tab);
        //   break;
        case 'edit':// 应该是没有这个配置了，需要确认一下
          this.objTabActionEdit(obj);
          break;
        default:
          break;
        }
      },
      jflowLaunch(obj) {
        obj.jflowType = 'jflowLaunch';
        this.clickExtraposition(obj);
      },
      objTabActionEdit(tab) {
        const editTableId = tab.action.lastIndexOf('/');
        const editTableName = tab.action.substring(0, editTableId);
        const label = `${this.activeTab.label.substring(2, this.$t('buttons.edit'))}${this.$t('tips.virtualTable')}`;
        const name = `S.${editTableName}.${editTableId}`;
        this.addKeepAliveLabelMaps({ name, label });
        const gateWay = this.serviceIdMap[this.tableName];
        this.addServiceIdMap({ tableName: editTableName.toUpperCase(), gateWay });
        const serviceIdMap = JSON.parse(window.localStorage.getItem('serviceIdMap'));
        serviceIdMap[editTableName.toUpperCase()] = `${gateWay}`;
        window.localStorage.setItem('serviceIdMap', JSON.stringify(serviceIdMap));
        this.tabOpen({
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
              id = this.updateData[this.itemName].delete[this.itemName].map(item => window.parseInt16(item.ID));
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
      objTabActionNavbar(tab) { // 跳转界面类型自定义按钮
        const actionType = tab.action.substring(0, tab.action.indexOf('/'));
        // const a = 'SYSTEM/TABLE/AD_TABLE/992?AD_CLIENT_NAME=${AD_CLIENT_NAME}&AD_ORG_ID=${AD_ORG_ID}&name=8888';
        // tab.action = a;
        if (tab.action) {
          let id = [];
          if (this.objectType === 'horizontal') { // 左右结构
            if (this.itemName === this.tableName) { // 主表
              this.routingHop(tab, this.itemId);// 主表使用明细ID
            } else { // 子表
              if (this.updateData && this.updateData[this.itemName] && this.updateData[this.itemName].delete && this.updateData[this.itemName].delete[this.itemName] && this.updateData[this.itemName].delete[this.itemName].length > 0) {
                id = this.updateData[this.itemName].delete[this.itemName].map(item => window.parseInt16(item.ID));
              }
              const type = [
                'CUSTOMIZED',
                'https:',
                'http:'
              ];
              if (type.includes(actionType)) {
                this.routingHop(tab, id);// 主表使用明细ID
              } else {
                if (id.length === 0) {
                  this.$Message.warning(this.$t('messages.checkID'));
                  return;
                } if (id.length > 1) {
                  this.$Message.warning(this.$t('messages.checkSingleID'));
                  return;
                }
                this.routingHop(tab, id);// 主表使用明细ID
              }
            }
          } else { // 上下结构主表
            this.routingHop(tab, this.itemId);
          }
        }
      },
      isCheck() { // 校验是否勾选了明细
        let id = [];
        if (this.updateData && this.updateData[this.itemName] && this.updateData[this.itemName].delete && this.updateData[this.itemName].delete[this.itemName] && this.updateData[this.itemName].delete[this.itemName].length > 0) {
          id = this.updateData[this.itemName].delete[this.itemName].map(item => window.parseInt16(item.ID));
        }
        if (id.length === 0) {
          this.$Message.warning(this.$t('messages.checkID'));
          return false;
        } if (id.length > 1) {
          this.$Message.warning(this.$t('messages.checkSingleID'));
          return false;
        }
        return id;
      },
      getIds(tab){
        // 获取当前的ids  
        if(this.tabCurrentIndex >0 && this.tabPanel){
          return  [this.tabPanel[this.tabCurrentIndex].tableid];
        }else{
          return [this.itemId];
        }
      },
      routerParms(){
          return {
              fullPath: window.vm.$route.fullPath,
              meta: window.vm.$route.meta,
              name: window.vm.$route.name,
              params: window.vm.$route.params,
              path:  window.vm.$route.path,
              query:  window.vm.$route.query
        }
    },
      routingHop(tab, id) {
        // tab.action配置路径前不能加/
        // /:itemId?id=1&&name=2
        // tab.action = 'CUSTOMIZED/FUNCTIONPERMISSION/:itemId?id=1&&name=2';
        let tabAction = '';
        if (tab.action && tab.action.includes('?')) { // path携带了参数
          tabAction = getUserenv({ url: tab.action });// 将参数匹配对应的环境变量值
        } else {
          tabAction = tab.action;
        }
        const actionType = tabAction.substring(0, tabAction.indexOf('/'));
        let singleEditType = tabAction.substring(tabAction.lastIndexOf('/') + 1, tabAction.length);
        if (actionType === 'SYSTEM') { // 框架配置界面
          if (singleEditType === ':itemId') { // 配置的路径未动态id,根据勾选的明细id进行路由拼接
            const path = `/${tabAction.replace(/:itemId/, id)}`;
            this.$router.push(
              path,
              {
                  type:'tablelist',
                  path:path,
                  id:id,
                  router:this.routerParms()
                }
            );
          } else {
            const path = `/${tabAction}`;
            this.$router.push(
              path,
              {
                  type:'tablelist',
                  path:path,
                  router:this.routerParms()
                }
            );
          }
        } else if (actionType === 'https:' || actionType === 'http:') { // 外链界面
          const name = `${LINK_MODULE_COMPONENT_PREFIX}.${tab.webname.toUpperCase()}.${tab.webid}`;
          this.addKeepAliveLabelMaps({ name, label: tab.webdesc });
          const linkUrl = tabAction;
          // const linkId = tab.webid;
          const linkModuleName = tab.webname.toUpperCase();

          if (!this.LinkUrl[linkModuleName]) { // 未防止外链界面在刷新后来源信息丢失，需将信息存入全局模块内
            this.increaseLinkUrl({ linkModuleName, linkUrl });
          }
          const obj = {
            linkName: tab.webname.toUpperCase(),
            linkId: tab.webid,
            linkUrl,
            linkLabel: tab.webdesc
          };
          window.sessionStorage.setItem('tableDetailUrlMessage', JSON.stringify(obj));// 当前跳转逻辑，配置在按钮上的信息对框架来说属于第三方信息，在刷新后会丢失，需存入全局，供刷新浏览器后做回显使用
          const type = 'tableDetailUrl';
          this.tabOpen({
            type,
            linkName: tab.webname,
            linkId: tab.webid
          });
          // 将当前外链界面信息存入session中，供外链界面处理逻辑时，可获取到来源界面的信息
          const data = {
            type: 'singleCustomizeButtonLink',
            value: tab,
            customizedModuleName: tab.webname.toUpperCase()
            // 因外链界面tablinkName相同时，只激活一个tab,所以外链界面用linkName作为key存入session,避免因勾选的id不同存入多个，导致关闭当前tab时无法清除存入的多个
          };
          this.updateCustomizeMessage(data);
        } else if (actionType.toUpperCase() === 'CUSTOMIZED') { // 自定义界面
          let path = tabAction;
          let name = '';
          if (tab.action && tab.action.includes('?')) {
            singleEditType = tab.action.substring(tab.action.lastIndexOf('/') + 1, tab.action.lastIndexOf('?'));// 动态id标记，：itemId
          }
          if (this.getCurrentItemInfo().tabrelation === '1:m') { // 1:m时存在表格，用户可勾选，可匹配动态ID，支持配置:itemId,1:1则不支持
            if (singleEditType === ':itemId') {
              if (this.isCheck()) { // 检测到已勾选
                path = `/${tabAction.replace(/:itemId/, id)}`;// 拼接path
                name = getLabel({ url: tab.action, id, type: 'customized' });// 设置label,需要为要跳转的目标表准备信息，如label,网关等
              } else {
                return;
              }
            } else {
              path = getUrl({ url: path, id: tab.webid, type: 'customized' });// 当检测到没有配置动态ID（itemId）时，getUrl方法会直接去除url上携带的参数，url上不支持配置参数
              name = getLabel({ url: tabAction, id: tab.webid, type: 'customized' });
            }
          } else {
            if (singleEditType === ':itemId') {
              alert(this.$t('messages.noDetail'));
              return;
            }
            path = getUrl({ url: path, id: tab.webid, type: 'customized' });
            name = getLabel({ url: tabAction, id: tab.webid, type: 'customized' });
          }
          // this.addKeepAliveLabelMaps({ name, label: tab.webdesc });


          // 支持直接在跳转定制界面类型的按钮tab.action上配置参数
          // 如：CUSTOMIZED/FUNCTIONPERMISSION？id=1&&name=2
          // const keepAliveLabelMapsObj = {
          //   k: name,
          //   v: tab.webdesc
          // };
          const undataFromPageCustomizeButtonInfo = {
            k: name,
            v: this[INSTANCE_ROUTE_QUERY]
          };
          // updateSessionObject('keepAliveLabelMaps', keepAliveLabelMapsObj);// keepAliveLabel因刷新后来源信息消失，存入session
          updateSessionObject('undataFromPageCustomizeButtonInfo', undataFromPageCustomizeButtonInfo);// 将自定义按钮为跳转自定义界面类型的自定义按钮信息存入session

          // router.push(
          //   path
          // );
          const customizedModuleName = tab.action.split('/')[1];

          const urlRes = `${actionType}/${customizedModuleName.toLocaleUpperCase()}/${tab.webid}`;
          const param = {
            url: urlRes,
            id: tab.webid,
            // label: tab.webdesc,
            isMenu: true,
          };
          this.directionalRouter(param);// 定向路由跳转方法
          const data = {
            type: 'singleCustomizeButton',
            value: tab,
            // customizedModuleId: tab.webid
            // customizedModuleName: customizedModuleName.toLocaleUpperCase()
            // 自定义界面：相同自定义界面标记，ID不同时，只激活同一个tab
          };

          if (enableActivateSameCustomizePage()) {
            data.customizedModuleName = customizedModuleName.toLocaleUpperCase();
          } else {
            data.customizedModuleId = id;
          }
          this.updateCustomizeMessage(data);
        }
      },

      clickSave(data) {
        // this.saveCallBack = null; // 清除保存回调，处理保存失败时候有回调的问题.仅限于当前时机清除，不可移动位置
        if (typeof (data.event) === 'function') {
          this.saveCallBack = data.event;
        }
        if (data ) {
          this.saveButtonPath = data.requestUrlPath;
        }
        // 兼容sp 配置走标准配置
        // if (this.saveButtonPath.includes('sp|')) {
        //       this.saveButtonPath = null;
        // } 
        const dom = document.getElementById('actionMODIFY');
        if (dom) {
          if (data) {
            this.saveEventAfter = data.type;
            const myEvent = document.createEvent('HTMLEvents');
            myEvent.initEvent('click', false, true);
            dom.dispatchEvent(myEvent);
            // const myEvent = new Event('click');
            // dom.dispatchEvent(myEvent);
          } else {
            const myEvent = document.createEvent('HTMLEvents');
            myEvent.initEvent('click', false, true);
            dom.dispatchEvent(myEvent);
            // const myEvent = new Event('click');
            // dom.dispatchEvent(myEvent);
          }
        } else {
          if (data) {
            this.saveEventAfter = data.type;
          }
          const obj = {
            name: this.$t('buttons.save'),
            eName: this.saveInfo.name,
            requestUrlPath: this.saveInfo.paths
          };
          this.objectSave(obj);
        }
      },
      objTabActionSlient(tab) { // 动作定义静默
        this.objTabActionSlientConfirm(tab);
      },
      getIds(tab){
        // 获取当前的ids  
        if(this.tabCurrentIndex >0 && this.tabPanel){
          return  [this.tabPanel[this.tabCurrentIndex].tableid];
        }else{
          return [this.itemId];
        }

      },
      // 动作定义静默执行
      objTabActionSlientConfirm(tab) {
        let params = {};
        const label = `${this.activeTab.label.replace(this.$t('buttons.edit'), '')}`;
        let ids = [];// 子表勾选1.4ID格式
        let idsOld = [];// 1.3ID格式
        let idsOldTypeNumber = [];// 1.3ID格式,number类型

        if (this.updateData && this.updateData[this.itemName] && this.updateData[this.itemName].delete && this.updateData[this.itemName].delete[this.itemName] && this.updateData[this.itemName].delete[this.itemName].length > 0) {
          ids = this.updateData[this.itemName].delete[this.itemName].map(item => window.parseInt16(item.ID));
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
            //  console.log(请检查静默类型按钮action配置，例如:action:com.jackrain.nea.oc.oms.api.OcbOrderMergeMenuCmd:1.0:oms-fi);
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
             //  sp 存储过程
            if(tab.actiontype === 'sp' || (tab.action && tab.action.includes('sp|'))){
                obj.ids = this.getIds(tab);
                delete obj.ID
            }

          } else if (this.subtables()) { // 有子表   左右结构
            if (this.itemName === this.tableName) { // 主表静默逻辑  走保存的逻辑
              obj[this.tableName] = {
                ID: this.itemId
              };
            } else if (this.getCurrentItemInfo().tabrelation === '1:1') { // 子表静默逻辑    // 没有表格
              obj = {
                tableName: this.itemName, // 子表表名
                ids:this.getIds(tab)
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

        // 处理存储过程逻辑，配置的path中带有sp|时则走框架的标准逻辑，不走定制path
        if(tab.actiontype === 'sp' || (tab.action && tab.action.includes('sp|'))){
          params.actionName = tab.webname;
          params.tableName = this.tableName;
        }



        const promise = new Promise((resolve, reject) => {
          this.getObjTabActionSlientConfirm({
            tab, params, path: tab.action, resolve, reject, moduleName: this[MODULE_COMPONENT_NAME], routeQuery: this[INSTANCE_ROUTE_QUERY], routePath: this[INSTANCE_ROUTE], vuedisplay: tab.vuedisplay
          });
          this.$R3loading.show(this.loadingName);
        });
        if (tab.cuscomponent) {
          const nextOperate = JSON.parse(// 配置信息
            tab.cuscomponent
          );

          promise.then(() => {
            this.$R3loading.hide(this.loadingName);
            if (nextOperate.success) {
              let successAction = null;
              let successActionParam = {};
              successAction = nextOperate.success;
              successActionParam = {
                actionid: 0,
                webaction: successAction
              };
              const promiseForSuccess = new Promise((resolve) => {
                this.getActionDataForButtons({ param: successActionParam, resolve });
              });
              promiseForSuccess.then(() => {
                const exeActionDataForComponent = this.ExeActionDataForComponent.data;
                this.webactionClick(exeActionDataForComponent);
              });
            } else {
              const message = this.ExeActionData;
              const data = {
                mask: true,
                title: this.$t('feedback.success'),
                content: `${message}`
              };
              this.$Modal.fcSuccess(data);
            }
          }, () => {
            this.$R3loading.hide(this.loadingName);
            if (nextOperate.failure) {
              let errorAction = null;
              let errorActionParam = {};
              errorAction = nextOperate.failure;
              errorActionParam = {
                actionid: 0,
                webaction: errorAction
              };
              const promises = new Promise((resolve) => {
                this.getActionDataForButtons({ param: errorActionParam, resolve });
              });
              promises.then(() => {
                const exeActionDataForComponent = this.ExeActionDataForComponent.data;
                this.webactionClick(exeActionDataForComponent);
              });
            }
          });
        } else {
          promise.then((res, actionName) => {
            const message = this.objTabActionSlientConfirmData.message;
            const data = {
              mask: true,
              title: this.$t('feedback.success'),
              content: `${message}`,
              onOk: () => {
                DispatchEvent('exeActionSuccessForR3', {
                  detail: {
                    name: 'exeAction',
                    type: 'horizontalTable',
                    url: actionName || '/p/cs/exeAction',
                    res,
                    moduleName: this[MODULE_COMPONENT_NAME],
                    routeQuery: this[INSTANCE_ROUTE_QUERY],
                    tableName: this[INSTANCE_ROUTE_QUERY].tableName,
                    routePath: this[INSTANCE_ROUTE]
                  }
                });
              },
            };
            this.$Modal.fcSuccess(data);
            if (tab.isrefrsh) {
              // 左右结构子表时，接收不到主表的表单监听，需要关闭loading
              // this.$R3loading.hide(this.loadingName);
              if (this.objectType === 'horizontal') {
                const itemNames = this.itemNameGroup.map((c) => {
                  if (c.tableName !== this.tableName) {
                    return c.tableName;
                  }
                });// 因左右结构itemNameGroup包含主表，上下结构不包括
                // if (itemNames.includes(this.itemName)) {
                //   this.$R3loading.hide(this.loadingName);
                // }
                this.$R3loading.hide(this.loadingName);
              }

              this.upData();
            } else {
              // this.upData();
              this.$R3loading.hide(this.loadingName);
            }
          }, () => {
            this.$R3loading.hide(this.loadingName);
          });
        }
      },
      objTabActionDialog(tab) { // 动作定义弹出框
        this.actionId = tab.webid;
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
        this.objTabActionDialogConfig = tab;
        this.dialogComponentName = filePath;
      },
      objectEXPORT() { // 导出功能
        let page = {};
        if (this.objectType === 'horizontal') { // 横向布局
          this.tabPanel.forEach((item) => {
            if (this.itemName !== this.tableName && item.tablename === this.itemName) {
              page = item.tablePageInfo;
            }
          });
        } else {
          this.tabPanel.forEach((item) => {
            if (item.tablename === this.itemName) {
              page = item.tablePageInfo;
            }
          });
        }
        const { refcolid, tabledesc } = this.getCurrentItemInfo();
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
        if (this.getCurrentItemTableRef && this.getCurrentItemTableRef.currentOrderList.length > 0) {
          // 如果没有排序则不传该参数
          searchdatas.orderby = this.getCurrentItemTableRef.currentOrderList;
        }
        const OBJ = {
          searchdata: JSON.stringify(searchdatas),
          filename: tabledesc,
          menu: tabledesc,
          filetype: '.xlsx',
          showColumnName: true,
        };

        // 新异步任务
        if(asyncTaskScheme() === 'skq') {
          const params = {
            detail: {
              apiParams: OBJ
            }
          }
          DispatchEvent(R3_EXPORT, params)
          return
        }

        window.localStorage.setItem('r3-stopPolling', true) // 锁住通知发送
        const promise = new Promise((resolve, reject) => {
          this.getExportQueryForButtons({ OBJ, resolve, reject });
          if(asyncTaskScheme() !== 'skq') {
            this.$R3loading.show(this.loadingName);
          }
        });
        const { tablename } = this.getCurrentItemInfo();
        let pageRes = {};
        let searchdata = {};
        if (this.objectType === 'horizontal') { // 横向布局
          this.tabPanel.forEach((item) => {
            if (this.itemName !== this.tableName && item.tablename === this.itemName) {
              pageRes = item.tablePageInfo;
            }
          });

          searchdata = {
            column_include_uicontroller: true,
            startindex: 0,
            range: pageRes.pageSize,
          };
        }
        promise.then(() => {
          if (this.buttonsData.exportdata) {
            if (Version() === '1.4') {
              // fileUrl字段不存在时就代表是异步导出。
              // 异步导出在[我的任务]查看
              if(messageSwitch()) {
                this.asyncExport()
                return
              }
              this.$R3loading.hide(this.loadingName);

              window.localStorage.setItem('r3-stopPolling', '') // 允许通知发送
              window.dispatchEvent(new CustomEvent('checkNotice')) // 触发通知检测。防止同步任务阻塞期间，把其他异步任务通知拦截了

              const eleLink = document.createElement('a');
              const path = getGateway(`/p/cs/download?filename=${this.buttonsData.exportdata.fileUrl}`);
              eleLink.setAttribute('href', encodeURI(path));
              eleLink.style.display = 'none';
              document.body.appendChild(eleLink);
              eleLink.click();
              document.body.removeChild(eleLink);
            } else {
              this.asyncExport()
              // // fileUrl字段不存在时就代表是异步导出。
              // // 异步导出在[我的任务]查看
              // if(!this.buttonsData.exportdata.fileUrl) {
              //   this.$R3loading.hide(this.loadingName);
              //   if (window.ProjectConfig.messageSwitch) {
              //     this.$Modal.fcSuccess({
              //       title: this.$t('feedback.success'),
              //       mask: true,
              //       content: this.$t('messages.processingTask')
              //     });
              //   }
              //   return
              // }

              // const promises = new Promise((resolve, reject) => {
              //   this.getExportedState({
              //     objid: this.buttonsData.exportdata, id: this.buttonsData.exportdata, resolve, reject
              //   });
              // });
              // promises.then(() => {
              //   this.$R3loading.hide(this.loadingName);
              //   if (this.exportTasks.dialog) {
                  // const message = {
                  //   mask: true,
                  //   title: this.$t('feedback.alert'),
                  //   content: this.$t('messages.processingTask'),
                  //   showCancel: true,
                  //   onOk: () => {
                  //     const type = 'tableDetailVertical';
                  //     const tab = {
                  //       type,
                  //       tableName: Version() === '1.3' ? 'CP_C_TASK' : 'U_NOTE',
                  //       tableId: Version() === '1.3' ? 24386 : 963,
                  //       id: this.buttonsData.exportdata
                  //     };
                  //     this.tabOpen(tab);
                  //     this.updataTaskMessageCount({ id: this.buttonsData.exportdata, stopUpdataQuantity: true });
                  //   }
                  // };
                  // this.$Modal.fcWarning(message);
              //   }
              //   if (this.exportTasks.successMsg) {
              //     const data = {
              //       mask: true,
              //       title: this.$t('feedback.success'),
              //       content: this.exportTasks.resultMsg
              //     };
              //     this.$Modal.fcSuccess(data);
              //   }
              // }, () => {
              //   this.$R3loading.hide(this.loadingName);
              //   if (this.exportTasks.warningMsg) {
              //     this.$Modal.fcError({
              //       mask: true,
              //       title: this.$t('feedback.error'),
              //       content: `${this.exportTasks.resultMsg}`
              //     });
              //   }
              // });
            }

            this.clearItemTableSearchValue();// 清除子表搜索框值
            if (this.objectType === 'horizontal') { // 横向布局
              // let page = {};
              // this.tabPanel.every((item) => {
              //   if (this.itemName !== this.tableName && item.tablename === this.itemName) {
              //     page = item.tablePageInfo;
              //     return false;
              //   }
              //   return true;
              // });

              this.getObjectTableItemForTableData({
                table: tablename, objid: this.itemId, refcolid, searchdata, tabIndex: this.currentTabIndex
              });
            }
            this.updateDeleteData({ tableName: this.itemName, value: {} });
          } else {
            this.$R3loading.hide(this.loadingName);
          }
        }, () => {
          this.getObjectTableItemForTableData({
            table: tablename, objid: this.itemId, refcolid, searchdata, tabIndex: this.currentTabIndex
          });
          this.$R3loading.hide(this.loadingName);
        });
      },

      // 异步导出
      asyncExport() {
        const id = Version() === '1.3' ? this.buttonsData.exportdata : this.buttonsData.exportdata.fileUrl
        const promises = new Promise((resolve, reject) => {
          this.getExportedState({
            objid: id, id, resolve, reject
          });
        });
        promises.then(() => {
          this.$R3loading.hide(this.loadingName);

          window.localStorage.setItem('r3-stopPolling', '') // 允许通知发送
          window.dispatchEvent(new CustomEvent('checkNotice')) // 触发通知检测。防止同步任务阻塞期间，把其他异步任务通知拦截了

          if (this.exportTasks.dialog) {
            // 兼容之前的异步
            if(enableAsyncTaskTip() && Version() === '1.3') {
                const message = {
                mask: true,
                title: this.$t('feedback.alert'),
                content: this.$t('messages.asyncImportSuccess'),
                showCancel: true,
                onOk: () => {
                  const type = 'tableDetailVertical';
                  const tab = {
                    type,
                    tableName: 'CP_C_TASK',
                    tableId: 24386,
                    id: this.buttonsData.exportdata
                  };
                  this.tabOpen(tab);
                  this.updataTaskMessageCount({ id: this.buttonsData.exportdata, stopUpdataQuantity: true });
                }
              };
              this.$Modal.fcWarning(message);
              return
            }
            const msg = !enableTaskNotice() && enableAsyncTaskTip() ? this.$t('messages.asyncTaskTip'): this.$t('messages.processingTask')
            this.$Message.success({
              content: msg,
              duration: 5
            })
          }
          if (this.exportTasks.successMsg) {
            this.$Message.success(this.exportTasks.resultMsg)
          }
        }, () => {
          this.$R3loading.hide(this.loadingName);
          if (this.exportTasks.warningMsg) {
            this.$Modal.fcError({
              mask: true,
              title: this.$t('feedback.error'),
              content: `${this.exportTasks.resultMsg}`
            });
          }
        });
      },

      objectCopy() { // 按钮复制功能
        const id = 'New';// 修改路由,复制操作时路由为新增
        const label = `${this.activeTab.label.replace(this.$t('buttons.edit'), this.$t('buttons.add'))}`;
        if (this.objectType === 'horizontal') { // 横向布局
          if (this.currentTabIndex === 0) { // 主表
            let formData = {};
            // this.tabPanel.forEach((item) => {
            //   if (item.tablename === this.tableName) {
            //     formData = item.componentAttribute.panelData;
            //   }
            // });

            let panelForm = FindInstance(this,'panelForm');
            console.log(panelForm,'panelForm');
             const copyData = { ...panelForm[0].formDataLabel };
            //const copyData = { ...formData };
            const modifyData = this.updateData[this.tableName].changeData;// 取changeData值，因外键形式需要lable和ID
            this.copyDataForSingleObject({ copyData });// 将复制所保存的数据存到global中
            this.copyModifyDataForSingleObject(modifyData);// 将复制修改过所保存的数据存到global中
            this.updateFormDataForRefshow();
            const type = 'tableDetailHorizontal';

            this.tabOpen({// 跳转路由，复制是新增逻辑
              type,
              tableName: this.tableName,
              tableId: this.tableId,
              label,
              id
            });
          }
        } else { // 纵向布局
          let panelForm = FindInstance(this,'panelForm')
          const copyData = { ...panelForm[0].formDataLabel };
          this.copyDataForSingleObject({ copyData });// 将复制所保存的数据存到global中
          const modifyData = this.updateData[this.tableName].changeData;// 取changeData值，因外键形式需要lable和ID
          // this.copyDataForSingleObject({ copyData });// 将复制所保存的数据存到global中
          this.copyModifyDataForSingleObject(modifyData);// 将复制修改过所保存的数据存到global中
          const type = 'tableDetailVertical';
          this.tabOpen({// 跳转路由，复制是新增逻辑
            type,
            tableName: this.tableName,
            tableId: this.tableId,
            label,
            id
          });
        }
        this.updataGlobalLoading(true);
        this.changeCopy(true);
        this.emptyTestData();// 清空记录的当前表的tab是否点击过的记录
      },
      copyForHorizontal() { // 横向结构接口 请求成功后复制逻辑
        this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/savaCopyData`, { copyDatas: this.copyDatas, tableName: this.tableName, modifyData: this.modifyData });
        this.copyDataForSingleObject({});// 清除global中复制所保存的数据
        this.$R3loading.show(this.loadingName);
      },
      copyForVertical() { // 纵向结构接口 请求成功后复制逻辑
        this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/savaCopyData`, { copyDatas: this.copyDatas, tableName: this.tableName, modifyData: this.modifyData });
        this.copyDataForSingleObject({});// 清除global中复制所保存的数据
        this.$R3loading.show(this.loadingName);
      },
      clickButtonsBack({ stop, type, obj }) { // 按钮返回事件
        if (stop) {
          this.back({ stop, type, obj });
          this.isValue = null;
        } else {
          this.testUpdata();
          if (this.isValue) {
            this.Warning(this.$t('messages.confirmBack'), () => {
              this.back({ stop, type, obj });
            });
          } else {
            this.back({ stop, type, obj });
            this.isValue = null;
          }
        }
      },
      back({ stop, type, obj }) {
        this.emptyTestData();// 清空记录的当前表的tab是否点击过的记录
        const { tableId, tableName } = this.$route.params;
        const { routePrefix } = this.$route.meta;

        // 列表界面配置动态路由
        const routeMapRecord = getSessionObject('routeMapRecord');

        const currentRoute = this.activeTab.routeFullPath;
        const keepAliveModuleName = getKeepAliveModuleName(this.$router.currentRoute);
        const tabUrl = keepAliveModuleName.substring(0, 1);

        // 单对象界面配置动态路由
        const routeMapRecordForSingleObject = getSessionObject('routeMapRecordForSingleObject');
        const routeMapRecordForNew = getSessionObject('routeMapRecord');

        const currentPath = this.$router.currentRoute.path;


        const SinglePageRouteNew = enableOpenNewTab() ? currentPath : currentPath.substring(currentPath.indexOf('/') + 1, currentPath.lastIndexOf('/'));
        const SinglePageRouteModify = enableOpenNewTab() ? currentPath : currentPath.substring(currentPath.indexOf('/') + 1, currentPath.lastIndexOf('/'));

        const newListPageRouteNew = enableOpenNewTab() ? keepAliveModuleName : keepAliveModuleName.substring(keepAliveModuleName.indexOf('.') + 1, keepAliveModuleName.lastIndexOf('.'));
        const newListPageRouteMOdify = enableOpenNewTab() ? keepAliveModuleName : keepAliveModuleName.substring(keepAliveModuleName.indexOf('.') + 1, keepAliveModuleName.lastIndexOf('.'));

        let routeMapRecordForSingleObjectNew = '';
        let routeMapRecordForSingleObjectModify = '';
        const routeMapRecordForListModify = {
          to: '',
          from: ''
        };
        const routeMapRecordForListNew = {
          to: '',
          from: ''
        };
        // 拦截跳转逻辑
        let { ResetrouterBackLogic } = window.ProjectConfig;
        if( ResetrouterBackLogic ){
          // 配置重置返回按钮逻辑（外键跳转有返回字段）
           let checked = new RouterPush(this, routePrefix, keepAliveModuleName).back();
            if(checked){
                return;
            }

        }
       
       
   
        if (this.itemId === 'New') { 
          // 单对象界面配置动态路由时，由动态路由界面跳转的新增单对象界面，
          // 点击返回时需回到维护的关系中对应的路由
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
        } else {
          Object.keys(routeMapRecordForNew).map((item) => { // 列表界面
            if (item.indexOf(newListPageRouteMOdify) > -1) {
              routeMapRecordForListModify.to = item;
              routeMapRecordForListModify.from = routeMapRecordForNew[item];
            }
          });
          Object.keys(routeMapRecordForSingleObject).map((item) => { // 单对象界面
            if (item.indexOf(SinglePageRouteModify) > -1) {
              routeMapRecordForSingleObjectModify = item;
            }
          });
        }
        if (routeMapRecord[keepAliveModuleName]) {
          const directionalRouterType = this.getDirectionalRouterType(routeMapRecord[keepAliveModuleName]);
          const param = {
            // type: directionalRouterType,
            // back: true,
            url: routeMapRecord[keepAliveModuleName],
          };
          if (directionalRouterType === 'S') {
            param.back = true;
          } else {
            param.type = directionalRouterType;
          }
          const deleteValue = {
            k: 'keepAliveModuleName',
            v: keepAliveModuleName
          };
          if (keepAliveModuleName.indexOf('PLUGIN') !== -1) { // 从插件界面双击进入单对象界面时，无需执行以下操作
            updateSessionObject('dynamicRoutingIsBackForDelete', deleteValue);
            window.sessionStorage.setItem('dynamicRoutingIsBack', true);// 添加是动态路由返回列表界面标记
          } else { // 从插件界面双击进入单对象界面时，返回时需清除routeMapRecord对应关系
            deleteFromSessionObject('routeMapRecord', keepAliveModuleName);
          }
          if (!enableOpenNewTab()) {
            this.decreasekeepAliveLists(keepAliveModuleName);
          }
          this.tabCloseAppoint({
            routeFullPath: currentRoute, stopRouterPush: true, keepAliveModuleName, routePrefix, itemId: this.itemId, tableName: this.tableName
          });
          this.tabOpen(param);

          // }
        } else if (routeMapRecordForSingleObject[currentPath]) {
          // if (!enableOpenNewTab()) {
          this.decreasekeepAliveLists(keepAliveModuleName);
          this.tabCloseAppoint({
            routeFullPath: currentPath, stopRouterPush: true, keepAliveModuleName, routePrefix, itemId: this.itemId, tableName: this.tableName
          });
          this.$router.push(routeMapRecordForSingleObject[currentPath]);

          // }
          // this.clickButtonsRefresh();
        } else if (routeMapRecordForSingleObjectNew) {
          // if (!enableOpenNewTab()) {
          this.decreasekeepAliveLists(keepAliveModuleName);
          this.tabCloseAppoint({
            routeFullPath: currentPath, stopRouterPush: true, keepAliveModuleName, routePrefix, itemId: this.itemId, tableName: this.tableName
          });
          this.$router.push(routeMapRecordForSingleObject[routeMapRecordForSingleObjectNew]);

          // }
          // this.clickButtonsRefresh();
        } else if (routeMapRecordForListNew.to) { // 动态路由（新增返回）
          const directionalRouterType = this.getDirectionalRouterType(routeMapRecordForListNew.from);
          const param = {
            // type: directionalRouterType,
            // back: true,
            url: routeMapRecordForListNew.from
          };
          if (directionalRouterType === 'S') {
            param.back = true;
          } else {
            param.type = directionalRouterType;
          }
          if (routeMapRecordForListNew.from.indexOf('SYSTEM') > -1) { 
            // 返回列表界面
            const deleteValue = {
              k: 'keepAliveModuleName',
              v: routeMapRecordForListNew.to
            };
            updateSessionObject('dynamicRoutingIsBackForDelete', deleteValue);
            console.log(routeMapRecordForListNew.to,'===')
            if((routeMapRecordForListNew.to).indexOf('PLUGIN')!== -1){
              window.sessionStorage.setItem('dynamicRoutingIsBack', true);
            }
            
          } else {
            deleteFromSessionObject('routeMapRecord', routeMapRecordForListNew.to);// 清除动态路由对应关系
          }
          // 添加是动态路由返回列表界面标记
          // if (!enableOpenNewTab()) {

          this.decreasekeepAliveLists(keepAliveModuleName);
          this.tabCloseAppoint({
            routeFullPath: currentRoute, stopRouterPush: true, keepAliveModuleName, routePrefix, itemId: this.itemId, tableName: this.tableName
          });
          this.tabOpen(param);

          // }
        } else if (routeMapRecordForSingleObjectModify) { // 单对象动态路由新增以及复制保存后跳转到编辑界面的返回需回到动态路由对应的界面
          // if (!enableOpenNewTab()) {
          this.decreasekeepAliveLists(keepAliveModuleName);
          this.tabCloseAppoint({
            routeFullPath: currentPath, stopRouterPush: true, keepAliveModuleName, routePrefix, itemId: this.itemId, tableName: this.tableName
          });
          this.$router.push(routeMapRecordForSingleObject[routeMapRecordForSingleObjectModify]);

          // }
        } else if (routeMapRecordForListModify.to) { // 列表动态路由（新增/复制保存成功后跳转到单对象界面执行返回操作）
          const directionalRouterType = this.getDirectionalRouterType(routeMapRecordForListNew.from);
          const param = {
            type: directionalRouterType,
            url: routeMapRecord[routeMapRecordForListModify.to]
          };
          const deleteValue = {
            k: 'keepAliveModuleName',
            v: routeMapRecordForListModify.to
          };
          updateSessionObject('dynamicRoutingIsBackForDelete', deleteValue);
          window.sessionStorage.setItem('dynamicRoutingIsBack', true);// 添加是动态路由返回列表界面标记
          // if (!enableOpenNewTab()) {
          this.decreasekeepAliveLists(keepAliveModuleName);
          this.tabCloseAppoint({
            routeFullPath: currentRoute, stopRouterPush: true, keepAliveModuleName, routePrefix, itemId: this.itemId, tableName: this.tableName
          });
          this.tabOpen(param);

          // }
        } else if (enableOpenNewTab()) {
          const keepAliveModuleNameForOpenNewTab = this[MODULE_COMPONENT_NAME];
          const currentRouteForOpenNewTab = this.$router.currentRoute.fullPath;
          this.decreasekeepAliveLists(keepAliveModuleNameForOpenNewTab);
          const closeParame = {
            tableName: this.tableName, routeFullPath: currentRouteForOpenNewTab, routePrefix, keepAliveModuleName, itemId: this.itemId
          };

          if (type === 'back') {
            this.tabCloseAppoint(closeParame);
            if (this.currentMenuExists({ tableName })) {
              closeParame.stopRouterPush = true;// 筛选到菜单内配置了当前单对象对应的标准列表界面，则可返回到其列表界面，反之，回到前一个tab
              const url = `/SYSTEM/TABLE/${this.tableName}/${this.tableId}`;
              const param = {
                tableId,
                tableName,
                back: true,
                url,
                NToUpperCase: true,
              };
              this.tabOpen(param);
            }
          } else {
            this.tabCloseAppoint(closeParame);
          }
        } else if (type === 'back') {
          const param = {
            tableId,
            tableName,
            back: true,
          };
          this.tabOpen(param);
        } else if (!enableOpenNewTab()) {
          // enableOpenNewTab为false,即单对象不是多开tab的情况，删除单对象后要返回列表
          const param = {
            tableId,
            tableName,
            back: true,
          };
          this.tabOpen(param);
        }
      },
      currentMenuExists(data) { // 判断当前表是否配置在菜单内
        // data.tableName:当前表名
        const name = Object.keys(this.allMenu).filter(d => d.includes(data.tableName));
        if (name.length > 0) {
          return true;
        }
        return false;
      },
      getDirectionalRouterType(url) { // 根据路由获取对应的页面类型
        // url：
        let directionalRouterType = '';
        if (url.indexOf(STANDARD_TABLE_LIST_PREFIX) > -1) {
          directionalRouterType = 'S';
        } else if (url.indexOf(HORIZONTAL_TABLE_DETAIL_PREFIX || VERTICAL_TABLE_DETAIL_PREFIX) > -1) {
          directionalRouterType = 'V';
        } else if (url.indexOf(CUSTOMIZED_MODULE_PREFIX) > -1) {
          directionalRouterType = 'C';
        } else if (url.indexOf(PLUGIN_MODULE_PREFIX) > -1) {
          directionalRouterType = 'P';
        }
        return directionalRouterType;
      },
      getbuttonGroupData(tabcmd) { // 按钮渲染逻辑
        const tabcmdData = tabcmd;
        if (tabcmdData.cmds) {
          // tabcmdData.cmds.forEach((item, index) => {
          if (this.objectType === 'horizontal') { // 横向布局
            if (this.itemName !== this.tableName) { // 子表
              const { tabrelation } = this.getCurrentItemInfo();
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

                      if (tabcmd.jflowpaths) {
                        buttonConfigInfo.jflowpath = tabcmd.jflowpaths[index];
                      }

                      this.updateRefreshButton(true);
                      // if (this.tempStorage && this.tempStorage.temp_storage && this.tempStorage.temp_storage.isenable) {
                      //   this.dataArray.temporaryStorage = true;// 新增配置保存按钮时，显示暂存按钮
                      // }
                      // this.dataArray.refresh = this.refreshButtons;
                      this.dataArray.buttonGroupShowConfig.buttonGroupShow.push(buttonConfigInfo);
                    }
                  } else if (item === 'actionMODIFY' && tabcmd.jflowpaths) {
                    this.saveButtonJflowPath = tabcmd.jflowpaths[index];
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
                      if (tabcmd.jflowpaths) {
                        buttonConfigInfo.jflowpath = tabcmd.jflowpaths[index];
                      }

                      this.updateRefreshButton(true);
                      if (this.tempStorage && this.tempStorage.temp_storage && this.tempStorage.temp_storage.isenable && !this.isHideTempStorage) {
                        this.dataArray.temporaryStorage = true;// 新增配置保存按钮时，显示暂存按钮
                      }
                      // this.dataArray.refresh = this.refreshButtons;jflowOldAndNew
                      this.dataArray.buttonGroupShowConfig.buttonGroupShow.push(buttonConfigInfo);
                    }
                  } else if (item === 'actionMODIFY' && tabcmd.jflowpaths) {
                    this.saveButtonJflowPath = tabcmd.jflowpaths[index];
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
                          if (this.tempStorage && this.tempStorage.temp_storage && this.tempStorage.temp_storage.isenable && !this.isHideTempStorage) {
                            this.dataArray.temporaryStorage = true;// 新增配置保存按钮时，显示暂存按钮
                          }
                        }
                      } else if (item === 'actionMODIFY') {
                        if (this.tempStorage && this.tempStorage.temp_storage && this.tempStorage.temp_storage.isenable && !this.isHideTempStorage) {
                          this.dataArray.temporaryStorage = true;// 新增配置保存按钮时，显示暂存按钮
                        }
                      }
                      if (tabcmd.jflowpaths) {
                        buttonConfigInfo.jflowpath = tabcmd.jflowpaths[index];
                      }

                      this.updateRefreshButton(true);

                      this.dataArray.buttonGroupShowConfig.buttonGroupShow.push(buttonConfigInfo);
                    }
                  } else if (item === 'actionMODIFY' && tabcmd.jflowpaths) {
                    this.saveButtonJflowPath = tabcmd.jflowpaths[index];
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

                        if (this.tempStorage && this.tempStorage.temp_storage && this.tempStorage.temp_storage.isenable && !this.isHideTempStorage) {
                          this.dataArray.temporaryStorage = true;// 新增配置保存按钮时，显示暂存按钮
                        }
                      }
                    } else if (item === 'actionMODIFY') {
                      if (this.tempStorage && this.tempStorage.temp_storage && this.tempStorage.temp_storage.isenable && !this.isHideTempStorage) {
                        this.dataArray.temporaryStorage = true;// 新增配置保存按钮时，显示暂存按钮
                      }
                    }
                    if (tabcmd.jflowpaths) {
                      buttonConfigInfo.jflowpath = tabcmd.jflowpaths[index];
                    }

                    this.updateRefreshButton(true);

                    this.dataArray.buttonGroupShowConfig.buttonGroupShow.push(buttonConfigInfo);
                  }
                } else if (item === 'actionMODIFY' && tabcmd.jflowpaths) {
                  this.saveButtonJflowPath = tabcmd.jflowpaths[index];
                }
              }
            });
          }
          //
        }
        // }
      },
      waListButtons(tabwebact) { // 自定义按钮渲染逻辑
        if (tabwebact.jflowbutton && tabwebact.jflowbutton.length > 0) {
          this.dataArray.jflowButton = tabwebact.jflowbutton;
        } else {
          this.dataArray.jflowButton = [];
        }

        if (this.objectType === 'horizontal') { // 横向布局
          if (this.itemName === this.tableName) {
            if (tabwebact.objbutton && tabwebact.objbutton.length > 0) {
              this.webactButton(tabwebact.objbutton);
            }
          } else if
            (tabwebact.objtabbutton && tabwebact.objtabbutton.length > 0) {
            this.webactButton(tabwebact.objtabbutton);
          }
          // if (tabwebact.objbutton && tabwebact.objbutton.length > 0) {
          //   this.webactButton(tabwebact.objbutton);
          // } else if (tabwebact.objtabbutton && tabwebact.objtabbutton.length > 0) {
          //   this.webactButton(tabwebact.objtabbutton);
          // }
        } else if (this.isItemTable) {
          if (tabwebact.objtabbutton && tabwebact.objtabbutton.length > 0) {
            this.webactButton(tabwebact.objtabbutton);
          }
        } else if (tabwebact.objbutton && tabwebact.objbutton.length > 0) {
          this.webactButton(tabwebact.objbutton);
        }
      },

      webactButton(buttonData) { // 自定义按钮渲染
        if (buttonData && buttonData.length > 0) {
          buttonData.forEach((item, index) => {
            if (item && item.ishide) {
              buttonData.splice(index);
            }
            this.dataArray.waListButtonsConfig.waListButtons.push(item);
          });
        }
      },
      addButtonShow(tabcmd) { // 判断按钮显示的条件是否为新增
        tabcmd.cmds.map((item, index) => {
          if (item === 'actionADD') {
            if (tabcmd.prem[index]) {
              if (this.tempStorage && this.tempStorage.temp_storage && this.tempStorage.temp_storage.isenable && !this.isHideTempStorage) {
                this.dataArray.temporaryStorage = true;// 新增配置保存按钮时，显示暂存按钮
              }
              this.dynamic.eName = 'actionMODIFY';
              this.dataArray.buttonGroupShowConfig.buttonGroupShow = [];
              if (this.tabcmd.paths) {
                this.dynamic.requestUrlPath = this.tabcmd.paths[index];
              }
              if (this.tabcmd.jflowpaths) {
                this.dynamic.jflowpath = this.tabcmd.jflowpaths[index];
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
        const buttonInfo = this.dataArray.buttonGroupShowConfig.buttonGroupShow.filter(d => d.name === this.$t('buttons.delete'))[0];
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

        if (this.subtables()) { // 存在子表
          if (this.objectType === 'horizontal') { // 横向布局
            if (this.itemName === this.tableName) { // 主表删除
              if (obj.requestUrlPath) { // 有path
                this.saveParameters();// 调用获取参数方法
                const data = {
                  title: this.$t('feedback.warning'),
                  mask: true,
                  content: this.$t('messages.confirmDelete'),
                  showCancel: true,
                  onOk: () => {
                    const promise = new Promise((resolve, reject) => {
                      this.performMainTableDeleteAction({
                        buttonInfo,
                        path: obj.requestUrlPath,
                        table: this.tableName,
                        objId: this.itemId,
                        currentParameter: this.currentParameter,
                        itemName: this.itemName,
                        isreftabs: this.subtables(),
                        itemNameGroup: this.itemNameGroup,
                        itemCurrentParameter: this.itemCurrentParameter,
                        tabIndex: this.currentTabIndex,
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
                  title: this.$t('feedback.warning'),
                  mask: true,
                  content: this.$t('messages.confirmDelete'),
                  showCancel: true,
                  onOk: () => {
                    const promise = new Promise((resolve, reject) => {
                      this.performMainTableDeleteAction({
                        buttonInfo, table: this.tableName, objId: this.itemId, resolve, reject
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
              const { tablename, refcolid, tabinlinemode } = this.getCurrentItemInfo();
              if (obj.requestUrlPath) { // 有path
                this.saveParameters();// 调用获取参数方法
                const data = {
                  title: this.$t('feedback.warning'),
                  mask: true,
                  content: this.$t('messages.confirmDelete'),
                  showCancel: true,
                  onOk: () => {
                    const promise = new Promise((resolve, reject) => {
                      this.performMainTableDeleteAction({
                        buttonInfo,
                        path: obj.requestUrlPath,
                        table: this.tableName,
                        objId: this.itemId,
                        currentParameter: this.currentParameter,
                        itemName: this.itemName,
                        isreftabs: this.subtables(),
                        itemNameGroup: this.itemNameGroup,
                        itemCurrentParameter: this.itemCurrentParameter,
                        tabIndex: this.currentTabIndex,
                        resolve,
                        reject
                      });
                    });

                    promise.then(() => {
                      const deleteMessage = this.buttonsData.deleteData;
                      if (deleteMessage) {
                        this.$Message.success(`${deleteMessage}`);
                        DispatchEvent('changePageForSelete', {
                          detail: {
                            tableName: this.tableName
                          }
                        });
                        // const searchdata = {
                        //   column_include_uicontroller: true,
                        //   startindex: (page.currentPageIndex - 1) * page.pageSize,
                        //   range: page.pageSize,
                        // };
                        // this.getObjectTableItemForTableData({
                        //   table: tablename, objid: this.itemId, refcolid, searchdata, tabIndex
                        // });
                        this.getInputForitemForChildTableForm({ table: tablename, tabIndex: this.currentTabIndex, tabinlinemode });
                        this.updateDeleteData({ tableName: this.itemName, value: {} });
                        // this.clickButtonsBack();
                        // this.$store.dispatch(`${this[MODULE_COMPONENT_NAME]}/getQueryListForAg`, searchData);
                      }
                    }, () => {
                      const deleteMessage = this.buttonsData.deleteData;
                      if (deleteMessage) {
                        this.$Message.success(`${deleteMessage}`);
                      }
                      this.updateModifyData({ tableName: tablename, value: {} });
                      this.updateDeleteData({ tableName: tablename, value: {} });
                      this.updateLabelData({ tableName: tablename, value: {} });
                    });
                  }
                };
                this.$Modal.fcWarning(data);
              } else { // 没有path
                // 没有path
                const data = {
                  title: this.$t('feedback.warning'),
                  mask: true,
                  content: this.$t('messages.confirmDelete'),
                  showCancel: true,
                  onOk: () => {
                    const promise = new Promise((resolve, reject) => {
                      this.performMainTableDeleteAction({
                        buttonInfo,
                        path: obj.requestUrlPath,
                        table: this.tableName,
                        objId: this.itemId,
                        currentParameter: this.currentParameter,
                        itemName: this.itemName,
                        isreftabs: this.subtables(),
                        itemNameGroup: this.itemNameGroup,
                        itemCurrentParameter: this.itemCurrentParameter,
                        tabIndex: this.currentTabIndex,
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
                        // const { tablename, refcolid, tabinlinemode } = this.getCurrentItemInfo();
                        DispatchEvent('changePageForSelete', {
                          detail: {
                            tableName: this.tableName
                          }
                        });
                        // const searchdata = {
                        //   column_include_uicontroller: true,
                        //   startindex: (page.currentPageIndex - 1) * page.pageSize,
                        //   range: page.pageSize,
                        // };
                        // this.getObjectTableItemForTableData({
                        //   table: tablename, objid: this.itemId, refcolid, searchdata, tabIndex
                        // });
                        this.getInputForitemForChildTableForm({ table: tablename, tabIndex: this.currentTabIndex, tabinlinemode });
                        this.updateDeleteData({ tableName: this.itemName, value: {} });
                      }
                    }, (res) => {
                      // this.$parent.$refs.objectTableRef.reloadErrorTips(res.data.data);
                      const deleteMessage = this.buttonsData.deleteData;
                      if (deleteMessage) {
                        this.$Message.success(`${deleteMessage}`);
                      }
                      this.updateModifyData({ tableName: tablename, value: {} });
                      this.updateDeleteData({ tableName: tablename, value: {} });
                      this.updateLabelData({ tableName: tablename, value: {} });
                    });
                  }
                };
                this.$Modal.fcWarning(data);
              }
            } else {
              const data = {
                mask: true,
                title: this.$t('feedback.warning'),
                content: this.$t('messages.chooseRecord',{action:obj.name})
              };
              this.$Modal.fcWarning(data);
            }
          } else if (this.objectType === 'vertical') {
            if (obj.requestUrlPath) { // 有path
              this.saveParameters();// 调用获取参数方法
              const data = {
                title: this.$t('feedback.warning'),
                mask: true,
                content: this.$t('messages.confirmDelete'),
                showCancel: true,
                onOk: () => {
                  const promise = new Promise((resolve, reject) => {
                    this.performMainTableDeleteAction({
                      buttonInfo,
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
                title: this.$t('feedback.warning'),
                mask: true,
                content: this.$t('messages.confirmDelete'),
                showCancel: true,
                onOk: () => {
                  const promise = new Promise((resolve, reject) => {
                    this.performMainTableDeleteAction({
                      buttonInfo, table: this.tableName, objId: this.itemId, resolve, reject
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
            title: this.$t('feedback.warning'),
            mask: true,
            content: this.$t('messages.confirmDelete'),
            showCancel: true,
            onOk: () => {
              const promise = new Promise((resolve, reject) => {
                this.performMainTableDeleteAction({
                  buttonInfo, path: obj.requestUrlPath, table: this.tableName, objId: this.itemId, resolve, reject,
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
            title: this.$t('feedback.warning'),
            mask: true,
            content: this.$t('messages.confirmDelete'),
            showCancel: true,
            onOk: () => {
              const promise = new Promise((resolve, reject) => {
                this.performMainTableDeleteAction({
                  buttonInfo, table: this.tableName, objId: this.itemId, resolve, reject
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
        const webact = this.getCurrentItemInfo().webact;
        if (this.objectType === 'vertical' && webact) { // 兼容半定制界面
          DispatchEvent('customizeClick', {
            detail: {
              type: 'delete'
            }
          });
        }
      },
      deleteSuccessEvent() {
        const value = this.hideBackButton();
        const keepAliveModuleName = this.activeTab.keepAliveModuleName;
        const currentRoute = this.$router.currentRoute.path;
        const routePrefix = this.$router.currentRoute.meta.routePrefix;
        if (value) {
          this.decreasekeepAliveLists(keepAliveModuleName);
          this.tabCloseAppoint({
            tableName: this.tableName, routeFullPath: currentRoute, routePrefix, itemId: this.itemId, tableName: this.tableName
          });
        } else {
          const stop = true;
          this.clickButtonsBack({ stop });
          // if (enableOpenNewTab()) {
          //   this.decreasekeepAliveLists(keepAliveModuleName);
          //   this.tabCloseAppoint({ tableName: this.tableName, routeFullPath: currentRoute, routePrefix });
          // }
        }
      },
      objectAdd() { // 新增
        this.testUpdata();
        if (this.isValue) {
          this.Warning(this.$t('messages.confirmAdd'), () => {
            this.clickAdd();
          });
        } else {
          this.clickAdd();
        }

        // this.emptyTestData();// 清空记录的当前表的tab是否点击过的记录
        // 如果不清空，跳转到新增界面时会出现子表无请求的状况
      },
      clickAdd() {
        const id = 'New';
        if (this.objectType === 'horizontal') {
          const type = 'tableDetailHorizontal';
          this.tabOpen({
            type,
            tableName: this.tableName,
            tableId: this.tableId,
            id
          });
        } else if (this.objectType === 'vertical') {
          const type = 'tableDetailVertical';
          this.tabOpen({
            type,
            tableName: this.tableName,
            tableId: this.tableId,
            id
          });
        }
      },
      noClickSave() { // 校验是否是保存按钮调用的保存方法
        const saveEventAfter = getSessionObject('saveEventAfter');
        if (this.saveEventAfter === 'submit'
          || saveEventAfter.type === 'submit'
          || this.saveEventAfter === 'objTabActionSlient'
          || saveEventAfter.type === 'objTabActionSlient') { // 提交操作
          return true;
        }
        return false;
      },
      getCurrentItemInfo() { // 获取当前子表信息
        if (this.objectType === 'vertical' && this.itemInfo.buttonsData && this.itemInfo.buttonsData.data && this.itemInfo.buttonsData.data.reftabs && this.itemInfo.buttonsData.data.reftabs.length > 0) { // 上下结构需要获取的是当前子表
          return this.itemInfo.buttonsData.data.reftabs[this.tabCurrentIndex];
        }
        return this.itemInfo;
      },
      objectSave(obj) { // 保存按钮事件逻辑
        // const webact = this.getCurrentItemInfo().webact;
        // if (this.objectType === 'vertical' && webact) { // 兼容半定制界面，保存成功时通知外部
        //   DispatchEvent('customizeClick', {
        //     detail: {
        //       type: 'save',
        //       mainTableParame: this.currentParameter,
        //       itemTableParame: this.itemCurrentParameter,
        //     }
        //   });
        // }
        // 因表单失去焦点触发联动校验需一定的时间处理，故校验逻辑需要延时，因延时是异步的，无法return值，所以在调用保存时，处理延时逻辑
        setTimeout(() => {
          if (this.itemId === 'New') { // 主表新增保存和编辑新增保存
            if (this.verifyRequiredInformation()) { // 校验必填项
              this.mainTableNewSaveAndEditorNewSave();
            }
          } else if (this.itemId !== '-1') { // 主表编辑保存
            this.mainTableEditorSave(obj);
          }
        }, 600);
      },
      mainTableNewSaveAndEditorNewSave() { // 新增保存
        this.saveParameters();// 调用获取参数方法
        const itemName = this.itemName;// 子表表名
        const itemCurrentParameter = this.itemCurrentParameter;// 当前子表保存所需参数
        const type = 'add';
        const path = this.dynamic.requestUrlPath;
        const objId = -1;
        if (!this.subtables()) { // 为false的情况下是没有子表
          if (this.dynamic.requestUrlPath) { // 配置path
            // console.log(' 主表新增保存,配置path的', this.dynamic.requestUrlPath);
            this.savaNewTable(type, path, objId);
          } else { // 没有配置path
            this.savaNewTable(type, path, objId);
          }
        }
        if (this.subtables()) { // 存在子表
          if (this.dynamic.requestUrlPath) { // 配置path
            this.savaNewTable(type, path, objId, itemName, itemCurrentParameter);
          } else { // 没有配置path
            this.savaNewTable(type, path, objId, itemName, itemCurrentParameter);
          }
        }
      },
      mainTableEditorSave(obj) { // 主表编辑保存
        this.saveParameters();// 调用获取参数方法
        const path = obj.requestUrlPath;
        const type = 'modify';
        let mainModify = {};// 主表修改的值
        if (this.updateData && this.updateData[this.tableName] && this.updateData[this.tableName].modify && this.updateData[this.tableName].modify[this.tableName]) {
          mainModify = Object.keys(this.updateData[this.tableName].modify[this.tableName]);
        }
        if (!this.subtables()) { // 为false的情况下是没有子表
          if (!enableRestrictSave()) {
            if (!Array.isArray(this.mainModify)) {
              mainModify = [];
            }
            const tag = 'jflow';
            mainModify.push(tag);
          }
          if ((this.verifyRequiredInformation() && mainModify.length > 0) || this.noClickSave()) {
            if (obj.requestUrlPath) { // 配置path。主表编辑保存,配置path的逻辑', obj.requestUrlPath
              this.savaNewTable(type, path, this.itemId);
            } else { // 没有配置path。主表编辑保存,没有配置path的逻辑
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
        const itemCurrentParameter = this.itemCurrentParameter;// 子表参数
        // const currentParameter = this.currentParameter;
        const path = obj.requestUrlPath;// 配置的path
        const type = 'modify';
        const objId = this.itemId;
        let mainModify = {};// 主表修改的值
        if (this.updateData && this.updateData[this.tableName] && this.updateData[this.tableName].modify && this.updateData[this.tableName].modify[this.tableName]) {
          mainModify = Object.keys(this.updateData[this.tableName].modify[this.tableName]);
        }

        if (this.objectType === 'vertical') {
          let itemModify = [];
          let itemAdd = [];
          if (this.updateData[itemName].modify && this.updateData[itemName].modify[itemName]) {
            itemModify = Object.keys(this.updateData[itemName].modify[itemName]);// 子表修改的值
          }
          if (this.updateData[itemName] && this.updateData[itemName].add[itemName]) {
            itemAdd = Object.keys(this.updateData[itemName].add[itemName]);// 子表新增的值
          }
          // if (this.noClickSave()) {
          //   if (this.verifyRequiredInformation()) { // 纵向结构保存校验
          //     if (obj.requestUrlPath) { // 配置path
          //       this.savaNewTable(type, path, objId, itemName, itemCurrentParameter);
          //     } else { // 没有配置path
          //       this.savaNewTable(type, path, objId, itemName, itemCurrentParameter);
          //     }
          //   }
          // } else
          if (itemModify.length === 0 && itemAdd.length === 0) { // 主表修改
            if (!enableRestrictSave()) {
              const tag = 'jflow';
              if (!Array.isArray(this.mainModify)) {
                mainModify = [];
              }
              mainModify.push(tag);
            }
            if (mainModify.length > 0 || this.noClickSave()) { // 主表修改了值和提交或自定义按钮配置isSave时，调用保存
              if (this.verifyRequiredInformation()) { // 纵向结构保存校验
                if (obj.requestUrlPath) { // 配置path
                  this.savaNewTable(type, path, objId, itemName, itemCurrentParameter);
                } else { // 没有配置path
                  this.savaNewTable(type, path, objId, itemName, itemCurrentParameter);
                }
              }
            }
          } else {
            let flag = false;// 是否符合以下某一个判断条件，用于非保存动作进行的保存（提交），如果没有，按照提交逻辑，不管是否修改字段，都要进行一次保存，如未修改过任何值，则进行一次主表保存
            if (itemModify.length > 0 && itemAdd.length < 1) { // 子表表格编辑修改
              // 校验子表表格必填项
              if (this.tempStorage && this.tempStorage.temp_storage && this.tempStorage.temp_storage.isenable && this.temporaryStoragePath) { // 配置了暂存按钮，不校验子表
                this.savaNewTable(type, path, objId, itemName, itemCurrentParameter, { sataType: 'modify' });
                flag = true;
              } else if (this.getCurrentItemInfo().tabrelation === '1:1') { // 1:1模式，不能再调用this.itemTableCheckFunc()检验，需重新定义逻辑
                if (this.verifyRequiredInformation()) {
                  this.savaNewTable(type, path, objId, itemName, itemCurrentParameter, { sataType: 'modify' });
                  flag = true;
                }
              } else if (this.itemTableCheckFunc()) { // 未配置暂存按钮，子表必须校验,1:m
                if(this.verifyRequiredmainInformation()){
                   this.savaNewTable(type, path, objId, itemName, itemCurrentParameter, { sataType: 'modify' });
                    flag = true;     
                }
               
              }
            }
            // const add = Object.assign({}, this.updateData[itemName].add[itemName], this.updateData[itemName].addDefault[itemName]);// 整合子表新增和默认值数据
            if (itemAdd.length > 0 && itemModify.length < 1) { // 子表新增
              if (this.verifyRequiredInformation()) { // 纵向结构保存校验
                this.savaNewTable(type, path, objId, itemName, itemCurrentParameter, { sataType: 'add' });
                flag = true;
              }
            }
            if (itemAdd.length > 0 && itemModify.length > 0) {
              if (this.verifyRequiredInformation()) { // 纵向结构保存校验
                if (this.tempStorage && this.tempStorage.temp_storage && this.tempStorage.temp_storage.isenable && this.temporaryStoragePath) { // 配置了暂存按钮，不校验子表
                  this.savaNewTable(type, path, objId, itemName, itemCurrentParameter, { sataType: 'addAndModify' });
                  flag = true;
                } else if (this.itemTableCheckFunc()) { // 未配置暂存按钮，子表必须校验
                  this.savaNewTable(type, path, objId, itemName, itemCurrentParameter, { sataType: 'addAndModify' });
                  flag = true;
                }
              }
            }


            if (this.noClickSave() && !flag) { // 当前为非保存按钮调用的保存操作，如flag=false则认为不符合以上任何判断可以进行保存的条件，则无条件调用一次主表保存
              if (this.verifyRequiredInformation()) { // 纵向结构保存校验
                if (obj.requestUrlPath) { // 配置path
                  this.savaNewTable(type, path, objId, itemName, itemCurrentParameter);
                } else { // 没有配置path
                  this.savaNewTable(type, path, objId, itemName, itemCurrentParameter);
                }
              }
            }
          }
        } else if (itemName === this.tableName) { // 主表修改
          if (!enableRestrictSave()) {
            if (!Array.isArray(this.mainModify)) {
              mainModify = [];
            }
            const tag = 'jflow';
            mainModify.push(tag);
          }
          if (mainModify.length > 0 || this.noClickSave()) { // 主表修改了值和提交或自定义按钮配置isSave时，调用保存
            if (this.verifyRequiredInformation()) { // 横向结构保存校验
              if (obj.requestUrlPath) { // 配置path
                this.savaNewTable(type, path, objId, itemName, itemCurrentParameter);
              } else { // 没有配置path
                this.savaNewTable(type, path, objId, itemName, itemCurrentParameter);
              }
            }
          }
        } else { // 子表修改
          let itemModify = [];// 子表修改的值
          let itemAdd = [];// 子表新增的值
          if (this.updateData[itemName].modify && this.updateData[itemName].modify[itemName]) {
            itemModify = Object.values(this.updateData[itemName].modify[itemName]);
          }
          if (this.updateData[itemName].add && this.updateData[itemName].add[itemName]) {
            itemAdd = Object.values(this.updateData[itemName].add[itemName]);
          }
          if (!enableRestrictSave()) {
            if (!Array.isArray(this.itemModify)) {
              mainModify = [];
            }
            const tag = 'jflow';
            itemModify.push(tag);
          }
          if (itemModify.length > 0 && itemAdd.length < 1) { // 子表表格编辑修改
            let check = null;
            if (this.getCurrentItemInfo().tabrelation === '1:1') {
              check = this.verifyRequiredInformation();
            } else {
              check = this.itemTableCheckFunc();
            }
            if (this.tempStorage && this.tempStorage.temp_storage && this.tempStorage.temp_storage.isenable && this.temporaryStoragePath) {
              this.savaNewTable(type, path, objId, itemName, itemCurrentParameter, { sataType: 'modify' });
            } else if (check) {
              // 解决jflow调用保存失效问题，同意弹出框点击取消后，调用保存失效，原因为参数缺少当前子表表名，aciton内判断逻辑无法向下执行
              const itemCurrentParameterRes = Object.assign({}, itemCurrentParameter);
              Object.keys(itemCurrentParameterRes.modify).length === 0 ? itemCurrentParameterRes.modify = {
                [itemName]: {}
              } : null;
              this.savaNewTable(type, path, objId, itemName, itemCurrentParameterRes, { sataType: 'modify' });
            }
          } else
            if (this.verifyRequiredInformation()) {
              if (itemAdd.length > 0 && itemModify.length > 0) { // 同时新增子表以及修改子表
                if (this.verifyRequiredInformation() && this.itemTableCheckFunc()) { // 横向结构保存校验
                  this.savaNewTable(type, path, objId, itemName, itemCurrentParameter, { sataType: 'addAndModify' });
                }
              }
              if (itemAdd.length > 0 && itemModify.length < 1) { // 新增子表
                if (this.verifyRequiredInformation()) { // 横向结构保存校验
                  this.savaNewTable(type, path, objId, itemName, itemCurrentParameter, { sataType: 'add' });
                }
              }
            }
        }
      },
      verifyRequiredmainInformation(){
        // 校验主表是否必填
          if (this.temporaryStorage) { // 配置了暂存则不校验
          this.temporaryStorage = false;
          return true;
        }
        this.saveParameters();// 获取主子表参数
        // 处理主表必填控制
        let panelForm_dom =  document.querySelector('.panelForm');
        let panelForm = panelForm_dom._vue_;
        let validate = panelForm.validate();
         if(validate.length > 0){
            this.$Message.warning(validate[0].tip);
            let dom = document.querySelector(`#${validate[0].colname}`);
            if(dom){
              let Input = dom.querySelector('input') || dom.querySelector('textarea');
              if(Input){
                  Input.focus();
              }

            }
            return false;
        }else{
            return true;
        }



      },
      verifyRequiredInformation() { // 验证表单必填项
      // 默认主表必须校验
        this.saveMainType = true;
        if (this.temporaryStorage) { // 配置了暂存则不校验
          this.temporaryStorage = false;
          return true;
        }


        this.saveParameters();// 获取主子表参数
        // 处理主表必填控制
         // 处理主表必填控制
      let panelForm_dom = document.querySelectorAll('.panelForm');
      let panelForm = [].reduce.call(panelForm_dom, function (arr, div) {
          if (div._vue_) {
            arr.push(div._vue_);
          }
          return arr;
        }, []);
        let {isCustomizeTab} = this.WebConf || {};  
        // 判断当前主表是否存在
       
        if(!isCustomizeTab){
          if (this.objectType === 'horizontal') {        
            let panelFormParent = FindInstance(this,`tapComponent.${this.tableName}`)[0];
            let panelFormVue = this.$_live_getChildComponent(panelFormParent, 'panelForm');
            if(panelForm[0] && panelForm[0].tableName !==this.tableName){
                panelForm.unshift(panelFormVue);
            }
          }

        }

       
      
      let validate = [];
      if (panelForm && panelForm[0]) {
        validate = panelForm.reduce((arr, item, index) => {
          // 判断当前主表是否存在
          if (index === 0 && !isCustomizeTab) {
            // 默认第一个主表
            arr.push(...item.validate())
          } else if (this.itemName === item.tableName) {
            if (!isItemTableNewValidation() || this.itemId !== 'New') {
              if (Object.keys(item.formChangeData).length > 0 || item.checkedChildForm) {
                let message = item.validate()
                arr.push(...message);
                this.saveMainType = false;
                // if(message.length>0){
                //   // 子表有校验
                //   this.saveMainType = false;
                // }
              }
            } else {
           
              let message = item.validate()
                arr.push(...message);
                // 子表有校验
                this.saveMainType = false;
            }
          }

          return arr;
        }, [])
      }
      if (validate.length > 0) {
        this.$Message.warning(validate[0].tip);
        
        let dom = document.querySelector(`#${validate[0].parentId} #${validate[0].colname}`);
        if (dom) {
          let Input = dom.querySelector('input') || dom.querySelector('textarea');
          if (Input) {
            Input.focus();
          }

        }
        return false;
      }
      if (isCustomizeTab && this.objectType === 'horizontal' && this.itemId == 'New') {
              // 隐藏主表且主表为新增状态的左右结构，不保存
            this.$Message.warning(this.$t('messages.saveConfigTip'));
            return false;
        }

        // const checkedInfo = this.currentParameter.checkedInfo;// 主表校验信息
        // if (checkedInfo || validate) {
        //   const messageTip = validate.concat(checkedInfo.messageTip || []);
        //   if (messageTip) {
        //     console.log(messageTip,'messageTip');
        //     if (messageTip.length > 0) {
        //       this.$Message.warning(messageTip[0]);
        //       // checkedInfo.validateForm.focus();
        //       if (checkedInfo && checkedInfo.validateForm) {
        //         checkedInfo.validateForm.focus();
        //       }
        //     }
        //   }
        // }
        // if (this.subtables()) { // 存在子表时
        //   let tabinlinemode = '';
        //   this.tabPanel.forEach((item) => {
        //     if (item.tablename === this.itemName) {
        //       tabinlinemode = item.tabinlinemode;
        //     }
        //   });
        //   console.log( this.tabPanel,' this.tabPanel');
        //   if (tabinlinemode === 'Y') { // 当子表中存在form时
        //     if (!this.itemTableValidation) {
        //       const itemCheckedInfo = this.itemCurrentParameter.checkedInfo;// 子表校验信息
        //       this.saveParameters();
        //       if (this.objectType === 'vertical') {
        //         if (this.itemId === 'New') {
        //           if (this.itemNameGroup.length > 0) { // 有子表
        //             if (KEEP_SAVE_ITEM_TABLE_MANDATORY) {
        //                // 为true时，子表没有必填项也必须要输入值才能保存
        //               const addInfo = this.itemCurrentParameter.add[this.itemName];
        //               if (itemCheckedInfo) {
        //                 const itemMessageTip = itemCheckedInfo.messageTip;
        //                 if (itemMessageTip) {
        //                   if (itemMessageTip.length > 0) {
        //                     this.$Message.warning(itemMessageTip[0]);
        //                     if (itemCheckedInfo && itemCheckedInfo.validateForm) {
        //                       itemCheckedInfo.validateForm.focus();
        //                     }
        //                     return false;
        //                   }
        //                 } if (Object.values(addInfo).length < 1) {
        //                   this.$Message.warning(this.$t('messages.requiredPersonalInfo'));

        //                   return false;
        //                 }
        //               }
        //             } else if (itemCheckedInfo) {
        //               const itemMessageTip = itemCheckedInfo.messageTip;
        //               if (itemMessageTip) {
        //                 if (isItemTableNewValidation() && itemMessageTip.length > 0) {
        //                   this.$Message.warning(itemMessageTip[0]);
        //                   if (itemCheckedInfo && itemCheckedInfo.validateForm) {
        //                     itemCheckedInfo.validateForm.focus();
        //                   }
        //                   return false;
        //                 } if (!isItemTableNewValidation()) {
        //                   const itemName = this.itemName;// 子表表名
        //                   let itemAdd = [];
        //                   if (this.updateData[itemName] && this.updateData[itemName].add[itemName]) {
        //                     itemAdd = Object.values(this.updateData[itemName].add[itemName]);// 子表新增的值
        //                   }

        //                   if (itemAdd.length > 0 && itemMessageTip.length > 0) {
        //                     this.$Message.warning(itemMessageTip[0]);
        //                     if (itemCheckedInfo && itemCheckedInfo.validateForm) {
        //                       itemCheckedInfo.validateForm.focus();
        //                     }
        //                     return false;
        //                   }
        //                 }
        //               }
        //             }
        //           }
        //         } else if (this.getCurrentItemInfo().tabrelation === '1:1') {
        //           const itemMessageTip = itemCheckedInfo.messageTip;
        //           if (itemMessageTip) {
        //             if (itemMessageTip.length > 0) {
        //               this.$Message.warning(itemMessageTip[0]);
        //               if (itemCheckedInfo && itemCheckedInfo.validateForm) {
        //                 itemCheckedInfo.validateForm.focus();
        //               }
        //               return false;
        //             }
        //           }
        //         } else if (Object.values(this.itemCurrentParameter.add[this.itemName]).length > 0) { // 处理当子表填入一个必填项值时，其余必填项必须填写
        //           const itemMessageTip = itemCheckedInfo.messageTip;
        //           if (itemMessageTip) {
        //             if (itemMessageTip.length > 0) {
        //               this.$Message.warning(itemMessageTip[0]);
        //               if (itemCheckedInfo && itemCheckedInfo.validateForm) {
        //                 itemCheckedInfo.validateForm.focus();
        //               }
        //               return false;
        //             }
        //           }
        //         }
        //       } else if (itemCheckedInfo) {
        //         const itemMessageTip = itemCheckedInfo.messageTip;
        //         if (itemMessageTip) {
        //           if (itemMessageTip.length > 0) {
        //             this.$Message.warning(itemMessageTip[0]);
        //             if (itemCheckedInfo && itemCheckedInfo.validateForm) {
        //               itemCheckedInfo.validateForm.focus();
        //             }
        //             return false;
        //           }
        //         }
        //       }
        //     }
        //   }
        // }

        if (window[this.tableName] && window[this.tableName].emitChangeAndContinue) {
          window[this.tableName].emitChangeAndContinue();
        }
         

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
        // 判断后端传参是否是主子表
        let isreftabs = this.socureIsreftabs();
        const itemNameGroup = this.itemNameGroup;
        let tabrelation = false;
        if (this.getCurrentItemInfo().tabrelation === '1:1') {
          tabrelation = true;
        }
        if(this.saveMainType && this.itemId === 'New' && !path){
          //只校验主表的时候不传子表
            isreftabs = false;
        }

        const parame = {
          ...this.currentParameter, // 主表信息
          itemCurrentParameter:itemCurrentParameter || this.currentParameter, // 子表信息
          type,
          tableName,
          objId,
          path,
          itemName,
          objectType,
          isreftabs,
          sataType,
          itemNameGroup:itemNameGroup||{}, // 子表表名
          itemObjId: this.itemObjId,
          temporaryStoragePath: this.temporaryStoragePath, // 暂存path
          tabrelation, // 子表1:1标记
          // buttonInfo,
          jflowPath: this.saveInfo.jflowPath,
        };
        const promise = new Promise((resolve, reject) => {
          if (this.itemId === 'New') {
            this.$R3loading.show(this.loadingName);
          }
          this.performMainTableSaveAction({ parame, resolve, reject });
        });
        console.log(promise);
        this.temporaryStoragePath = '';
        let stop = false;
        let removeMessage = false;
        promise.then((res) => {
          // this.closeCurrentLoading();//保存成功后不需要清除loading,调刷新时会触发表单，表单会触发监听，监听会关闭loading
          stop = false;
          removeMessage = false;

          this.saveAfter(type, tableName, stop, removeMessage);

          const webact = this.getCurrentItemInfo().webact;
          DispatchEvent('saveResolve', {// 用于子表监听保存成功后执行相对应逻辑
            detail: {
              type: 'resolve',
              mainTableParame: this.currentParameter, // 保存接口主表参数
              itemTableParame: this.itemCurrentParameter, // 保存接口子表参数
              res, // 接口返回res
              currentRoute: this.$router.currentRoute
            }
          });
          if (this.objectType === 'vertical' && webact) { // 兼容半定制界面，保存成功时通知外部
            DispatchEvent('customizeClick', {
              detail: {
                type: 'save', // 类型为保存成功
                mainTableParame: this.currentParameter, // 保存接口主表参数
                itemTableParame: this.itemCurrentParameter, // 保存接口子表参数
                res, // 接口返回res
              }
            });

            DispatchEvent('objTabActionSlientForItemTable', {// 用于子表监听保存成功后执行相对应逻辑
              detail: {
                type: 'resolve',
              }
            });
          }
        }, () => {
          this.closeCurrentLoading();
          stop = true;
          removeMessage = true;
          this.saveAfter(type, tableName, stop, removeMessage);
          DispatchEvent('objTabActionSlientForItemTable', {// 用于子表监听保存失败后执行相对应逻辑
            detail: {
              type: 'reject',
            }
          });
          this.saveCallBack = null; // 清除jflow回调
        }).finally(() => {
          this.$R3loading.hide(this.loadingName);
        });
      },

      // 保存后的回调
      saveAfter(type, tableName, stop, removeMessage) {
        if (!stop) { // 保存失败时，不清空store里面存的参数，
          // this.clearEditData();// 清空store update数据
        } else { // 保存失败不执行任何逻辑
          this.saveEventAfter = '';
          const saveEventAfterData = {
            k: 'type',
            v: {}
          };
          updateSessionObject('saveEventAfter', saveEventAfterData);
        }
        this.emptyTestData();// 清空记录的当前表的tab是否点击过的记录
        if (type === 'add') { // 横向结构新增主表保存成功后跳转到编辑页面
          // this.updateChangeData({ tableName: this.tableName, value: {} });
          if (!stop) { // 如果保存失败，不执行以下操作
            if (enableOpenNewTab()) {
              // 当开启同表新开tab模式，为解决新增成功后跳转到新开的编辑界面后，新增界面loading未关闭问题
              this.$R3loading.hide(this.loadingName);
              //this.clearEditData();// 清空store update数据
              //this.upData();// 为解决新增保存后新开tab，新增界面信息未清除问题
              // 处理多开复制保存激活新增页面缓存问题  bug：53133
              this.decreasekeepAliveLists(this[MODULE_COMPONENT_NAME]);
            }
            let types = '';
            if (this.objectType === 'horizontal') {
              types = 'tableDetailHorizontal';
            } else {
              types = 'tableDetailVertical';
            }
            const label = `${this.activeTab.label.replace(this.$t('buttons.add'), this.$t('buttons.edit'))}`;

            // 处理新增时候执行回调但是不跳转界面
            if (typeof (this.saveCallBack) === 'function') {
              this.saveCallBack(this.buttonsData.newMainTableSaveData ? this.buttonsData.newMainTableSaveData.objId : this.itemId).then(() => {
                const tab = {
                  type: types,
                  tableName,
                  target:'self',
                  tableId: this.tableId,
                  label,
                  id: this.buttonsData.newMainTableSaveData ? this.buttonsData.newMainTableSaveData.objId : this.itemId
                };
                this.tabOpen(tab);
              });
              this.saveCallBack = null;
            } else {
              const tab = {
                type: types,
                tableName,
                target:'self',
                tableId: this.tableId,
                label,
                id: this.buttonsData.newMainTableSaveData ? this.buttonsData.newMainTableSaveData.objId : this.itemId
              };
              this.tabOpen(tab);
            }
          }
          const message = this.buttonsData.message;
          const data = {
            title: this.$t('feedback.success'),
            content: `${message}`
          };
          if (message) {
            this.$Message.success(data);
          }
          if (!enableOpenNewTab()) {
            this.decreasekeepAliveLists(this[MODULE_COMPONENT_NAME]);
          }
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
        this.emptyChangeData(this.tableName);
        this.updateModifyData({ tableName: this.tableName, value: {} });
        this.updateAddDefaultData({ tableName: this.tableName, value: {} });
        this.updateAddData({ tableName: this.tableName, value: {} });
        this.updateDeleteData({ tableName: this.tableName, value: {} });
      },
      clearItemEditData() {
        const itemNames = this.itemNameGroup.map((c) => {
          if (c.tableName !== this.tableName) {
            return c.tableName;
          }
        });// 因左右结构itemNameGroup包含主表，上下结构不包括
        let tableName = null;
        if (this.objectType === 'horizontal') { // 横向布局
          if (itemNames.includes(this.itemName)) { // 子表
            tableName = this.itemName;
          }
        } else {
          tableName = this.itemName;
        }
        // this.updateChangeData({ tableName, value: {} });
        this.emptyChangeData(this.tableName);
        this.updateModifyData({ tableName, value: {} });
        this.updateAddDefaultData({ tableName, value: {} });
        this.updateAddData({ tableName, value: { } });
        this.updateDeleteData({ tableName, value: {} });
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
        const saveEventAfter = getSessionObject('saveEventAfter');
        const objTabActionSlientData = getSessionObject('objTabActionSlientData');
        if (!stop) {
          // this.clearEditData();// 清空store update数据
          if (this.saveEventAfter === 'submit' || saveEventAfter.type === 'submit') { // 提交操作
            const promise = new Promise((resolve, reject) => {
              this.getObjectTrySubmit({

                objId: this.itemId, table: this.tableName, path: this.saveButtonPath, isreftabs: this.isreftabs, resolve, reject, moduleName: this[MODULE_COMPONENT_NAME], routeQuery: this[INSTANCE_ROUTE_QUERY], routePath: this[INSTANCE_ROUTE]
              });
            });

            promise.then(() => {
                           this.temporaryStorage = false;
                           this.dataArray.temporaryStorage = false;
                           const message = this.buttonsData.submitData.message;
                           if (message) {
                             this.upData(`${message}`);
                           } else {
                             this.upData();
                           }
                           this.saveEventAfter = '';
                           const saveEventAfterData = {
                             k: 'type',
                             v: {}
                           };
                           updateSessionObject('saveEventAfter', saveEventAfterData);
                           this.clearEditData();// 清空store update数据
                         },
                         () => { // 状态为rejected时执行
                           //  const submitReject = window.localStorage.getItem('submitReject');
                           //  if (!submitReject) {
                           //    //  this.upData();
                           //  } else {
                           //    window.localStorage.removeItem('submitReject');
                           //  }
                           this.saveEventAfter = '';
                           const saveEventAfterData = {
                             k: 'type',
                             v: {}
                           };
                           updateSessionObject('saveEventAfter', saveEventAfterData);
                         });
          } else if (this.saveEventAfter === 'invalid' || saveEventAfter.type === 'invalid') {
            // const promise = new Promise((resolve, reject) => {
            //   this.getObjectTryInvalid({
            //     objId: this.itemId, table: this.tableName, path: this.saveButtonPath, isreftabs: this.isreftabs, resolve, reject
            //   });
            // });
            // this.temporaryStorage = false;
            // this.dataArray.temporaryStorage = false;
            // this.saveEventAfter = '';
            // const saveEventAfterData = {
            //   k: 'type',
            //   v: {}
            // };
            // updateSessionObject('saveEventAfter', saveEventAfterData);

            // promise.then(() => {
            //   const message = this.buttonsData.invalidData.message;
            //   if (message) {
            //     this.upData(`${message}`);
            //   } else {
            //     this.upData();
            //   }
            // }, () => { // 状态为rejected时执行
            //   this.upData();
            // });
          } else if (this.saveEventAfter === 'objTabActionSlient' || saveEventAfter.type === 'objTabActionSlient') { // 静默程序配置isSave时，保存成功后才可执行静默程序
            this.buttonEvent(Object.keys(this.objTabActionSlientData).length > 0 ? this.objTabActionSlientData : objTabActionSlientData.data);
            this.clearEditData();// 清空store update数据
            // this.objTabActionSlientConfirm(this.objTabActionSlientData);
            this.objTabActionSlientData = {};
            const data = {
              k: 'data',
              v: {}
            };
            updateSessionObject('objTabActionSlientData', data);
          } else if (typeof (this.saveCallBack) === 'function') {
            const saveEventAfterData = {
              k: 'type',
              v: {}
            };
            updateSessionObject('saveEventAfter', saveEventAfterData);
            this.saveEventAfter = '';
            this.clearEditData();// 清空store update数据
            this.saveCallBack();
            this.saveCallBack = null;
          } else { // 保存后的保存成功提示信息
            const message = this.buttonsData.message;
            this.clearEditData();// 清空store update数据

            if (message) {
              this.upData(`${message}`);
            } else if (removeMessage) {
              this.upData();
            } else {
              this.upData(this.$t('feedback.saveSuccess'));
            }
          }
        } else {
          // this.temporaryStorage = false;
          // this.dataArray.temporaryStorage = false;
          // this.upData();//保存失败不刷新
        }
      },
      getCopyData() {
        const copyItemId = this.$route.query.copyItemId;
        const copyTableModuleName = `${this.objectType.substr(0, 1).toUpperCase()}.${this.tableName}.${this.tableId}.${copyItemId}`;// 目标复制界面的模块名称
        const copyTableState = this.$store.state[copyTableModuleName];
        const modifyData = JSON.parse(JSON.stringify(copyTableState.updateData[this.tableName].changeData));

        let copyDatas = {};
        if (this.objectType === 'horizontal') { // 横向布局
          // 开启enableOpenNewTab功能后，复制逻辑改为，从路由参数上获取要复制的界面的明细id,取复制界面的数据用于赋值当前界面，作为复制数据
          let formData = {};
          formData = copyTableState.tabPanels[0].componentAttribute.panelData;
          formData = JSON.parse(JSON.stringify(formData));// 此值会导致更新其它表数据
          copyDatas = { ...formData };
        } else { // 纵向布局
          copyDatas = { ...copyTableState.mainFormInfo.formData };
        }
        this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/savaCopyData`, { copyDatas, tableName: this.tableName, modifyData });
        this.$R3loading.show(this.loadingName);
      },
      networkEventListener(event) {
        const { detail } = event;
        const { response } = detail;
        const url = '/p/cs/getObject';
        if (!this._inactive && url === detail.url) {
          if (response && response.data && response.data.code === 0) {
            // if (enableOpenNewTab()) {
            //   const iscopy = this.$route.query.iscopy;
            //   if (iscopy) {
            //     this.getCopyData();
            //   }
            // } else
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
        if (!this._inactive) { // 只处理当前激活的子表tab
          if (event.detail.type === 'submit') {
            const promise = new Promise((resolve, reject) => {
              const submitButtonPath = (Version() === '1.4') ? this.defaultButtonData.tabcmd.paths[this.defaultButtonData.tabcmd.cmds.indexOf('actionSUBMIT')] : null;
              this.getObjectTrySubmit({
                objId: this.itemId, table: this.tableName, path: submitButtonPath, isreftabs: this.isreftabs, resolve, reject, moduleName: this[MODULE_COMPONENT_NAME], routeQuery: this[INSTANCE_ROUTE_QUERY], routePath: this[INSTANCE_ROUTE]
              });
            });
          }

          if (event.detail.type === 'refresh') {
            this.clickButtonsRefresh();
            if (event.detail.tableId) {
              const oUl = document.querySelector('.ark-tabs-panels-nav');
              if (oUl) {
                for (let i = 0; i < oUl.children.length; i++) {
                  this.tabPanel.some((item) => {
                    if (item.id) {
                      item.tableid = item.id;
                    }
                    if (Number(event.detail.tableId) === Number(item.tableid) && item.tabledesc === oUl.children[i].innerText) {
                      oUl.children[i].click();
                      return item;
                    } if (Number(event.detail.tableId) === Number(this.tableId) && this.activeTab.label === oUl.children[i].innerText) {
                      oUl.children[i].click();
                      setTimeout(() => {
                        const refreshButton = document.querySelector('#refresh');
                        refreshButton.click();
                        return item;
                      }, 1000);
                    }
                  });
                }
              }
            }
          }

          if (event.detail.type === 'save') {
            this.clickSave();
          }


          if (event.detail.type === 'clearSubmit') {
            this.saveEventAfter = '';
            const saveEventAfterData = {
              k: 'type',
              v: {}
            };
            updateSessionObject('saveEventAfter', saveEventAfterData);
          }
        }
      },
      updataMainTableForHorizontal(fun) {
        let page = {};
        if (this.objectType === 'horizontal') { // 横向布局
          this.tabPanel.every((item) => {
            if (this.itemName !== this.tableName && item.tablename === this.itemName) {
              page = item.tablePageInfo;
              return false;
            }
            return true;
          });
        }
        new Promise((resolve, reject) => {
          this.getObjectTabForMainTable({
            itemInfo: this.itemInfo, table: this.tableName, objid: this.itemId, tabIndex: 0, itemTabelPageInfo: page, moduleName: this[MODULE_COMPONENT_NAME], resolve, reject, isFirstRequest: true, isNotFirstRequest: false
          });
        }).then(() => {
          if (fun) {
            fun();
          }
        });
        this.emptyTestData();// 清空记录的当前表的tab是否点击过的记录
      },
      hideBackButton() {
        // 隐藏返回按钮
        // 拦截跳转逻辑
         this.dataArray.back = true;
        const clickMenuAddSingleObjectData = getSessionObject('clickMenuAddSingleObject');
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
        let checked = new RouterPush(this).exists(currentRoute);
        // 判断来源是否存在;
        if(checked){
            this.dataArray.back = false;
        }else{
           this.dataArray.back = true;
        }
        let { ResetrouterBackLogic } = window.ProjectConfig;
        if( ResetrouterBackLogic ){
          return false;
        }

        const addRouteToEditorData = getSessionObject('addRouteToEditor');
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
        const routeFullPath = currentRoute;
        const routeMapRecordForHideBackButtonData = getSessionObject('routeMapRecordForHideBackButton');
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

      closeCurrentLoading() { // 关闭当前tab loading
        const dom = document.querySelector(`#${this.loadingName}-loading`);
        if (dom) {
          this.$R3loading.hide(this.loadingName);
        }
      },
      hideListenerLoading(value) { // 根据监听关闭loading
        const currentTableName = this[MODULE_COMPONENT_NAME].split('.')[1];
        // const dom = document.querySelector(`#${currentTableName}-loading`);
        if (value.detail.hideCopyLoading || value.detail.hideLoadingForButton) {
          // if (currentTableName) {
          this.$R3loading.hide(this.loadingName);
          // } else {
          //   this.$R3loading.hide(this.loadingName);
          // }
        }
      },
      hideButtonsForcmds(data) { // 隐藏标准类型元数据配置按钮
        if (this.tabcmd.cmds && this.tabcmd.cmds.length > 0) {
          this.tabcmd.cmds.map((item, index) => {
            if (data.includes(item)) {
              this.tabcmd.prem[index] = false;
            }
          });
        }
      },
      showButtonsForcmds(data) { // 显示标准类型元数据配置按钮
        if (this.tabcmd.cmds && this.tabcmd.cmds.length > 0) {
          this.tabcmd.cmds.map((item, index) => {
            if (data.includes(item)) {
              this.tabcmd.prem[index] = true;
            }
          });
        }
      },
      setDisableButtons() {
        if (this.objectType === 'horizontal') {
          if (this.itemInfo.id && this.itemInfo.id === this.tableId) { // 当前激活 tab为主表
            if (this.WebConf && this.WebConf.disableExport) {
              this.hideButtonsForcmds(['actionEXPORT']);
            } else if (this.WebConf && this.WebConf.disableImport) {
              this.hideButtonsForcmds(['actionIMPORT']);
            }
          } else if (this.webConfSingle && this.webConfSingle.disableExport) {
            this.hideButtonsForcmds(['actionEXPORT']);
          } else if (this.webConfSingle && this.webConfSingle.disableImport) {
            this.hideButtonsForcmds(['actionIMPORT']);
          }
        } else if (this.WebConf && this.WebConf.disableExport) {
          this.hideButtonsForcmds(['actionEXPORT']);
        } else if (this.WebConf && this.WebConf.disableImport) {
          this.hideButtonsForcmds(['actionIMPORT']);
        }
      },
      showSingleButtons(data) {
        this.showButtonsForcmds(data.default.names);
      },
    },
    beforeDestroy() {
      window.removeEventListener('jflowClick', this.jflowClick);
      window.removeEventListener('network', this.networkEventListener);
      window.removeEventListener('globalNoticeCopy', this.hideListenerLoading);
      window.removeEventListener(`${this[MODULE_COMPONENT_NAME]}globaVerifyMessageClosed`, this.hideListenerLoading);
      window.removeEventListener('showSingleButtons', this.showSingleButtons);
    },
    mounted() {
      this.updataCurrentTableDetailInfo();
      this.$el._vue_ = this;
      this.setDisableButtons();
      if (this.isItemTable) {
        this.dataArray.refresh = false;
        this.dataArray.back = false;
      }
      this.updataClickSave(this.clickSave);
      this.testUpdataValue(this.testUpdata);
      this.updataVerifyRequiredInformation(this.verifyRequiredInformation);
      // this.dataArray.back = this.backButton;
      if (this.jflowButton.length > 0) {
        this.dataArray.jflowButton = this.jflowButton;
      }
      this.hideBackButton();
      if (!this._inactive) {
        window.addEventListener('showSingleButtons', this.tabClick);

        window.addEventListener('showSingleButtons', this.showSingleButtons);
        window.addEventListener('jflowClick', this.jflowClick);
        window.addEventListener(`${this[MODULE_COMPONENT_NAME]}globaVerifyMessageClosed`, this.hideListenerLoading);
        window.addEventListener('globalNoticeCopy', this.hideListenerLoading);
        window.addEventListener('network', this.networkEventListener);// 监听接口
      }
      if (this.objectType === 'horizontal') { // 横向布局
        if (this.tabPanel && this.tabPanel.length > 0) {
          this.tabPanel.forEach((item) => {
            if (this.itemName !== this.tableName) {
              const objreadonly = item.componentAttribute.buttonsData.data.objreadonly;
              if (objreadonly) {
                this.hideButtonsForcmds(['actionMODIFY', 'actionDELETE', 'actionIMPORT', 'actionCANCOPY']);
              // if (this.tabcmd.cmds && this.tabcmd.cmds.length > 0) {
              // this.tabcmd.cmds.forEach((item, index) => {
              //   if (item === 'actionMODIFY' || item === 'actionDELETE' || item === 'actionIMPORT' || item === 'actionCANCOPY') {
              //     this.tabcmd.prem[index] = false;
              //   }
              // });
              // }
              }

              if (Version() === '1.4' && this.getCurrentItemInfo() && this.getCurrentItemInfo().tabrelation === '1:1') { // 1对1的只有modify和export根据prem来，其他几个按钮就默认不显示
                if (this.tabcmd.cmds && this.tabcmd.cmds.length > 0) {
                  this.tabcmd.cmds.forEach((item, index) => {
                    if (item !== 'actionMODIFY' || item !== 'actionEXPORT') {
                      this.tabcmd.prem[index] = false;
                    }
                  });
                }
              }

              const { tabinlinemode } = this.getCurrentItemInfo();
              if (tabinlinemode === 'N') {
                this.hideButtonsForcmds(['actionMODIFY', 'actionDELETE', 'actionIMPORT']);
              // if (this.tabcmd.cmds && this.tabcmd.cmds.length > 0) {
              //   this.tabcmd.cmds.forEach((item, index) => {
              //     if (item === 'actionMODIFY' || item === 'actionDELETE' || item === 'actionIMPORT') {
              //       this.tabcmd.prem[index] = false;
              //     }
              //   });
              // }
              }

              if (this.disableExport) {
                this.hideButtonsForcmds(['actionEXPORT']);
              }
            }
          });
        }


        if (this.webConfSingle) {
          if (this.webConfSingle.disableImport) {
            this.hideButtonsForcmds(['actionIMPORT']);
          }
          if (this.webConfSingle.disableExport) {
            this.hideButtonsForcmds(['actionEXPORT']);
          }
        }
      }

      if (this.tabcmd.cmds && this.tabcmd.cmds.length > 0) {
        this.buttonsReorganization(this.tabcmd);
      }
      // this.dataArray.refresh = this.refreshButtons;
      this.waListButtons(this.tabwebact);
    },
    activated() {
        // 处理按钮返回逻辑
      this.hideBackButton();
      this.updataCurrentTableDetailInfo();
    },
    created() {
      this.ChineseDictionary = ChineseDictionary;
      const { tableName, tableId, itemId } = this[INSTANCE_ROUTE_QUERY];
      this.tableName = tableName;
      this.tableId = tableId;
      this.itemId = itemId;
      this.buttonMap = buttonmap;
      this.loadingName = this.moduleComponentName.replace(/\./g, '-');
    },

  };
</script>
