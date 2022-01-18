<template>
  <div :class="classes">
    <div
      v-if="type === 'vertical' && itemInfo.tabrelation==='1:1'&&watermarkimg"
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
    <component
      :is="objectButtonComponent"
      v-if="buttonsData.isShow&&componentType!=='ALL'"
      :object-type="type"
      class="objectButtons"
      :item-info="itemInfo"
      :item-name-group="childTableNames"
      :item-name="tableName"
      :tabcmd="buttonsData.data.tabcmd"
      :disable-export="buttonsData.data.DisableEXPORT"
      :item-table-check-func="itemTableCheckFunc"
      :tabwebact="buttonsData.data.tabwebact"
      :isactive="isactive"
      :watermarkimg="resetWaterMark"
      :clear-item-table-search-value="clearItemTableSearchValue"
      :isreftabs="isreftabs"
      :is-main-form="tabPanelsAll"
      :is-item-table-vertical="buttonsData.data.isItemTableVertical"
      :back-button="buttonsData.data.backButton"
      :is-item-table="isItemTable"
      :web-conf-single="webConfSingle"
    />
    <!-- 子表表格新增区域form -->
    <childrenForm
      v-if="formData.isShow&&itemInfo.tabrelation!=='1:1'"
      v-show="status === 1 && !objreadonly"
      :tableName="tableName"
      :objreadonly="objreadonly"
      :default-data="formData.data"
      :readonly="formReadonly"
      :master-name="currentPageRoute.tableName"
      :master-id="currentPageRoute.itemId"
      :module-form-type="type"
      :is-main-table="isMainTable"
    ></childrenForm>

     <!-- <compositeForm  
      v-if="formData.isShow&&itemInfo.tabrelation!=='1:1'"
      v-show="status === 1 && !objreadonly"
      :object-type="type"
      :is-main-table="isMainTable"
      :objreadonly="objreadonly"
      :readonly="formReadonly"
      :default-set-value="changeData"
      :master-name="currentPageRoute.tableName"
      :master-id="currentPageRoute.itemId"
      :module-form-type="type"
      class="form"
      :default-data="formData.data"
      :paths="formPaths"
      :isreftabs="isreftabs"
      :child-table-name="tableName"
      :from="from"
      :web-conf-single="webConfSingle"
      :is-child-table="isChildTable"
      @on-formEnter="enterClick"
      @formChange="formChange"
      @InitializationForm="initForm"
      @VerifyMessage="verifyForm"
    /> -->
    <div
      v-if="componentName"
      style="overflow-y: auto;flex:1;"
    >
      <component
        :is="customizeComponent"
        v-if="componentName"
        :item-info="itemInfo"
      />
      <!-- 自定义组件 -->
      <compositeForm
        v-if="panelData.isShow"
        :is-main-table="isMainTable"
        :object-type="type"
        :objreadonly="objreadonly"
        :readonly="formReadonly"
        :default-set-value="changeData"
        :master-name="currentPageRoute.tableName"
        :master-id="currentPageRoute.itemId"
        :module-form-type="type"
        :class="type === 'vertical' ? 'verticalFormPanel' : 'formPanel'"
        type="PanelForm"
        :default-data="panelData.data"
        :paths="formPaths"
        :isreftabs="isreftabs"
        :child-table-name="tableName"
        @formChange="formPanelChange"
        @InitializationForm="initFormPanel"
        @VerifyMessage="verifyFormPanel"
      />
    </div>
    <!-- 左右结构主表和子表1:1模式的form(面板) -->
    <panelForm
      v-if="panelData.isShow&&!componentName"
      :tableName="tableName"
      :readonly="objreadonly"
      :is-main-table="isMainTable"
      :defaultData="panelData.data"
    ></panelForm>
    
    <!-- <compositeForm
      v-if="panelData.isShow&&!componentName"
      :is-main-table="isMainTable"
      :object-type="type"
      :objreadonly="objreadonly"
      :readonly="formReadonly"
      :default-set-value="changeData"
      :master-name="currentPageRoute.tableName"
      :master-id="currentPageRoute.itemId"
      :module-form-type="type"
      :class="type === 'vertical' ? 'verticalFormPanel' : 'formPanel'"
      type="PanelForm"
      :default-data="panelData.data"
      :paths="formPaths"
      :isreftabs="isreftabs"
      :is-child-table="isChildTable"
      :child-table-name="tableName"
      :from="from"
      @formChange="formPanelChange"
      @InitializationForm="initFormPanel"
      @VerifyMessage="verifyFormPanel"
    /> -->
    <!-- 明细表格 -->
    <component
      :is="objectTableComponent"
      v-if="tableData.isShow"
      ref="objectTableRef"
      class="objectTable"
      :table-height="type === 'vertical'? 300: 0"
      :table-name="tableName"
      :data-source="tableData.data"
      :type="type"
      :item-info="itemInfo"
      :readonly="buttonsData.data.objreadonly"
      :table-readonly="!getActionModify"
      :objreadonly="objreadonly"
      :web-conf-single="webConfSingle"
      :status="status"
      :tabwebact="buttonsData.data.tabwebact"
      :tooltip-for-item-table="tooltipForItemTable"
      :isCommonTable="isCommonTable"
      @tableBeforeData="tableBeforeData"
      @tableBeforeLabelData="tableBeforeLabelData"
      @tableDataChangeLabel="tableDataChangeLabel"
      @tableDataChangeLabelBefore="tableDataChangeLabelBefore"
      @tableDataChange="tableDataChange"
      @tableSelectedRow="tableSelectedRow"
      @tableVerifyMessage="tableVerifyMessage"
    > 
      <div slot="detail-buttons-a" slot-scope="slotProps" v-if="slotArray.detailbuttonsa">
         <component :is="slotArray.detailbuttonsa" :slotProps="slotProps" />
      </div>
    </component>
  </div>
