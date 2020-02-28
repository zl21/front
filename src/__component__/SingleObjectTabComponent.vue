<template>
  <div class="tabComponent">
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
    />
    <!-- 子表表格新增区域form -->
    <compositeForm
      v-if="formData.isShow&&itemInfo.tabrelation!=='1:1'"
      v-show="status === 1 && !objreadonly"
      :object-type="type"
      :is-main-table="isMainTable"
      :objreadonly="objreadonly"
      :readonly="formReadonly"
      :default-set-value="changeData"
      :master-name="$route.params.tableName"
      :master-id="$route.params.itemId"
      :module-form-type="type"
      class="form"
      :default-data="formData.data"
      :paths="formPaths"
      :isreftabs="isreftabs"
      :child-table-name="tableName"
      :from="from"
      @on-formEnter="enterClick"
      @formChange="formChange"
      @InitializationForm="initForm"
      @VerifyMessage="verifyForm"
    />
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
        :master-name="$route.params.tableName"
        :master-id="$route.params.itemId"
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
    <!-- 左右结构主表和子表的form(面板) -->
    
    <compositeForm
      v-if="panelData.isShow&&!componentName"
      :is-main-table="isMainTable"
      :object-type="type"
      :objreadonly="itemReadOnlyForJflow"
      :readonly="itemReadOnlyForJflow"
      :default-set-value="changeData"
      :master-name="$route.params.tableName"
      :master-id="$route.params.itemId"
      :module-form-type="type"
      :class="type === 'vertical' ? 'verticalFormPanel' : 'formPanel'"
      type="PanelForm"
      :default-data="panelData.data"
      :paths="formPaths"
      :isreftabs="isreftabs"
      :child-table-name="tableName"
      :from="from"
      @formChange="formPanelChange"
      @InitializationForm="initFormPanel"
      @VerifyMessage="verifyFormPanel"
    />
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
      :readonly="buttonsData.data.objreadonly || !getActionModify"
      :objreadonly="objreadonly"
      :status="status"
      :tabwebact="buttonsData.data.tabwebact"
      :tooltip-for-item-table="tooltipForItemTable"
      @tableBeforeData="tableBeforeData"
      @tableBeforeLabelData="tableBeforeLabelData"
      @tableDataChangeLabel="tableDataChangeLabel"
      @tableDataChangeLabelBefore="tableDataChangeLabelBefore"
      @tableDataChange="tableDataChange"
      @tableSelectedRow="tableSelectedRow"
      @tableVerifyMessage="tableVerifyMessage"
    />
  </div>
</template>

