
<!--suppress ALL -->
<template>
  <div :id=" this.$router.currentRoute.params.tableName"
       :class="classess">
    <!-- oldTree
      <tree
      v-if="isTreeList&&treeShow"
      :current-label="getCurrentLabel"
      :tree-datas="treeConfigData"
      :is-change-tree-config-data="isChangeTreeConfigData"
      @searchClick="searchClick"
      @menuTreeChange="menuTreeChange"
      @changeTreeConfigData="changeTreeConfigData"
    />
     -->
    <div v-if="isTreeList">

      <tree v-show="treeShow"
            ref="tree"
            :tree-datas="treeConfigData"
            @menuTreeChange="menuTreeChange" />
    </div>

    <div v-if="isTreeList"
         class="treeSwitch"
         @click="treeShow = !treeShow">
      <i v-if="!treeShow"
         class="iconfont iconbj_right" />
      <i v-if="treeShow"
         class="iconfont iconbj_left" />
    </div>
    <div :is="slotName"  
         :getVm="getVm"
       >
        <!-- <Button
          id="hideRefresh"
          type="fcdefault"
          @click="b"
        >
          测试按钮
        </Button> -->
        <ButtonGroup slot="list-buttons"
                    ref="R3ButtonGroup"
                    :data-array="buttons.dataArray"
                    :id-array="idArray"
                    @buttonClick="buttonClick"
                    @clearSelectIdArray="clearSelectIdArray" />
        <listsForm slot="list-form"  ref="R3listform"
                  v-if="formItems.defaultFormItemsLists && formItems.defaultFormItemsLists.length > 0"
                  :id="$route.params.tableName"
                  :moduleComponentName='moduleComponentName'
                  :form-item-lists="formItems.defaultFormItemsLists"
                  :default-spread="changeSearchFoldnum.switchValue"
                  :search="true"
                  :listFormTemple="slotTemple ? slotTemple.listForm : ()=>{}"
                  :treeShow="treeShow"
                  :default-column="Number(4)"
                  :search-foldnum="Number(changeSearchFoldnum.queryDisNumber || formItems.searchFoldnum)"
                  @onHandleEnter="searchClickData" />
        <component :is="defined"  slot="list-defind" ></component>           
        <tabBar slot="list-tabBar" ref="R3tabBar"
                v-if="getFilterTable"
                :data="ag.tablequery"
                @tabClick="tabClick" />

        <AgTable ref="agTableElement"
                slot="list-table"
                :columnRenderer="columnRendererHandler"
                :agProcessColumns="agProcessColumns"
                :agProcessRows="agProcessRows"
                :processAgOptions="processAgOptions"
                :moduleComponentName='moduleComponentName'
                :style="agTableElementStyles"
                :page-attribute="pageAttribute"
                :datas="ag.datas"
                :css-status="ag.status4css"
                :legend="ag.status4css"
                :is-filter-table="getFilterTable"
                :user-config-for-ag-table="userConfigForAgTable"
                :on-page-change="getFilterTable?onPageChangeForFilterTable:onPageChange"
                :on-page-size-change="getFilterTable?onPageSizeChangeForFilterTable:onPageSizeChange"
                :on-selection-changed="onSelectionChanged"
                :on-row-double-click="onRowDoubleClick"
                :on-sort-changed="onSortChange"
                :is-big="buttons.isBig"
                :on-column-moved="onColumnMoved"
                :on-column-pinned="onColumnPinned"
                :on-column-visible-changed="onColumnVisibleChanged"
                :on-cell-single-click="onCellSingleClick"
                :is-common-table="commonTable"
                :buttons-data=" buttons.dataArray.waListButtonsConfig.waListButtons"
                :do-table-search="searchClickData"
                @CommonTableCustomizedDialog="commonTableCustomizedDialog"
                @grid-ready="gridReady" />
  </div>
    <!-- <Modal/>//动作定义弹框，已将动作定义弹框和提示弹框整合，此弹框暂时弃用
      v-if="buttons.actionDialog.show"
      v-model="actionModal"
      :mask="true"
      :title="buttons.actionDialog.title"
    >
      <keep-alive
        include
        exclude
      >
        <component :is="dialogComponent" />
      </keep-alive>
    </Modal> -->
    <!-- 导入弹框 -->
    <ImportDialog v-if="buttons.importData.importDialog"
                  :name="buttons.importData.importDialog"
                  :visible="buttons.importData.importDialog"
                  :show-close="true"
                  :title="buttons.importData.importDialogTitle"
                  :tablename="buttons.tableName"
                  :main-id="buttons.tableId"
                  @confirmImport="searchClickData"
                  @closeDialog="closeDialog"
                  @imporSuccess="imporSuccess" />
    <ErrorModal ref="dialogRefs"
                :mask="buttons.dialogConfig.mask"
                :title="buttons.dialogConfig.title"
                :content-text="buttons.dialogConfig.contentText"
                :footer-hide="buttons.dialogConfig.footerHide"
                :confirm="buttons.dialogConfig.confirm"
                @confirmDialog="confirmDialog()" />
    <dialogComponent ref="dialogRef"
                     :popwin-message="popwinMessage"
                     :id-array="buttons.selectIdArr"
                     :select-row-data="buttons.selectArr"
                     :title="dialogComponentNameConfig.title"
                     :obj-tab-action-dialog-config="objTabActionDialogConfig"
                     :mask="dialogComponentNameConfig.mask"
                     :content-text="dialogComponentNameConfig.contentText"
                     :footer-hide="dialogComponentNameConfig.footerHide"
                     :confirm="dialogComponentNameConfig.confirm"
                     :dialog-component-name="dialogComponentName"
                     :isrefrsh="buttons.isrefrsh"
                     @dialogComponentSaveSuccess="dialogComponentSaveSuccess" />
    <!-- 批量 -->
    <modifyDialog v-if="modifyDialogshow"
                  ref="dialogmodify"
                  :title="activeTab.label"
                  @on-oncancle-success="onCancleSuccess"
                  @on-save-success="onSaveSuccess" />
   
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';
import ButtonGroup from './ButtonComponent.vue';
import AgTable from './AgTable.vue';
import FormItemComponent from './FormItemComponent.vue';
import ItemComponent from './ItemComponent.vue';
import buttonmap from '../assets/js/buttonmap';
import dialogComponent from './Dialog.vue';
import ChineseDictionary from '../assets/js/ChineseDictionary';
import ImportDialog from './ImportDialog.vue';
import ErrorModal from './ErrorModal.vue';
import modifyDialog from './ModifyModal.vue';
import tree from './tree.vue';
import slotTemplate from './slot/standardTableList.vue';

import regExp from '../constants/regExp';
import getObjdisType from '../__utils__/getObjdisType';
import {
  Version,
  CUSTOMIZED_MODULE_PREFIX,
  LINK_MODULE_COMPONENT_PREFIX, MODULE_COMPONENT_NAME,
  INSTANCE_ROUTE_QUERY,
  INSTANCE_ROUTE,
  isCommonTable,
  enableActivateSameCustomizePage,
  enableKAQueryDataForUser,
  blockFullOperation,
  isFilterTable,
  listDefaultColumn,
  classFix,
  messageSwitch,
  enableTaskNotice,
  enableAsyncTaskTip,
  enableGateWay,
  asyncTaskScheme
} from '../constants/global';
import network, { getGateway, urlSearchParams} from '../__utils__/network';
import customize from '../__config__/customize.config';
// import router from '../__config__/router.config';
import { getSessionObject, deleteFromSessionObject, updateSessionObject } from '../__utils__/sessionStorage';
import { getUrl, getLabel } from '../__utils__/url';
import { DispatchEvent, R3_EXPORT } from '../__utils__/dispatchEvent';
import getUserenv from '../__utils__/getUserenv';
import { addSearch, querySearch } from '../__utils__/indexedDB';
import { getPinnedColumns } from '../__utils__/tableMethods'
import { isTaskProcessing } from '../__utils__/task-utils'
import tabBar from './tabBar.vue';
import listsForm from './FormComponents/list/listsForm';

