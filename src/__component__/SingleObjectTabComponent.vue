<template>
  <div class="tabComponent">
    <component
      :is="'SingleObjectButtons'"
      v-if="buttonsData.isShow"
      :object-type="type"
      class="objectButtons"
      :item-info="itemInfo"
      :item-name-group="childTableNames"
      :item-name="tableName"
      :tabcmd="buttonsData.data.tabcmd"
      :tabwebact="buttonsData.data.tabwebact"
      :isactive="isactive"
      :isreftabs="isreftabs"
    />
    <component
      :is="'CompositeForm'"
      v-if="formData.isShow"
      v-show="status === 1"
      :objreadonly="objreadonly"
      :default-set-value="changeData"
      :master-name="$route.params.tableName"
      :master-id="$route.params.itemId"
      :module-form-type="type"
      class="form"
      :default-data="formData.data"
      :paths="formPaths"
      @on-formEnter="formEnter"
      @formChange="formChange"
      @InitializationForm="initForm"
      @VerifyMessage="verifyForm"
    />
    <component
      :is="'CompositeFormPanel'"
      v-if="panelData.isShow"
      :objreadonly="objreadonly"
      :default-set-value="changeData"
      :master-name="$route.params.tableName"
      :master-id="$route.params.itemId"
      :module-form-type="type"
      class="formPanel"
      type="PanelForm"
      :default-data="panelData.data"
      :paths="formPaths"
      @formChange="formPanelChange"
      @InitializationForm="initFormPanel"
      @VerifyMessage="verifyFormPanel"
    />
    <component
      :is="'TableDetailCollection'"
      v-if="tableData.isShow"
      class="objectTable"
      :table-height="type === 'vertical'? 300: 0"
      :table-name="tableName"
      :data-source="tableData.data"
      :type="type"
      :item-info="itemInfo"
      :readonly="buttonsData.data.objreadonly"
      :status="status"
      :tooltip-for-item-table="tooltipForItemTable"
      @tableBeforeData="tableBeforeData"
      @tableDataChange="tableDataChange"
      @tableSelectedRow="tableSelectedRow"
      @tableVerifyMessage="tableVerifyMessage"
    />
  </div>
</template>