<script>
  /* eslint-disable keyword-spacing */

  import Vue from 'vue';
  import { mapMutations, mapState, } from 'vuex';

  import router from '../__config__/router.config';
  import tableDetailCollection from './TableDetailCollection';
  import singleObjectButtons from './SingleObjectButtons';
  import compositeForm from './CompositeForm';
  import horizontalMixins from '../__config__/mixins/horizontalTableDetail';
  import verticalMixins from '../__config__/mixins/verticalTableDetail';
  import CompontentNotFound from './CompontentNotFound';
  import CustomizeModule from '../__config__/customize.config';


  import {
    KEEP_SAVE_ITEM_TABLE_MANDATORY, Version, MODULE_COMPONENT_NAME, enableJflow 
  } from '../constants/global';

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
      };
    },
    components: {
      compositeForm
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
      jflowWaterMark: {
        type: String,
        default: ''
      }, // jflow水印数据
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
    inject: [MODULE_COMPONENT_NAME],  
    computed: { 
      ...mapState('global', {
        objreadonlyForJflow: ({ objreadonlyForJflow }) => objreadonlyForJflow,
      }),
      itemReadOnlyForJflow() {
        if(!enableJflow() && this.objreadonlyForJflow && this.objreadonlyForJflow.itemTableName === this.tableName) {
          return this.objreadonlyForJflow.readonly;
        }
        return this.objreadonly;
      }, 
      tabPanelsAll() {
        return this.$store.state[this[MODULE_COMPONENT_NAME]].tabPanels;
      },
      resetWaterMark() {
        if (this.watermarkimg) {
          if (this.jflowWaterMark) {
            return this.jflowWaterMark;
          }
          return this.watermarkimg;
        }
        if (this.jflowWaterMark) {
          return this.jflowWaterMark;
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
    
      // ...mapState(moduleName(), {
      //   activeTab: ({ updateData }) => updateData,
      // }),
    },
    mounted() {
      console.log('🍍', this.itemReadOnlyForJflow);
      // this.generateComponent();
    },
    created() {
      this.generateComponent();
    },
    methods: {
      ...mapMutations('global', ['tabHref', 'decreasekeepAliveLists']),

      // ...mapActions(this[MODULE_COMPONENT_NAME], ['performMainTableSaveAction']),
      generateComponent() {
        const externalModules = (window.ProjectConfig || { externalModules: undefined }).externalModules || {};
        const tableComponent = `${this[MODULE_COMPONENT_NAME]}.TableDetailCollection`;
        const buttonComponent = `${this[MODULE_COMPONENT_NAME]}.SingleObjectButtons`;
        if (this.type === 'vertical') {
          if (Vue.component(tableComponent) === undefined) {
            Vue.component(tableComponent, Vue.extend(Object.assign({ mixins: [verticalMixins()] }, tableDetailCollection)));
          }
          if (Vue.component(buttonComponent) === undefined) {
            Vue.component(buttonComponent, Vue.extend(Object.assign({ mixins: [verticalMixins()] }, singleObjectButtons)));
          }
        } else {
          if(Vue.component(tableComponent) === undefined) {
            Vue.component(tableComponent, Vue.extend(Object.assign({ mixins: [horizontalMixins()] }, tableDetailCollection)));
          }
          if (Vue.component(buttonComponent) === undefined) {
            Vue.component(buttonComponent, Vue.extend(Object.assign({ mixins: [horizontalMixins()] }, singleObjectButtons)));
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
      enterClick() {
        if(this.itemInfo && this.itemInfo.tabrelation && this.itemInfo.tabrelation !== '1:1') {
          this.formEnter();
        }
      },
      formEnter() {
        this.isclick = false;
        let savePath = '';
        const { itemId } = router.currentRoute.params;
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
        const { itemId } = router.currentRoute.params;
        if (this.verifyRequiredInformation()) { // 验证表单必填项
          this.saveParameters();// 调用获取参数方法
          const itemName = this.tableName;// 子表表名
          const itemCurrentParameter = this.itemCurrentParameter;
          if (itemId === 'New') { // 主表新增保存和编辑新增保存
            // console.log('主表新增保存和编辑新增保存');
            const type = 'add';
            const path = savePath;
            const objId = -1;

            if (!this.subtables()) { // 为0的情况下是没有子表
              // console.log('没有子表');
              if (path) { // 配置path
                // console.log(' 主表新增保存,配置path的', this.dynamic.requestUrlPath);
                this.savaNewTable(type, path, objId);
              } else { // 没有配置path
                this.savaNewTable(type, path, objId);
              }
            }
            if (this.subtables()) { // 大于0 的情况下是存在子表
              // console.log('有子表');
              if (path) { // 配置path
                this.savaNewTable(type, path, objId, itemName, itemCurrentParameter);
              } else { // 没有配置path
                this.savaNewTable(type, path, objId, itemName, itemCurrentParameter);
              }
            }
          } else if (itemId !== '-1') { // 主表编辑保存
            // console.log('主表编辑保存');
            const path = savePath;
            const type = 'modify';
            if (!this.subtables()) { // 为0的情况下是没有子表
              // console.log('没有子表',);

              if (savePath) { // 配置path
                // console.log('主表编辑保存,配置path的逻辑', obj.requestUrlPath);
                this.savaNewTable(type, path, this.itemId);
              } else { // 没有配置path
                // console.log('主表编辑保存,没有配置path的逻辑');
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
              // } else{ // 横向结构
              //   const store = this.$store.state[this[MODULE_COMPONENT_NAME]];
              //   let itemModify = [];
              //   let itemAdd = [];
              //   if (store.updateData[itemName].modify && store.updateData[itemName].modify[itemName]) {
              //     itemModify = store.updateData[itemName].modify[itemName];
              //   }
              //   if (store.updateData[itemName] && store.updateData[itemName].add[itemName]) {
              //     itemAdd = store.updateData[itemName].add[itemName];
              //   }
              //   if (itemModify && Object.values(itemModify).length > 0 && Object.values(itemAdd).length < 1) { // 单对象界面上下结构子表修改
              //     this.savaNewTable(type, path, objId, itemName, itemCurrentParameter, { sataType: 'modify' });
              //   }
              //   if (itemAdd && Object.values(itemAdd).length > 0 && Object.values(itemModify).length < 1) { // 单对象界面上下结构子表新增
              //     this.savaNewTable(type, path, objId, itemName, itemCurrentParameter, { sataType: 'add' });
              //   }
              //   if(itemModify && Object.values(itemModify).length > 0 && itemAdd && Object.values(itemAdd).length > 0) { // 单对象界面上下结构子表修改新增同时操作
              //     this.savaNewTable(type, path, objId, itemName, itemCurrentParameter, { sataType: 'addAndModify' });
              //   }
              // }
              // else { // 没有配置path
              //   const store = this.$store.state[this[MODULE_COMPONENT_NAME]];
              //   if (store.updateData[itemName].modify[itemName] && Object.values(store.updateData[itemName].modify[itemName]).length > 0) {
              //     this.savaNewTable(type, path, objId, itemName, itemCurrentParameter, { sataType: 'modify' });
              //   }
              //   // const add = Object.assign({}, store.updateData[itemName].add[itemName], store.updateData[itemName].addDefault[itemName]);// 整合子表新增和默认值数据
              //   if (store.updateData[itemName].add[itemName] && Object.values(store.updateData[itemName].add[itemName]).length > 0) {
              //     this.savaNewTable(type, path, objId, itemName, itemCurrentParameter, { sataType: 'add' });
              //   }
              // }
            }
          }
        }
      },
      savaNewTable(type, path, objId, itemName, itemCurrentParameter, sataType, enter) { // 主表新增保存方法
        const tabIndex = this.$store.state[this[MODULE_COMPONENT_NAME]].tabCurrentIndex;
        const objectType = this.type;
        const Id = objId === 'New' ? '-1' : objId;

        const childTableNames = this.childTableNames;
        const { tableName } = router.currentRoute.params;
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
          isreftabs: this.verifyForm
        };
        const promise = new Promise((resolve, reject) => {
          this.$store.dispatch(`${this[MODULE_COMPONENT_NAME]}/performMainTableSaveAction`, { parame, resolve, reject });
        });

        // this.performMainTableSaveAction(parame);

        promise.then(() => {
          if (this.type === 'vertical') {
            this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/updateChangeData`, { tableName: this.tableName, value: {} });
            this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/updateAddData`, { tableName: this.tableName, value: {} });
          } else {
            this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/updateChangeData`, { tableName: this.tableName, value: {} });
            this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/updateAddData`, { tableName: this.tableName, value: {} });
          }
          const { tableId, itemId } = this.$route.params;
          const { tablename, refcolid, tabinlinemode } = this.itemInfo;
          let id = '';
          if (this.$store.state[this[MODULE_COMPONENT_NAME]].buttonsData.newMainTableSaveData) {
            id = this.$store.state[this[MODULE_COMPONENT_NAME]].buttonsData.newMainTableSaveData.objId;
          } else {
            id = itemId;
          }
          const message = this.$store.state[this[MODULE_COMPONENT_NAME]].buttonsData.message;

          // 保存成功后路由跳转到编辑界面
          if (type === 'add') { // 横向结构新增主表保存成功后跳转到编辑页面
            let types = '';
            if (this.type === 'horizontal') {
              types = 'tableDetailHorizontal';
            } else {
              types = 'tableDetailVertical';
            }
            const label = `${this.$store.state.global.activeTab.label.replace('新增', '编辑')}`;
            const tab = {
              type: types,
              tableName,
              tableId,
              label,
              id: this.$store.state[this[MODULE_COMPONENT_NAME]].buttonsData.newMainTableSaveData ? this.$store.state[this[MODULE_COMPONENT_NAME]].buttonsData.newMainTableSaveData.objId : itemId
            };
            // this.updateChangeData({ tableName: this.tableName, value: {} });
            this.$store.commit('global/tabHref', tab);
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
            this.$store.dispatch(`${this[MODULE_COMPONENT_NAME]}/getObjectTabForMainTable`, { table: tableName, objid: id, tabIndex });
          } else {
            this.$store.dispatch(`${this[MODULE_COMPONENT_NAME]}/getObjectForMainTableForm`, { table: tableName, objid: itemId, tabIndex });
            this.$store.dispatch(`${this[MODULE_COMPONENT_NAME]}/getObjectTabForMainTable`, { table: tableName, objid: itemId, tabIndex });
          }
          // console.log(this.$store.state[this[MODULE_COMPONENT_NAME]].buttonsData);
          // const objIdSave = this.$store.state[this[MODULE_COMPONENT_NAME]].buttonsData.newMainTableSaveData.objId ? this.$store.state[this[MODULE_COMPONENT_NAME]].buttonsData.newMainTableSaveData.objId : itemId;

          this.$Message.success(message);
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
        const checkedInfo = this.currentParameter.checkedInfo;// 主表校验信息
        if (checkedInfo) {
          const messageTip = checkedInfo.messageTip;
          if (messageTip && messageTip.length > 0) {
            this.$Message.warning(messageTip[0]);
            checkedInfo.validateForm.focus();
            return false;
          }
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
                  this.$Message.warning('个人信息不能为空!');
                  return false;
                }
              }
            }
          }
        }
        // }
        return true;
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
          const { tableName } = router.currentRoute.params;
          if (current === tableName) {
            this.currentParameter = this.$store.state[this[MODULE_COMPONENT_NAME]].updateData[current];
          }
          return obj;
        }, {});
      },
      formChange(val, changeVal) {
        const { tableName } = this;
        const obj = {};
        const { itemId } = this.$route.params;
        obj[tableName] = val;
        if (itemId) {
          this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/updateChangeData`, { tableName, value: changeVal });
          this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/updateAddData`, { tableName, value: obj });
        }
      },
      initForm(val) {
        const { tableName } = this;
        const { itemId } = this.$route.params;
        const obj = {};
        obj[tableName] = val;
        if (itemId) {
          this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/updateAddDefaultData`, { tableName, value: obj });
        }
      },
      verifyForm(data) {
        const { tableName } = this;
        const { itemId } = this.$route.params;
        if (itemId) {
          this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/updateCheckedInfoData`, { tableName, value: data });
        }
      },
      verifyFormPanel(data) {
        const { tableName } = this;
        const { itemId } = this.$route.params;
        if (itemId) {
          this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/updateCheckedInfoData`, { tableName, value: data });
        }
      },
      formPanelChange(val, changeVal, valLabel) {
        const { tableName } = this;
        const { itemId } = this.$route.params;
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
        const { itemId } = this.$route.params;
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
        const { itemId } = this.$route.params;
        if (itemId) {
          this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/updateDefaultData`, { tableName, value: data });
        }
      },
      tableBeforeLabelData(data) {
        const { tableName } = this;
        const { itemId } = this.$route.params;
        if (itemId) {
          this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/updateDefaultLabelData`, { tableName, value: data });
        }
      },
      tableDataChangeLabelBefore(data) {
        const { tableName } = this;
        const { itemId } = this.$route.params;
        if (itemId) {
          this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/updateItemBeforeLabelData`, { tableName, value: data });
        }
      },
      tableDataChange(data) {
        const { tableName } = this;
        const { itemId } = this.$route.params;
        if (itemId) {
          this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/updateModifyData`, { tableName, value: data });
        }
      },
      tableDataChangeLabel(data) {
        const { tableName } = this;
        const { itemId } = this.$route.params;
        if (itemId) {
          this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/updateModifyLabelData`, { tableName, value: data });
        }
      }, // 抛出label
      tableSelectedRow(data) {
        const { tableName } = this;
        const { itemId } = this.$route.params;
        if (itemId) {
          this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/updateDeleteData`, { tableName, value: data });
        }
      },
      tableVerifyMessage(data) {
        // const { tableName } = this;
        // this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/updateCheckedInfoData`, { tableName, value: data });
      }
    }
  };
</script>

<style lang="less">
  .tabComponent{
    height: 100%;
    display: flex;
    flex-direction: column;
    .objectButtons {
      .buttonList {
        padding-left: 0;
      }
    }
    .form {
      padding: 0 10px 8px 0;
      background-color: #F8F8F8;
    }
    .formPanel {
      flex: 1;
      overflow:auto;
    }
    .verticalFormPanel {
      margin: 10px 16px;
      flex: 1;
    }
    .objectTable {
    }
  }
</style>
