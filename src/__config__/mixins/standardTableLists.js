import { mapState, mapActions, mapMutations } from 'vuex';
import router from '../router.config';
import {
  isCommonTable, STANDARD_TABLE_COMPONENT_PREFIX, STANDARD_COMMONTABLE_COMPONENT_PREFIX, MODULE_COMPONENT_NAME, INSTANCE_ROUTE, INSTANCE_ROUTE_QUERY, customizeMixins
} from '../../constants/global';
import store from '../store.config';


const getComponentName = () => {
  const { tableName, tableId } = router.currentRoute.params;
  if (router.currentRoute.meta.routePrefix === '/SYSTEM/COMMONTABLE') {
    return `${STANDARD_COMMONTABLE_COMPONENT_PREFIX}.${tableName}.${tableId}`;
  } if (router.currentRoute.meta.routePrefix === '/SYSTEM/TABLE') {
    return `${STANDARD_TABLE_COMPONENT_PREFIX}.${tableName}.${tableId}`;
  }
  return null;
};

// const getFullPath = () => router.currentRoute.fullPath;

export default () => ({
  provide: {
    [MODULE_COMPONENT_NAME]: getComponentName(),
    [INSTANCE_ROUTE]: router.currentRoute.fullPath,
    [INSTANCE_ROUTE_QUERY]: router.currentRoute.params,
  },
  // mixins: [customizeMixins().standardTableListsCustomize ? customizeMixins().standardTableListsCustomize : false],
  data() {
    return {
      noMounted: true, // 进入单对象会同时触发mounted与actived两个生命周期，因此无法判断是否在切换tab
    };
  },
  created() {
    this.noMounted = false;
    this[MODULE_COMPONENT_NAME] = getComponentName();
    this[INSTANCE_ROUTE] = router.currentRoute.fullPath;
    this[INSTANCE_ROUTE_QUERY] = router.currentRoute.params;
  },
  mounted() {
    
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
        'updataSelectIdArr',
        'updateTableData',
        'updatestopOnRowDoubleClickData',
        'updataIsBig',
        'updateTabParam',
        'resetTabParam',
        'filterButtonsForDisable',
        'resetButtonsStatus',
        'updateFormAssignData'
        
      ]),
  },
  computed: {
    ...mapState(getComponentName(), {
      ag: ({ ag, userConfigForAgTable }) => {
        // 处理标准表格的隐藏列逻辑
        const data = JSON.parse(JSON.stringify(ag));
        if (isCommonTable() && userConfigForAgTable && userConfigForAgTable.hideColumn && data.datas.tabth) {
          userConfigForAgTable.hideColumn.split(',').every((item) => {
            data.datas.tabth = data.datas.tabth.filter((temp) => {
              if (temp.colname !== item) {
                return true;
              }
              return false;
            });
            return true;
          });
        }

        // 列表字段支持字段合并样式展示

        if (data.key_group && data.key_group.length > 0 && data.datas.tabth) {
          data.key_group.map((item) => {
            data.datas.tabth.map((temp) => {
              if (item.target === temp.colname) {
                temp.key_group = item.source;
              }
              return temp;
            });
            return item;
          });
        }

        if(data.pinnedColumns) {
          data.datas.pinnedColumns = data.pinnedColumns
        }
        return data;
      },
      userConfigForAgTable: ({ userConfigForAgTable }) => userConfigForAgTable,
      pageAttribute: ({ ag }) => ({
        current: (ag.datas.start + ag.datas.defaultrange) / ag.datas.defaultrange || 1,
        total: ag.datas.totalRowCount || 0,
        'page-size-opts': ag.datas.selectrange || [10, 25, 50, 100],
        'show-elevator': true,
        'show-sizer': true,
        'show-total': true,
        'page-size': ag.datas.defaultrange || 10
      }),
      formItems: ({ formItems }) => formItems,
      buttons: ({ buttons }) => buttons,
      webconf: ({ webconf }) => webconf, // 局部webconf，用于控制普通表格
      webConf: ({ webConf }) => webConf, // 列表界面webConf
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
