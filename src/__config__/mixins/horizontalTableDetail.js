
import { mapActions, mapMutations, mapState } from 'vuex';
// import store from '../window.vm.$store.config';
// import router from '../window.vm.$router.config';
import {
  MODULE_COMPONENT_NAME, INSTANCE_ROUTE, HAS_BEEN_DESTROYED_MODULE, INSTANCE_ROUTE_QUERY 
} from '../../constants/global';
import { updateSessionObject } from '../../__utils__/sessionStorage';
import minx from '../../__component__/tableDetailjs/mixin';
export default (modulename) => {
  const componentName = modulename;
  return ({
    provide: {
      [MODULE_COMPONENT_NAME]: componentName,
      [INSTANCE_ROUTE]: window.vm.$router.currentRoute.fullPath,
      [INSTANCE_ROUTE_QUERY]: window.vm.$router.currentRoute.params,
  
    },
    // mixins: [customizeMixins().horizontalTableDetailCustomize ? customizeMixins().horizontalTableDetailCustomize : false],
    data() {
      return {
      };
    },
    mixins:[minx],
    created() {
      if (!this[MODULE_COMPONENT_NAME]) {
        this[MODULE_COMPONENT_NAME] = componentName;
      }
      if (!this[INSTANCE_ROUTE]) {
        this[INSTANCE_ROUTE] = window.vm.$router.currentRoute.fullPath;
      }
      if (!this[INSTANCE_ROUTE_QUERY]) {
        this[INSTANCE_ROUTE_QUERY] = window.vm.$router.currentRoute.params;
      }
    },
    mounted() {
     
    },
    computed: {
      ...mapState('global', {
        activeTab: ({ activeTab }) => activeTab,// 当前表基本数据，包含路由信息，表名，ID等
      }),
      ...mapState(componentName, {
        childReadonly: ({ childTableReadonly }) => childTableReadonly,
        buttonsData: ({ buttonsData }) => buttonsData,
        tabPanel: ({ ...tabPanels }) => tabPanels.tabPanels,
        tabCurrentIndex: ({ tabCurrentIndex }) => tabCurrentIndex,
        updateData: ({ ...updateData }) => updateData.updateData,
        tablePageInfo: ({ ...tablePageInfo }) => tablePageInfo.tablePageInfo,
        copy: ({ copy }) => copy,
        pageInfo: ({ pageInfo }) => pageInfo,
        objTabActionSlientConfirmData: ({ objTabActionSlientConfirmData }) => objTabActionSlientConfirmData,
        defaultDataForCopy: ({ defaultDataForCopy }) => defaultDataForCopy,
        tooltipForItem: ({ tooltipForItemTable }) => tooltipForItemTable,
        copyDataForReadOnly: ({ copyDataForReadOnly }) => copyDataForReadOnly,
        instanceId: ({ instanceId }) => instanceId,
        refreshButton: ({ refreshButton }) => refreshButton,
        defaultButtonData: ({ defaultButtonData }) => defaultButtonData,
        globalLoading: ({ globalLoading }) => globalLoading,
        testData: ({ testData }) => testData,
        tempStorage: ({ tempStorage }) => tempStorage,
        WebConf: ({ WebConf }) => WebConf,
        ExeActionDataForComponent: ({ ExeActionDataForComponent }) => ExeActionDataForComponent,
        itemObjId: ({ itemObjId }) => itemObjId,
        isHideTempStorage: ({ isHideTempStorage }) => isHideTempStorage,
        saveInfo: ({ saveInfo }) => saveInfo,
        isRequest: ({ isRequest }) => isRequest,
        WebConf:({WebConf}) => WebConf,
        childTableNames: ({ tabPanels }) => tabPanels.reduce((acc, cur, idx) => {
          if (idx > 0) {
            acc.push({ tableName: cur.tablename });
          }
          return acc;
        }, []),
      }),
    },
    methods: {
      ...mapActions(componentName,
        [
          'getObjectTabForMainTable',
          'getObjectForMainTableForm',
          'getObjectTabForChildTableButtons',
          'getInputForitemForChildTableForm',
          'getItemObjForChildTableForm',
          'getObjectTableItemForTableData',
          'performMainTableSaveAction',
          'performMainTableDeleteAction',
          'getExportQueryForButtons',
          'getObjTabActionSlientConfirm',
          'getObjectTrySubmit',
          'getObjectTryUnSubmit',
          'getObjectTryInvalid',
          'getActionDataForButtons',
        ]),
      ...mapMutations(componentName,
        [
          'updateTabCurrentIndex',
          'updateChangeData',
          'changeCopy',
          // 'copyDefaultData',
          'savaCopyData',
          'updateFormDataForRefshow',
          'updateCopyData',
          'changeFormDataForCopy',
          'updateTableData',
          'updateTablePageInfo',
          'updateModifyData',
          'updateModifyLabelData',
          'updateAddDefaultData',
          'updateAddData',
          'updateDeleteData',
          'updateObjTabActionSlientConfirm',
          'updateTableSearchData',
          'updateRefreshButton',
          'updateButtonsDataForCustomization',
          'updataGlobalLoading',
          'seleteAddData',
          'emptyChangeData',
          'updateButtonGetActionData',
          'updataClickSave',
          'testUpdataValue',
          'updataVerifyRequiredInformation',
          'isRequestUpdata',
          'emptyTestData',
          'updateLabelData',
          'updateChildTabPanels'

        ]),
    },
    beforeDestroy() {
      try {
        if (this.$options.isKeepAliveModel) {
          window.vm.$store.unregisterModule(this.moduleComponentName);
        }
      } catch (e) {
        console.log(e);
      }
    },
    deactivated() {
      if (this.keepAliveLists && this.keepAliveLists.length > 0 && this.keepAliveLists.indexOf(this[MODULE_COMPONENT_NAME]) === -1) {
        if (this.$options.isKeepAliveModel) {
          updateSessionObject(HAS_BEEN_DESTROYED_MODULE, { k: this[MODULE_COMPONENT_NAME], v: true });
          this.$destroy();
        }
      }
    },
    destroyed() {
      if (window.Vue) {
        if (this.$options.isKeepAliveModel) {
          delete window.Vue.options.components[this.$options._componentTag];
        }
      }
    }
  });
};
