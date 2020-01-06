import { mapState, mapActions, mapMutations } from 'vuex';
import router from '../router.config';
import {
  STANDARD_TABLE_COMPONENT_PREFIX, MODULE_COMPONENT_NAME, INSTANCE_ROUTE, INSTANCE_ROUTE_QUERY 
} from '../../constants/global';
import store from '../store.config';

const getComponentName = () => {
  const { tableName, tableId } = router.currentRoute.params;
  return `${STANDARD_TABLE_COMPONENT_PREFIX}.${tableName}.${tableId}`;
};


export default () => ({
  provide: {
    [MODULE_COMPONENT_NAME]: getComponentName(),
    [INSTANCE_ROUTE]: router.currentRoute.fullPath,
    [INSTANCE_ROUTE_QUERY]: router.currentRoute.params,
  },
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
        'updateUserConfig',
        'getActionDataForButtons'
      ]),
    ...mapMutations(getComponentName(),
      [
        'updateFailInfo',
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
        'setAgTableErrorMessage',
        'setPrintValueForButtons',
      
        
      ]),
  },
  computed: {
    ...mapState(getComponentName(), {
      ag: ({ ag }) => ag,
      userConfigForAgTable: ({ userConfigForAgTable }) => userConfigForAgTable,
      pageAttribute: ({ ag }) => ({
        current: (ag.datas.start + ag.datas.defaultrange) / ag.datas.defaultrange || 1,
        total: ag.datas.totalRowCount || 0,
        'page-size-opts': ag.datas.selectrange || [10, 25, 50, 100],
        'show-elevator': true,
        'show-sizer': true,
        'show-total': true
      }),
      formItems: ({ formItems }) => formItems,
      buttons: ({ buttons }) => buttons,
      webconf: ({ webconf }) => webconf
    }),
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
