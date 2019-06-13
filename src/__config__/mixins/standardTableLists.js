import { mapState, mapActions, mapMutations } from 'vuex';
import router from '../router.config';
import { STANDARD_TABLE_COMPONENT_PREFIX } from '../../constants/global';
import store from '../store.config';

const getComponentName = () => {
  const { tableName, tableId } = router.currentRoute.params;
  return `${STANDARD_TABLE_COMPONENT_PREFIX}.${tableName}.${tableId}`;
};


export default () => ({
  mounted() {
    this.moduleComponentName = getComponentName();
  },
  methods: {
    ...mapActions(getComponentName(),
      [
        'setColHide',
        'setColPin',
        'setColPosition',
        'getQueryListForAg',
        'getTableQueryForForm',
        'getExportQueryForButtons',
        'getBatchDeleteForButtons',
        'getExeActionDataForButtons',
        'getToFavoriteDataForButtons',
        'getRemoveFavoriteDataForButtons',
        'importGetUploadParameters',
        'importGetUploadParametersForButtons',
        'batchVoidForButtons',
        'batchSubmitForButtons',
        'batchUnSubmitForButtons',
        'updateUserConfig'
      ]),
    ...mapMutations(getComponentName(),
      [
        'updateAgConfig',
        'updateFormData',
        'updateFormLists',
        'updateDefaultButtonGroupData',
        'deleteTableData',
        'onSelectionChangedAssignment',
        'updateButtonExeActionData',
        'collectTablelist',
        'updateButtonSetFavoriteData',
        'setActiveTabActionValue',
        'setImportDialogTitle',
        'setErrorModalValue',
        'updateButtonbatchSubmitData',
        'updateButtonbatchUnSubmitData',
        'setActionDialog',
        'closeImportDialog',
        'setAgTableErrorMessage'
      
        
      ]),
  },
  computed: {
    ...mapState(getComponentName(), {
      ag: ({ ag }) => ag,
      hideColumn: ({ hideColumn }) => hideColumn,
      colPosition: ({ colPosition }) => colPosition,
      fixedColumn: ({ fixedColumn }) => fixedColumn,
      pageAttribute: ({ ag }) => ({
        current: (ag.datas.start + ag.datas.defaultrange) / ag.datas.defaultrange || 1,
        total: ag.datas.totalRowCount || 0,
        'page-size-opts': ag.datas.selectrange || [10, 25, 50, 100],
        'show-elevator': true,
        'show-sizer': true,
        'show-total': true
      }),
      formItems: ({ formItems }) => formItems,
      buttons: ({ buttons }) => buttons
    }),
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
