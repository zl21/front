import { mapState, mapActions, mapMutations } from 'vuex';
import getComponentName from '../../__utils__/getModuleName';
// import store from '../store.config';
// import router from '../router.config';
import {
  MODULE_COMPONENT_NAME, INSTANCE_ROUTE, HAS_BEEN_DESTROYED_MODULE, INSTANCE_ROUTE_QUERY, customizeMixins
} from '../../constants/global';
import { updateSessionObject } from '../../__utils__/sessionStorage';
import minx from '../../__component__/tableDetailjs/mixin';

export default () => ({
  provide: {
    [MODULE_COMPONENT_NAME]: getComponentName(),
    [INSTANCE_ROUTE]: window.vm.$router.currentRoute.fullPath,
    [INSTANCE_ROUTE_QUERY]: window.vm.$router.currentRoute.params,
  },
  // mixins: [customizeMixins().verticalTableDetailCustomize ? customizeMixins().verticalTableDetailCustomize : false],
  data() {
    return {};
  },
  mixins:[minx],
  mounted() {
  },
  created() {
    if (!this[MODULE_COMPONENT_NAME]) {
      this[MODULE_COMPONENT_NAME] = getComponentName();
    }
    if (!this[INSTANCE_ROUTE]) {
      this[INSTANCE_ROUTE] = window.vm.$router.currentRoute.fullPath;
    }
    if (!this[INSTANCE_ROUTE_QUERY]) {
      this[INSTANCE_ROUTE_QUERY] = window.vm.$router.currentRoute.params;
    }
  },
  computed: {
    ...mapState('global', {
      keepAliveLists: ({ keepAliveLists }) => keepAliveLists,
      activeTab: ({ activeTab }) => activeTab,// 当前表基本数据，包含路由信息，表名，ID等
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
      WebConf:({WebConf}) => WebConf,
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
        // 'copyDefaultData',
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
        'updateScrollPosition',
        'updateLabelData',
        'updateChildTabPanels'
        // 'resetFormReadOnlyAttribute'

      ]),
    ...mapMutations('global', ['decreasekeepAliveLists', 'increaseKeepAliveLists']),
  },
  beforeDestroy() {
    try {
      if (this.$options.isKeepAliveModel) {
        // this.$el = null;
        window.vm.$store.unregisterModule(this.moduleComponentName);
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
