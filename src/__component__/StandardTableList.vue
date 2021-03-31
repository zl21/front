
<!--suppress ALL -->
<template>
  <div
    :id=" this.$router.currentRoute.params.tableName"
    class="standarTableListContent"
  >
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
    
    <tree
      v-if="isTreeList&&treeShow"
      ref="tree"
      :tree-datas="treeConfigData"
      @menuTreeChange="menuTreeChange"
    />
    <div
      v-if="isTreeList"
      class="treeSwitch"
      @click="treeShow = !treeShow"
    >
      <i
        v-if="!treeShow"
        class="iconfont iconbj_right"
      />
      <i
        v-if="treeShow"
        class="iconfont iconbj_left"
      />
    </div>
    <div class="StandardTableListRootDiv">
      <!-- <Button
        id="hideRefresh"
        type="fcdefault"
        @click="b"
      >
        测试按钮
      </Button> -->
      <ButtonGroup
        ref="R3ButtonGroup"
        :data-array="buttons.dataArray"
        :id-array="idArray"
        :search-datas="dataProcessing()"
        @buttonClick="buttonClick"
        @clearSelectIdArray="clearSelectIdArray"
      />
      <FormItemComponent
        ref="FormItemComponent"
        :form-items-data="formItems.data"
        :form-item-lists="formItemsLists"
        :default-spread="changeSearchFoldnum.switchValue"
        :default-column="Number(defaultColumn)"
        :search-foldnum="Number(changeSearchFoldnum.queryDisNumber || formItems.searchFoldnum)"
        @formDataChange="formDataChange"
      />
      <AgTable
        ref="agTableElement"
        :style="agTableElementStyles"
        :page-attribute="pageAttribute"
        :datas="ag.datas"
        :css-status="ag.status4css"
        :legend="ag.status4css"
        :user-config-for-ag-table="userConfigForAgTable"
        :on-page-change="onPageChange"
        :on-page-size-change="onPageSizeChange"
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
      />
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
    <ImportDialog
      v-if="buttons.importData.importDialog"
      :name="buttons.importData.importDialog"
      :visible="buttons.importData.importDialog"
      :show-close="true"
      :title="buttons.importData.importDialogTitle"
      :tablename="buttons.tableName"
      :main-id="buttons.tableId"
      @confirmImport="searchClickData"
      @closeDialog="closeDialog"
      @imporSuccess="imporSuccess"
    />
    <ErrorModal
      ref="dialogRefs"
      :mask="buttons.dialogConfig.mask"
      :title="buttons.dialogConfig.title"
      :content-text="buttons.dialogConfig.contentText"
      :footer-hide="buttons.dialogConfig.footerHide"
      :confirm="buttons.dialogConfig.confirm"
      @confirmDialog="confirmDialog()"
    />
    <dialogComponent
      ref="dialogRef"
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
      @dialogComponentSaveSuccess="dialogComponentSaveSuccess"
    />
    <!-- 批量 -->
    <modifyDialog
      v-if="modifyDialogshow"
      ref="dialogmodify"
      :title="activeTab.label"
      @on-oncancle-success="onCancleSuccess"
      @on-save-success="onSaveSuccess"
    />
  </div>
  <!-- </div> -->
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
    listDefaultColumn
  } from '../constants/global';
  import { getGateway } from '../__utils__/network';
  import customize from '../__config__/customize.config';
  import router from '../__config__/router.config';
  import { getSessionObject, deleteFromSessionObject, updateSessionObject } from '../__utils__/sessionStorage';
  import { getUrl, getLabel } from '../__utils__/url';
  import { DispatchEvent } from '../__utils__/dispatchEvent';
  import treeData from '../__config__/treeData.config';
  import getUserenv from '../__utils__/getUserenv';
  import { addSearch, querySearch } from '../__utils__/indexedDB';


  const fkHttpRequest = () => require(`../__config__/actions/version_${Version()}/formHttpRequest/fkHttpRequest.js`);

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
    },
    data() {
      return {
        treeSearchData: {}, // 树配置的自定义参数，如有和框架查询接口同参数的字段，则覆盖
        popwinMessage: {},
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
        dialogComponentNameConfig: {
          title: '提示',
          mask: true,
          footerHide: false,
          contentText: '',
          confirm: () => {
          }
        }, // 弹框配置信息

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
      getCurrentLabel() {
        return this.keepAliveLabelMaps[this[MODULE_COMPONENT_NAME]];
      },
      formLists() {
        return this.refactoringData(
          this.formItems.defaultFormItemsLists.concat([])
        );
      },
      isCommonTable() {
        return isCommonTable();
      },
      commonTable() {
        if (router.currentRoute.meta.routePrefix === '/SYSTEM/COMMONTABLE') {
          return true;
        }  
        return this.isCommonTable || this.webconf.commonTable;
        //  (router.currentRoute.meta.routePrefix === '/SYSTEM/TABLE')
        // return false;
      },
      agTableElementStyles() {
        if (this.formItemsLists.length === 0) {
          return {
            paddingTop: 0
          };
        }
        return {};
      },
      idArray() {
        return this.buttons.selectIdArr;
      },
      isTreeList() {
        const treeQuery = this.$router.currentRoute.query;
        if (treeQuery.isTreeTable) {
          return true;
        }
        return false;
      },
      treeConfigData() {
        const treeQuery = this.$router.currentRoute.query;
        if (treeQuery.isTreeTable || window.isTree) {
          const { tableName } = this.$router.currentRoute.params;
          if (window.ProjectConfig && window.ProjectConfig.externalTreeDatas && window.ProjectConfig.externalTreeDatas[tableName]) {
            return window.ProjectConfig.externalTreeDatas[tableName]();
          }
          if (treeData) {
            if (treeData[tableName]) {
              return treeData[tableName]();
            }
            return null;
          }
        } 
      
        return [];
      },
      defaultColumn() { // 获取配置列表一行几列数据
        return listDefaultColumn();
      }
    },
    watch: {
      formLists() {
        const arr = JSON.parse(JSON.stringify(this.formLists));
        arr.map((temp, index) => {
          temp.component = this.formLists[index].component;
          temp.item.event = this.formLists[index].item.event;
          temp.item.props = this.formLists[index].item.props;
          temp.labelWidth = 90;
          return temp;
        });

        if (JSON.stringify(arr) !== JSON.stringify(this.formItemsLists)) {
          this.formItemsLists = arr;
        }
      },
      $route() {
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
      // a() {
      //   // 插入列表界面默认值
      //   const data = {
      //     // tableId: '992',
      //     values: [
      //       {
      //         display: 'OBJ_FK',
      //         colid: '99525',
      //         defaultValue: '元数据',
      //         refobjid: '666666'// OBJ_FK类型
      //       }
      //     ]
      //   };
      //   // this.updataSTDefaultQuery(data);
      //   this.tabOpen({
      //     type: 'S',
      //     tableName: 'SHANGPIN',
      //     tableId: '24445',
      //     isSetQuery: true,
      //     queryData: data
      //   });
      // },
     
      ...mapActions('global', ['updateAccessHistory', 'getExportedState', 'updataTaskMessageCount', 'getMenuLists']),
      ...mapMutations('global', ['updateCustomizeMessage', 'tabOpen', 'increaseLinkUrl', 'addServiceIdMap', 'addKeepAliveLabelMaps', 'directionalRouter', 'updataSTDefaultQuery']),
      // changeTreeConfigData(value) {//oldTree
      //   this.isChangeTreeConfigData = value;
      // },
      // searchClick(value) { // 用于和读取的树配置文件传参，用于模糊查询功能
      //   this.searchTreeDatas.menuTreeQuery = value;
      //   this.treeDatas = this.getTreeDatas(this.searchTreeDatas);
      // },
      menuTreeChange(treeName, currentId, flag, queryFilterData, searchData) {
        this.searchData.fixedcolumns = this.dataProcessing();
        if (Object.keys(queryFilterData) && Object.keys(queryFilterData).length > 0 && flag) {
          this.searchData.reffixedcolumns = queryFilterData;
        } else if (this.searchData && this.searchData.reffixedcolumns) {
          delete this.searchData.reffixedcolumns;
        }
        this.treeSearchData = searchData;
        this.searchData.startIndex = 0;
        // this.getQueryListForAg(this.searchData);
        const searchDataRes = Object.assign({}, this.searchData, searchData);
        this.getQueryListPromise(searchDataRes);
        this.onSelectionChangedAssignment({ rowIdArray: [], rowArray: [] });// 查询成功后清除表格选中项
        // 按钮查找 查询第一页数据
        const { tableName } = this[INSTANCE_ROUTE_QUERY];
        const data = {
          k: tableName,
          v: currentId
        };
        updateSessionObject('TreeId', data);
      },
      // menuTreeChange(arrayIDs, treeName, val, item) {//oldTree
      //   this.searchData.fixedcolumns = this.dataProcessing();
      //   if (val.length > 0 && arrayIDs.length > 0) {
      //     this.searchData.reffixedcolumns = {
      //       [treeName]: `in (${arrayIDs})`
      //     };
      //   } else if (this.searchData && this.searchData.reffixedcolumns) {
      //     delete this.searchData.reffixedcolumns;
      //   }
      //   this.getQueryListForAg(this.searchData);
      //   this.onSelectionChangedAssignment({ rowIdArray: [], rowArray: [] });// 查询成功后清除表格选中项
      //   // 按钮查找 查询第一页数据
       
      //   const { tableName } = this[INSTANCE_ROUTE_QUERY];
      //   const data = {
      //     k: tableName,
      //     v: item.ID
      //   };
      //   updateSessionObject('TreeId', data);
      //   // const data = {
      //   //   [tableName]: item.ID
      //   // };
      //   // this.updataTreeId(data);
      // },
      // btnclick(obj) { // 表格操作按钮组
      //   this.updataSelectIdArr(obj.ID);
      //   switch (obj.vuedisplay) {
      //   case 'slient':
      //     this.webActionSlient(obj);
      //     break;
      //   case 'dialog':
      //     // 
      //     break;
      //   case 'navbar':
      //     this.objTabActionNavbar(obj); // 新标签跳转
      //     break;
      //   default:
      //     break;
      //   }
      // },
      imporSuccess(id) {
        if (Version() === '1.3') {
          if (id) {
            const promises = new Promise((resolve, reject) => {
              this.getExportedState({
                objid: id, id, resolve, reject 
              });
            });
            promises.then(() => {          
              this.setImportDialogTitle(false);
              this.$R3loading.hide(this[INSTANCE_ROUTE_QUERY].tableName);
              if (this.exportTasks.dialog) {
                const message = {
                  mask: true,
                  title: '提醒',
                  content: ' 本次操作已后台处理，是否至[我的任务]查看',
                  showCancel: true,
                  onOk: () => {
                    const type = 'tableDetailVertical';
                    const tab = {
                      type,
                      tableName: 'CP_C_TASK',
                      tableId: '24386',
                      id
                    };
                    this.tabOpen(tab);
                    this.updataTaskMessageCount({ id, stopUpdataQuantity: true });
                  }
                };
                this.$Modal.fcWarning(message);
              }
              if (this.exportTasks.successMsg) {
                const data = {
                  mask: true,
                  title: '成功',
                  content: `${this.exportTasks.resultMsg}`
                };
                this.$Modal.fcSuccess(data);
              }
              this.searchClickData();
            }, () => {
              // if (this.exportTasks.warningMsg) {
              //   const data = {
              //     mask: true,
              //     title: '错误',
              //     content: `${this.exportTasks.resultMsg}`
              //   };
              //   this.$Modal.fcError(data);
              // }
              this.$R3loading.hide(this[INSTANCE_ROUTE_QUERY].tableName);
              this.setImportDialogTitle(false);
            });
          }
        } else {
          this.$R3loading.hide(this[INSTANCE_ROUTE_QUERY].tableName);
        }
      },
      commonTableCustomizedDialog(params) {
        this.$refs.dialogRef.open();
        this.dialogComponentNameConfig.title = params.column.customerurl.reftabdesc;
        this.dialogComponentNameConfig.footerHide = true;
        this.dialogComponentName = params.column.customerurl.tableurl;
      }, // 普通表格跳动作定义按钮弹窗
      dialogComponentSaveSuccess() { // 自定义弹框执行确定按钮操作
        if (this.objTabActionDialogConfig.isrefrsh) {
          this.searchClickData();
        }
      },
      closeDialog() {
        this.closeImportDialog();
      },
      onCancleSuccess() {
        this.modifyDialogshow = false;
      },
      onSaveSuccess(data) {
        // 重新请求
        this.modifyDialogshow = false;
        this.$Message.success(data.message);
        this.getQueryList();
      },
      getQueryList() {
        const { agTableElement } = this.$refs;
        // agTableElement.$refs.agTableElement.showAgLoading();//去除普通表格loading,因查询接口会唤起框架统一loading，两种loading冲突
        // this.getQueryListForAg(this.searchData);
        this.getQueryListPromise(this.searchData);
        this.onSelectionChangedAssignment({ rowIdArray: [], rowArray: [] });// 查询成功后清除表格选中项
      },
      onPageChange(page) {
        const { range } = this.searchData;
        this.searchData.startIndex = range * (page - 1);
        this.getQueryList();
      },
      onPageSizeChange(pageSize) {
        this.searchData.startIndex = 0;
        this.searchData.range = pageSize;
        this.getQueryList();
      },
      onRowDoubleClick(colDef, row) {
        if (!this.buttons.onRowDoubleClick) { // 配置actionView禁用表格双击事件
          return;
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
              title: '警告',
              content: '请维护表名或OBJID'
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
              title: '警告',
              content: '请设置外键关联表的显示配置'
            };
            this.$Modal.fcWarning(data);
          }
          this.tabOpen({
            type,
            tableName: row._TABLENAME.val,
            tableId: row._TABLEID.val,
            id: row._OBJID.val,
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
      onSortChange(sortArr) {
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
      transferFormat(obj) {
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
      orderby(obj) {
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
      onColumnMoved(cols) {
        const { tableId } = this[INSTANCE_ROUTE_QUERY];
        this.setColPosition({
          tableid: tableId,
          colposition: cols
        });
        this.updateAgConfig({ key: 'colPosition', value: cols });
      },
      onColumnPinned(pinnedCols) {
        const { tableId } = this[INSTANCE_ROUTE_QUERY];
        this.setColPin({
          tableid: tableId,
          fixedcolumn: pinnedCols
        });
        this.updateAgConfig({ key: 'fixedColumn', value: pinnedCols });
      },
      onColumnVisibleChanged(hideCols) {
        const { tableId } = this[INSTANCE_ROUTE_QUERY];
        this.setColHide({
          tableid: tableId,
          hidecolumns: hideCols
        });
        this.updateAgConfig({ key: 'hideColumn', value: hideCols });
      },
      onCellSingleClick(colDef, rowData, target) {
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
              title: '警告',
              content: '请设置外键关联表的显示配置'
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
            const param = {
              url: colDef.customerurl.tableurl,
              query: rowData[colDef.customerurl.refobjid].val,
              lablel: colDef.customerurl.reftabdesc,
              isMenu: true,
              lingName: colDef.customerurl.linkname,
              linkId: rowData[colDef.customerurl.refobjid].val,
            };
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
      },
      // 表单操作
      refactoringData(defaultFormItemsLists) {
        // 对获取的数据进行处理
        let items = [];
        if (this.formItemsLists.length > 0 && !this.resetType) {
          return this.formItemsLists;
        }
        items = JSON.parse(JSON.stringify(defaultFormItemsLists)).reduce(
          (array, current, itemIndex) => {
            const obj = {};
            // 判断采用那种表现方式
            function checkDisplay(item) {
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

              if (item.display === 'RADIO_GROUP') {
                str = 'select';
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
              event: {
                keydown: (event) => {
                  // 输入框的keydown event, $this
                  if (event.keyCode === 13) {
                    // enter回车查询
                    this.searchClickData();
                  }
                },
                change: () => {
                  if (current.isuppercase) {
                    setTimeout(() => {
                      this.lowercaseToUppercase(itemIndex);
                    }, 50);
                  }
                },
                fkrpSelected: (value) => {
                  this.formItemsLists[itemIndex].item.props.AutoData = [];
                  this.formItemsLists[itemIndex].item.value = value;
                  // this.formItemsLists = this.formItemsLists.concat([]);
                },
                'on-delete': ($this, item, key, index) => {
                  fkHttpRequest().fkDelMultiQuery({
                    searchObject: {
                      tableid: item.props.fkobj.reftableid,
                      modelname: key
                    },
                    serviceId: current.fkobj.serviceId,
                    success: () => {
                      fkHttpRequest().fkGetMultiQuery({
                        searchObject: {
                          tableid: item.props.fkobj.reftableid
                        },
                        serviceId: current.fkobj.serviceId,
                        success: (res) => {
                          this.freshDropDownPopFilterData(res, index);
                        }
                      });
                    }
                  });
                },
                'popper-value': ($this, value, Selected) => {
                  // 当外键下拉展开时去请求数据
                  this.formItemsLists[itemIndex].item.value = value;
                  this.formItemsLists[itemIndex].item.props.Selected = Selected;
                  this.formItemsLists = this.formItemsLists.concat([]);
                },
                'popper-show': ($this, item, index) => {
                  // 当气泡拉展开时去请求数据
                  fkHttpRequest().fkGetMultiQuery({
                    searchObject: {
                      tableid: item.props.fkobj.reftableid
                    },
                    serviceId: current.fkobj.serviceId,
                    success: (res) => {
                      this.freshDropDownPopFilterData(res, index);
                    }
                  });
                },
                clear: () => {
                  this.formItemsLists[itemIndex].item.props.Selected = [];
                  this.formItemsLists[itemIndex].item.value = '';
                },
                valuechange: ($this) => {
                  // 弹窗多选
                  this.formItemsLists[itemIndex].item.props.Selected = ($this.selected && $this.selected.length > 0) ? $this.selected : [];
                  this.formItemsLists[itemIndex].item.value = $this.value; // `已经选中${$this.selected.length}条数据`
                  this.formItemsLists = this.formItemsLists.concat([]);
                  if (!$this.value) {
                    // this.freshDropDownSelectFilterAutoData({}, itemIndex, 'empty');
                    return false;
                  }

                  // const searchObject = {
                  //   ak: $this.value,
                  //   colid: current.colid,
                  //   fixedcolumns: {}
                  // };
                  // fkHttpRequest().fkFuzzyquerybyak({
                  //   searchObject: this.setSeachObject(searchObject, current),
                  //   serviceId: current.fkobj.serviceId,
                  //   success: (res) => {
                  //     // this.freshDropDownSelectFilterAutoData(res, itemIndex);
                  //   }
                  // });
                },
                'on-popper-hide': ($this) => {
                  // 初始化清空数据
                  this.formItemsLists[itemIndex].item.props.data = {};
                  this.formItemsLists = this.formItemsLists.concat([]);
                },
                'on-show': ($this) => {
                  // 当外键下拉站开始去请求数据
                  const searchObject = {
                    isdroplistsearch: true,
                    refcolid: current.colid,
                    startindex: 0,
                    range: $this.pageSize
                  };

                  fkHttpRequest().fkQueryList({
                    searchObject: this.setSeachObject(searchObject, current),
                    serviceId: current.fkobj.serviceId,
                    success: (res) => {
                      this.freshDropDownSelectFilterData(res, itemIndex);
                    }
                  });
                },
                inputValueChange: (value) => {
                  // 外键的模糊搜索
                  if (!value) {
                    // this.freshDropDownSelectFilterAutoData({}, itemIndex, 'empty');
                    return false;
                  }
                  const searchObject = {
                    ak: value,
                    colid: current.colid,
                    fixedcolumns: {}
                  };

                  fkHttpRequest().fkFuzzyquerybyak({
                    searchObject: this.setSeachObject(searchObject, current),
                    serviceId: current.fkobj.serviceId,
                    success: (res) => {
                      this.freshDropDownSelectFilterAutoData(res, itemIndex);
                    }
                  });
                },
                pageChange: (currentPage, $this) => {
                  // 外键的分页查询
                  const searchObject = {
                    isdroplistsearch: true,
                    refcolid: current.colid,
                    startindex: $this.data.defaultrange * ($this.currentPage - 1),
                    range: $this.pageSize
                  };
                  fkHttpRequest().fkQueryList({
                    searchObject: this.setSeachObject(searchObject, current),
                    serviceId: current.fkobj.serviceId,
                    success: (res) => {
                      this.freshDropDownSelectFilterData(res, itemIndex);
                    }
                  });
                }
              },
              validate: {}
            };

            if (current.webconf) {
              obj.item.props.webconf = current.webconf;
            }


            // 输入控制
            if (current.type === 'NUMBER' && !current.display) {
              // 只能输入 正整数 
              let string = '';
              current.length = 100;

              if (current.webconf && current.webconf.ispositive) {
                string = `^\\d{0,${current.length}}(\\\.[0-9]{0,${
                  current.scale
                }})?$`;
              } else {
                string = `^(-|\\+)?\\d{0,${current.length - current.scale}}(\\\.[0-9]{0,${
                  current.scale
                }})?$`;
              }
              
              const typeRegExp = new RegExp(string);
              if (current.scale > 0) {
                obj.item.props.regx = typeRegExp;
              } else if (current.webconf && current.webconf.ispositive) {
                obj.item.props.regx = regExp.Number;
              } else {
                obj.item.props.regx = regExp.Digital;
              }
            }

            // 带有combobox的添加到options属性中
            if (current.combobox) {
              const arr = current.combobox.reduce((sum, item) => {
                sum.push({
                  label: item.limitdesc,
                  value: item.limitval
                });
                return sum;
              }, []);
              obj.item.options = arr;
            }
            // 多状态合并的select
            if (current.conds && current.conds.length > 0) {
              let sumArray = [];
              current.conds.map((item) => {
                sumArray = sumArray.concat(
                  item.combobox.reduce((sum, temp) => {
                    sum.push({
                      label: temp.limitdesc,
                      value: `${item.colname}|${temp.limitval}`
                    });
                    return sum;
                  }, [])
                );
                return item;
              });
              obj.item.options = sumArray;
            }

            // 日期控件属性控制
            if (current.display === 'OBJ_DATENUMBER') {
              obj.item.props.type = 'daterange';
              obj.item.props.display = current.display;
              obj.item.props.format = 'yyyy/MM/dd';
            }
            if (current.display === 'OBJ_DATE') {
              obj.item.props.type = 'datetimerange';
              obj.item.props.format = 'yyyy/MM/dd HH:mm:ss';
            }
            if (current.display === 'OBJ_TIME') {
              obj.item.props.type = 'timerange';
              obj.item.props.format = 'yyyy/MM/dd HH:mm:ss';
            }

            // 属性isuppercase控制
            if (current.isuppercase) {
              // obj.item.props.regx = regExp.Capital;
              // obj.item.event.regxCheck = (value, $this, errorValue) => {
              //   this.lowercaseToUppercase(errorValue, itemIndex);
              // };
            }

            // 外键的单选多选判断

            if (current.display === 'OBJ_FK') {
              switch (current.fkobj.searchmodel) {
              case 'drp':
                obj.item.props.single = true;
                obj.item.props.fk_type = 'drp';
                obj.item.props.fkobj = current.fkobj;
                obj.item.props.defaultSelected = this.defaultValue(current) || [];
                break;
              case 'mrp':
                obj.item.props.single = false;
                obj.item.props.fk_type = 'mrp';
                obj.item.props.fkobj = current.fkobj;
                obj.item.props.defaultSelected = this.defaultValue(current) || [];
                break;
              case 'pop':
                obj.item.props = current;
                obj.item.props.blurType = false;
                obj.item.props.optionTip = false;
                obj.item.props.enterType = true;
                obj.item.props.fkdisplay = 'pop';
                obj.item.props.show = false;
                // 失去光标是否保存
                obj.item.props.dialog = {
                  model: {
                    title: current.fkdesc,
                    width: 920,
                    mask: true,
                    draggable: true,
                    closable: true,
                    scrollable: true,
                    maskClosable: false,
                    'footer-hide': true
                  }
                };
                //  单对象界面
                obj.item.props.AutoData = [];
                obj.item.props.fkobj = {
                  colid: current.colid,
                  reftable: current.fkobj.reftable,
                  serviceId: current.fkobj.serviceId,
                  reftableid: current.fkobj.reftableid,
                  show: false,
                  url:
                    `${current.fkobj.serviceId ? (`/${current.fkobj.serviceId}`) : ''
                    }/p/cs/menuimport`
                };
                obj.item.props.datalist = [];
                obj.item.props.Selected = [];
                if (current.refobjid && current.refobjid !== -1) {
                  obj.item.props.Selected.push({
                    ID: current.refobjid,
                    Label: current.default
                  });
                  obj.item.value = current.default;
                }
                
                // if (!item.props.readonly && !this.objreadonly) {
                //   item.props.Selected.push(this.defaultValue(current)[0]);
                //   item.value = this.defaultValue(current)[0].Label;
                // } else {
                //   item.value = this.defaultValue(current)[0].Label;
                // }
                break;
              case 'mop':
                obj.item.props.fkobj = current.fkobj;
                obj.item.props.fkobj.colid = current.colid;
                obj.item.props.blurType = false;
                // obj.item.props.fkobj.saveType = 'object';
                obj.item.props.fkobj.url = '/p/cs/menuimport'; // 处理导入接口  去除网关`/${obj.item.props.fkobj.serviceId}/p/cs/menuimport`
                obj.item.props.datalist = [];
                obj.item.props.Selected = [];
                obj.item.props.filterDate = {};
                break;
              default:
                break;
              }
            }

            // 设置indexDB默认查询条件 
            if (enableKAQueryDataForUser() || this.webConf.enableKAQueryDataForUser) {
              Object.keys(this.searchDBdata).map((temp) => {
                // console.log(obj.item);
                // if (temp === obj.item.field && obj.item.value) {
                //   return temp;
                // }
                if (temp === obj.item.field && this.searchDBdata[temp]) {
                  obj.item.value = this.searchDBdata[temp];
                }

                if (current.display === 'OBJ_FK' && temp === obj.item.field && this.searchDBdata[temp]) {
                  switch (current.fkobj.searchmodel) {
                  case 'drp':
                    obj.item.props.defaultSelected = this.searchDBdata[temp];
                    break;
                  case 'mrp':
                    obj.item.props.defaultSelected = this.searchDBdata[temp];
                    break;
                  default:
                    break;
                  }
                }
              });
            }
            
            array.push(obj);
            return array;
          },
          []
        );

        // 处理默认数据，然后进行查询
        // if (defaultFormItemsLists.length === 0 && !this.formDefaultComplete) {
        //   this.formDefaultComplete = true;
        //   this.searchClickData();
        // }
        // if (Object.keys(this.formItems.data).length === 0 && defaultFormItemsLists.length !== 0) {
        //   this.formDataChange(
        //     items.reduce((obj, current) => {
        //       obj[current.item.field] = current.item.value;
        //       return obj;
        //     }, {})
        //   );

        //   setTimeout(() => {
        //     this.searchClickData();
        //   }, 200);
        // }
        this.resetType = false;
        return items;
      },
      setSeachObject(obj, current) {
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
      resetForm() {
        // 列表查询重置
        this.resetType = true;
        const promise = new Promise((resolve, reject) => {
          const searchData = this.searchData;
          if (searchData.reffixedcolumns) {
            delete searchData.reffixedcolumns;
          }
          // this.isChangeTreeConfigData = 'Y'; //oldTree
          if (this.isTreeList && this.treeShow) {
            this.$refs.tree.callMethod();
            this.treeSearchData = {};// 将树配置的参数清除，保证下一个查询时恢复框架默认参数
          }
          if (this.buttons.isBig) {
            searchData.closeIsBig = true;
          }

          if (enableKAQueryDataForUser() || this.webConf.enableKAQueryDataForUser) {
            const search = {};
            search.R3UserId = `${this.userInfo.id}_${this.searchData.table}`;
            addSearch(search);

            this.updateSearchDBdata({});
            this.updateFormData(this.$refs.FormItemComponent.dataProcessing(this.$refs.FormItemComponent.FormItemLists));
          }
          this.getTableQueryForForm({ searchData, resolve, reject });
        });
      },
      defaultValue(item) {
        // 设置表单的默认值

        // OBJ_DATENUMBER OBJ_DATE OBJ_SELECT OBJ_FK
        if (item.display === 'OBJ_DATENUMBER') {
          if (item.customDefault) {
            const timeRange = [
              `${new Date().r3Format(new Date(item.customDefault[0]), 'yyyy/MM/dd')}`,
              `${new Date().r3Format(new Date(item.customDefault[1]), 'yyyy/MM/dd')}`
            ];
            return timeRange;
          }
          // 日期控件;
          if (item.default === '-1') {
            return '';
          } if (item.default !== '-1' && item.default) {
            const timeRange = [
              new Date().setNewFormt(new Date().minusDays(Number(item.default)).toIsoDateString(), '-', ''),
              new Date().setNewFormt(new Date().toIsoDateString(), '-', '')
            ];
            return timeRange;
          }

          // 设置默认值
          if (item.daterange) {
            const timeRange = [
              new Date().setNewFormt(new Date().minusDays(Number(item.daterange)).toIsoDateString(), '-', ''),
              new Date().setNewFormt(new Date().toIsoDateString(), '-', '')
            ];
            return timeRange;
          }
        }
        if (item.display === 'OBJ_DATE') {
          if (item.customDefault) {
            const timeRange = [
              `${new Date().r3Format(new Date(item.customDefault[0]), 'yyyy/MM/dd hh:mm:ss')}`,
              `${new Date().r3Format(new Date(item.customDefault[1]), 'yyyy/MM/dd hh:mm:ss')}`
            ];
            return timeRange;
          }
          if (item.default === '-1') {
            return '';
          }
          const timeRange = [
            `${new Date().setNewFormt(new Date()
              .minusDays(Number(item.daterange))
              .toIsoDateString(), '-', '/')} 00:00:00`,
            `${new Date().setNewFormt(new Date().toIsoDateString(), '-', '/')} 23:59:59`
          ];
          return timeRange;
        }

        if ((item.display === 'OBJ_SELECT' || item.display === 'RADIO_GROUP') && item.default) {
          // 处理select的默认值
          let arr = [];
          arr = item.default.split(',');
          return arr;
        }

        if (item.display === 'OBJ_FK' && item.default) {
          // 外键默认值
          const arr = [];
          arr.push({
            ID: item.refobjid,
            Label: item.default
          });
          if (item.fkobj && (item.fkobj.searchmodel === 'pop' || item.fkobj.searchmodel === 'mop')) {
            return item.default;
          }
          return arr;
        }
        // if(item.display === 'OBJ_FK' && item.fkobj){
        //     return '';
        // }
        
        return item.default;
      },
      getTableQuery() {
        // 获取列表的查询字段
        const searchData = this.searchData;
        this.getTableQueryForForm({ searchData });
      },
      formDataChange(data, item, index) { // 表单数据修改
        if (JSON.stringify(this.formItems.data) !== JSON.stringify(data)) {
          if (this.formItemsLists.length > 0) {
            this.formItemsLists[index].item.value = item.item.value;
          }

          this.updateFormData(data);
        }
      },
      freshDropDownPopFilterData(res, index) {
        // 外键下拉时，更新下拉数据
        // this.formItemsLists[index].item.props.datalist = res.data.data;
        if (res.length > 0) {
          res.forEach((item) => {
            item.label = item.value;
            item.value = item.key;
            item.delete = true;
          });
          this.formItemsLists[index].item.props.datalist = res;
        } else {
          this.formItemsLists[index].item.props.datalist = res;
        }
      },
      freshDropDownSelectFilterData(res, index) {
        // 外键下拉时，更新下拉数据
        this.formItemsLists[index].item.props.data = Object.assign({}, res.data.data);
        this.formItemsLists[index].item.props.totalRowCount = res.data.data.totalRowCount;
        this.formItemsLists[index].item.props.pageSize = res.data.data.defaultrange;
        this.formItemsLists = this.formItemsLists.concat([]);
      },
      freshDropDownSelectFilterAutoData(res, index, type) {
        // 外键的模糊搜索数据更新
        this.formItemsLists[index].item.props.hidecolumns = ['id', 'value'];        
        if (type === 'empty') {
          this.formItemsLists[index].item.props.defaultSelected = [];

          // this.formItemsLists[index].item.props.AutoData = [];
        } else {
          this.formItemsLists[index].item.props.AutoData = res.data.data;
        }
        // this.formItemsLists = this.formItemsLists.concat([]);
        if (this.$refs.FormItemComponent) {
          this.$refs.FormItemComponent.FormItemLists[index].item.props.AutoData = res.data.data;
        }
      },
      lowercaseToUppercase(index) {
        // 将字符串转化为大写
        const UppercaseValue = this.formItemsLists[index].item.value ? this.formItemsLists[index].item.value.toUpperCase() : '';
        this.formItemsLists[index].item.value = UppercaseValue;
        this.formItemsLists = this.formItemsLists.concat([]);
      },

      // 按钮组操作
      clearSelectIdArray() { // 关闭打印预览与直接打印后清空选中项
        this.onSelectionChangedAssignment({ rowIdArray: [], rowArray: [] });// 查询成功后清除表格选中项
        const detailTable = document.querySelector('.detailTable');
        const commonTable = document.querySelector('.commonTable');

        if (detailTable && detailTable.agTable) { // ag表格
          detailTable.agTable.deselectAll();
        }
        if (commonTable) { // 普通表格
          commonTable.deselectAll();
        }
      },
      getbuttonGroupdata() {
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
                name: '导出'
              };
              buttonGroupShow.push(buttonConfigInfo);
            }
            if (this.webConf.disableImport === false) {
              const buttonConfigInfo = {
                eName: 'actionIMPORT',
                name: '导入'
              };
              buttonGroupShow.push(buttonConfigInfo);
            }
          } 
          this.updateDefaultButtonGroupData(buttonGroupShow);
          this.collectTablelist();
        }
      },
      onSelectionChanged(rowIdArray, rowArray) {
        // 获取表格选中明细
        this.onSelectionChangedAssignment({ rowIdArray, rowArray });
      },
      buttonClick(type, obj) {
        this.setActiveTabActionValue({});// 点击按钮前清除上一次按钮存的信息

        if (type === 'fix') {
          this.AddDetailClick(obj);
        } else if (type === 'custom') {
          this.webactionClick(type, obj);
        } else if (type === 'Collection') {
          this.clickButtonsCollect();
        } else if (type === 'reset') {
          // 重置列表渲染
          this.resetForm();
        } else {
          this.searchEvent();
        }
      },
      searchEvent() {
        // 支持查询按钮前置事件，通过promise处理
        const searchDataRes = Object.assign({}, this.searchData, this.treeSearchData);
        const obj = {
          callBack: () => new Promise((searchBeforeResolve, searchBeforeReject) => {
            this.searchData.searchBeforeResolve = searchBeforeResolve;
            this.searchData.searchBeforeReject = searchBeforeReject;
            this.searchClickData();
          })
        };
        if (this.R3_searchBefore && typeof this.R3_searchBefore === 'function') {
          this.R3_searchBefore(obj);
        } else {
          this.searchClickData({ searchDataRes });
        }
      },
      objTabActionDialog(tab) { // 动作定义弹出框
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
     
      webactionClick(type, obj) {
        // 点击自定义按钮 创建table
        this.setActiveTabActionValue(obj);
        if (obj.vuedisplay === 'js') {
          if (obj.action && this[obj.action] && typeof this[obj.action] === 'function') {
            this[obj.action](obj);
          }
        } else if (obj.vuedisplay === 'slient') {
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
          this.objTabActionDialog(obj);
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
      objTabActiondDownload(tab) {
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
      webActionSlient(item) {
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
            ids: this.buttons.selectIdArr.map(d => parseInt(d))
          };
        }

        let promise = new Promise((resolve, reject) => {
          this.$R3loading.show();
          this.getExeActionDataForButtons({
            item, obj, resolve, reject, moduleName: this[MODULE_COMPONENT_NAME], routeQuery: this[INSTANCE_ROUTE_QUERY], routePath: this[INSTANCE_ROUTE]
          });
        });
        if (item.ID) {
          this.onSelectionChangedAssignment({ rowIdArray: [], rowArray: [] });// 查询成功后清除表格选中项
        }

        if (this.buttons.activeTabAction.cuscomponent) { // 如果接口cuscomponent有值，逻辑为自定义调自定义
          const nextOperate = JSON.parse(// 配置信息
            this.buttons.activeTabAction.cuscomponent
          );
          promise.then(() => {
            this.$R3loading.hide(this[INSTANCE_ROUTE_QUERY].tableName);
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
                title: '成功',
                content: `${message}`
              };
              this.$Modal.fcSuccess(data);
            }
          }, () => {
            this.$R3loading.hide(this[INSTANCE_ROUTE_QUERY].tableName);
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
            this.$R3loading.hide(this[INSTANCE_ROUTE_QUERY].tableName);
            const message = this.buttons.ExeActionData;
            const data = {
              mask: true,
              title: '成功',
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
            if (this.buttons.isrefrsh) {
              this.searchClickData();
            }
          }, () => {
            this.$R3loading.hide(this[INSTANCE_ROUTE_QUERY].tableName);
          });
        }
      },

      dataProcessing() { // 查询数据处理
        const jsonData = Object.keys(this.formItems.data).reduce((obj, item) => {
          if (this.formItems.data[item] && JSON.stringify(this.formItems.data[item]).indexOf('bSelect-all') < 0) {
            obj[item] = this.formItems.data[item];
          }
          return obj;
        }, {});
        return Object.keys(jsonData).reduce((obj, item) => {
          let value = '';

          this.formItemsLists.concat([]).every((temp) => {
            if (temp.item.field === item) { // 等于当前节点，判断节点类型
              if (temp.item.type === 'DatePicker' && (temp.item.props.type === 'datetimerange' || temp.item.props.type === 'daterange')) { // 当为日期控件时，数据处理
                if ((jsonData[item][0] && jsonData[item][1])) {  
                  if (jsonData[item][0].includes('/')) {
                    const formDate = temp.item.props.type === 'datetimerange' ? 'yyyy/MM/dd hh:mm:ss' : 'yyyyMMdd';
                    const array = JSON.parse(JSON.stringify(jsonData[item]));
                    // 日期格式传参处理，主要是处理第一次默认值查询
                    array[0] = new Date().r3Format(new Date(array[0]), formDate);
                    array[1] = new Date().r3Format(new Date(array[1]), formDate);
                    value = array.join('~').replace(/-/g, '/');
                  } else {
                    value = jsonData[item].join('~');
                  }
                } else {
                  value = '';
                }
                return false;
              }

              if (
                temp.item.type === 'TimePicker'
                && temp.item.props.type === 'timerange'
                && (jsonData[item][0] && jsonData[item][1])
              ) {
                // 时分秒的时间段处理
                value = jsonData[item].join('~');
                return false;
              }

              if (temp.item.type === 'select') {
                if (jsonData[item].length > 0) {
                  value = jsonData[item].map(option => `=${option}`);
                } else {
                  value = '';
                }

                // 处理select，分为单个字段select和合并型select
                return false;
              }
              value = jsonData[item];
              return false;
            }

            if (
              !temp.item.field
              && temp.item.type === 'select'
              && item.indexOf(':') < 0
            ) {
              // 处理合并型select
              value = jsonData[item].map(option => `=${option}`);
              return false;
            }
            if (temp.item.inputname === item) {
              value = jsonData[item];
            }


            return true;
          });
          if (value) {
            obj[item] = value;
          }

          return obj;
        }, {});
      },
      searchClickData(value) {
        // 按钮查找 查询第一页数据
        if (value && !value.flag) { // 返回时查询之前页码
          this.searchData.startIndex = 0;
        }
        this.searchData.fixedcolumns = this.dataProcessing();
        this.searchData.fixedcolumns = Object.assign({},this.searchData.fixedcolumns,this.dataProcessing());
        if (value && value.searchDataRes) {
          value.searchDataRes.fixedcolumns = Object.assign({}, value.searchDataRes.fixedcolumns, this.dataProcessing());
          if (value && !value.flag) { // 返回时查询之前页码
            value.searchDataRes.startIndex = 0;
          }
        }
        // this.getQueryListForAg(this.searchData);
        if (this.buttons.isBig) {
          this.updataIsBig(false);
        }

        this.getQueryListPromise(value && value.searchDataRes ? value.searchDataRes : this.searchData);
        this.onSelectionChangedAssignment({ rowIdArray: [], rowArray: [] });// 查询成功后清除表格选中项
      },
      requiredCheck(data) { // 查询条件必填校验
        return new Promise((resolve, reject) => {
          this.formItems.defaultFormItemsLists.map((item) => {
            const value = Array.isArray(this.formItems.data[item.colname]) ? this.formItems.data[item.colname][0] : (Object.prototype.toString.call(this.formItems.data[item.colname]) === '[Object Object]' ? Object.keys(this.formItems.data[item.colname]).length > 0 : this.formItems.data[item.colname]);
            if (item.webconf && item.webconf.required && !value) {
              this.$Modal.fcError({
                title: '错误',
                content: `查询条件[${item.coldesc}]不能为空!`,
                mask: true
              });

              reject();
            }
          });
          resolve();
        });
      },
      getQueryListPromise(data) {
        const promise = new Promise((resolve, reject) => {
          this.requiredCheck().then(() => {
            this.$R3loading.show();
            data.resolve = resolve;
            data.reject = reject;
            data.isolr = this.buttons.isSolr;

            if (enableKAQueryDataForUser() || this.webConf.enableKAQueryDataForUser) {
              const search = JSON.parse(JSON.stringify(this.$refs.FormItemComponent.formDataObject));

              this.formItemsLists.map((temp) => {
                if (temp.item.type === 'AttachFilter') {
                  delete search[temp.item.field];
                }

                if (temp.item.type === 'DropDownSelectFilter' && !Array.isArray(search[temp.item.field])) {
                  delete search[temp.item.field];
                }
              });
              search.R3UserId = `${this.userInfo.id}_${this.searchData.table}`;
              addSearch(search);

              this.updateSearchDBdata({});
              this.updateFormData(this.$refs.FormItemComponent.dataProcessing(this.$refs.FormItemComponent.FormItemLists));
            }
            

            this.getQueryListForAg(data);
          });
        });
        promise.then((res) => {
          this.onSelectionChangedAssignment({ rowIdArray: [], rowArray: [] });// 查询成功后清除表格选中项
          if (!this.searchData.range) {
            if (Version() === '1.3') {
              this.searchData.range = res.data.datas.defaultrange;
            } else {
              this.searchData.range = res.data.data.defaultrange;
            }
          }
          this.$R3loading.hide(this[INSTANCE_ROUTE_QUERY].tableName);
        }, () => { // 状态为rejected时执行
          this.$R3loading.hide(this[INSTANCE_ROUTE_QUERY].tableName);
        });
      },
      dialogMessage(title, contentText, obj) {
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
      getSingleObjectPageType() {
        
      },
      AddDetailClick(obj) {
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
                router.push(
                  path
                );
              } else {
                const path = `/${tableurl}`;
                router.push(
                  path
                );
              }
            } else if (actionType.toUpperCase() === 'CUSTOMIZED') {
              const customizedModuleName = tableurl.substring(tableurl.indexOf('/') + 1, tableurl.lastIndexOf('/')).toLocaleUpperCase();
              const path = `${CUSTOMIZED_MODULE_PREFIX}/${customizedModuleName.toUpperCase()}/New`;
              router.push({
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
              window.getObjdisType({ table: tableName }).then((res) => {
                type = res === 'tabpanle' ? 'H' : 'V';  
                this.tabOpen({
                  type,
                  tableName,
                  tableId,
                  label,
                  id
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
              id
            });
            return;
          }
        }
        if (obj.name === this.buttonMap.CMD_DELETE.name) {
          // 删除动作  对用网络请求
          if (this.buttons.selectIdArr.length > 0) {
            const title = '警告';
            const contentText = `确认执行${obj.name}?`;
            this.dialogMessage(title, contentText, obj);
          } else {
            const data = {
              mask: true,
              title: '警告',
              content: `请先选择需要${obj.name}的记录！`
            };
            this.$Modal.fcWarning(data);
          }
          return;
        }

        if (obj.name === this.buttonMap.CMD_SUBMIT.name) {
          // 批量提交
          this.buttons.dynamicRequestUrl.submit = obj.requestUrlPath;
          if (this.buttons.selectIdArr.length > 0) {
            const title = '警告';
            const contentText = `确认执行${obj.name}?`;
            this.dialogMessage(title, contentText, obj);
          } else {
            const data = {
              mask: true,
              title: '警告',
              content: `请先选择需要${obj.name}的记录！`
            };
            this.$Modal.fcWarning(data);
          }
          return;
        }

        if (obj.name === this.buttonMap.CMD_VOID.name) {
          // 批量作废
          if (this.buttons.selectIdArr.length > 0) {
            const title = '警告';
            const contentText = `确认执行${obj.name}?`;
            this.dialogMessage(title, contentText, obj);
          } else {
            const data = {
              mask: true,
              title: '警告',
              content: `请先选择需要${obj.name}的记录！`
            };
            this.$Modal.fcWarning(data);
          }
          return;
        }

        if (obj.name === this.buttonMap.CMD_UNSUBMIT.name) {
          // 批量反提交
          if (this.buttons.selectIdArr.length > 0) {
            const title = '警告';
            const contentText = `确认执行${obj.name}?`;
            this.dialogMessage(title, contentText, obj);
          } else {
            const data = {
              mask: true,
              title: '警告',
              content: `请先选择需要${obj.name}的记录！`
            };
            this.$Modal.fcWarning(data);
          }
          return;
        }

        if (obj.name === this.buttonMap.CMD_EXPORT.name) {
          // 导出
          if (this.buttons.selectIdArr.length === 0) {
            const title = '警告';
            const contentText = '当前的操作会执行全量导出，导出时间可能会比较慢！是否继续导出？';
            this.dialogMessage(title, contentText, obj);
            return;
          }
          this.batchExport(obj);
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
                title: '警告',
                content: '请选择批量修改数据!'
              });
              return;
            }
            this.$Modal.fcWarning({
              mask: true,
              title: '警告',
              content: `未勾选记录,将批量更新所有查询结果(共计${
                this.ag.datas.totalRowCount
              }行),是否确定继续操作?`,
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
      batchExport(buttonsData) {
        this.$R3loading.show();
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

       
        if (this.buttons.selectIdArr.length !== 0) {
          this.searchData.fixedcolumns = { ID: this.buttons.selectIdArr };
        } 
        const OBJ = {
          searchdata: this.searchData,
          filename: this.activeTab.label,
          filetype: '.xlsx',
          showColumnName: true,
          menu: this.activeTab.label
        };
        const promise = new Promise((resolve, reject) => {
          this.getExportQueryForButtons({
            OBJ, resolve, reject, buttonsData 
          });
        });
        promise.then(() => {
          if (this.buttons.exportdata) {
            if (Version() === '1.4') {
              this.$R3loading.hide(this[INSTANCE_ROUTE_QUERY].tableName);
              const eleLink = document.createElement('a');
              const path = getGateway(`/p/cs/download?filename=${this.buttons.exportdata}`);
              eleLink.setAttribute('href', path);
              eleLink.style.display = 'none';
              document.body.appendChild(eleLink);
              eleLink.click();
              document.body.removeChild(eleLink);
            } else if (Version() === '1.3') {
              const promises = new Promise((resolve, reject) => {
                this.getExportedState({
                  objid: this.buttons.exportdata, id: this.buttons.exportdata, resolve, reject 
                });
              });
              promises.then(() => {
                this.$R3loading.hide(this[INSTANCE_ROUTE_QUERY].tableName);
                if (this.exportTasks.dialog) {
                  const message = {
                    mask: true,
                    title: '提醒',
                    content: ' 本次操作已后台处理，是否至[我的任务]查看',
                    showCancel: true,
                    onOk: () => {
                      const type = 'tableDetailVertical';
                      const tab = {
                        type,
                        tableName: 'CP_C_TASK',
                        tableId: '24386',
                        id: this.buttons.exportdata
                      };
                      this.tabOpen(tab);
                      this.updataTaskMessageCount({ id: this.buttons.exportdata, stopUpdataQuantity: true });
                    }
                  };
                  this.$Modal.fcWarning(message);
                }
                if (this.exportTasks.successMsg) {
                  const data = {
                    mask: true,
                    title: '成功',
                    content: this.exportTasks.resultMsg
                  };
                  this.$Modal.fcSuccess(data);
                }
                this.searchClickData();
              }, () => {
                if (this.exportTasks.warningMsg) {
                  this.$R3loading.hide(this[INSTANCE_ROUTE_QUERY].tableName);
                  const data = {
                    mask: true,
                    title: '错误',
                    content: `${this.exportTasks.resultMsg}`
                  };
                  this.$Modal.fcError(data);
                }
              });
            }
          } else {
            this.$R3loading.hide(this[INSTANCE_ROUTE_QUERY].tableName);
          }
        }, () => {
          this.searchClickData();
          this.$R3loading.hide(this[INSTANCE_ROUTE_QUERY].tableName);
        });
      },
      deleteTableList(data) { // 删除方法
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
            title: '成功',
            content: `${message}`
          };
          this.$Modal.fcSuccess(datas);
        }, () => {});
      },
      batchVoid(data) {
        const tableName = this.buttons.tableName;
        const ids = this.buttons.selectIdArr.map(d => parseInt(d));
        // this.$R3loading.show();
        const promise = new Promise((resolve, reject) => {
          this.batchVoidForButtons({
            tableName, ids, resolve, reject, data
          });
        });
        promise.then(() => {
          // this.$R3loading.hide(this[INSTANCE_ROUTE_QUERY].tableName)
          const message = this.buttons.batchVoidForButtonsData.message;
          const data = {
            mask: true,
            title: '成功',
            content: `${message}`
          };
          this.$Modal.fcSuccess(data);
        }, () => {});
      },
      batchSubmit(data) {
        // 批量提交
        const url = this.buttons.dynamicRequestUrl.submit;
        const tableName = this.buttons.tableName;
        const ids = this.buttons.selectIdArr.map(d => parseInt(d));
        const promise = new Promise((resolve, reject) => {
          this.batchSubmitForButtons({
            url, tableName, ids, resolve, reject, moduleName: this[MODULE_COMPONENT_NAME], routeQuery: this[INSTANCE_ROUTE_QUERY], routePath: this[INSTANCE_ROUTE], data
          });
        });
        promise.then(() => {
          const message = this.buttons.batchSubmitData.message;
          const data = {
            mask: true,
            title: '成功',
            content: `${message}`
          };
          this.$Modal.fcSuccess(data);
        }, () => {});
      },
      batchUnSubmit(data) {
        // 批量反提交
        const obj = {
          tableName: this.buttons.tableName,
          ids: this.buttons.selectIdArr.map(d => parseInt(d))
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
              title: '成功',
              content: `${message}`
            };
            this.$Modal.fcSuccess(data);
            // this.getQueryListForAg(this.searchData);
          }
        }, () => {});
      },
      forAgTableErrorMessage(errorData) { // 操纵列表数据失败时ag显示错误提示的图标以及message
        this.setAgTableErrorMessage(errorData);
      },
      clickButtonsCollect() { // 收藏
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
      confirmDialog(obj) {
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
          if (this.buttons.activeTabAction.vuedisplay === 'slient') {
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
          if (this.buttons.dialogConfig.contentText.indexOf('批量更新') >= 0) {
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
            this.buttons.dialogConfig.contentText.indexOf('操作会执行全量导出') >= 0
          ) {
            this.batchExport(obj);
          } else if (this.buttons.selectSysment.length > 0) {
            this.searchData('backfresh');
          }
        }
      },
      errorDialogClose() {
        const errorDialogvalue = false;
        this.setErrorModalValue({ errorDialogvalue });
      },
     
      objTabActionNavbar(tab) {
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
                this.$Message.warning('请勾选ID');
                return;
              } if (this.buttons.selectIdArr.length > 1) {
                this.$Message.warning('只能勾选单个ID');
                return;
              }
              const itemId = this.buttons.selectIdArr.filter(item => item);
              const path = `/${tabAction.replace(/:itemId/, itemId)}`;
              router.push(
                path
              );
            } else {
              const path = `/${tabAction}`;
              router.push(
                path
              );
            }
          } else if (actionType === 'https:' || actionType === 'http:') {
            let linkUrl = '';
            if (tabAction.indexOf(':itemId') !== -1) {
              if (this.buttons.selectIdArr.length === 0) {
                this.$Message.warning('请勾选ID');
                return;
              } if (this.buttons.selectIdArr.length > 1) {
                this.$Message.warning('只能勾选单个ID');
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
                this.$Message.warning('请勾选ID');
                return;
              } if (this.buttons.selectIdArr.length > 1) {
                this.$Message.warning('只能勾选单个ID');
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
      networkEventListener(event) {
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
      async networkGetTableQuery(event) {
        if (this._inactive) { return; }
        const { detail } = event;
        if (detail.url === '/p/cs/getTableQuery' && (Version() === '1.4' ? detail.response.data.data.tabcmd : detail.response.data.tabcmd)) {
          this.updateFormData(this.$refs.FormItemComponent.dataProcessing(this.$refs.FormItemComponent.FormItemLists));
          const enableKAQueryDataForUserFlag = Version() === '1.4' ? !!(detail.response.data.data.datas.webconf && detail.response.data.data.datas.webconf.enableKAQueryDataForUser) : !!(detail.response.data.datas.webconf && detail.response.data.datas.webconf.enableKAQueryDataForUser);
          if (enableKAQueryDataForUser() || enableKAQueryDataForUserFlag) {
            await querySearch(`${this.$store.state.global.userInfo.id}_${this.searchData.table}`).then((response) => {
              if (response) {
                const lists = Version() === '1.4' ? detail.response.data.data.datas.dataarry : detail.response.data.datas.dataarry;
                lists.map((item) => {
                  if (item.default) {
                    delete response[item.colname];
                  }

                  if (item.display === 'OBJ_FK' && response[item.colname] && !Array.isArray(response[item.colname])) {
                    delete response[item.colname];
                  }
                  
                  if (item.display === 'OBJ_FK' && response[item.colname] && item.fkobj.fkdisplay !== 'mrp') {
                    response[item.colname] = response[item.colname].reduce((array, current) => {
                      array.push(current.ID);
                      return array;
                    }, []);
                  }


                  // 处理select类型
                  if (item.display === 'OBJ_SELECT' && response[item.colname]) {
                    response[item.colname] = response[item.colname].map(temp => temp = temp.replace(/\=/g, ''));
                  }

                  // 处理外健
                  if (item.display === 'OBJ_FK' && response[item.colname] && item.fkobj.fkdisplay !== 'mrp') {
                    item.default = response[item.colname][0].Label;
                    item.refobjid = response[item.colname][0].ID;
                  }

                  if (!item.default && response[item.colname]) {
                    item.default = response[item.colname];
                  }
                  return item;
                });
                // 过滤部分处理不了的类型字段
                delete response.undefined; // 过滤配置的下拉多字段类型
                this.updateSearchDBdata(response);
                this.updateFormData(Object.assign({}, this.$refs.FormItemComponent.dataProcessing(this.$refs.FormItemComponent.FormItemLists), response));
              }
              if (!this.buttons.isBig) {
                this.searchClickData();
              }
            });
          } else if (!this.buttons.isBig) {
            // 初始化调用时，ie环境下增加500ms延时调用
            if (this.isIE()) {
              setTimeout(() => {
                this.searchClickData();
              }, 500);
            } else {
              this.searchClickData();
            }
          }
        }
      },
      isIE() {
        if (!!window.ActiveXObject || 'ActiveXObject' in window) return true;
        return false;
      },
      // 监听update.ST.FailInfo事件
      updateSTFailInfo(event) {
        if (event.detail[MODULE_COMPONENT_NAME] === this[MODULE_COMPONENT_NAME]) {
          this.updateFailInfo(event.detail.failInfo);
        }
      }
    },
    mounted() {
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
    activated() {
      const { tableId } = this[INSTANCE_ROUTE_QUERY];
      this.updateAccessHistory({ type: 'table', id: tableId });
    },
    created() {
      this.buttonMap = buttonmap;
      this.ChineseDictionary = ChineseDictionary;
    },
    beforeDestroy() {
      window.removeEventListener('network', this.networkEventListener);
      window.removeEventListener('network', this.networkGetTableQuery);
      window.removeEventListener('updateSTFailInfo', this.updateSTFailInfo);
    }
  };
</script>

<style lang="less">
.standarTableListContent{
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  .treeSwitch{
    // position: absolute;
    user-select: none;
    width: 11px;
    height: 83px;
    line-height: 84px;
    cursor: pointer;
    margin-top: 18%;
    text-align: center;
    border-top-left-radius: 46px;
    border-bottom-left-radius: 46px;
    border: 1px solid #d2d2d2;
    border-right: #fff 1px solid;
    // transform-origin: right;
    // transform: translateY(-50px) perspective(50px) rotateY(-30deg);
      &:hover{
      background: #d2d2d2;
      opacity: 0.5;
      }
    i{
        margin-left: -2px;
      }
}

 .tree{
    width:300px;
    padding:10px;
    // margin-right:15px;
    border-right:1px solid #d2d2d2;
    overflow-x: scroll;
    overflow-y: hidden;
   
  }
.StandardTableListRootDiv {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
}

</style>
