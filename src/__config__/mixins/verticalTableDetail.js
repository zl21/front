import { mapState, mapActions, mapMutations } from 'vuex';
import getComponentName from '../../__utils__/getModuleName';
import store from '../store.config';
import router from '../router.config';
import {
  MODULE_COMPONENT_NAME, INSTANCE_ROUTE, HAS_BEEN_DESTROYED_MODULE, INSTANCE_ROUTE_QUERY, customizeMixins
} from '../../constants/global';
import { updateSessionObject } from '../../__utils__/sessionStorage';

export default () => ({
  provide: {
    [MODULE_COMPONENT_NAME]: getComponentName(),
    [INSTANCE_ROUTE]: router.currentRoute.fullPath,
    [INSTANCE_ROUTE_QUERY]: router.currentRoute.params,
  },
  // mixins: [customizeMixins().verticalTableDetailCustomize ? customizeMixins().verticalTableDetailCustomize : false],
  data() {
    return {
      noMounted: true, // 进入单对象会同时触发mounted与actived两个生命周期，因此无法判断是否在切换tab
    };
  },
  
  mounted() {
    this.noMounted = false;
  },
  created() {
    this[MODULE_COMPONENT_NAME] = getComponentName();
    this[INSTANCE_ROUTE] = router.currentRoute.fullPath;
    this[INSTANCE_ROUTE_QUERY] = router.currentRoute.params;
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
        'getObjTabActionSlientConfirm',
        'getActionDataForButtons'
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
        'changeFormData',
        'updateButtonGetActionData',
        'updataClickSave',
        'testUpdataValue',
        'updataVerifyRequiredInformation',
        'isRequestUpdata',
        'emptyTestData',
        'updateScrollPosition'
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
  destroyed() {
    if (window.Vue) {
      if (this.$options.isKeepAliveModel) {
        delete window.Vue.options.components[this.$options._componentTag];
      }
    }
  }
});
