
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
  created() {
    this[MODULE_COMPONENT_NAME] = getComponentName();
    this[INSTANCE_ROUTE] = router.currentRoute.fullPath;
    this[INSTANCE_ROUTE_QUERY] = router.currentRoute.params;
  },
  activated() {
    const currentTableName = this.$router.currentRoute.params.tableName;
    const tpl = document.querySelector(`#${currentTableName}-loading`);
    if (tpl) {
      if (store.state.global.currentLoading.indexOf(currentTableName) !== -1) {
        tpl.remove();
        store.commit('global/deleteLoading', currentTableName);
      }
    }
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
      jflowPluginDataArray: ({ jflowPluginDataArray }) => jflowPluginDataArray,
      refreshButton: ({ refreshButton }) => refreshButton,
      jflowWaterMark: ({ jflowWaterMark }) => jflowWaterMark,
      defaultButtonData: ({ defaultButtonData }) => defaultButtonData,
      globalLoading: ({ globalLoading }) => globalLoading,
      testData: ({ testData }) => testData,
      tempStorage: ({ tempStorage }) => tempStorage,
      WebConf: ({ WebConf }) => WebConf,
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
        'getObjectTryInvalid'
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
