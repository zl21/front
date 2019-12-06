import { mapState, mapActions, mapMutations } from 'vuex';
import getComponentName from '../../__utils__/getModuleName';
import store from '../store.config';
import router from '../router.config';
import { MODULE_COMPONENT_NAME, INSTANCE_ROUTE } from '../../constants/global';

export default () => ({
  provide: {
    [MODULE_COMPONENT_NAME]: getComponentName(),
    [INSTANCE_ROUTE]: router.currentRoute.fullPath
  },
  created() {
    this[MODULE_COMPONENT_NAME] = getComponentName();
  },
  activated() {
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
      globalLoading: ({ globalLoading }) => globalLoading,
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
        'seleteAddData'
        // 'resetFormReadOnlyAttribute'

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
  }
});
