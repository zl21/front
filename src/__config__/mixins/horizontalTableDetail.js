
import { mapActions, mapMutations, mapState } from 'vuex';
import getComponentName from '../../__utils__/getModuleName';
import store from '../store.config';
import router from '../router.config';
import {
  MODULE_COMPONENT_NAME, INSTANCE_ROUTE, HAS_BEEN_DESTROYED_MODULE, INSTANCE_ROUTE_QUERY 
} from '../../constants/global';
import { updateSessionObject } from '../../__utils__/sessionStorage';

export default () => ({
  provide: {
    [MODULE_COMPONENT_NAME]: getComponentName(),
    [INSTANCE_ROUTE]: router.currentRoute.fullPath,
    [INSTANCE_ROUTE_QUERY]: router.currentRoute.params,

  },
  data() {
    return {
      noMounted: true, // 进入单对象会同时触发mounted与actived两个生命周期，因此无法判断是否在切换tab
    };
  },
  created() {
    this[MODULE_COMPONENT_NAME] = getComponentName();
    this[INSTANCE_ROUTE] = router.currentRoute.fullPath;
    this[INSTANCE_ROUTE_QUERY] = router.currentRoute.params;
    this.noMounted = false;
  },
  mounted() {
   
  },
  activated() {
    if (this.noMounted) { // 因进入单对象界面会触发activated生命周期，以下操作为切换tab时的处理逻辑，第一次加载组件不需要执行以下操作，故在mounted里加标示区分
      const currentTableName = this.$router.currentRoute.params.tableName;
      const tpl = document.querySelector(`#${currentTableName}-loading`);
      if (tpl) {
        if (this.currentLoading && this.currentLoading.indexOf(currentTableName) !== -1) {
          tpl.remove();
          this.deleteLoading(currentTableName);
        }
      }
    }
    this.noMounted = true;
  },
  computed: {
    ...mapState(getComponentName(), {
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
      childTableNames: ({ tabPanels }) => tabPanels.reduce((acc, cur, idx) => {
        if (idx > 0) {
          acc.push({ tableName: cur.tablename });
        }
        return acc;
      }, []),
    })
  },
  methods: {
    ...mapActions(getComponentName(),
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
    ...mapMutations(getComponentName(),
      [
        'updateTabCurrentIndex',
        'updateChangeData',
        'changeCopy',
        'copyDefaultData',
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
        'updatavVerifyRequiredInformation'
      ]),
  },
  beforeDestroy() {
    try {
      if (this.$options.isKeepAliveModel) {
        store.unregisterModule(this.moduleComponentName);
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