<script>
  import Vue from 'vue';
  import router from '../__config__/router.config';
  import tableDetailCollection from './TableDetailCollection';
  import singleObjectButtons from './SingleObjectButtons';
  import compositeForm from './CompositeForm';
  import horizontalMixins from '../__config__/mixins/horizontalTableDetail';
  import verticalMixins from '../__config__/mixins/verticalTableDetail';
  import getModuleName from '../__utils__/getModuleName';
  import { KEEP_SAVE_ITEM_TABLE_MANDATORY } from '../constants/global';

  export default {
    name: 'SingleObjectTabComponent',

    data() {
      return {
        currentParameter: {},
        itemCurrentParameter: {},
      };
    },
    components: {
    },
    props: {
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
      objreadonly: {
        type: Boolean,
      },
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
      tooltipForItemTable: {
        type: Array,
        default: () => []
      }
    },
    watch: {},
    computed: {
      formPaths() {
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
      // this.generateComponent();
    },
    created() {
      this.generateComponent();
    },
    methods: {


      // ...mapActions(getModuleName(), ['performMainTableSaveAction']),
      generateComponent() {
        if (this.type === 'vertical') {
          Vue.component('TableDetailCollection', Vue.extend(Object.assign({ mixins: [verticalMixins()] }, tableDetailCollection)));
          Vue.component('SingleObjectButtons', Vue.extend(Object.assign({ mixins: [verticalMixins()] }, singleObjectButtons)));
          Vue.component('CompositeFormPanel', Vue.extend(Object.assign({ mixins: [verticalMixins()] }, compositeForm)));
          Vue.component('CompositeForm', Vue.extend(Object.assign({ mixins: [verticalMixins()] }, compositeForm)));
        } else {
          Vue.component('TableDetailCollection', Vue.extend(Object.assign({ mixins: [horizontalMixins()] }, tableDetailCollection)));
          Vue.component('SingleObjectButtons', Vue.extend(Object.assign({ mixins: [horizontalMixins()] }, singleObjectButtons)));
          Vue.component('CompositeFormPanel', Vue.extend(Object.assign({ mixins: [horizontalMixins()] }, compositeForm)));
          Vue.component('CompositeForm', Vue.extend(Object.assign({ mixins: [horizontalMixins()] }, compositeForm)));
        }
      },
      formEnter() {
        let savePath = '';
        const { itemId } = router.currentRoute.params;

        if (this.type === 'horizontal') {
          this.$store.state[getModuleName()].tabPanels.forEach((item) => {
            if (item.tablename === this.tableName) {
              if (itemId === 'New') { // 主表新增保存和编辑新增保存
                savePath = item.componentAttribute.buttonsData.data.tabcmd.paths[0];
              } else {
                savePath = item.componentAttribute.buttonsData.data.tabcmd.paths[0];
              }
            }
          });
        } else if (itemId === 'New') { // 主表新增保存和编辑新增保存
          savePath = this.$store.state[getModuleName()].mainFormInfo.buttonsData.data.tabcmd.paths[0];
        } else {
          savePath = this.$store.state[getModuleName()].mainFormInfo.buttonsData.data.tabcmd.paths[1];
        }
        this.determineSaveType(savePath);
      }, // 表单回车触发
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

            if (!this.isreftabs) { // 为0的情况下是没有子表
              // console.log('没有子表');
              if (path) { // 配置path
                // console.log(' 主表新增保存,配置path的', this.dynamic.requestUrlPath);
                this.savaNewTable(type, path, objId);
              } else { // 没有配置path
                this.savaNewTable(type, path, objId);
              }
            }
            if (this.isreftabs) { // 大于0 的情况下是存在子表
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
            if (!this.isreftabs) { // 为0的情况下是没有子表
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
            if (this.isreftabs) { // 大于0 的情况下是存在子表
              const objId = itemId;
              const sataType = 'itemSave';
              const enter = 'enterSave';
              if (savePath) { // 配置path
                this.savaNewTable(type, path, objId, itemName, itemCurrentParameter, sataType, enter);

                // this.savaNewTable(type, path, objId, itemName, itemCurrentParameter);
              } else { // 没有配置path
                this.savaNewTable(type, path, objId, itemName, itemCurrentParameter);
              }
            }
          }
        }
      },
      savaNewTable(type, path, objId, itemName, itemCurrentParameter, sataType, enter) { // 主表新增保存方法
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
          this.$store.dispatch(`${getModuleName()}/performMainTableSaveAction`, { parame, resolve, reject });
        });

        // this.performMainTableSaveAction(parame);
        this.$store.commit(`${getModuleName()}/updateChangeData`, { tableName: this.tableName, value: {} });
        promise.then(() => {
          const { tableId, itemId } = this.$route.params;
          const { tablename, refcolid } = this.itemInfo;
          let id = '';
          if (this.$store.state[getModuleName()].buttonsData.newMainTableSaveData) {
            id = this.$store.state[getModuleName()].buttonsData.newMainTableSaveData.objId;
          } else {
            id = itemId;
          }
          const message = this.$store.state[getModuleName()].buttonsData.message;
          // console.log(this.$store.state[getModuleName()].buttonsData);
          // const objIdSave = this.$store.state[getModuleName()].buttonsData.newMainTableSaveData.objId ? this.$store.state[getModuleName()].buttonsData.newMainTableSaveData.objId : itemId;
          if (this.type === 'horizontal') {
            this.$store.dispatch(`${getModuleName()}/getObjectTableItemForTableData`, {
              table: tablename, objid: itemId, refcolid, searchdata: { column_include_uicontroller: true }
            });
            this.$store.dispatch(`${getModuleName()}/getInputForitemForChildTableForm`, { table: tablename });
            // this.$store.dispatch(`${getModuleName()}/getObjectTabForChildTableButtons`, { maintable: tableName, table: tableName, objid: itemId });

            // this.$store.dispatch(`${getModuleName()}/getObjectTableItemForTableData`, {
            //   table: tablename, objid: itemId, refcolid, searchdata: { column_include_uicontroller: true }
            // });
          } else if (itemId === 'New') {
            this.$store.dispatch(`${getModuleName()}/getObjectForMainTableForm`, { table: tableName, objid: id });
            this.$store.dispatch(`${getModuleName()}/getObjectTabForMainTable`, { table: tableName, objid: id });
          } else {
            this.$store.dispatch(`${getModuleName()}/getObjectForMainTableForm`, { table: tableName, objid: itemId });
            this.$store.dispatch(`${getModuleName()}/getObjectTabForMainTable`, { table: tableName, objid: itemId });
          }
          this.$Message.success(message);
          // this.getObjectForMainTableForm({ table: this.tableName, objid: this.itemId });
          // this.getObjectTabForMainTable({ table: this.tableName, objid: this.itemId });
          // this.$store.dispatch(`${getModuleName()}/getObjectTableItemForTableData`, {
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
        });
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
                const addInfo = this.$store.state[getModuleName()].updateData[this.tableName].itemCurrentParameter.add[this.itemName];
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
          Object.keys(this.$store.state[getModuleName()].updateData).reduce((obj, current) => { // 获取store储存的新增修改保存需要的参数信息
            if (current === this.tableName) {
              this.itemCurrentParameter = this.$store.state[getModuleName()].updateData[current];
            }
            return obj;
          }, {});
        }
        Object.keys(this.$store.state[getModuleName()].updateData).reduce((obj, current) => { // 获取store储存的新增修改保存需要的参数信息
          const { tableName } = router.currentRoute.params;
          if (current === tableName) {
            this.currentParameter = this.$store.state[getModuleName()].updateData[current];
          }
          return obj;
        }, {});
      },
      formChange(val, changeVal) {
        const { tableName } = this;
        const { itemId } = this.$route.params;
        const obj = {};
        obj[tableName] = val;
        this.$store.commit(`${getModuleName()}/updateChangeData`, { tableName, value: changeVal });
        if (itemId === 'New') {
          this.$store.commit(`${getModuleName()}/updateAddData`, { tableName, value: obj });
        } else {
          this.$store.commit(`${getModuleName()}/updateModifyData`, { tableName, value: obj });
        }
      },
      initForm(val) {
        const { tableName } = this;
        const { itemId } = this.$route.params;
        const obj = {};
        obj[tableName] = val;
        if (itemId === 'New') {
          this.$store.commit(`${getModuleName()}/updateAddData`, { tableName, value: obj });
        }
        this.$store.commit(`${getModuleName()}/updateDefaultData`, { tableName, value: obj });
      },
      verifyForm(data) {
        const { tableName } = this;
        this.$store.commit(`${getModuleName()}/updateCheckedInfoData`, { tableName, value: data });
      },
      verifyFormPanel(data) {
        const { tableName } = this;
        this.$store.commit(`${getModuleName()}/updateCheckedInfoData`, { tableName, value: data });
      },
      formPanelChange(val, changeVal) {
        const { tableName } = this;
        const { itemId } = this.$route.params;
        const obj = {};
        obj[tableName] = val;
        this.$store.commit(`${getModuleName()}/updateChangeData`, { tableName, value: changeVal });
        if (itemId === 'New') {
          this.$store.commit(`${getModuleName()}/updateAddData`, { tableName, value: obj });
        } else {
          this.$store.commit(`${getModuleName()}/updateModifyData`, { tableName, value: obj });
        }
      },
      initFormPanel(val) {
        const { tableName } = this;
        const obj = {};
        obj[tableName] = val;
        const { itemId } = this.$route.params;
        if (itemId === 'New') {
          this.$store.commit(`${getModuleName()}/updateAddData`, { tableName, value: obj });
        }
        this.$store.commit(`${getModuleName()}/updateDefaultData`, { tableName, value: obj });
      },
      tableBeforeData(data) {
        const { tableName } = this;
        this.$store.commit(`${getModuleName()}/updateDefaultData`, { tableName, value: data });
      },
      tableDataChange(data) {
        const { tableName } = this;
        const { itemId } = this.$route.params;
        if (itemId === 'New') {
          this.$store.commit(`${getModuleName()}/updateAddData`, { tableName, value: data });
        } else {
          this.$store.commit(`${getModuleName()}/updateModifyData`, { tableName, value: data });
        }
      },
      tableSelectedRow(data) {
        const { tableName } = this;
        this.$store.commit(`${getModuleName()}/updateDeleteData`, { tableName, value: data });
      },
      tableVerifyMessage(data) {
        const { tableName } = this;
        this.$store.commit(`${getModuleName()}/updateCheckedInfoData`, { tableName, value: data });
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
      overflow-y: auto;
    }
    .objectTable {
    }
  }
</style>
