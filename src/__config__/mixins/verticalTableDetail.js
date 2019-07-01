import { mapState, mapActions, mapMutations } from 'vuex';
import getComponentName from '../../__utils__/getModuleName';
import store from '../store.config';

export default () => ({
  mounted() {
    this.moduleComponentName = getComponentName();
  },
  computed: {
    ...mapState('global', {
      keepAliveLists: ({ keepAliveLists }) => keepAliveLists
    }),
    ...mapState(getComponentName(), {
      buttonsData: ({ buttonsData }) => buttonsData,
      mainFormInfo: ({ ...mainFormInfo }) => mainFormInfo.mainFormInfo,
      tabPanel: ({ tabPanels }) => tabPanels,
      tabCurrentIndex: ({ tabCurrentIndex }) => tabCurrentIndex,
      updateData: ({ updateData }) => updateData,
      tablePageInfo: ({ ...tablePageInfo }) => tablePageInfo.tablePageInfo,
      copy: ({ copy }) => copy,
      pageInfo: ({ pageInfo }) => pageInfo,
      objTabActionSlientConfirmData: ({ objTabActionSlientConfirmData }) => objTabActionSlientConfirmData,
      defaultDataForCopy: ({ defaultDataForCopy }) => defaultDataForCopy,
      tooltipForItem: ({ tooltipForItemTable }) => tooltipForItemTable,
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
        'updateAddData',
        'updateModifyData',
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
        'updateObjTabActionSlientConfirm'
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