</template>

<script>
  /* eslint-disable keyword-spacing */

  import Vue from 'vue';
  import { mapMutations, mapState, } from 'vuex';

  // import router from '../__config__/window.vm.$router.config';
  import tableDetailCollection from './TableDetailCollection.vue';
  import singleObjectButtons from './SingleObjectButtons.vue';
  import compositeForm from './CompositeForm.vue';
  import childrenForm from '../__component__/FormComponents/childrenForm/form.vue'
  import horizontalMixins from '../__config__/mixins/horizontalTableDetail';
  import verticalMixins from '../__config__/mixins/verticalTableDetail';
  import CompontentNotFound from './CompontentNotFound.vue';
  import CustomizeModule from '../__config__/customize.config';
  import WaterMark from './WaterMark.vue';
  import { DispatchEvent } from '../__utils__/dispatchEvent';
  import {
    classFix, getCustomizeWaterMark, KEEP_SAVE_ITEM_TABLE_MANDATORY, Version, MODULE_COMPONENT_NAME, INSTANCE_ROUTE_QUERY, notificationOfMain
  } from '../constants/global';
  import { deepClone } from '../__utils__/common'

  const customizeModules = {};
  Object.keys(CustomizeModule).forEach((key) => {
    customizeModules[key.toUpperCase()] = CustomizeModule[key];
  });


  export default {

    data() {
      return {
        from: 'singlePage',
        currentParameter: {},
        itemCurrentParameter: {},
        isclick: true,
        objectButtonComponent: '', // 单对象按钮组件
        objectTableComponent: '', // 单对象表格组件
        customizeComponent: '', // 自定义组件
        isRequest: false,
        dialogType:false, // 是否是导入弹窗
        slotArray:{}, // 内置卡槽组件
        slotTableTemplate:'', // 接入外部的渲染组件
        callbackFun:()=>{  // 回调函数
              
        },
        currentItemId: '', 
        currentTableId: ''
        // tableName: this[INSTANCE_ROUTE_QUERY].tableName
      };
    },
    components: {
      compositeForm,
      WaterMark,
      childrenForm
    },
    props: {
      tabPanel: {
        type: Array,
        default() {
          return [];
        }
      },
      mainFormPaths: {
        type: Array,
        default() {
          return [];
        }
      }, // form组件主表paths
      type: {
        type: String,
        default: 'vertical'
      },
      tableName: {
        type: String,
        default: ''
      },
      isreftabs: {
        type: Boolean,
      },
      isMainTable: {
        type: Boolean,
        default: false
      }, // 判断是否是主表
      objreadonly: {
        type: Boolean,
      },
      formReadonly: {
        type: Boolean,
        default: false
      }, // 表单objreadonly
      isactive: {
        type: Boolean,
      },
      status: {
        type: Number,
        default: 1
      },
      tableId: {
        type: String,
        default: ''
      },
      changeData: {
        type: Object,
        default: () => ({})
      },
      webConfSingle: {
        type: Object,
        default: () => ({})
      },
      tableData: {
        type: Object,
        default: () => ({})
      }, // 表格数据
      buttonsData: {
        type: Object,
        default: () => ({})
      }, // 按钮数据
      formData: {
        type: Object,
        default: () => ({})
      }, // 表单数据
      panelData: {
        type: Object,
        default: () => ({})
      }, // 面板数据
      itemInfo: {
        type: Object,
        default: () => ({})
      }, // 面板数据
      childTableNames: {
        type: Array,
        default: () => []
      }, // 面板数据
      watermarkimg: {
        type: String,
        default: ''
      }, // 水印数据
      tooltipForItemTable: {
        type: Array,
        default: () => []
      },
      componentName: {
        type: String,
        default: ''
      }, // 定制界面自定义组件名称
      componentType: {
        type: String,
        default: ''
      }// 定制界面自定义组件类型，为ALL时不显示单对象按钮组件
    },
    inject: [MODULE_COMPONENT_NAME, INSTANCE_ROUTE_QUERY],
    computed: {
      ...mapState('global', {
      }),
      classes() {
        return [
          `${classFix}tabComponent`,
        ];
      },

      // 根据接口判断是否用普通表格渲染
      isCommonTable() {
        const buttonsData = this.buttonsData.data
        const useAgGrid = window.ProjectConfig.useAgGrid
        if(buttonsData.webconf && buttonsData.webconf.commonTable === true) {
          return true
        } else if(useAgGrid && (!buttonsData.webconf || (buttonsData.webconf && buttonsData.webconf.commonTable === undefined))) {
          return false
        } else {
          return false
        } 
      },

      // 根据接口判断是否用普通表格渲染
      isCommonTable() {
        const buttonsData = this.buttonsData.data
        const useAgGrid = window.ProjectConfig.useAgGrid
        if(buttonsData.webconf && buttonsData.webconf.commonTable === true) {
          return true
        } else if(useAgGrid && (!buttonsData.webconf || (buttonsData.webconf && buttonsData.webconf.commonTable === undefined))) {
          return false
        } else {
          return false
        } 
      },

      // 是否是子表
      isChildTable() {
        if(this.type === 'horizontal' && this.currentTabIndex !== 0) {
          return true;
        }
        if(this.type === 'vertical') {
          return true;
        }
        return false;
      },
      waterMarkTop() {
        const customizeWaterMark = getCustomizeWaterMark();
        if(this.watermarkimg) {
          const src = this.watermarkimg.split('/')[3].split('.')[0];
          if (customizeWaterMark[src] && customizeWaterMark[src].top) {
            return customizeWaterMark[src].top;
          }
        }

        return '42px';
      },
      waterMarkLeft() {
        const customizeWaterMark = getCustomizeWaterMark();
        if(this.watermarkimg) {
          const src = this.watermarkimg.split('/')[3].split('.')[0];
          if (customizeWaterMark[src] && customizeWaterMark[src].left) {
            return customizeWaterMark[src].left;
          }
        }
        return '11px';
      },
      waterMarkWidth() {
        const customizeWaterMark = getCustomizeWaterMark();
        if(this.watermarkimg) {
          const src = this.watermarkimg.split('/')[3].split('.')[0];
          if (customizeWaterMark[src] && customizeWaterMark[src].width) {
            return customizeWaterMark[src].width;
          }
        }
        return '80px';
      },

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

      currentPageRoute() {
        return this[INSTANCE_ROUTE_QUERY];
      },
      currentTabIndex() {
        const tabCurrentIndex = this.$store.state[this[MODULE_COMPONENT_NAME]].tabCurrentIndex;
        // const WebConf = this.$store.state[this[MODULE_COMPONENT_NAME]].WebConf;
        // if (WebConf && WebConf.isCustomizeTab && this.type === 'horizontal') {
        //   return tabCurrentIndex + 1;
        // }
        return tabCurrentIndex;
      },

      tabPanelsAll() {
        return this.$store.state[this[MODULE_COMPONENT_NAME]].tabPanels;
      },
      resetWaterMark() {
        if (this.watermarkimg) {
          return this.watermarkimg;
        }
        return '';
      },
      getActionModify() {
        if (this.itemInfo.componentAttribute.buttonsData.data.tabcmd) {
          return this.itemInfo.componentAttribute.buttonsData.data.tabcmd.cmds.every((cur, idx) => {
            if (cur === 'actionMODIFY') {
              return this.itemInfo.componentAttribute.buttonsData.data.tabcmd.prem[idx];
            }
            return true;
          });
        }
        return true;
      }, // 判断子表的按钮actionModify是否可用
      formPaths() {
        if (this.type === 'vertical') {
          return this.mainFormPaths;
        }
        if (this.buttonsData.data && this.buttonsData.data.tabcmd && this.buttonsData.data.tabcmd.paths) {
          return this.buttonsData.data.tabcmd.paths;
        }

        return [];
      },
      isItemTable() {
        if(this.type === 'vertical') {
          return true;
        }
        return false;
      }
      // ...mapState(moduleName(), {
      //   activeTab: ({ updateData }) => updateData,
      // }),
    },
    mounted() {
      // this.generateComponent();
      this.$el._vue_=this;
    },
    created() {
      const { tableId, itemId } = this[INSTANCE_ROUTE_QUERY];
      this.currentTableId = tableId;
      this.currentItemId = itemId;
      this.generateComponent();
    },
    methods: {
      ...mapMutations('global', ['decreasekeepAliveLists']),

      // ...mapActions(this[MODULE_COMPONENT_NAME], ['performMainTableSaveAction']),

      // 转移水印
      getTransferDom() {
        let value = '' // 默认不转移节点
        
        if(window.ProjectConfig.domPortal && window.ProjectConfig.domPortal.waterMark) {
          value = window.ProjectConfig.domPortal.waterMark({
            fromComponent: 'SingleObjectTabComponent',
            type: this.type
          })
        }
        
        if(value) {
          const dom = document.querySelector(value)
          if(dom) {
            dom.appendChild(this.$refs.watermark)
          }
        }
      },

      generateComponent() {
        const externalModules = (window.ProjectConfig || { externalModules: undefined }).externalModules || {};
        const tableComponent = `${this[MODULE_COMPONENT_NAME]}.TableDetailCollection`;
        const buttonComponent = `${this[MODULE_COMPONENT_NAME]}.SingleObjectButtons`;
        const tableDetailCollectionMixin = (window.ProjectConfig.customizeMixins && window.ProjectConfig.customizeMixins.tableDetailCollectionMixin) || {};
        // 混入卡槽
        if(tableDetailCollectionMixin.slotArray){
          Object.keys(tableDetailCollectionMixin.slotArray).forEach((key)=>{
            this.slotArray[key] = tableDetailCollectionMixin.slotArray[key];
          })
        }
          // 混入外部接入的渲染
        if (tableDetailCollectionMixin.slotTableTemplate) {
          this.slotTableTemplate = tableDetailCollectionMixin.slotTableTemplate;
        }
       
        const singleObjectButtonsMixin = (window.ProjectConfig.customizeMixins && window.ProjectConfig.customizeMixins.singleObjectButtonsMixin) || {};
        const vuexModuleName = this.moduleComponentName;

        const singlePanelForm = `tabComponent.${this.tableName}.PanelForm`;

        if (this.type === 'vertical') {
          if (Vue.component(tableComponent) === undefined) {
            Vue.component(tableComponent, Vue.extend(Object.assign({ mixins: [verticalMixins(), tableDetailCollectionMixin] }, tableDetailCollection)));
          }
          if (Vue.component(buttonComponent) === undefined) {
            Vue.component(buttonComponent, Vue.extend(Object.assign({ mixins: [verticalMixins(), singleObjectButtonsMixin] }, singleObjectButtons)));
          }
        } else {
          if(Vue.component(tableComponent) === undefined) {
            Vue.component(tableComponent, Vue.extend(Object.assign({ mixins: [horizontalMixins(vuexModuleName), tableDetailCollectionMixin] }, tableDetailCollection)));
          }
          if (Vue.component(buttonComponent) === undefined) {
            Vue.component(buttonComponent, Vue.extend(Object.assign({ mixins: [horizontalMixins(vuexModuleName), singleObjectButtonsMixin] }, singleObjectButtons)));
          }
        }
        if(this.componentName) { // 定制tab自定义组件
          const customizedModuleName = this.componentName.toUpperCase();
          if (Vue.component(customizedModuleName) === undefined) {
            const target = externalModules[customizedModuleName] || customizeModules[customizedModuleName];
            if (target) {
              Vue.component(customizedModuleName, target.component);
              this.customizeComponent = customizedModuleName;
            } else {
              Vue.component(customizedModuleName, CompontentNotFound);
              this.customizeComponent = customizedModuleName;
            }
          } else {
            this.customizeComponent = customizedModuleName;
          }
        }
        this.objectTableComponent = tableComponent;
        this.objectButtonComponent = buttonComponent;
        this.currentSinglePanelForm = singlePanelForm;
        
      },
      itemTableCheckFunc() {
        if (this.$refs.objectTableRef && Object.keys(this.$refs.objectTableRef.tableFormVerify()).length > 0) {
          return false;
        }
        return true;
      }, // 传给按钮组件的回调方法，用来调表格组件的校验
      clearItemTableSearchValue() {
        if (this.$refs.objectTableRef) {
          this.$refs.objectTableRef.clearSearchData();
        }
      }, // 清空表格搜索框的值
      enterClick(callback) {
        if(this.itemInfo && this.itemInfo.tabrelation && this.itemInfo.tabrelation !== '1:1') {
          this.formEnter();
          if(callback){
            this.callbackFun = callback;
          }
        }
      },
      formEnter() {
        this.isclick = false;
        let savePath = '';
        const { itemId } = window.vm.$router.currentRoute.params;
        if(Version() === '1.4') {
          const store = this.$store.state[this[MODULE_COMPONENT_NAME]];
          const itemName = this.tableName;// 子表表名
          if (this.type === 'horizontal') {
            this.$store.state[this[MODULE_COMPONENT_NAME]].tabPanels.forEach((item) => {
              if (item.tablename === this.tableName) {
                if (itemId === 'New') { // 主表新增保存和编辑新增保存
                  savePath = item.componentAttribute.buttonsData.data.tabcmd.paths[0];
                } else {
                  savePath = item.componentAttribute.buttonsData.data.tabcmd.paths[0];
                }
              }
            });
            this.determineSaveType(savePath);
          } else if (itemId === 'New') { // 主表新增保存和编辑新增保存
            if (store.updateData[itemName].add && Object.values(store.updateData[itemName].add[itemName]).length > 0) { // 新增时只有子表有新增内容才可进行回车保存
              savePath = this.$store.state[this[MODULE_COMPONENT_NAME]].mainFormInfo.buttonsData.data.tabcmd.paths[0];
              this.determineSaveType(savePath);
            }
          } else {
            savePath = this.$store.state[this[MODULE_COMPONENT_NAME]].mainFormInfo.buttonsData.data.tabcmd.paths[1];
            this.determineSaveType(savePath);
          }
        }else{
          this.determineSaveType();
        }
      }, // 表单回车触发
      subtables() {
        if (Version() === 1.4) {
          if (this.isreftabs) {
            return true;
          }
          return false;
        } if (this.childTableNames.length > 0) {
          return true;
        }
        return false;
      },
      determineSaveType(savePath) { // 回车保存
        const { itemId } = window.vm.$router.currentRoute.params;
        if (this.verifyRequiredInformation()) { // 验证表单必填项
          this.saveParameters();// 调用获取参数方法
          const itemName = this.tableName;// 子表表名
          const itemCurrentParameter = this.itemCurrentParameter;
          if (itemId === 'New') { // 主表新增保存和编辑新增保存
            const type = 'add';
            const path = savePath;
            const objId = -1;

            if (!this.subtables()) { // 为0的情况下是没有子表
              if (path) { // 配置path
                this.savaNewTable(type, path, objId);
              } else { // 没有配置path
                this.savaNewTable(type, path, objId);
              }
            }
            if (this.subtables()) { // 大于0 的情况下是存在子表
              if (path) { // 配置path
                this.savaNewTable(type, path, objId, itemName, itemCurrentParameter);
              } else { // 没有配置path
                this.savaNewTable(type, path, objId, itemName, itemCurrentParameter);
              }
            }
          } else if (itemId !== '-1') { // 主表编辑保存
            const path = savePath;
            const type = 'modify';
            if (!this.subtables()) { // 为0的情况下是没有子表

              if (savePath) { // 配置path
                this.savaNewTable(type, path, this.itemId);
              } else { // 没有配置path
                const objId = itemId;
                this.savaNewTable(type, path, objId);
              }
            }
            if (this.subtables()) { // 大于0 的情况下是存在子表
              const objId = itemId;
              // const sataType = 'itemSave';
              // if (this.type === 'vertical') {
              const store = this.$store.state[this[MODULE_COMPONENT_NAME]];
              let itemModify = [];
              let itemAdd = [];
              if (store.updateData[itemName].modify && store.updateData[itemName].modify[itemName]) {
                itemModify = store.updateData[itemName].modify[itemName];
              }
              if (store.updateData[itemName] && store.updateData[itemName].add[itemName]) {
                itemAdd = store.updateData[itemName].add[itemName];
              }
              if (itemModify && Object.values(itemModify).length > 0 && Object.values(itemAdd).length < 1) { // 单对象界面上下结构子表修改
                this.savaNewTable(type, path, objId, itemName, itemCurrentParameter, { sataType: 'modify' });
              }
              if (itemAdd && Object.values(itemAdd).length > 0 && Object.values(itemModify).length < 1) { // 单对象界面上下结构子表新增
                this.savaNewTable(type, path, objId, itemName, itemCurrentParameter, { sataType: 'add' });
              }
              if(itemAdd && Object.values(itemAdd).length > 0 && itemModify && Object.values(itemModify).length > 0) { // 单对象界面上下结构子表修改新增同时操作
                if(this.itemTableCheckFunc()) {
                  this.savaNewTable(type, path, objId, itemName, itemCurrentParameter, { sataType: 'addAndModify' });
                }
              }
            }
          }
        }
      },
      savaNewTable(type, path, objId, itemName, itemCurrentParameter, sataType, enter) { // 主表新增保存方法
        const tabIndex = this.currentTabIndex;
        const objectType = this.type;
        const Id = objId === 'New' ? '-1' : objId;
        const childTableNames = this.childTableNames;
        const { tableName } = window.vm.$router.currentRoute.params;
        const parame = {
          ...this.currentParameter, // 主表信息
          itemCurrentParameter, // 子表信息
          type,
          tableName,
          objId: Id,
          path,
          itemName: this.tableName,
          objectType,
          itemNameGroup: childTableNames,
          sataType,
          enter,
          dialogType:this.dialogType,
          isreftabs: this.verifyForm
        };
        const promise = new Promise((resolve, reject) => {
          this.$store.dispatch(`${this[MODULE_COMPONENT_NAME]}/performMainTableSaveAction`, { parame, resolve, reject });
        });
       

        // this.performMainTableSaveAction(parame);

        promise.then((res) => {
           // 关闭子表导入
        this.dialogType = false;
          if (this.type === 'vertical') {
            this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/updateChangeData`, { tableName: this.tableName, value: {} });
            this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/updateAddData`, { tableName: this.tableName, value: {} });
          } else {
            this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/updateChangeData`, { tableName: this.tableName, value: {} });
            this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/updateAddData`, { tableName: this.tableName, value: {} });
          }
          const { tableId, itemId } = this[INSTANCE_ROUTE_QUERY];
          const { tablename, refcolid, tabinlinemode } = this.itemInfo;
          let id = '';
          if (this.$store.state[this[MODULE_COMPONENT_NAME]].buttonsData.newMainTableSaveData) {
            id = this.$store.state[this[MODULE_COMPONENT_NAME]].buttonsData.newMainTableSaveData.objId;
          } else {
            id = itemId;
          }
          const message = this.$store.state[this[MODULE_COMPONENT_NAME]].buttonsData.message;
          // 弹窗回调结果
          if(typeof this.callbackFun ==='function'){
            this.callbackFun(res);
          }

          // this.emptyTestData();// 清空记录的当前表的tab是否点击过的记录
          this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/emptyTestData`);

          // 保存成功后路由跳转到编辑界面
          if (type === 'add') { // 横向结构新增主表保存成功后跳转到编辑页面
            let types = '';
            if (this.type === 'horizontal') {
              types = 'tableDetailHorizontal';
            } else {
              types = 'tableDetailVertical';
            }
            const label = `${this.$store.state.global.activeTab.label.replace(this.$t('buttons.add'), this.$t('buttons.edit'))}`;
            const tab = {
              type: types,
              tableName,
              tableId,
              label,
              id: this.$store.state[this[MODULE_COMPONENT_NAME]].buttonsData.newMainTableSaveData ? this.$store.state[this[MODULE_COMPONENT_NAME]].buttonsData.newMainTableSaveData.objId : itemId
            };
            // this.updateChangeData({ tableName: this.tableName, value: {} });
            this.$store.commit('global/tabOpen', tab);
            this.decreasekeepAliveLists(this[MODULE_COMPONENT_NAME]);
          }else if (this.type === 'horizontal') {
            const searchdata = {
              column_include_uicontroller: true,
              startindex: this.$store.state[this[MODULE_COMPONENT_NAME]].tablePageInfo.currentPageIndex - 1,
              range: this.$store.state[this[MODULE_COMPONENT_NAME]].tablePageInfo.pageSize,
            };
            this.$store.dispatch(`${this[MODULE_COMPONENT_NAME]}/getObjectTableItemForTableData`, {
              table: tablename, objid: itemId, refcolid, searchdata, tabIndex
            });
            this.$store.dispatch(`${this[MODULE_COMPONENT_NAME]}/getInputForitemForChildTableForm`, { table: tablename, tabIndex, tabinlinemode });
            // this.$store.dispatch(`${this[MODULE_COMPONENT_NAME]}/getObjectTabForChildTableButtons`, { maintable: tableName, table: tableName, objid: itemId });

            // this.$store.dispatch(`${this[MODULE_COMPONENT_NAME]}/getObjectTableItemForTableData`, {
            //   table: tablename, objid: itemId, refcolid, searchdata: { column_include_uicontroller: true }
            // });
          } else if (itemId === 'New') {
            this.$store.dispatch(`${this[MODULE_COMPONENT_NAME]}/getObjectForMainTableForm`, { table: tableName, objid: id, tabIndex });
            new Promise((resolve, reject) => {
              this.$store.dispatch(`${this[MODULE_COMPONENT_NAME]}/getObjectTabForMainTable`, {
                table: tableName, objid: id, tabIndex, resolve, reject
              });
            }).then(() => {
            });
          } else {
            this.$store.dispatch(`${this[MODULE_COMPONENT_NAME]}/getObjectForMainTableForm`, { table: tableName, objid: itemId, tabIndex });
            new Promise((resolve, reject) => {
              this.$store.dispatch(`${this[MODULE_COMPONENT_NAME]}/getObjectTabForMainTable`, {
                table: tableName, objid: itemId, tabIndex, resolve, reject
              });
            }).then(() => {
            });
          }
          // console.log(this.$store.state[this[MODULE_COMPONENT_NAME]].buttonsData);
          // const objIdSave = this.$store.state[this[MODULE_COMPONENT_NAME]].buttonsData.newMainTableSaveData.objId ? this.$store.state[this[MODULE_COMPONENT_NAME]].buttonsData.newMainTableSaveData.objId : itemId;
          if(message) {
            this.$Message.success(message);
          }
          // this.getObjectForMainTableForm({ table: this.tableName, objid: this.itemId });
          // this.getObjectTabForMainTable({ table: this.tableName, objid: this.itemId });
          // this.$store.dispatch(`${this[MODULE_COMPONENT_NAME]}/getObjectTableItemForTableData`, {
          //   table: this.tableName,
          //   objid: itemId,
          //   refcolid,
          //   searchdata: {
          //     column_include_uicontroller: true,
          //     startindex: 0,
          //     range: 10,
          //     fixedcolumns: {}
          //   }
          // });
        }, () => {});
      },
      verifyRequiredInformation() { // 验证表单必填项
        this.saveParameters();
        const checkedInfo = this.verifymiainForm();// 主表校验信息
        if (checkedInfo.length>0) {
           this.$Message.warning(checkedInfo[0].tip);
            let dom = document.querySelector(`#${checkedInfo[0].colname}`);
            if(dom){
              let Input = dom.querySelector('input') || dom.querySelector('textarea');
              if(Input){
                  Input.focus();
              }

            }
            return false;
        }
        // if (this.objectType === 'vertical') { // 纵向结构
        if (this.childTableNames.length > 0) { // 存在子表时
          const itemCheckedInfo = this.itemCurrentParameter.checkedInfo;// 子表校验信息
          if (itemCheckedInfo) {
            const itemMessageTip = itemCheckedInfo.messageTip;
            if (itemMessageTip && itemMessageTip.length > 0) {
              this.$Message.warning(itemMessageTip[0]);
              itemCheckedInfo.validateForm.focus();
              return false;
            }
          } else if (KEEP_SAVE_ITEM_TABLE_MANDATORY) { // 为true时，子表没有必填项也必须要输入值才能保存
            this.saveParameters();
            if (this.type === 'vertical') {
              if (this.itemId === 'New') {
                const addInfo = this.$store.state[this[MODULE_COMPONENT_NAME]].updateData[this.tableName].itemCurrentParameter.add[this.itemName];
                if (Object.values(addInfo).length < 1) {
                  this.$Message.warning(this.$t('messages.requiredPersonalInfo'));
                  return false;
                }
              }
            }
          }
        }
        // }
        return true;
      },
      verifymiainForm(){
        // 获取主表校验
        let panelForm_dom =  document.querySelector('.panelForm');
        let validate = [];
        if(panelForm_dom){
          let panelForm = panelForm_dom._vue_;
        
          if(panelForm){
            validate = panelForm.validate();
          }
        }
        
        return validate;

      },
      saveParameters() {
        if (this.verifyForm) { // 有子表
          Object.keys(this.$store.state[this[MODULE_COMPONENT_NAME]].updateData).reduce((obj, current) => { // 获取store储存的新增修改保存需要的参数信息
            if (current === this.tableName) {
              this.itemCurrentParameter = this.$store.state[this[MODULE_COMPONENT_NAME]].updateData[current];
            }
            return obj;
          }, {});
        }
        Object.keys(this.$store.state[this[MODULE_COMPONENT_NAME]].updateData).reduce((obj, current) => { // 获取store储存的新增修改保存需要的参数信息
          const { tableName } = window.vm.$router.currentRoute.params;
          if (current === tableName) {
            this.currentParameter = this.$store.state[this[MODULE_COMPONENT_NAME]].updateData[current];
          }
          return obj;
        }, {});
      },
      deleteFormData(data){
          //删除状态的key
            let updateLinkageForm = this.$store._mutations[`${this[MODULE_COMPONENT_NAME]}/seleteAddData`]
          if(updateLinkageForm){
            this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/seleteAddData`, data);
          }
      },
      // 判断数据是否修改过
      getUpdatedValue(formData, defaultData) {
        const form = deepClone(formData)
        Object.keys(form).forEach(field => {
          const defaultValue = defaultData[field]
          const currentValue = form[field]
          const isEqual = defaultValue && (defaultValue == currentValue) // 强转化是否相等。处理数字输入框的场景用
          const isEqualString = defaultValue && (JSON.stringify(defaultValue) === JSON.stringify(currentValue)) // 引用型对象转字符串进行比较是否相等

          // 条件1: 没初始值，且没有输入值
          // 条件2: 有初始值，但是值跟之前对比没发生变化
          // currentValue === 0是因为数子输入框输入再删除会把默认值变成0，而不是''
          // currentValue === '[]' 的出现的场景时文件上传表单
         
          if((currentValue === 0 && defaultValue === undefined) || (currentValue === '' && defaultValue === undefined) || (currentValue === '[]' && defaultValue === undefined) || isEqualString || isEqual) {
            delete form[field];
             const data = {
              key: field,
              itemName: this.itemInfo.tablename
            };
            this.deleteFormData(data);

          }
        })
        return form
      },

      // 表单数据变化
      formChange(val, changeVal, label, formData, defaultDataInt, defaultFormData) {
        const { tableName } = this;
        const { itemId } = this[INSTANCE_ROUTE_QUERY];
        if (itemId) {
          const updatedValue = this.getUpdatedValue(formData, defaultFormData);
          // 如果没变化，数据恢复原样
          if(Object.keys(updatedValue).length === 0) {
            this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/updateChangeData`, { tableName, value: {} });
            this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/updateAddData`, { tableName, value: {} });
            return
          }
          const obj = {};
          obj[tableName] = updatedValue;
          this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/updateChangeData`, { tableName, value: defaultDataInt });
          this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/updateAddData`, { tableName, value: obj });
        }
      },
      initForm(val) {
        const { tableName } = this;
        const { itemId } = this[INSTANCE_ROUTE_QUERY];
        const obj = {};
        obj[tableName] = val;
        if (itemId) {
          this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/updateAddDefaultData`, { tableName, value: obj });
        }
      },
      verifyForm(data) {
        const { tableName } = this;
        const { itemId } = this[INSTANCE_ROUTE_QUERY];
        if (itemId) {
          this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/updateCheckedInfoData`, { tableName, value: data });
        }
      },
      verifyFormPanel(data) {
        const { tableName } = this;
        const { itemId } = this[INSTANCE_ROUTE_QUERY];
        if (itemId) {
          this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/updateCheckedInfoData`, { tableName, value: data });
        }
      },
      
      formPanelChange(val, changeVal, valLabel) {
        if(notificationOfMain() && this.$route.params.tableName === this.tableName) {
          DispatchEvent('notificationOfMain', {
            detail: val
          });
        }
        const { tableName } = this;
        const { itemId } = this[INSTANCE_ROUTE_QUERY];
        const obj = {};
        const objLabel = {};
        obj[tableName] = val;
        objLabel[tableName] = valLabel;
        if (itemId) {
          this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/updateChangeData`, { tableName, value: changeVal });
          if (itemId === 'New') {
            this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/updateAddData`, { tableName, value: obj });
          } else {
            this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/updateModifyData`, { tableName, value: obj });
            this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/updateModifyLabelData`, { tableName, value: objLabel });
          }
        }
      },
      initFormPanel(val, valChange, valLabel) {
        const { tableName } = this;
        const obj = {};
        const objLabel = {};
        obj[tableName] = val;
        objLabel[tableName] = valLabel;
        const { itemId } = this[INSTANCE_ROUTE_QUERY];
        if (itemId) {

          if (itemId === 'New') {
            this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/updateAddData`, { tableName, value: obj });
          }
          this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/updateDefaultData`, { tableName, value: obj });
          this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/updateDefaultLabelData`, { tableName, value: objLabel });
        }
      },
      tableBeforeData(data) {
        const { tableName } = this;
        const { itemId } = this[INSTANCE_ROUTE_QUERY];
        if (itemId) {
          this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/updateDefaultData`, { tableName, value: data });
        }
      },
      tableBeforeLabelData(data) {
        const { tableName } = this;
        const { itemId } = this[INSTANCE_ROUTE_QUERY];
        if (itemId) {
          this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/updateDefaultLabelData`, { tableName, value: data });
        }
      },
      tableDataChangeLabelBefore(data) {
        const { tableName } = this;
        const { itemId } = this[INSTANCE_ROUTE_QUERY];
        if (itemId) {
          this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/updateItemBeforeLabelData`, { tableName, value: data });
        }
      },
      tableDataChange(data) {
        const { tableName } = this;
        const { itemId } = this[INSTANCE_ROUTE_QUERY];
        if (itemId) {
          this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/updateModifyData`, { tableName, value: data });
        }
      },
      tableDataChangeLabel(data) {
        const { tableName } = this;
        const { itemId } = this[INSTANCE_ROUTE_QUERY];
        if (itemId) {
          this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/updateModifyLabelData`, { tableName, value: data });
        }
      }, // 抛出label
      tableSelectedRow(data) {
        const { tableName } = this;
        const { itemId } = this[INSTANCE_ROUTE_QUERY];
        if (itemId) {
          this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/updateDeleteData`, { tableName, value: data });
        }
      },
      tableVerifyMessage(data) {
        // const { tableName } = this;
        // this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/updateCheckedInfoData`, { tableName, value: data });
      }
    },
  };
</script>
