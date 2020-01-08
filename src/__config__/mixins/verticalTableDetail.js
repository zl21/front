import { mapState, mapActions, mapMutations } from 'vuex';
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
    ...mapState('global', {
      keepAliveLists: ({ keepAliveLists }) => keepAliveLists
    }),
    ...mapState(getComponentName(), {
      childReadonly: ({ childTableReadonly }) => childTableReadonly,
      buttonsData: ({ buttonsData }) => buttonsData,
      mainFormInfo: ({ mainFormInfo }) => mainFormInfo,
      tabPanel: ({ tabPanels }) => tabPanels,
      tabCurrentIndex: ({ tabCurrentIndex }) => tabCurrentIndex,
      updateData: ({ updateData }) => updateData,
      tablePageInfo: ({ ...tablePageInfo }) => tablePageInfo.tablePageInfo,
      copy: ({ copy }) => copy,
      pageInfo: ({ pageInfo }) => pageInfo,
      objTabActionSlientConfirmData: ({ objTabActionSlientConfirmData }) => objTabActionSlientConfirmData,
      defaultDataForCopy: ({ defaultDataForCopy }) => defaultDataForCopy,
      instanceId: ({ instanceId }) => instanceId,
      tooltipForItem: ({ tooltipForItemTable }) => tooltipForItemTable,
      jflowPluginDataArray: ({ jflowPluginDataArray }) => jflowPluginDataArray,
      refreshButton: ({ refreshButton }) => refreshButton,
      jflowWaterMark: ({ jflowWaterMark }) => jflowWaterMark,
      defaultButtonData: ({ defaultButtonData }) => defaultButtonData,
      globalLoading: ({ globalLoading }) => globalLoading,
      testData: ({ testData }) => testData,
      tempStorage: ({ tempStorage }) => tempStorage,
      WebConf: ({ WebConf }) => WebConf,
      childTableNames: ({ tabPanels }) => tabPanels.reduce((acc, cur) => {
        acc.push({ tableName: cur.tablename });
        return acc;
      }, []),
    }),
  },
  methods: {
    ...mapActions(getComponentName(),
      [
        'getObjectForMainTableForm',
        'getObjectTabForMainTable',
        'getObjectTableItemForTableData',
        'getFormDataForRefTable',
        'getObjectTabForRefTable',
        'getItemObjForChildTableForm',
        'performMainTableSaveAction',
        'performMainTableDeleteAction',
        'getInputForitemForChildTableForm',
        'getObjectTrySubmit',
        'getObjectTryUnSubmit',
        'getObjectTryInvalid',
        'getExportQueryForButtons',
        'getObjTabActionSlientConfirm'
      ]),
    ...mapMutations(getComponentName(),
      [
        'updateTabCurrentIndex',
        'updateDefaultData',
        'updateDefaultLabelData',
        'updateAddData',
        'updateModifyData',
        'updateModifyLabelData',
        'updateDeleteData',
        'updateChangeData',
        'updateCheckedInfoData',
        'updatePanelData',
        'changeCopy',
        'changeUpdateDataForForm',
        'savaCopyData',
        'copyDefaultData',
        'updateUnSubmitData',
        'updateTableListForRefTable',
        'updateTablePageInfo',
        'updateAddDefaultData',
        'updateObjTabActionSlientConfirm',
        'updateTableSearchData',
        'updateRefreshButton',
        'updataGlobalLoading',
        'seleteAddData',
        'emptyChangeData',
        // 'resetFormReadOnlyAttribute'

      ]),
    ...mapMutations('global', ['decreasekeepAliveLists', 'increaseKeepAliveLists']),
  },
  beforeDestroy() {
    try {
      if (this.$options.isKeepAliveModel) {
        // this.$el = null;
        store.unregisterModule(this.moduleComponentName);
      }
      // const components = window.Vue.options.components;
      // Object.keys(components).forEach((compontent) => {
      //   if (compontent.indexOf(this.moduleComponentName) > -1) {
      //     delete components[compontent];
      //   }
      // });
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
 
});
