
import { mapActions, mapMutations, mapState } from 'vuex';
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
        'updateAddDefaultData',
        'updateAddData',
        'updateDeleteData',
        'updateObjTabActionSlientConfirm',
        'updateTableSearchData',
        'updateRefreshButton',
        'updateButtonsDataForCustomization'
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
