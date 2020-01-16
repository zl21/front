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

// const getFullPath = () => router.currentRoute.fullPath;

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
  mounted() {
    this.noMounted = false;
    this[MODULE_COMPONENT_NAME] = getComponentName();
    this[INSTANCE_ROUTE] = router.currentRoute.fullPath;
    this[INSTANCE_ROUTE_QUERY] = router.currentRoute.params;
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
    if (this.noMounted) { // 因进入单对象界面会触发activated生命周期，以下操作为切换tab时的处理逻辑，第一次加载组件不需要执行以下操作，故在mounted里加标示区分
      const currentTableName = this.$router.currentRoute.params.tableName;
      const tpl = document.querySelector(`#${currentTableName}-loading`);
      if (tpl) {
        if (store.state.global.currentLoading.indexOf(currentTableName) !== -1) {
          tpl.remove();
          store.commit('global/deleteLoading', currentTableName);
        }
      }
    }
    this.noMounted = true;
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
  destroyed() {
    if (window.Vue) {
      if (this.$options.isKeepAliveModel) {
        delete window.Vue.options.components[this.$options._componentTag];
      }
    }
  }
});