export default {
  components: {
    tree,
    ButtonGroup,
    AgTable,
    FormItemComponent,
    ImportDialog,
    ErrorModal,
    modifyDialog,
    dialogComponent,
    tabBar,
    listsForm

  },
  data () {
    return {
      treeSearchData: {}, // 树配置的自定义参数，如有和框架查询接口同参数的字段，则覆盖
      popwinMessage: {},
      TreeChange: true, // 是否是树的点击
      objTabActionDialogConfig: {}, // 自定义按钮配置
      urlArr: ['/p/cs/batchUnSubmit', '/p/cs/batchSubmit', '/p/cs/batchDelete', '/p/cs/batchVoid', '/p/cs/exeAction'],
      tableButtons: [],
      // isChangeTreeConfigData: '',//oldTree
      treeShow: true,
      actionModal: false,
      resetType: false, // 是否是重置的功能
      dialogComponent: null,
      searchData: {
        table: '',
        startIndex: 0,
        // range: 10,
        orderby: undefined
      },
      formItemsLists: [],
      modifyDialogshow: false, // 批量修改弹窗
      formDefaultComplete: false,
      dialogComponentName: null,
      ztreetimer: null, // 树刷新时间判断
      mountedChecked: false, // 页面是否渲染完成
      dialogComponentNameConfig: {
        title: this.$t('feedback.alert'),
        mask: true,
        footerHide: false,
        contentText: '',
        confirm: () => {
        }
      }, // 弹框配置信息
      currentTabValue: {},
      filterTableParam: {},
      defined:'', // 插入的组件
      slotName: '',  // 模板名称
      slotTemple:''  // 模板的slot    
    };
  },
  computed: {
    ...mapState('global', {
      favorite: ({ favorite }) => favorite,
      activeTab: ({ activeTab }) => activeTab,
      serviceIdMap: ({ serviceIdMap }) => serviceIdMap,
      keepAliveLabelMaps: ({ keepAliveLabelMaps }) => keepAliveLabelMaps,
      LinkUrl: ({ LinkUrl }) => LinkUrl,
      exportTasks: ({ exportTasks }) => exportTasks,
      changeSearchFoldnum: ({ changeSearchFoldnum }) => changeSearchFoldnum,
      userInfo: ({ userInfo }) => userInfo,
    }),
    classess: () => `${classFix}standarTableListContent`,
    getFilterTable () {
      if (isFilterTable() && this.ag.tablequery.open) {
        return true;
      }
      return false;
    },
    getCurrentLabel () {
      return this.keepAliveLabelMaps[this[MODULE_COMPONENT_NAME]];
    },
    formLists () {
      return []
      // return this.refactoringData(
      //   this.formItems.defaultFormItemsLists.concat([])
      // );
    },
    isCommonTable () {
      return isCommonTable();
    },
    commonTable () {
      if (this.$router.currentRoute.meta.routePrefix === '/SYSTEM/COMMONTABLE') {
        return true;
      }
      return this.isCommonTable || this.webconf.commonTable;
      //  (router.currentRoute.meta.routePrefix === '/SYSTEM/TABLE')
      // return false;
    },
    agTableElementStyles () {
      if (this.formItemsLists.length === 0) {
        return {
          paddingTop: 0
        };
      }
      return {};
    },
    idArray () {
      return this.buttons.selectIdArr;
    },
    isTreeList () {
      const treeQuery = this.$router.currentRoute.query;
      if (treeQuery.isTreeTable) {
        return true;
      }
      return false;
    },
    treeConfigData () {
      const treeQuery = this.$router.currentRoute.query;
      if (treeQuery.isTreeTable || window.isTree) {
        const { tableName } = this.$router.currentRoute.params;
        let { externalTreeDatas} = window.ProjectConfig || {};
        if ( externalTreeDatas && externalTreeDatas[tableName]) {
          return externalTreeDatas [tableName]();
        }
        // if (treeData) {
        //   if (treeData[tableName]) {
        //     return treeData[tableName]();
        //   }
        //   return null;
        // }
      }

      return async () => { return {} };
    },
    defaultColumn () { // 获取配置列表一行几列数据
      return listDefaultColumn();
    }
  },
  watch: {
    ag: {
      handler () {
        // 监听ag数据 yan触发树的数据变化
        // if (!this.mountedChecked) {
        //   return false;
        // }
        const { tableName, customizedModuleName } = this.$router.currentRoute.params;


        clearTimeout(this.ztreetimer);
        const checked = this.moduleComponentName.split('.').includes(tableName || customizedModuleName);
        this.ztreetimer = setTimeout(() => {
          if (this.$refs && this.$refs.tree && this.mountedChecked && !this.TreeChange && checked) {
            this.$refs.tree.getTreeInfo();
          }
        }, 50);
      }
    },
    formLists () {
      const arr = JSON.parse(JSON.stringify(this.formLists));
      arr.map((temp, index) => {
        temp.component = this.formLists[index].component;
        temp.item.event = this.formLists[index].item.event;
        temp.item.props = this.formLists[index].item.props;
        temp.labelWidth = 90;
        return temp;
      });
      clearTimeout(this.resetTypeTime);
      this.resetTypeTime = setTimeout(() => {
        this.resetType = false;
      }, 500);
      if (JSON.stringify(arr) !== JSON.stringify(this.formItemsLists)) {
        this.formItemsLists = arr;
      }
      // let value_copty = JSON.parse(JSON.stringify(value));
      // let old_copty = JSON.parse(JSON.stringify(old));
      // if (JSON.stringify(value_copty) !== JSON.stringify(old_copty)) {
      //   this.formItemsLists = arr;
      // }
    },
    $route () {
      setTimeout(() => {
        // 当路由变化，且观测到是返回动作的时候，延迟执行查询动作。
        if (!this._inactive) {
          const routeMapRecord = getSessionObject('routeMapRecord');
          const isDynamicRouting = Boolean(window.sessionStorage.getItem('dynamicRoutingIsBack'));// 动态路由跳转的单对象界面返回列表界面标记
          const routeFullPath = this.$router.currentRoute.path;
          if (routeMapRecord && isDynamicRouting) { // 动态路由返回
            const dynamicRoutingIsBackForDeleteValue = getSessionObject('dynamicRoutingIsBackForDelete');

            Object.entries(routeMapRecord).forEach(([key, value]) => {
              if (value === routeFullPath && dynamicRoutingIsBackForDeleteValue.keepAliveModuleName === key) {
                this.searchClickData({ value: 'true' });
                window.sessionStorage.removeItem('dynamicRoutingIsBack');// 清除动态路由返回标记
                deleteFromSessionObject('routeMapRecord', dynamicRoutingIsBackForDeleteValue.keepAliveModuleName);// 清除动态路由对应关系
                deleteFromSessionObject('dynamicRoutingIsBackForDelete', 'keepAliveModuleName');// 清除动态路由需要返回的单对象界面
              }
            });
          }
          // 符合记录规则一：由列表界面跳转到单对象界面，如果目标单对象界面和列表界面属于不同的表（Table不同），则将此种关系维护到路由记录“栈”。
          // 所返回的列表界面符合以上逻辑关系，则刷新当前列表界面
          if (this.$route.query.isBack || this.$route.query.ISBACK) {
            this.searchClickData({ flag: 'true' });
          }
        }
      }, 0);
    },
  },
  methods: {
    getVm (){
      // 获取上一层实例
      return this;
    },
    // 表格渲染完毕回调
    gridReady (e) {
      if (this.R3_agReady) {
        this.R3_agReady(e)
      }
    },

    // 支持项目组定制表格选项
    processAgOptions (options) {
      if (this.R3_processAgOptions) {
        return this.R3_processAgOptions(options)
      }
      return options
    },

    // r3内部定制表格渲染列
    columnRendererHandler (cellData, render) {
      if (this.columnRenderer) {
        this.columnRenderer(cellData, render)
      }
    },

    // 支持项目组定制表格列
    agProcessColumns (columns) {
      if (this.R3_processColumns) {
        return this.R3_processColumns(columns)
      }
      return columns
    },

    // 支持项目组定制表格行数据
    agProcessRows (rows) {
      if (this.R3_processRows) {
        return this.R3_processRows(rows)
      }
      return rows
    },

    onPageSizeChangeForFilterTable (pageSize) {
      this.resetButtonsStatus();
      this.searchData.startIndex = 0;
      this.searchData.range = pageSize;
      if (this.currentTabValue.tabValue.tab_value) {
        Object.values(this.currentTabValue.tabValue.tab_value).map((item) => {
          this.searchData.fixedcolumns = Object.assign({}, item, this.searchData.fixedcolumns);
          this.filterTableParam = item;
        });
      }

      const param = {
        startIndex: this.searchData.startIndex,
        range: this.searchData.range,
        index: this.currentTabValue.index
      };
      this.updateTabParam(param);
      this.getQueryList();
    },

    onPageChangeForFilterTable (page) {
      this.resetButtonsStatus();

      const { range } = this.searchData;
      this.searchData.startIndex = range * (page - 1);
      if (this.currentTabValue && this.currentTabValue.tabValue.tab_value) {
        Object.values(this.currentTabValue.tabValue.tab_value).map((item) => {
          this.searchData.fixedcolumns = Object.assign({}, item, this.searchData.fixedcolumns);
          this.filterTableParam = item;
        });
      }
      const param = {
        startIndex: this.searchData.startIndex,
        range: this.searchData.range,
        index: this.currentTabValue.index
      };
      this.updateTabParam(param);
      this.getQueryList();
    },
    firstSearchTable () {
      this.resetButtonsStatus();

      if (this.getFilterTable) {
        const el = this.$_live_getChildComponent(this, 'tabBar');
        el.tabClick(0);
        const obj = {
          index: 0,
          tabValue: this.ag.tablequery.multi_tab[0]
        };
        this.currentTabValue = obj;
      } else if (!this.buttons.isBig || this.resetType === true) {
        this.searchClickData();
      }
    },
    filterTabColoname (data) {
      // 过滤tab 的字段小写
        if(!Array.isArray(data.tab_value)){
            return false;
          }
          let tab_value = data.tab_value.reduce((arr,item)=>{
            Object.keys(item).forEach((key)=>{
              let key_k = key.toLocaleLowerCase();
               let option = {
                [key_k]: item[key]
              }
              arr.push(option)
            });
            return arr;
          },[]);
          return  tab_value;
    },
    async tabClick ({ data, index, stopRequest, isBackEventTriggger }) {
      this.filterTableParam = {};
      if (this.ag.tablequery.multi_tab[index] && this.ag.tablequery.multi_tab[index].startIndex) {
        if (this.$route.query.isBack || this.$route.query.ISBACK) {
          this.searchData.startIndex = data.startIndex;
        } else {
          this.searchData.startIndex = 0;
        }
      } else {
        // fix:(#47888)有tab过滤的表格，从详情页返回时页码会重置到第一页
        // 从详情返回列表界面时不需要重置页码，isBackEventTriggger就是用来作为返回事件的标记
        if(!isBackEventTriggger) {
          this.searchData.startIndex = 0;
        }
      }

      // 注释下面代码fix:(#47885)切换tab会重置显示条数
      // if (this.ag.tablequery.multi_tab[index] && this.ag.tablequery.multi_tab[index].range) {
      //   this.searchData.range = data.range;
      // } else {
      //   delete this.searchData.range;
      // }
      
      this.searchData.table = this[INSTANCE_ROUTE_QUERY].tableName;
      this.searchData.fixedcolumns = await this.dataProcessing();
      if (data.tab_value) {
        // Object.values(data.tab_value).map((item) => {
        //   this.searchData.fixedcolumns = Object.assign({}, item, this.searchData.fixedcolumns);
        //   this.filterTableParam = item;
        // });
        const arrRes = [];

        const tabValue = JSON.parse(JSON.stringify(this.filterTabColoname(data)));
        this.searchData.fixedcolumns = Object.values(tabValue).reduce((arr, obj) => {
          Object.keys(this.searchData.fixedcolumns).map((key) => {
            if (obj[key]) {
              if (obj[key] !== this.searchData.fixedcolumns[key]) {
                switch (Object.prototype.toString.call(obj[key])) {
                  case '[object String]':
                    if (obj[key].includes('~')) { // 判断否是时间段类型字段,取两个时间的并集
                      let dateArray = [];
                      dateArray = dateArray.concat(this.searchData.fixedcolumns[key].split('~'));
                      dateArray = dateArray.concat(obj[key].split('~'));
                      dateArray.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
                      arr[key] = [dateArray[0], dateArray[3]].join('~');
                    } else {
                      arr[key] = `${obj[key]},${this.searchData.fixedcolumns[key]}`;
                      arr[key] = arr[key].split(',');
                      // arr[key] = Array.from(new Set(arrRes));
                      // arr[key] = arr[key].toString();
                    }

                    break;
                  case '[object Array]':
                    arr[key] = obj[key].concat(this.searchData.fixedcolumns[key]);
                    arr[key] = Array.from(new Set(arr[key]));

                    break;
                  default:
                    break;
                }
                return obj[key];
              }
            }
            arr[key] = this.searchData.fixedcolumns[key];
          });

          arr = Object.assign(obj, arr);
          return arr;
        }, {});
        this.filterTableParam = this.searchData.fixedcolumns;
        // this.searchData.fixedcolumns = Object.assign(this.searchData.fixedcolumns, popwinMessage);
      }
      const obj = {
        index,
        tabValue: data
      };
      this.currentTabValue = obj;
      let parameData = {}
      if (!stopRequest) {//若stopRequest为true,则只通过以上逻辑整合参数，不发送请求
        if (this.treeSearchData) {
          let copySearchData = this.searchData
          copySearchData = Object.assign({}, copySearchData, this.treeSearchData)
          copySearchData.fixedcolumns = this.searchData.fixedcolumns
          parameData = copySearchData
        } else {
          parameData = this.searchData
        }
        this.getQueryListPromise(parameData);

      }
      this.onSelectionChangedAssignment({ rowIdArray: [], rowArray: [] });// 查询成功后清除表格选中项
    },


    ...mapActions('global', ['updateAccessHistory', 'getExportedState', 'updataTaskMessageCount', 'getMenuLists']),
    ...mapMutations('global', ['updateCustomizeMessage', 'tabOpen', 'increaseLinkUrl', 'addServiceIdMap', 'addKeepAliveLabelMaps', 'directionalRouter', 'updataSTDefaultQuery']),

    async menuTreeChange (treeName, currentId, flag, queryFilterData, searchData) {
      let fixedcolumns = await this.dataProcessing();
      let filterTableParam = JSON.parse(JSON.stringify(this.filterTableParam));
      let fixedcolumnsdata = JSON.parse(JSON.stringify(fixedcolumns));
      this.searchData.fixedcolumns = Object.assign(filterTableParam, fixedcolumnsdata);
      if (Object.keys(queryFilterData) && Object.keys(queryFilterData).length > 0 && flag) {
        this.searchData.reffixedcolumns = queryFilterData;
      } else if (this.searchData && this.searchData.reffixedcolumns) {
        delete this.searchData.reffixedcolumns;
      }
      this.TreeChange = true;
      if (flag === false) {
        // 如果取消则不走查树
        searchData = {};
      }
      this.treeSearchData = searchData || {};
      this.searchData.startIndex = 0;
      // this.getQueryListForAg(this.searchData);

      const searchDataRes = Object.assign({}, this.searchData, searchData);

      this.getQueryListPromise(searchDataRes);
      this.onSelectionChangedAssignment({ rowIdArray: [], rowArray: [] });// 查询成功后清除表格选中项
      this.$refs.agTableElement.clearChecked();
      // 按钮查找 查询第一页数据
      const { tableName } = this[INSTANCE_ROUTE_QUERY];
      const data = {
        k: tableName,
        v: currentId
      };
      updateSessionObject('TreeId', data);
    },

    imporSuccess (id) {
      if (true) { // Version() === '1.3'
        if (id) {
          const promises = new Promise((resolve, reject) => {
            this.getExportedState({
              objid: id, id, resolve, reject
            });
          });
          promises.then(() => {
            this.setImportDialogTitle(false);
            this.$R3loading.hide(this.loadingName);
            if (this.exportTasks.dialog) {
              const message = {
                mask: true,
                title: this.$t('feedback.alert'),
                content: this.$t('messages.asyncImportSuccess'),
                showCancel: true,
                onOk: () => {
                  const type = 'tableDetailVertical';
                  const tab = {
                    type,
                    tableName: Version() === '1.3' ? 'CP_C_TASK' : 'U_NOTE',
                    tableId: Version() === '1.3' ? 24386 : 963,
                    id
                  };
                  this.tabOpen(tab);
                  this.updataTaskMessageCount({ id, stopUpdataQuantity: true });
                }
              };
              this.$Modal.fcWarning(message);
            }
            if (this.exportTasks.successMsg) {
              // fix: 1.3环境，调用已读接口导致通知不展示
              if(window.ProjectConfig.enableTaskNotice) {
                return
              }
              const data = {
                mask: true,
                title: this.$t('feedback.success'),
                content: `${this.exportTasks.resultMsg}`
              };
              this.$Modal.fcSuccess(data);
            }
            this.searchClickData();
          }, () => {
            this.$R3loading.hide(this.loadingName);
            this.setImportDialogTitle(false);
          });
        }
      } else {
        this.$R3loading.hide(this.loadingName);
      }
    },
    commonTableCustomizedDialog (params) {
      this.$refs.dialogRef.open();
      this.dialogComponentNameConfig.title = params.column.customerurl.reftabdesc;
      this.dialogComponentNameConfig.footerHide = true;
      this.dialogComponentName = params.column.customerurl.tableurl;
    }, // 普通表格跳动作定义按钮弹窗
    dialogComponentSaveSuccess () { // 自定义弹框执行确定按钮操作
      if (this.objTabActionDialogConfig.isrefrsh) {
        this.searchClickData();
      }
    },
    closeDialog () {
      this.closeImportDialog();
    },
    onCancleSuccess () {
      this.modifyDialogshow = false;
    },
    onSaveSuccess (data) {
      // 重新请求
      this.modifyDialogshow = false;
      this.$Message.success(data.message);
      this.getQueryList();
    },
    getQueryList () {
      const { agTableElement } = this.$refs;
      // agTableElement.$refs.agTableElement.showAgLoading();//去除普通表格loading,因查询接口会唤起框架统一loading，两种loading冲突
      // this.getQueryListForAg(this.searchData);
      this.getQueryListPromise(this.searchData);
      this.onSelectionChangedAssignment({ rowIdArray: [], rowArray: [] });// 查询成功后清除表格选中项
    },
    onPageChange (page) {
      this.resetButtonsStatus();

      const { range } = this.searchData;
      this.searchData.startIndex = range * (page - 1);
      this.TreeChange = true;
      this.getQueryList();
    },
    onPageSizeChange (pageSize) {
      this.resetButtonsStatus();

      this.TreeChange = true;
      this.searchData.startIndex = 0;
      this.searchData.range = pageSize;
      this.getQueryList();
    },

    // 是否是从【我的任务】进入单对象
    isGoToTaskDetail() {
      const taskTableNames = ['CP_C_TASK', 'U_NOTE']
      return taskTableNames.includes(this.$route.params.tableName)
    },

    // 从【我的任务】进入单对象，如果任务未读,需调用读取接口
    readTask(row) {
      if(isTaskProcessing(row)) {
        return
      }
      const id = row.ID.val
      const url = Version() === '1.4' ? '/p/cs/u_note/ignoreMsg': '/p/cs/ignoreMsg'
      const data = Version() === '1.4' ? { id, objId: id } : urlSearchParams({ id })
      network.post(url, data,{
        serviceId: Version() === '1.4' && enableGateWay() ? 'asynctask' : ''
      })
    },

    // 表格双击
    onRowDoubleClick (colDef, row) {
      if (!this.buttons.onRowDoubleClick) { // 配置actionView禁用表格双击事件
        return;
      }

      if(this.isGoToTaskDetail()) {
        if( Version() === '1.4' && row.READ_STATE.refobjval === 0) {
          this.readTask(row)
        }

        if( Version() === '1.3' && row.READSTATE.val === '未读') {
          this.readTask(row)
        }
      }

      // const param = {
      //   url: 'CUSTOMIZED/FUNCTIONPERMISSION/1',
      //   isMenu: true,
      // };
      // this.directionalRouter(param);// 定向路由跳转方法
      // return;
      const { tableName, tableId } = this[INSTANCE_ROUTE_QUERY];
      // const treeQuery = this.$router.currentRoute.query;
      // if (treeQuery.isTreeTable) {
      const treeIds = getSessionObject('TreeId');
      const treeTableListSelectId = treeIds[tableName];
      // }
      if (this.webconf.dynamicRouting) { // 配置了动态路由，双击表格走动态路由
        // this.tabOpen({
        //   type: 'tableDetailHorizontal',
        //   tableName: 'AD_TABLE',
        //   tableId: '992',
        //   id: '24369',
        // });
        window.sessionStorage.setItem('dynamicRouting', true);
        let type = '';
        if (!row._TABLENAME || !row._TABLENAME.val || !row._TABLEID || !row._TABLEID.val || !row._OBJID || !row._OBJID.val) {
          const data = {
            mask: true,
            title: this.$t('feedback.warning'),
            content: this.$t('messages.maintainTableName')
          };
          this.$Modal.fcWarning(data);
        } else if (row._OBJURL && row._OBJURL.val) {
          const tableurl = row._OBJURL.val;
          const id = row._OBJID.val;
          const param = {
            url: tableurl,
            id,
            isMenu: true,
            treeTableListSelectId
          };
          this.directionalRouter(param);// 定向路由跳转方法
          return;
        } else if (row._OBJTYPE && row._OBJTYPE.val === 'object') {
          // 单对象上下结构
          type = 'tableDetailVertical';
        } else if (row._OBJTYPE && row._OBJTYPE.val === 'tabpanle') { // 左右结构
          type = 'tableDetailHorizontal';
        } else {
          const data = {
            mask: true,
            title: this.$t('feedback.warning'),
            content: this.$t('messages.setAssociationTable')
          };
          this.$Modal.fcWarning(data);
        }
        this.tabOpen({
          type,
          tableName: row._TABLENAME.val,
          tableId: row._TABLEID.val,
          id: row._OBJID.val,
          original:'outclick',
          serviceId: row._SERVICEID ? row._SERVICEID.val : null
        });
      } else {
        const id = row.ID.val;
        if (this.ag.tableurl) {
          const param = {
            url: this.ag.tableurl,
            id,
            isMenu: true,
            treeTableListSelectId
          };
          this.directionalRouter(param);// 定向路由跳转方法

          const data = {
            type: 'standardTableurlCustomized',
            value: row,
            // customizedModuleId: id
          };
          if (enableActivateSameCustomizePage()) {
            const customizedModuleName = this.ag.tableurl.split('/')[1];
            data.customizedModuleName = customizedModuleName.toLocaleUpperCase();
          } else {
            data.customizedModuleId = id;
          }
          this.updateCustomizeMessage(data);
        } else if (this.ag.datas.objdistype === 'tabpanle') {
          // 单对象左右结构
          const type = 'tableDetailHorizontal';
          const tab = {
            type,
            tableName,
            tableId,
            id
          };
          this.tabOpen(tab);
        } else {
          // 单对象上下结构
          const type = 'tableDetailVertical';
          const tab = {
            type,
            tableName,
            tableId,
            id
          };
          this.tabOpen(tab);
        }
      }
    }, // ag表格行双击回调
    onSortChange (sortArr) {
      const { tableName } = this[INSTANCE_ROUTE_QUERY];
      const transferFormat_param = {
        sortArr,
        tableName
      };
      const obj = {
        orderbyData: this.transferFormat(transferFormat_param),
        searchData: this.searchData
      };
      this.orderby(obj);
      this.getQueryList();
    },
    transferFormat (obj) {
      return obj.sortArr.map((d) => {
        if (d.sort === 'normal') {
          return {
            column: `${obj.tableName}.${d.colId || 'COMUMN_NOT_EXIST'}`,
            // asc: d.sort === 'asc'
          };
        }
        return {
          column: `${obj.tableName}.${d.colId || 'COMUMN_NOT_EXIST'}`,
          asc: d.sort === 'asc'
        };
      });
    },
    orderby (obj) {
      if (obj.searchData.orderby) {
        const filterSort = this.searchData.orderby.filter(d => d.column === obj.orderbyData[0].column && d.asc !== obj.orderbyData[0].asc);
        if (filterSort.length > 0) {
          this.searchData.orderby.map((d) => {
            if (d.column === obj.orderbyData[0].column && d.asc !== obj.orderbyData[0].asc) {
              d.asc = obj.orderbyData[0].asc;
            }
          });
        } else {
          this.searchData.orderby = this.searchData.orderby.concat(obj.orderbyData);
        }
      } else {
        this.searchData.orderby = obj.orderbyData;
      }
    },
    onColumnMoved (cols) {
      if(cols === this._colPositionCache) {
        return
      }
      this._colPositionCache = cols
      const { tableId } = this[INSTANCE_ROUTE_QUERY];
      this.setColPosition({
        tableid: tableId,
        colposition: cols
      });
      this.updateAgConfig({ key: 'colPosition', value: cols });
    },

    // 列固定的回调
    onColumnPinned (pinnedCols) {
      const { tableId } = this[INSTANCE_ROUTE_QUERY];

      let resultColumns = pinnedCols
      // 剔除掉扩展属性里的固定列
      if (this.ag.pinnedColumns) {
        let { pinnedLeftColumns: paramsLeft, pinnedRightColumns: paramsRight } = getPinnedColumns(pinnedCols)
        const { pinnedLeftColumns, pinnedRightColumns } = getPinnedColumns(this.ag.pinnedColumns)
        for (let i = paramsLeft.length - 1; i >= 0; i--) {
          if (pinnedLeftColumns.includes(paramsLeft[i])) {
            paramsLeft.splice(i, 1)
          }
        }
        for (let i = paramsRight.length - 1; i >= 0; i--) {
          if (pinnedRightColumns.includes(paramsRight[i])) {
            paramsRight.splice(i, 1)
          }
        }
        paramsLeft = paramsLeft.join(',')
        paramsRight = paramsRight.join(',')
        resultColumns = `${paramsLeft}${paramsRight ? ('|' + paramsRight) : ''}`
      }

      this.setColPin({
        tableid: tableId,
        fixedcolumn: resultColumns
      });
      this.updateAgConfig({ key: 'fixedColumn', value: pinnedCols });
    },

    // 设置隐藏
    setColVisible (hideCols, callback) {
      const { tableId } = this[INSTANCE_ROUTE_QUERY];
      this.setColHide({
        tableid: tableId,
        hidecolumns: hideCols
      });
      this.updateAgConfig({ key: 'hideColumn', value: hideCols });
      typeof callback === 'function' && callback()
    },

    // 监听表格隐藏或显示列
    onColumnVisibleChanged (hideCols,callback) {
      this.setColVisible(hideCols,callback)
    },
    onCellSingleClick (colDef, rowData, target) {
      // 单元格无内容时禁止跳转
      if (rowData[colDef.colname].val === '') {
        return;
      }

      const { tableId } = this[INSTANCE_ROUTE_QUERY];
      if (target.getAttribute('data-target-tag') === 'fkIcon') {
        window.sessionStorage.setItem('dynamicRouting', true);
        const {
          objdistype
          // , reftableid, reftable, fkdesc, serviceId
        } = colDef;
        const {
          reftableid, reftablename, refobjid, reftabdesc, serviceId
        } = rowData[colDef.colId];
        let type = '';
        if (objdistype === 'tabpanle') { // 上下结构
          type = 'tableDetailHorizontal';
        } else if (objdistype === 'object') {
          type = 'tableDetailVertical';
        } else {
          const data = {
            mask: true,
            title: this.$t('feedback.warning'),
            content: this.$t('messages.setAssociationTable')
          };
          this.$Modal.fcWarning(data);
          return;
        }
        window.sessionStorage.setItem('dynamicRoutingForHideBackButton', true);
        this.tabOpen({
          id: refobjid,
          tableName: reftablename,
          tableId: reftableid,
          type,
          original:'outclick',
          label: reftabdesc,
          serviceId
        });
      }
      if (colDef.customerurl && Object.keys(colDef.customerurl).length > 0) { // 配置链接型字段
        const objdistype = colDef.customerurl.objdistype;
        if (objdistype === 'popwin') {
          // 自定义弹窗
          this.$refs.dialogRef.open();
          this.dialogComponentNameConfig.title = colDef.customerurl.reftabdesc;
          this.dialogComponentNameConfig.footerHide = true;
          this.dialogComponentName = colDef.customerurl.tableurl;
          const param = colDef.customerurl.refobjid.split(',');
          if (Object.keys(rowData).length > 0 && param && param.length > 0) {
            this.popwinMessage = Object.keys(rowData).reduce((arr, obj) => {
              if (param.includes(obj)) {
                arr[obj] = rowData[obj].val;
              }
              return arr;
            }, {});
          }
          // 将元数据配置的refobjid，字符串，可配置多个字段，将配置的字段解析后传入自定义弹框，供弹框作为参数使用
        } else if (objdistype === 'tabpanle') {
          // 左右结构单对象界面
          const type = 'tableDetailHorizontal';
          const tab = {
            type,
            tableName: colDef.customerurl.reftablename,
            tableId: colDef.customerurl.reftableid,
            label: colDef.customerurl.reftabdesc,
            id: rowData[colDef.customerurl.refobjid].val
          };
          this.tabOpen(tab);
        } else if (objdistype === 'object') {
          // 上下结构单对象界面
          const type = 'tableDetailVertical';
          const tab = {
            type,
            tableName: colDef.customerurl.reftablename,
            tableId: colDef.customerurl.reftableid,
            label: colDef.customerurl.reftabdesc,
            id: rowData[colDef.customerurl.refobjid].val
          };
          this.tabOpen(tab);
        } else if (objdistype === 'customized') {
          // 自定义界面
          // let customizeMessage = null;
          // const param = colDef.customerurl.refobjid.split(',');
          // if (Object.keys(rowData).length > 0 && param && param.length > 0) {
          //   customizeMessage = Object.keys(rowData).reduce((arr, obj) => {
          //     if (param.includes(obj)) {
          //       arr[obj] = rowData[obj].val;
          //     }
          //     return arr;
          //   }, {});
          // }
          const customizedModuleName = colDef.customerurl.tableurl.split('/')[1];
          const data = {
            type: 'standardCustomerurlCustomized',
            value: rowData,
            // customizedModuleName: customizedModuleName.toLocaleUpperCase()
          };
          if (enableActivateSameCustomizePage()) {
            data.customizedModuleName = customizedModuleName.toLocaleUpperCase();
          } else {
            data.customizedModuleId = rowData[colDef.customerurl.refobjid].val;
          }
          // 自定义界面：相同自定义界面标记，ID不同时，只激活同一个tab

          this.updateCustomizeMessage(data);
          // 将元数据配置的refobjid，字符串，可配置多个字段，将配置的字段解析后用作lu y，供弹框作为参数使用
          const type = 'tableDetailAction';

          const url = `/${colDef.customerurl.tableurl.toUpperCase()}/${rowData[colDef.customerurl.refobjid].val}`;
          const tab = {
            type,
            label: colDef.customerurl.reftabdesc,
            url
          };
          this.tabOpen(tab);
        } else if (objdistype === 'link') { // 支持跳转外链界面配置动态参数
          // 字段链接跳转外链界面扩展
          if (this.onCellSingleClick_type_link && typeof this.onCellSingleClick_type_link === 'function') {
            const obj = {
              colDef,
              rowData
            };
            this.onCellSingleClick_type_link(obj);
          } else {
            const query = {};
            const queryArray = colDef.customerurl.refobjid.split(',');
            if (queryArray.length > 1) {
              queryArray.reduce((a, o) => {
                if (rowData[o] && rowData[o].val) query[o] = rowData[o].val;
              }, {});
            } else if (queryArray.length === 1) {
              query.objId = rowData[colDef.customerurl.refobjid].val;
            }

            const param = {
              url: colDef.customerurl.tableurl, // 跳转的外链界面内加载的iframe的src地址，即加载的页面地址
              query, // 地址携带的参数
              label: colDef.customerurl.reftabdesc, // 外链界面对应的Tab展示名称
              isMenu: true, // 设置了label则该参数必须设置为true
              linkName: colDef.customerurl.linkname, // 外链界面表名，作为路由参数
              linkId: queryArray.length > 1 ? rowData.ID.val : rowData[colDef.customerurl.refobjid].val, // 外链界面表ID，作为路由参数
            };

            // const param = {
            //   url: colDef.customerurl.tableurl,
            //   query: rowData[colDef.customerurl.refobjid].val,
            //   label: colDef.customerurl.reftabdesc,
            //   isMenu: true,
            //   linkName: colDef.customerurl.linkname,
            //   linkId: rowData[colDef.customerurl.refobjid].val,
            // };
            this.directionalRouter(param);// 定向路由跳转方法

            const data = {
              type: 'standardCustomerurlLink',
              value: rowData,
              customizedModuleName: colDef.customerurl.linkname.toUpperCase()
              // 因外链界面tablinkName相同时，只激活一个tab,所以外链界面用linkName作为key存入session,避免因勾选的id不同存入多个，导致关闭当前tab时无法清除存入的多个
            };
            this.updateCustomizeMessage(data);
          }

        }
      }
    },
    // 表单操作
    refactoringData (defaultFormItemsLists) {
      // 对获取的数据进行处理
      let items = [];
      if (this.formItemsLists.length > 0 && !this.resetType) {
        return this.formItemsLists;
      }
      items = JSON.parse(JSON.stringify(defaultFormItemsLists)).reduce(
        (array, current, itemIndex) => {
          const obj = {};
          // 判断采用那种表现方式
          function checkDisplay (item) {
            let str = '';
            if (!item.display || item.display === 'text') {
              str = 'input';
            }
            if (item.display === 'OBJ_SELECT') {
              str = 'select';
            }
            if (item.display === 'OBJ_FK') {
              switch (item.fkobj.searchmodel) {
                case 'drp':
                  str = 'DropDownSelectFilter';
                  break;
                case 'mrp':
                  str = 'DropDownSelectFilter';
                  break;
                case 'pop':
                  str = 'AttachFilter';
                  break;
                case 'mop':
                  str = 'AttachFilter';
                  break;
                default:
                  break;
              }
            }

            if (
              item.display === 'OBJ_DATENUMBER'
              || item.display === 'OBJ_DATE'
            ) {
              str = 'DatePicker';
            }

            if (item.display === 'OBJ_TIME') {
              str = 'TimePicker';
            }

            return str;
          }

          obj.row = current.row ? current.row : 1;
          obj.col = current.col ? current.col : 1;
          obj.component = ItemComponent;


          obj.item = {
            type: checkDisplay(current),
            title: current.coldesc,
            field: current.colname,
            value: this.defaultValue(current),
            inputname: current.inputname,
            props: {
            },

            validate: {}
          };

          if (current.webconf) {
            obj.item.props.webconf = current.webconf;
          }


          // 输入控制

          // 属性isuppercase控制
          if (current.isuppercase) {
            // obj.item.props.regx = regExp.Capital;
            // obj.item.event.regxCheck = (value, $this, errorValue) => {
            //   this.lowercaseToUppercase(errorValue, itemIndex);
            // };
          }

          // 外键的单选多选判断



          // if (!item.props.readonly && !this.objreadonly) {
          //   item.props.Selected.push(this.defaultValue(current)[0]);
          //   item.value = this.defaultValue(current)[0].Label;
          // } else {
          //   item.value = this.defaultValue(current)[0].Label;
          // }



          array.push(obj);
          return array;
        },
        []
      );

      this.resetType = false;
      return items;
    },
    setSeachObject (obj, current) {
      // precolnameslist
      if (current.precolnameslist) {
        if (Object.hasOwnProperty.call(obj, 'ak')) {
          obj.fixedcolumns.precolnameslist = current.precolnameslist;
        } else {
          obj.precolnameslist = current.precolnameslist;
        }
        return obj;
      }
      return obj;
    },
    resetForm () {
      this.filterTableParam = {};
      sessionStorage.removeItem(this.instanceRouteQuery.tableId);
      this.resetTabParam();
      // 列表查询重置
      this.resetType = true;
      const promise = new Promise(async (resolve, reject) => {
        const searchData = this.searchData;
        if (searchData.reffixedcolumns) {
          delete searchData.reffixedcolumns;
        }
        // this.isChangeTreeConfigData = 'Y'; //oldTree
        if (this.isTreeList && this.$refs.tree) {
          this.$refs.tree.clearNode();
          this.treeSearchData = {};// 将树配置的参数清除，保证下一个查询时恢复框架默认参数
        }
        if (this.buttons.isBig) {
          searchData.closeIsBig = true;
        }

        if (enableKAQueryDataForUser() || this.webConf.enableKAQueryDataForUser) {
          const search = {};
          search.R3UserId = `${this.userInfo.id}_${this.searchData.table}`;
          addSearch(search);

          // this.updateSearchDBdata({});
          this.updateFormData(await this.dataProcessing());
        }
        this.getTableQueryForForm({ searchData, resolve, reject });
      });
    },
    getTableQuery () {
      // 获取列表的查询字段
      const searchData = this.searchData;

      this.getTableQueryForForm({ searchData });
    },

    // 按钮组操作
    clearSelectIdArray () { // 关闭打印预览与直接打印后清空选中项
      this.onSelectionChangedAssignment({ rowIdArray: [], rowArray: [] });// 查询成功后清除表格选中项
      this.$refs.agTableElement.clearChecked();
      const commonTable = document.querySelector('.commonTable');

      if (this.$refs.agTableElement.$refs.agGridTableContainer) { // ag表格
        this.$refs.agTableElement.$refs.agGridTableContainer.api.deselectAll();
      }
      if (commonTable) { // 普通表格
        commonTable.deselectAll();
      }
    },
    getbuttonGroupdata () {
      // 获取按钮数据
      const tabcmdData = this.buttons.tabcmd;
      if (tabcmdData.cmds) {
        const buttonGroupShow = [];
        // 导入导出按钮配置规则：disableImport：true(隐藏导入按钮) false(显示导入按钮)，导出按钮和导入按钮保持一致

        if (this.webConf) {
          if (this.webConf.disableImport || this.webConf.disableImport === false) {
            tabcmdData.prem[7] = false;
          }
          if (this.webConf.disableExport || this.webConf.disableExport === false) {
            tabcmdData.prem[8] = false;
          }
        }
        tabcmdData.cmds.forEach((item, index) => {
          if (item === 'actionView') {
            this.updatestopOnRowDoubleClickData(tabcmdData.prem[index]);
            // this.buttons.detailState = ;
          } else if (tabcmdData.prem[index]) {
            const type = item.split('action');
            const str = `CMD_${type[1].toUpperCase()}`;
            if (str === 'CMD_PRINT') {
              this.setPrintValueForButtons(true);
            } else {
              this.buttonMap[str].eName = item;
              const buttonConfigInfo = JSON.parse(JSON.stringify(this.buttonMap[str]));

              if (tabcmdData.paths) {
                buttonConfigInfo.requestUrlPath = tabcmdData.paths[index];
              }
              if (tabcmdData.jflowpaths) { // jflow对标准类型按钮配置path
                const jflowpathsRes = JSON.parse(JSON.stringify(tabcmdData.jflowpaths));
                buttonConfigInfo.jflowpath = jflowpathsRes[index];
                this.urlArr.push(jflowpathsRes[index]);
              }

              if (this.webConf && ((this.webConf.disableImport && str === 'CMD_IMPORT') || (this.webConf.disableExport && str === 'CMD_EXPORT'))) {
                // 根据webConf控制列表界面导入导出按钮
              } else {
                buttonGroupShow.push(buttonConfigInfo);
              }
            }
          }
        });

        if (this.webConf) {
          if (this.webConf.disableExport === false) {
            const buttonConfigInfo = {
              eName: 'actionEXPORT',
              name: this.$t('buttons.export')
            };
            buttonGroupShow.push(buttonConfigInfo);
          }
          if (this.webConf.disableImport === false) {
            const buttonConfigInfo = {
              eName: 'actionIMPORT',
              name: this.$t('buttons.import')
            };
            buttonGroupShow.push(buttonConfigInfo);
          }
        }
        this.updateDefaultButtonGroupData(buttonGroupShow);
        this.collectTablelist();
      }
    },
    onSelectionChanged (rowIdArray, rowArray) {
      // this.filterButtonsForDisable(rowArray);
      // 获取表格选中明细
      this.onSelectionChangedAssignment({ rowIdArray, rowArray });
    },

    buttonClick (type, obj) {
      this.TreeChange = false;
      this.setActiveTabActionValue({});// 点击按钮前清除上一次按钮存的信息
      // this.resetType = false;
      if (type === 'fix') {
        this.AddDetailClick(type, obj);
      } else if (type === 'custom') {
        this.webactionClick(type, obj);
      } else if (type === 'Collection') {
        this.clickButtonsCollect();
      } else if (type === 'reset') {
        // 重置列表渲染
        this.resetForm();
        // 查询成功后清除表格选中项
        this.onSelectionChangedAssignment({ rowIdArray: [], rowArray: [] });
        this.$refs.agTableElement.clearChecked();
      } else {
        this.searchEvent();
      }
    },
    searchEvent () {
      // 支持查询按钮前置事件，通过promise处理
      const searchDataRes = Object.assign({}, JSON.parse(JSON.stringify(this.searchData)), JSON.parse(JSON.stringify(this.treeSearchData)));
      const obj = {
        callBack: () => new Promise((searchBeforeResolve, searchBeforeReject) => {
          this.searchData.searchBeforeResolve = searchBeforeResolve;
          this.searchData.searchBeforeReject = searchBeforeReject;
          this.searchClickData({ value: 'true' });
        })
      };
      if (this.R3_searchBefore && typeof this.R3_searchBefore === 'function') {
        this.R3_searchBefore(obj);
      } else {
        this.searchClickData();
      }
    },
    objTabActionDialog (tab) { // 动作定义弹出框
      this.$refs.dialogRef.open();
      const title = `${tab.webdesc}`;
      this.dialogComponentNameConfig = {
        title,
      };
      this.dialogComponentNameConfig.footerHide = true;
      // this.actionDialog.show = true;
      // this.actionDialog.title = tab.webdesc;
      this.objTabActionDialogConfig = tab;
      if (tab.action.indexOf('?') >= 0) {
        // this.dialogComponent = this.getCustomizeComponent(tab.action.split('/')[0]);
      } else {
        const url = tab.action;
        const index = url.lastIndexOf('\/');
        const filePath = url.substring(index + 1, url.length);
        // Vue.component(filePath, CustomizeModule[filePath].component);
        this.dialogComponentName = filePath;
      }
    },

    webactionClick (type, obj) {
      // 点击自定义按钮 创建table
      this.setActiveTabActionValue(obj);
      if (obj.vuedisplay === 'js') {
        if (obj.action && this[obj.action] && typeof this[obj.action] === 'function') {
          this[obj.action](obj);
        }
      } else if (obj.vuedisplay === 'slient' || obj.vuedisplay === 'slient_custom') {
        // 静默程序            if(obj.confirm){  //有提示
        if (obj.confirm) {
          // 有提示
          if (obj.confirm.indexOf('{') >= 0) {
            if (JSON.parse(obj.confirm).isselect) {
              if (this.buttons.selectIdArr && this.buttons.selectIdArr.length === 0) {
                const title = this.ChineseDictionary.WARNING;
                const contentText = `${JSON.parse(obj.confirm).nodesc}`;
                // this.dialogMessage(title, contentText);
                const data = {
                  mask: true,
                  title,
                  content: contentText
                };
                this.$Modal.fcWarning(data);
              } else if (
                JSON.parse(obj.confirm).isradio
                && this.buttons.selectIdArr.length !== 1
              ) {
                const title = this.ChineseDictionary.WARNING;
                const contentText = `${JSON.parse(obj.confirm).radiodesc}`;
                this.dialogMessage(title, contentText, obj);
              } else if (JSON.parse(obj.confirm).desc) {
                const title = this.ChineseDictionary.WARNING;
                const contentText = `${JSON.parse(obj.confirm).desc}`;
                this.dialogMessage(title, contentText, obj);
              } else {
                // 参数都不存在,直接执行
                this.webActionSlient(obj);
              }
            } else {
              const title = this.ChineseDictionary.WARNING;
              const contentText = `${JSON.parse(obj.confirm).desc}`;
              this.dialogMessage(title, contentText, obj);
            }
          } else {
            const title = this.ChineseDictionary.WARNING;
            const contentText = `${obj.confirm}`;
            this.dialogMessage(title, contentText, obj);
          }
        } else {
          this.webActionSlient(obj);
        }
      } else if (obj.vuedisplay === 'navbar') {
        // !JSON.parse(obj.confirm.isselect)
        if (!obj.confirm || !JSON.parse(obj.confirm).isselect) {
          this.objTabActionNavbar(obj); // 新标签跳转
        } else {
          // 动作定义根据列表是否选值
          const confirm = JSON.parse(obj.confirm);
          if (this.buttons.selectIdArr.length > 0) {
            if (confirm.isradio && this.buttons.selectIdArr.length !== 1) {
              const title = this.ChineseDictionary.WARNING;
              const contentText = `${confirm.radiodesc}`;
              this.dialogMessage(title, contentText);
            } else if (confirm.desc) {
              const title = this.ChineseDictionary.WARNING;
              const contentText = `${confirm.desc}`;
              this.dialogMessage(title, contentText);
            } else {
              this.objTabActionNavbar(obj); // 新标签跳转
            }
          } else if (confirm.nodesc) {
            const title = this.ChineseDictionary.WARNING;
            const contentText = `${confirm.nodesc}`;
            this.dialogMessage(title, contentText);
          } else {
            this.objTabActionNavbar(obj); // 新标签跳转
          }
        }
      } else if (!obj.confirm || !JSON.parse(obj.confirm).isselect) {
         if (obj.vuedisplay === 'download') {
            this.objTabActiondDownload(obj);
          }else{
            this.objTabActionDialog(obj);
          }
      } else if (JSON.parse(obj.confirm).isselect) {
        // 是否是必选列表项, 动作定义根据列表是否选值
        const confirm = JSON.parse(obj.confirm);
        if (this.buttons.selectIdArr.length > 0) {
          if (confirm.isradio && this.buttons.selectIdArr.length !== 1) {
            const title = this.ChineseDictionary.WARNING;
            const contentText = `${confirm.radiodesc}`;
            this.dialogMessage(title, contentText, obj);
          } else if (confirm.desc) {
            const title = this.ChineseDictionary.WARNING;
            const contentText = `${confirm.desc.replace(
              '{isselect}',
              this.buttons.selectIdArr.length
            )}`;
            this.dialogMessage(title, contentText, obj);
          } else if (obj.vuedisplay === 'download') {
            this.objTabActiondDownload(obj);
          } else {
            // this.setActionDialog(obj);
            // const componentName = obj.action
            //   .split('?')[0]
            //   .replace(/\//g, '_');
            // Vue.component(
            //   componentName,
            //   Vue.extend(importCustom(obj.action.split('?')[0]))
            // );
            // this.dialogComponent = componentName;
            this.objTabActionDialog(obj);
          }
        } else if (confirm.nodesc) { // 校验提示
          const title = this.ChineseDictionary.WARNING;
          const contentText = `${confirm.nodesc}`;
          // this.dialogMessage(title, contentText);
          const data = {
            mask: true,
            title,
            content: contentText
          };
          this.$Modal.fcWarning(data);
        } else {
          // this.setActionDialog(obj);

          // const componentName = obj.action.split('?')[0].replace(/\//g, '_');

          // Vue.component(
          //   componentName,
          //   Vue.extend(importCustom(obj.action.split('?')[0]))
          // );
          // this.dialogComponent = componentName;
          this.objTabActionDialog(obj);
        }
      } else { // 需要弹出提示信息
        const message = obj.confirm.indexOf('{') >= 0
          ? JSON.parse(obj.confirm).nodesc
          : obj.confirm;
        const title = this.ChineseDictionary.WARNING;
        const contentText = `${message}`;
        this.dialogMessage(title, contentText, obj);
      }
    },

    // objTabActionUrl(tab) { // 外链类型
    //   // const linkUrl = tab.action;
    //   // const linkId = tab.webid;
    //   // this.increaseLinkUrl({ linkId, linkUrl });
    //   // setTimeout(() => {
    //   //   this.tabOpen({
    //   //     type: 'tableDetailUrl',
    //   //     tableName: tab.webname.toUpperCase(),
    //   //     tableId: tab.webid,
    //   //     label: tab.webdesc,
    //   //     url: tab.action
    //   //   });
    //   // }, 500);

    //   const eleLink = document.createElement('a');
    //   eleLink.href = tab.action;
    //   eleLink.target = '_blank';
    //   document.body.appendChild(eleLink);
    //   eleLink.click();
    //   document.body.removeChild(eleLink);
    // },
    objTabActiondDownload (tab) {
      // const filename = tab.webname;
      const selectIdArr = this.buttons.selectIdArr;
      const downloadId = selectIdArr[0];
      const paths = tab.action.replace('$objid$', downloadId);
      const eleLink = document.createElement('a');
      const path = getGateway(`${paths}`);
      eleLink.setAttribute('href', path);
      eleLink.style.display = 'none';
      document.body.appendChild(eleLink);
      eleLink.click();
      document.body.removeChild(eleLink);
      // this.downFile(path, filename);
    },
    // downFile(path, filename) {
    //   // 创建隐藏的可下载链接
    //   const eleLink = document.createElement('a');
    //   eleLink.download = filename;
    //   eleLink.style.display = 'none';
    //   // 字符内容转变成blob地址
    //   const blob = new Blob([path]);
    //   eleLink.href = URL.createObjectURL(blob);
    //   // 触发点击
    //   document.body.appendChild(eleLink);
    //   eleLink.click();
    //   // 然后移除
    //   document.body.removeChild(eleLink);
    // },
    webActionSlient (item) {
      let obj = {};
      if (Version() === '1.3') {
        obj = {
          tableid: this.buttons.tableId,
          ids: this.buttons.selectIdArr,
          menu: this.buttons.tabledesc
        };
      } else {
        obj = {
          tableName: this.buttons.tableName,
          ids: this.buttons.selectIdArr.map(d => window.parseInt16(d))
        };
      }

      let promise = new Promise((resolve, reject) => {
        this.$R3loading.show(this.loadingName);
        this.getExeActionDataForButtons({
          item, obj, resolve, reject, moduleName: this[MODULE_COMPONENT_NAME], routeQuery: this[INSTANCE_ROUTE_QUERY], routePath: this[INSTANCE_ROUTE]
        });
      });
      if (item.ID) {
        this.onSelectionChangedAssignment({ rowIdArray: [], rowArray: [] });// 查询成功后清除表格选中项
        this.$refs.agTableElement.clearChecked();
      }

      if (this.buttons.activeTabAction.cuscomponent) { // 如果接口cuscomponent有值，逻辑为自定义调自定义
        const nextOperate = JSON.parse(// 配置信息
          this.buttons.activeTabAction.cuscomponent
        );
        promise.then(() => {
          this.$R3loading.hide(this.loadingName);
          if (nextOperate.success) {
            let successAction = null;
            let successActionParam = {};
            successAction = nextOperate.success;
            successActionParam = {
              actionid: 0,
              webaction: successAction
            };
            promise = new Promise((resolve) => {
              this.getActionDataForButtons({ param: successActionParam, resolve });
            });
            promise.then(() => {
              const exeActionDataForComponent = this.buttons.ExeActionDataForComponent.data;
              const type = 'custom';
              this.webactionClick(type, exeActionDataForComponent);
            });
          } else {
            const message = this.buttons.ExeActionData;
            const data = {
              mask: true,
              title: this.$t('feedback.success'),
              content: `${message}`
            };
            this.$Modal.fcSuccess(data);
          }
        }, () => {
          this.$R3loading.hide(this.loadingName);
          if (nextOperate.failure) {
            let errorAction = null;
            let errorActionParam = {};
            errorAction = nextOperate.failure;
            errorActionParam = {
              actionid: 0,
              webaction: errorAction
            };
            promise = new Promise((resolve) => {
              this.getActionDataForButtons({ param: errorActionParam, resolve });
            });
            promise.then(() => {
              const exeActionDataForComponent = this.buttons.ExeActionDataForComponent.data;
              const type = 'custom';
              this.webactionClick(type, exeActionDataForComponent);
            });
          }
        });
      } else { // 没有配置动作定义调动作定义逻辑
        promise.then((res, actionName) => {
          if (res.isrefrsh && item.isrefrsh) {
            // 页面刷新兼容错误数据
            this.getQueryListPromise(Object.assign({}, this.searchData, { merge: true }));
            return;

          }
          this.$R3loading.hide(this.loadingName);
          const message = this.buttons.ExeActionData;
          const data = {
            mask: true,
            title: this.$t('feedback.success'),
            content: `${message}`,
            onOk: () => {
              DispatchEvent('exeActionSuccessForR3', {
                detail: {
                  name: 'exeAction',
                  type: 'horizontalTable',
                  url: actionName || '/p/cs/exeAction',
                  res,
                  moduleName: this[MODULE_COMPONENT_NAME],
                  routeQuery: this[INSTANCE_ROUTE_QUERY],
                  tableName: this[INSTANCE_ROUTE_QUERY].tableName,
                  routePath: this[INSTANCE_ROUTE]
                }
              });
            },
          };
          this.$Modal.fcSuccess(data);
          if (item.isrefrsh) {
            this.searchClickData();
          }
        }, () => {
          this.$R3loading.hide(this.loadingName);
        });
      }
    },

    async dataProcessing () { // 查询数据处理
      const Form = this.$_live_getChildComponent(this, 'listsForm');
      let obj = {};
      if (Form) {
        obj = await Form.getFormData()
      }
      return obj
    },
    async searchClickData (value) {
      this.resetButtonsStatus();
      // 按钮查找 查询第一页数据
      // if (value && !value.flag) { // 返回时查询之前页码
      //   this.searchData.startIndex = 0;
      // }
      const fixedcolumns = await this.dataProcessing();
      this.searchData.fixedcolumns = fixedcolumns
      // this.searchData.fixedcolumns = Object.assign({}, this.searchData.fixedcolumns, this.dataProcessing());
      if (value) { // 返回时查询之前页码
        if (!value.flag) {
          this.searchData.startIndex = 0;
        }
      } else {
        this.searchData.startIndex = 0;
      }

      if (this.getFilterTable) {
        const el = this.$_live_getChildComponent(this, 'tabBar');
        const tabCurrentIndex = el.$refs.R3_Tabs.focusedKey;
        el.tabClick(tabCurrentIndex, false, value && value.flag);
        return
      } else {
        this.searchData.fixedcolumns = fixedcolumns;
      }

      // 我的任务界面加排序参数
      const tableName = this[INSTANCE_ROUTE_QUERY].tableName
      if(tableName === 'U_NOTE' || tableName === 'CP_C_TASK') {
        this.searchData.orderby = [{
          column: `${tableName}.ID`,
          asc: false
        }]
      }

      let json = JSON.parse(JSON.stringify(this.searchData));
      json = Object.assign({}, json, this.treeSearchData);
      // this.getQueryListForAg(this.searchData);
      if (this.buttons.isBig) {
        this.updataIsBig(false);
      }
      this.getQueryListPromise(json);
      this.onSelectionChangedAssignment({ rowIdArray: [], rowArray: [] });// 查询成功后清除表格选中项
    },

    // getResSearchDataForFilterTable (data) {
    //   //此方法用于整合当前查询的参数以及当前激活的tab所配置的参数，执行过此方法后，会将整合好的参数更新至this.searchData，需要用到表格过滤参数的逻辑，可直接调用该方法即可，调用过后拿到的this.searchData即为最新参数
    //   if (this.getFilterTable) {
    //     const el = this.$_live_getChildComponent(this, 'tabBar');
    //     const tabCurrentIndex = el.$refs.R3_Tabs.focusedKey;
    //     const { stopRequest } = data
    //     el.tabClick(tabCurrentIndex, stopRequest);
    //   }
    // },
    // searchClickData(value) {
    //       this.resetButtonsStatus();
    //       // 按钮查找 查询第一页数据
    //       if (!value) { // 返回时查询之前页码
    //         this.searchData.startIndex = 0;
    //       }
    //       if (this.getFilterTable) {
    //         const el = this.$_live_getChildComponent(this, 'tabBar');
    //         const tabCurrentIndex = el.$refs.R3_Tabs.focusedKey;
    //         el.tabClick(tabCurrentIndex);
    //       } else {
    //         this.searchData.fixedcolumns = this.dataProcessing();
    //       }
    //       // this.getQueryListForAg(this.searchData);
    //       if (this.buttons.isBig) {
    //         this.updataIsBig(false);
    //       }
    //       this.getQueryListPromise(this.searchData);
    //       this.onSelectionChangedAssignment({ rowIdArray: [], rowArray: [] });// 查询成功后清除表格选中项
    //     },



    requiredCheck (data) { // 查询条件必填校验
      return new Promise((resolve, reject) => {
        this.formItems.defaultFormItemsLists.map((item) => {
          const value = data.fixedcolumns[item.colname]
          if (item.webconf && item.webconf.required && !value) {
            this.$Modal.fcError({
              title: this.$t('feedback.error'),
              content: this.$t('messages.searchIsRequired',{desc:item.coldesc}),
              mask: true
            });
            this.$R3loading.hide(this.loadingName);
            reject();
          }
        });
        resolve();
      });
    },
    getOrderMarks(message){
      // 订单标记 获取虚拟标记的数据
      const Form = this.$_live_getChildComponent(this, 'listsForm');
      if(!Form || !Array.isArray(Form.virtualKey)){
          return message;
      }
       Form.virtualKey.reduce((arr,item)=>{
        //  清除虚拟字段的key
       delete message.fixedcolumns[item];
        let dom = document.querySelector(`#${item}`);
        if(dom && dom.__vue__){
          let value = dom.__vue__.value;
          if(Array.isArray(value)){
            value.forEach((item)=>{
             if(item){
               let key = item.split(':')[0];
               let keyValue = item.split(':')[1];
               if(item.split(':')[2] == 'true'){
                //  是否是数字格式
                  keyValue = Number(keyValue);
               }
               if(item.split(':')[3]){
                //  是否是字符串模式
                  keyValue = `${keyValue}`
               }else{
                  keyValue = `=${keyValue}`

               }
               if(message.fixedcolumns[key]){
                 if(message.fixedcolumns[key].includes(keyValue) === false){
                   if(Array.isArray(message.fixedcolumns[key])){
                      message.fixedcolumns[key].push(`${keyValue}`);      
                   }else{
                      message.fixedcolumns[key] =message.fixedcolumns[key] + ` ${keyValue}`;      
                   }
                    
                 }
              }else{
                message.fixedcolumns[key] = [`${keyValue}`];
              }
             }
          })

          }
          
        }

      },{});  
      return message;

    },
    getQueryListPromise (message, searchDataRes) {
      // 重拼树的数据
      let data = this.getOrderMarks(message);
      setTimeout(() => {
        data = Object.assign(data, JSON.parse(JSON.stringify(this.treeSearchData || {})));
        // fix: (#47768)如果查询条件巧好有id字段，会导致查询失效，所以把下面这行(#39252)注释掉了
        // delete data.fixedcolumns.ID // fix: (#39252)点击导出，再查询会携带id参数
        if(this.R3_setQueryList && typeof this.R3_setQueryList ==='function'){
            // 回调函数  重新组合
            data = this.R3_setQueryList(data);
        }
        const promise = new Promise((resolve, reject) => {
          this.requiredCheck(data).then(() => {
            this.$R3loading.show(this.loadingName);
            const currentParame = this.paramePreEvent(data, searchDataRes)
            currentParame.resolve = resolve;
            currentParame.reject = reject;
            currentParame.isolr = this.buttons.isSolr;

            if (enableKAQueryDataForUser() || this.webConf.enableKAQueryDataForUser) {
                if(this.$_live_getChildComponent(this, 'listsForm')){
                  this.$_live_getChildComponent(this, 'listsForm').getFormDataLabel().then(async search => {
                      this.formItems.defaultFormItemsLists.map((temp) => {
                        // 存储查询条件时过滤掉弹窗多选类型
                        if (temp.display === 'OBJ_FK' && temp.fkobj.searchmodel === 'mop') {
                          delete search[temp.colname];
                        }
                        // 过滤外键字符串
                        if (temp.display === 'OBJ_FK') {
                          if (!Array.isArray(search[temp.colname])) {
                            delete search[temp.colname];
                          }
                        }
                      });
                      search.R3UserId = `${this.userInfo.id}_${this.searchData.table}`;
                      addSearch(search);

                      // this.updateSearchDBdata({});
                      this.updateFormData(await this.dataProcessing());
                    })

                }  
                
              
            }
            this.getQueryListForAg(currentParame);
          });
        });
        promise.then((res) => {
          this.onSelectionChangedAssignment({ rowIdArray: [], rowArray: [] });// 查询成功后清除表格选中项
          this.$refs.agTableElement.clearChecked();
          if (!this.searchData.range) {
            if (Version() === '1.3') {
              this.searchData.range = res.data.datas.defaultrange;
            } else {
              this.searchData.range = res.data.data.defaultrange;
            }
          }
          this.$R3loading.hide(this.loadingName);
        }, () => { // 状态为rejected时执行
          this.$R3loading.hide(this.loadingName);
        });
      }, 150);
    },
    paramePreEvent (data, searchDataRes) {
      //data：全局参数
      //searchDataRes:局部方法根据全局参数进行整合的参数
      //
      if (searchDataRes) {
        searchDataRes.fixedcolumns = data.fixedcolumns
      }
      const currentParame = searchDataRes || data
      return currentParame
    },

    // 弹出消息提示框
    dialogMessage (title, contentText, obj) {
      this.setErrorModalValue({
        title,
        contentText,
      });
      const data = {
        mask: this.buttons.dialogConfig.mask,
        title: this.buttons.dialogConfig.title,
        content: this.buttons.dialogConfig.contentText,
        showCancel: true,
        onOk: () => {
          this.confirmDialog(obj);
        }
      };
      this.$Modal.fcWarning(data);
      // this.$refs.dialogRefs.open();
    },
    AddDetailClick (type, obj) {
      DispatchEvent('R3StandardButtonClick', {
        detail: {
          type, obj
        }
      });
      const { tableName, tableId, } = this[INSTANCE_ROUTE_QUERY];
      if (obj.name === this.buttonMap.CMD_ADD.name) {
        // 新增
        if (this.ag.tableurl) {
          let tableurl = '';
          if (this.ag.tableurl.includes('?')) {
            tableurl = getUserenv({ url: this.ag.tableurl });
          } else {
            tableurl = this.ag.tableurl;
          }
          const actionType = tableurl.substring(0, tableurl.indexOf('/'));
          const singleEditType = tableurl.substring(tableurl.lastIndexOf('/') + 1, tableurl.length);
          if (actionType === 'SYSTEM') {
            if (singleEditType === ':itemId') {
              const path = `/${tableurl.replace(/:itemId/, 'New')}`;
              this.$router.push(
                path
              );
            } else {
              const path = `/${tableurl}`;
              this.$router.push(
                path
              );
            }
          } else if (actionType.toUpperCase() === 'CUSTOMIZED') {
            const customizedModuleName = tableurl.substring(tableurl.indexOf('/') + 1, tableurl.lastIndexOf('/')).toLocaleUpperCase();
            const path = `${CUSTOMIZED_MODULE_PREFIX}/${customizedModuleName.toUpperCase()}/New`;
            this.$router.push({
              path
            });
            const objs = {
              customizedModuleName,
              id: 'New'
            };
            window.sessionStorage.setItem('customizedMessage', JSON.stringify(objs));
            const externalModules = (window.ProjectConfig || { externalModules: undefined }).externalModules || {};
            const customizeConfig = Object.keys(externalModules).length > 0 ? externalModules : customize;
            Object.keys(customizeConfig).forEach((customizeName) => {
              const nameToUpperCase = customizeName.toUpperCase();
              if (nameToUpperCase === customizedModuleName) {
                const labelName = `${customizeConfig[customizeName].labelName}`;
                const name = `C.${customizedModuleName}.New`;
                this.addKeepAliveLabelMaps({ name, label: labelName });
                // this.addServiceIdMap({ name, label: labelName });
              }
            });
            return;
          }
        } else {
          const id = 'New';
          const label = `${this.activeTab.label}新增`;
          let type = '';
          if (this.buttons.isBigStatus) { // 配置海量
            let {hugeQuery} = window.ProjectConfig;
            if(hugeQuery){
              let type = hugeQuery.reduce((arr,item)=>{
                if(item.table === tableName){
                   arr = item.tabpanle;
                } 
                return arr;
              },'');
              if(type){
                  this.tabOpen({
                  type,
                  tableName,
                  tableId,
                  label,
                  id,
                });
                return;
              }
              
            }
            window.getObjdisType({ table: tableName }).then((res) => {
              type = res === 'tabpanle' ? 'H' : 'V';
              this.tabOpen({
                type,
                tableName,
                tableId,
                label,
                id,
              });
            });
          } else if (this.ag.datas.objdistype === 'tabpanle') { // 单对象左右结构
            type = 'tableDetailHorizontal';
          } else {
            type = 'tableDetailVertical'; // 左右结构的单对项页面
          }


          this.tabOpen({
            type,
            tableName,
            tableId,
            label,
            id,
          });
          return;
        }
      }
      if (obj.name === this.buttonMap.CMD_DELETE.name) {
        // 删除动作  对用网络请求
        if (this.buttons.selectIdArr.length > 0) {
          const title = this.$t('feedback.warning');
          const contentText = this.$t('messages.confirmAction',{action:obj.name});
          this.dialogMessage(title, contentText, obj);
        } else {
          const data = {
            mask: true,
            title: this.$t('feedback.warning'),
            content: this.$t('messages.chooseRecord',{action:obj.name})
          };
          this.$Modal.fcWarning(data);
        }
        return;
      }

      if (obj.name === this.buttonMap.CMD_SUBMIT.name) {
        // 批量提交
        this.buttons.dynamicRequestUrl.submit = obj.requestUrlPath;
        if (this.buttons.selectIdArr.length > 0) {
          const title = this.$t('feedback.warning');
          const contentText = this.$t('messages.confirmAction',{action:obj.name});
          this.dialogMessage(title, contentText, obj);
        } else {
          const data = {
            mask: true,
            title: this.$t('feedback.warning'),
            content: this.$t('messages.chooseRecord',{action:obj.name})
          };
          this.$Modal.fcWarning(data);
        }
        return;
      }

      if (obj.name === this.buttonMap.CMD_VOID.name) {
        // 批量作废
        if (this.buttons.selectIdArr.length > 0) {
          const title = this.$t('feedback.warning');
          const contentText = this.$t('messages.confirmAction',{action:obj.name});
          this.dialogMessage(title, contentText, obj);
        } else {
          const data = {
            mask: true,
            title: this.$t('feedback.warning'),
            content: this.$t('messages.chooseRecord',{action:obj.name})
          };
          this.$Modal.fcWarning(data);
        }
        return;
      }

      if (obj.name === this.buttonMap.CMD_UNSUBMIT.name) {
        // 批量反提交
        if (this.buttons.selectIdArr.length > 0) {
          const title = this.$t('feedback.warning');
          const contentText = this.$t('messages.confirmAction',{action:obj.name});
          this.dialogMessage(title, contentText, obj);
        } else {
          const data = {
            mask: true,
            title: this.$t('feedback.warning'),
            content: this.$t('messages.chooseRecord',{action:obj.name})
          };
          this.$Modal.fcWarning(data);
        }
        return;
      }

      if (obj.name === this.buttonMap.CMD_EXPORT.name) {
        // 全量导出
        if (this.buttons.selectIdArr.length === 0) {
          if(enableAsyncTaskTip() && asyncTaskScheme() !== 'skq') {
            const title = this.$t('feedback.warning');
            const contentText = this.$t('messages.exportAllTip')
            this.dialogMessage(title, contentText, obj);
          } else {
            this.batchExport(obj);
          }

          return;
        }
        if (this.R3_openedApi_export && typeof this.R3_openedApi_export === 'function') {
          this.R3_openedApi_export(obj);
        } else {
          // 批量导出
          this.batchExport(obj);
        }
        return;
      }

      if (obj.name === this.buttonMap.CMD_IMPORT.name) {
        // 导入
        this.setImportDialogTitle(true);
        // this.importGetUploadParametersForButtons(); // 调用导入参数接口
        return;
      }
      if (obj.name === this.buttonMap.CMD_GROUPMODIFY.name) {
        // 批量修改
        if (this.buttons.selectIdArr.length > 0) {
          this.modifyDialogshow = true;
          setTimeout(() => {
            this.$refs.dialogmodify.open(
              this[INSTANCE_ROUTE_QUERY], this.buttons.selectIdArr.length, this.searchData.fixedcolumns, this.buttons.selectIdArr, obj
            );
          }, 200);
        } else {
          if (blockFullOperation()) { // 控制批量修改在未选择数据时，不做处理
            this.$Modal.fcWarning({
              mask: true,
              title: this.$t('feedback.warning'),
              content: this.$t('messages.selectModifiedData')
            });
            return;
          }
          this.$Modal.fcWarning({
            mask: true,
            title: this.$t('feedback.warning'),
            content: this.$t('messages.updateSearchResult',{total:this.ag.datas.totalRowCount}),
            showCancel: true,
            onOk: () => {
              this.modifyDialogshow = true;
              setTimeout(() => {
                this.$refs.dialogmodify.open(
                  this[INSTANCE_ROUTE_QUERY], this.ag.datas.totalRowCount, this.searchData.fixedcolumns, 'all', obj
                );
              }, 200);
            },
            onCancel: () => {

            }

          });
        }
      }
    },

    batchExport (buttonsData) {
      if(asyncTaskScheme() !== 'skq') {
        this.$R3loading.show(this.loadingName);
      }
      // let searchData = {};
      // const { tableName } = this[INSTANCE_ROUTE_QUERY];
      // 导出
      // searchData = {
      //   table: tableName,
      //   column_include_uicontroller: true,
      //   fixedcolumns: { ID: this.buttons.selectIdArr },
      //   range: 10,
      //   startindex: 0
      // };

      const searchdata = JSON.parse(JSON.stringify(this.searchData))
      if (this.buttons.selectIdArr.length !== 0) {
        searchdata.fixedcolumns = { ID: this.buttons.selectIdArr };
      }
      searchdata.column_include_uicontroller =  true
      // fix:海量数据导出bug
      if(!searchdata.fixedcolumns) {
          searchdata.fixedcolumns = {}
      }
      const OBJ = {
        searchdata,
        filename: this.activeTab.label,
        filetype: '.xlsx',
        showColumnName: true,
        menu: this.activeTab.label
      };

      // 新异步任务
      if(asyncTaskScheme() === 'skq') {
        const params = {
          detail: {
            apiParams: OBJ
          }
        }
        const { jflowpath, requestUrlPath } = buttonsData
        if(jflowpath || requestUrlPath) {
          params.url = jflowpath || requestUrlPath
        }
        DispatchEvent(R3_EXPORT, params)
        return
      }
      
      window.localStorage.setItem('r3-stopPolling', true) // 锁住通知发送

      const promise = new Promise((resolve, reject) => {
        this.getExportQueryForButtons({
          OBJ, resolve, reject, buttonsData
        });
      });
      promise.then(() => {
        if (this.buttons.exportdata) {
          if (Version() === '1.4') { // Version() === '1.4'

            // fileUrl字段不存在时就代表是异步导出。
            // 异步导出在[我的任务]查看
            if (messageSwitch()) {
              this.asyncExport()
              return
            }

            window.localStorage.setItem('r3-stopPolling', '') // 允许通知发送
            window.dispatchEvent(new CustomEvent('checkNotice')) // 触发通知检测。防止同步任务阻塞期间，把其他异步任务通知拦截了

            this.$R3loading.hide(this.loadingName);
            const eleLink = document.createElement('a');
            const path = getGateway(`/p/cs/download?filename=${this.buttons.exportdata.fileUrl}`);
            eleLink.setAttribute('href', path);
            eleLink.style.display = 'none';
            document.body.appendChild(eleLink);
            eleLink.click();
            document.body.removeChild(eleLink);
          } else if (Version() === '1.3') { // Version() === '1.3'
            this.asyncExport()

            // // fileUrl字段不存在时就代表是异步导出。
            // // 异步导出在[我的任务]查看
            // if(!this.buttons.exportdata.fileUrl) {
            //   this.$R3loading.hide(this.loadingName);
            //   if (window.ProjectConfig.messageSwitch) {
                // this.$Modal.fcSuccess({
                //   title: this.$t('feedback.success'),
                //   mask: true,
                //   content: this.$t('messages.processingTask')
                // });
            //   }
            //   return
            // }

            // const promises = new Promise((resolve, reject) => {
            //   this.getExportedState({
            //     objid: this.buttons.exportdata, id: this.buttons.exportdata, resolve, reject
            //   });
            // });
            // promises.then(() => {
            //   this.$R3loading.hide(this.loadingName);
            //   if (this.exportTasks.dialog) {
                // const message = {
                //   mask: true,
                //   title: this.$t('feedback.alert'),
                //   content: this.$t('messages.processingTask'),
                //   showCancel: true,
                //   onOk: () => {
                //     const type = 'tableDetailVertical';
                //     const tab = {
                //       type,
                //       tableName: Version() === '1.3' ? 'CP_C_TASK' : 'U_NOTE',
                //       tableId: Version() === '1.3' ? 24386 : 963,
                //       id: this.buttons.exportdata
                //     };
                //     this.tabOpen(tab);
                //     this.updataTaskMessageCount({ id: this.buttons.exportdata, stopUpdataQuantity: true });
                //   }
                // };
                // this.$Modal.fcWarning(message);
            //   }
            //   if (this.exportTasks.successMsg) {
            //     const data = {
            //       mask: true,
            //       title: this.$t('feedback.success'),
            //       content: this.exportTasks.resultMsg
            //     };
            //     this.$Modal.fcSuccess(data);
            //   }
            //   this.searchClickData();
            // }, () => {
            //   if (this.exportTasks.warningMsg) {
            //     this.$R3loading.hide(this.loadingName);
            //     const data = {
            //       mask: true,
            //       title: this.$t('feedback.error'),
            //       content: `${this.exportTasks.resultMsg}`
            //     };
            //     this.$Modal.fcError(data);
            //   }
            // });
          }
        } else {
          this.$R3loading.hide(this.loadingName);
        }
      }, () => {
        this.searchClickData();
        this.$R3loading.hide(this.loadingName);
      });
    },

    // 异步导出
    asyncExport() {
      const id = Version() === '1.3' ? this.buttons.exportdata : this.buttons.exportdata.fileUrl
      const promises = new Promise((resolve, reject) => {
        this.getExportedState({
          objid: id, id, resolve, reject
        });
      });
      promises.then(() => {
        this.$R3loading.hide(this.loadingName);

        window.localStorage.setItem('r3-stopPolling', '') // 允许通知发送
        window.dispatchEvent(new CustomEvent('checkNotice')) // 触发通知检测。防止同步任务阻塞期间，把其他异步任务通知拦截了

        if (this.exportTasks.dialog) {
          if(enableAsyncTaskTip() && Version() === '1.3') {
              const message = {
                mask: true,
                title: this.$t('feedback.alert'),
                content: this.$t('messages.asyncImportSuccess'),
                showCancel: true,
                onOk: () => {
                  const type = 'tableDetailVertical';
                  const tab = {
                    type,
                    tableName: Version() === '1.3' ? 'CP_C_TASK' : 'U_NOTE',
                    tableId: Version() === '1.3' ? 24386 : 963,
                    id: this.buttons.exportdata
                  };
                  this.tabOpen(tab);
                  this.updataTaskMessageCount({ id: this.buttons.exportdata, stopUpdataQuantity: true });
                }
              };
              this.$Modal.fcWarning(message);
              return
          }
          const msg = !enableTaskNotice() && enableAsyncTaskTip() ? this.$t('messages.asyncTaskTip'): this.$t('messages.processingTask')
          this.$Message.success({
            content: msg,
            duration: 5
          })
        }
        if (this.exportTasks.successMsg) {
          this.$Message.success(this.exportTasks.resultMsg)
        }
        // this.searchClickData();
      }, () => {
        this.$R3loading.hide(this.loadingName);
        if (this.exportTasks.warningMsg) {
          const data = {
            mask: true,
            title: this.$t('feedback.error'),
            content: `${this.exportTasks.resultMsg}`
          };
          this.$Modal.fcError(data);
        }
      });
    },

    deleteTableList (data) { // 删除方法
      const tableName = this.buttons.tableName;
      const selectIdArr = this.buttons.selectIdArr;
      const promise = new Promise((resolve, reject) => {
        this.getBatchDeleteForButtons({
          tableName, selectIdArr, resolve, reject, data
        });
      });
      promise.then(() => {
        const message = this.buttons.batchDeleteData.message;
        const datas = {
          mask: true,
          title: this.$t('feedback.success'),
          content: `${message}`
        };
        this.$Modal.fcSuccess(datas);
      }, () => { });
    },
    batchVoid (data) {
      const tableName = this.buttons.tableName;
      const ids = this.buttons.selectIdArr.map(d => window.parseInt16(d));
      const promise = new Promise((resolve, reject) => {
        this.batchVoidForButtons({
          tableName, ids, resolve, reject, data
        });
      });
      promise.then(() => {
        const message = this.buttons.batchVoidForButtonsData.message;
        const data = {
          mask: true,
          title: this.$t('feedback.success'),
          content: `${message}`
        };
        this.$Modal.fcSuccess(data);
      }, () => { });
    },
    batchSubmit (data) {
      // 批量提交
      const url = this.buttons.dynamicRequestUrl.submit;
      const tableName = this.buttons.tableName;
      const ids = this.buttons.selectIdArr.map(d => window.parseInt16(d));
      const promise = new Promise((resolve, reject) => {
        this.batchSubmitForButtons({
          url, tableName, ids, resolve, reject, moduleName: this[MODULE_COMPONENT_NAME], routeQuery: this[INSTANCE_ROUTE_QUERY], routePath: this[INSTANCE_ROUTE], data
        });
      });
      promise.then(() => {
        const message = this.buttons.batchSubmitData.message;
        const data = {
          mask: true,
          title: this.$t('feedback.success'),
          content: `${message}`
        };
        this.$Modal.fcSuccess(data);
      }, () => { });
    },
    batchUnSubmit (data) {
      // 批量反提交
      const obj = {
        tableName: this.buttons.tableName,
        ids: this.buttons.selectIdArr.map(d => window.parseInt16(d))
      };
      const promise = new Promise((resolve, reject) => {
        this.batchUnSubmitForButtons({
          obj, resolve, reject, data
        });
      });
      promise.then(() => {
        const message = this.buttons.batchUnSubmitData;
        if (message) {
          const data = {
            mask: true,
            title: this.$t('feedback.success'),
            content: `${message}`
          };
          this.$Modal.fcSuccess(data);
          // this.getQueryListForAg(this.searchData);
        }
      }, () => { });
    },
    forAgTableErrorMessage (errorData) { // 操纵列表数据失败时ag显示错误提示的图标以及message
      this.setAgTableErrorMessage(errorData);
    },
    clickButtonsCollect () { // 收藏
      const params = {
        id: this.buttons.tableId,
        type: 'table'
      };
      if (this.buttons.dataArray.collectiImg) {
        // 取消收藏
        this.getRemoveFavoriteDataForButtons(params);
      } else {
        // 添加收藏
        this.getToFavoriteDataForButtons(params);
      }
    },
    // 点击确认后的弹框
    confirmDialog (obj) {
      if (this.buttons.selectIdArr.length > 0) {
        switch (obj.eName) {
          case 'actionDELETE': // 删除
            this.deleteTableList(obj); // 按钮删除动作
            break;
          case 'actionSUBMIT': // 提交
            this.batchSubmit(obj);// 按钮提交动作
            break;
          case 'actionUNSUBMIT': // 取消提交
            this.batchUnSubmit(obj);// 按钮取消提交动作
            break;
          case 'actionVOID': // 作废
            this.batchVoid(obj); // 按钮作废动作
            break;

          default:
            break;
        }
      }
      if (this.buttons.activeTabAction) {
        if (this.buttons.activeTabAction.vuedisplay === 'slient' || obj.vuedisplay === 'slient_custom') {
          // slient静默跳转页面类型按钮
          if (this.buttons.activeTabAction.confirm.indexOf('{') >= 0) {
            if (JSON.parse(this.buttons.activeTabAction.confirm).isselect) {
              if (
                JSON.parse(this.buttons.activeTabAction.confirm).isradio
              ) {
                // 单选
                if (this.buttons.selectIdArr.length === 1) {
                  this.webActionSlient(this.buttons.activeTabAction, obj); // 静默执行
                }
              } else if (this.buttons.selectIdArr.length > 0) {
                this.webActionSlient(this.buttons.activeTabAction, obj);
              }
            } else {
              this.webActionSlient(this.buttons.activeTabAction, obj);
            }
          } else {
            this.webActionSlient(this.buttons.activeTabAction, obj);
          }
          return;
        }
        if (this.buttons.activeTabAction.vuedisplay === 'navbar') {
          if (this.buttons.activeTabAction.confirm.indexOf('{') >= 0) {
            if (JSON.parse(this.buttons.activeTabAction.confirm).isselect) {
              if (
                JSON.parse(this.buttons.activeTabAction.confirm).isradio
              ) {
                // 单选
                if (this.buttons.selectIdArr.length === 1) {
                  this.objTabActionNavbar(this.buttons.activeTabAction); // 新标签跳转
                }
              } else if (this.buttons.selectIdArr.length > 0) {
                this.objTabActionNavbar(this.buttons.activeTabAction);
              }
            } else {
              this.objTabActionNavbar(this.buttons.activeTabAction);
            }
          } else {
            this.objTabActionNavbar(this.buttons.activeTabAction);
          }
          return;
        }
        if (this.buttons.activeTabAction.vuedisplay === 'dialog') {
          // 弹窗动作定义提示后操作
          if (this.buttons.activeTabAction.confirm.indexOf('{') >= 0) {
            if (JSON.parse(this.buttons.activeTabAction.confirm).isselect) {
              if (JSON.parse(this.buttons.activeTabAction.confirm).isradio) {
                // 单选
                if (this.buttons.selectIdArr.length === 1) {
                  this.objTabActionDialog(this.buttons.activeTabAction);
                }
              } else if (this.buttons.selectIdArr.length > 0) {
                this.objTabActionDialog(this.buttons.activeTabAction);
              }
            } else {
              this.objTabActionDialog(this.buttons.activeTabAction);
            }
          } else {
            this.objTabActionDialog(this.buttons.activeTabAction);
          }
        }
        if (this.buttons.dialogConfig.contentText.indexOf(this.$t('buttons.batchUpdate')) >= 0) {
          this.dataConShow.dataConShow = true;
          this.dataConShow.title = this.$store.state.activeTab.label;
          this.dataConShow.tabConfig = {
            tabledesc: this.$store.state.activeTab.label,
            tablename: this.param.tablename,
            tableid: this.formObj_tableid,
            tabrelation: '1:1',
            objid: this.buttons.selectIdArr
          };
        } else if (
          this.buttons.dialogConfig.contentText.indexOf(this.$t('messages.execExportAll')) >= 0
        ) {
          // this.batchExport(obj);
          // 是否需要进行二次校验
          if (this.R3_openedApi_export && typeof this.R3_openedApi_export === 'function') {
            this.R3_openedApi_export(obj);
          } else {
            this.batchExport(obj);
          }
        } else if (this.buttons.selectSysment.length > 0) {
          this.searchData('backfresh');
        }
      }
    },
    errorDialogClose () {
      const errorDialogvalue = false;
      this.setErrorModalValue({ errorDialogvalue });
    },

    objTabActionNavbar (tab) {
      if (tab.action) {
        // const a = 'SYSTEM/TABLE/AD_TABLE/992?AD_CLIENT_NAME={AD_CLIENT_NAME}&AD_ORG_ID={AD_ORG_ID}';
        let tabAction = '';
        // tab.action = a;
        if (tab.action && tab.action.includes('?')) {
          tabAction = getUserenv({ url: tab.action });
        } else {
          tabAction = tab.action;
        }
        const actionType = tabAction.substring(0, tabAction.indexOf('/'));
        const singleEditType = tabAction.substring(tabAction.lastIndexOf('/') + 1, tabAction.length);
        if (actionType === 'SYSTEM') {
          if (singleEditType === ':itemId') {
            if (this.buttons.selectIdArr.length === 0) {
              this.$Message.warning(this.$t('messages.checkID'));
              return;
            } if (this.buttons.selectIdArr.length > 1) {
              this.$Message.warning(this.$t('messages.checkSingleID'));
              return;
            }
            const itemId = this.buttons.selectIdArr.filter(item => item);
            const path = `/${tabAction.replace(/:itemId/, itemId)}`;
            this.$router.push(
              path
            );
          } else {
            const path = `/${tabAction}`;
            this.$router.push(
              path
            );
          }
        } else if (actionType === 'https:' || actionType === 'http:') {
          let linkUrl = '';
          if (tabAction.indexOf(':itemId') !== -1) {
            if (this.buttons.selectIdArr.length === 0) {
              this.$Message.warning(this.$t('messages.checkID'));
              return;
            } if (this.buttons.selectIdArr.length > 1) {
              this.$Message.warning(this.$t('messages.checkSingleID'));
              return;
            }
            linkUrl = `${tabAction.replace(':itemId', '')}?id=${this.buttons.selectIdArr.toString()}`;
          } else {
            linkUrl = tabAction;
          }
          const type = 'tableDetailUrl';
          this.tabOpen({
            type,
            linkName: tab.webname,
            linkId: tab.webid
          });
          const name = `${LINK_MODULE_COMPONENT_PREFIX}.${tab.webname.toUpperCase()}.${tab.webid}`;
          this.addKeepAliveLabelMaps({ name, label: tab.webdesc });
          // const linkId = tab.webid;
          const linkModuleName = tab.webname.toUpperCase();
          if (!this.LinkUrl[linkModuleName]) {
            this.increaseLinkUrl({ linkModuleName, linkUrl });
          }
          const obj = {
            linkName: tab.webname,
            linkId: tab.webid,
            linkUrl,
            linkLabel: tab.webdesc
          };
          window.sessionStorage.setItem('tableDetailUrlMessage', JSON.stringify(obj));
          const data = {
            type: 'standardCustomizeButtonLink',
            value: tab,
            customizedModuleName: tab.webname.toUpperCase()
            // 因外链界面tablinkName相同时，只激活一个tab,所以外链界面用linkName作为key存入session,避免因勾选的id不同存入多个，导致关闭当前tab时无法清除存入的多个
          };

          this.updateCustomizeMessage(data);
        } else if (actionType.toUpperCase() === 'CUSTOMIZED') {
          const name = getLabel({ url: tabAction, id: tab.webid, type: 'customized' });
          // this.addKeepAliveLabelMaps({ name, label: tab.webdesc });
          // const path = getUrl({ url: tabAction, id: tab.webid, type: 'customized' });
          // const keepAliveLabelMapsObj = {
          //   k: name,
          //   v: tab.webdesc
          // };
          const undataFromPageCustomizeButtonInfo = {
            k: name,
            v: this[INSTANCE_ROUTE_QUERY]
          };
          updateSessionObject('undataFromPageCustomizeButtonInfo', undataFromPageCustomizeButtonInfo);// 将自定义按钮为跳转自定义界面类型的自定义按钮信息存入session

          // updateSessionObject('keepAliveLabelMaps', keepAliveLabelMapsObj);// keepAliveLabel因刷新后来源信息消失，存入session
          // router.push(
          //   path
          // );
          const itemId = this.buttons.selectIdArr.filter(item => item);

          if (singleEditType === ':itemId') {
            if (this.buttons.selectIdArr.length === 0) {
              this.$Message.warning(this.$t('messages.checkID'));
              return;
            } if (this.buttons.selectIdArr.length > 1) {
              this.$Message.warning(this.$t('messages.checkSingleID'));
              return;
            }
            const path = `${tabAction.replace(/:itemId/, itemId)}`;
            const param = {
              url: path,
              id: itemId[0],
              isMenu: true,
            };
            this.directionalRouter(param);// 定向路由跳转方法

            // router.push(
            //   path
            // );
          } else {
            const path = `${tabAction}/${tab.webid}`;
            // router.push(
            //   path
            // );
            const param = {
              url: path,
              id: tab.webid,
              // label: tab.webdesc,
              isMenu: true,
            };
            this.directionalRouter(param);// 定向路由跳转方法
          }
          const customizedModuleName = tab.action.split('/')[1];

          const data = {
            type: 'standardCustomizeButton',
            value: tab,
            // customizedModuleId: itemId[0]
            // customizedModuleName: customizedModuleName.toLocaleUpperCase()
            // 自定义界面：相同自定义界面标记，ID不同时，只激活同一个tab
          };
          if (enableActivateSameCustomizePage()) {
            data.customizedModuleName = customizedModuleName.toLocaleUpperCase();
          } else {
            data.customizedModuleId = itemId[0];
          }
          this.updateCustomizeMessage(data);
        }
      }
    },

    // network 监听函数
    networkEventListener (event) {
      if (this._inactive) { return; }
      const { detail } = event;
      const { response } = detail;
      // this.urlArr = ['/p/cs/batchUnSubmit', '/p/cs/batchSubmit', '/p/cs/batchDelete', '/p/cs/batchVoid'];
      let merge = false;
      if (this.urlArr.indexOf(detail.url || '') > -1) {
        if (response && response.data && response.data.code === -1) {
          merge = true;
        }

        const {
          allPages, currentPage, currentPageSize, total
        } = this.$refs.agTableElement.$children[0];
        const selectIdArrLength = this.buttons.selectIdArr ? this.buttons.selectIdArr.length : 0;
        // const detailTable = document.querySelector('.detailTable').agTable.api.paginationProxy.pageSize;
        let currentPageSizes = Math.ceil(total % currentPageSize);
        if (currentPageSizes === 0) {
          currentPageSizes = currentPageSize;
        }

        if (selectIdArrLength === currentPageSizes && allPages === currentPage) { // 如果分页在最后一页并且删除当页全部
          this.searchData.startIndex = currentPageSize * ((total - selectIdArrLength) / currentPageSize - 1);
          this.searchData.startIndex = this.searchData.startIndex >= 0 ? this.searchData.startIndex : 0;
        }
        // this.getQueryListForAg(Object.assign({}, this.searchData, { merge }));
        this.getQueryListPromise(Object.assign({}, this.searchData, { merge }));
      }
    },

    // getTableQuery监听,做第一次数据查询
    async networkGetTableQuery (event) {
      if (this._inactive) { return; }
      const { detail } = event;

      if (detail.url === '/p/cs/getTableQuery' && (Version() === '1.4' ? detail.response.data.data.tabcmd : detail.response.data.tabcmd)) {
        this.updateFormData(await this.dataProcessing());
        const enableKAQueryDataForUserFlag = Version() === '1.4' ? !!(detail.response.data.data.datas.webconf && detail.response.data.data.datas.webconf.enableKAQueryDataForUser) : !!(detail.response.data.datas.webconf && detail.response.data.datas.webconf.enableKAQueryDataForUser);
        if (!this.buttons.isBig || this.resetType === true) {
          // 初始化调用时，ie环境下增加500ms延时调用
          if (this.isIE()) {
            setTimeout(() => {
              this.firstSearchTable();
            }, 500);
          } else {
            setTimeout(() => {
              this.firstSearchTable();
            }, 100);
          }
        }
      }
    },

    isIE () {
      if (!!window.ActiveXObject || 'ActiveXObject' in window) return true;
      return false;
    },
    // 监听update.ST.FailInfo事件
    updateSTFailInfo (event) {
      if (event.detail[MODULE_COMPONENT_NAME] === this[MODULE_COMPONENT_NAME]) {
        this.updateFailInfo(event.detail.failInfo);
      }
    }
  },
  mounted () {
    setTimeout(() => {
      // 判断页面是否渲染完成,用于判断树是否调用
      this.mountedChecked = true;
    }, 2000);
    this.searchData.table = this[INSTANCE_ROUTE_QUERY].tableName;
    if (!this._inactive) {
      window.addEventListener('network', this.networkEventListener);
      window.addEventListener('network', this.networkGetTableQuery);
      window.addEventListener('updateSTFailInfo', this.updateSTFailInfo);
    }
    this.updateUserConfig({ type: 'table', id: this[INSTANCE_ROUTE_QUERY].tableId });
    const promise = new Promise((resolve, reject) => {
      const searchData = this.searchData;
      this.getTableQueryForForm({ searchData, resolve, reject });
    });
    promise.then(() => {
      this.getbuttonGroupdata();
    });
  },
  activated () {
    const { tableId } = this[INSTANCE_ROUTE_QUERY];
    this.updateAccessHistory({ type: 'table', id: tableId });
  },
   async created () {
    this._colPositionCache = undefined // 缓存表格列位置，如果相同不再请求接口
    this.buttonMap = buttonmap;
    this.ChineseDictionary = ChineseDictionary;
    this.loadingName = this.$route.meta.moduleName.replace(/\./g, '-');
    // if (window.ProjectConfig.layoutDirectionSlot && window.ProjectConfig.layoutDirectionSlot.standardTableList) {
    //   this.slotName = window.ProjectConfig.layoutDirectionSlot.standardTableList;
    // } else {
    //   this.slotName = slotTemplate;
    // }
    this.slotName = slotTemplate;
  
     if (window.ProjectConfig.layoutDirectionSlot && window.ProjectConfig.layoutDirectionSlot.standardTableList) {
      //  标准列表配置
       if( window.ProjectConfig.layoutDirectionSlot.standardTableList.defined){
          // 全局配置  
          this.defined = window.ProjectConfig.layoutDirectionSlot.standardTableList.defined;
       }else{
        let table_name= this[INSTANCE_ROUTE_QUERY].tableName;
        // 配置表
        let { tableName } = window.ProjectConfig.layoutDirectionSlot.standardTableList;
        if(tableName && tableName[table_name] ){
          if(tableName[table_name].defined){
            // 配置当前的defind
            this.defined = tableName[table_name].defined;
          }else if(tableName[table_name].layout){
            // 配置当前的表的布局
            this.slotName = tableName[table_name].layout;
            if( typeof this.slotName ==='object'){
              this.slotTemple = this.slotName.slotTemple;
            }else{
              this.slotTemple = (await this.slotName()).default.slotTemple;
            }
          }

        }
       
      
       }

    } else {
      this.defined = '';
    }

  },
  beforeDestroy () {
    window.removeEventListener('network', this.networkEventListener);
    window.removeEventListener('network', this.networkGetTableQuery);
    window.removeEventListener('updateSTFailInfo', this.updateSTFailInfo);
  }
};
</script>
