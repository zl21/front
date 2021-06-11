/* eslint-disable vue/html-indent */
/* eslint-disable vue/html-self-closing */
<template>
  <div class="TableDetailCollection">
    <div class="detail-collection">
      <component :is="slotTableTemplate" :tabwebact="tabwebact"
      :webConfSingle = webConfSingle
      :dataSource ="dataSource"
      :readonly="readonly"
      :tableReadonly="tableReadonly"
      :objreadonly="objreadonly"
      :tableHeight="tableHeight"
      :status="status"
      :tableName="tableName"
      :type="type"
      :itemInfo="itemInfo"> 
        <div class="page-buttons" slot="detail-page">
            <Page
              ref="page"
              :total="dataSource.totalRowCount"
              :page-size-opts="dataSource.selectrange"
              :current="currentPage"
              class="table-page"
              size="small"
              show-elevator
              show-sizer
              show-total
              @on-change="pageChangeEvent"
              @on-page-size-change="pageSizeChangeEvent"
            />
        </div>
         
          <ul
            v-if="!isHorizontal && !readonly"
            class="detail-buttons" slot="detail-buttons" 
          >
            <a
              v-for="item in buttonData"
              :key="item.name"
              @click="buttonClick(item)"
            >
              <slot name="detail-buttons-a" 
               v-bind:item="item">【{{ item.name }}】</slot>
            </a>
          </ul>
          <Dialog
            ref="dialogRef"
            :title="dialogConfig.title"            
            :mask="dialogConfig.mask"
            :content-text="dialogConfig.contentText"
            :idArray="tableRowSelectedIds"
            :itemId="tableName"
            :footer-hide="dialogConfig.footerHide"
            :confirm="dialogConfig.confirm"
          />
        
        <div
          v-if="filterList.length > 0"
          class="detail-search" slot="detail-search"
        >
          <Select
            v-model="searchCondition"
            clearable
            placeholder="查询条件"
            @on-change="selectedChange"
            @on-clear="searchCondition=''"
          >
            <Option
              v-for="item in filterList"
              :key="item.colname"
              :label="item.name"
              :value="item.isfk ? item.inputname : item.colname"
            >
              {{ item.name }}
            </Option>
          </Select>
          <div class="detail-search-input">
            <Input
              v-model="searchInfo"
              search
              placeholder="请输入查询内容"
              @on-change="onInputChange"
              @on-search="searTabelList"
            >
            <Button
              slot="prepend"
              @click="searTabelList"
            >
              搜索
            </Button>
            </Input>
          </div>
        </div>

      <!-- <div class="detail-top">
      
      </div> -->
      <div class="table-outside" slot="detail-table" 
          v-bind:columns="columns" 
          v-bind:tabledata="tabledata">
        <Table
          v-if="isCommonTable || !useAgGrid"
          ref="selection"
          class="table-in"
          :height="tableHeight? tableHeight :true"
          border
          :columns="columns"
          :loading="loading"
          :data="tabledata"
          :total-data="totalDataNumber"
          @on-selection-change="tableSelectedChange"
          @on-sort-change="tableSortChange"
          @on-row-dblclick="tableRowDbclick"
        />
        <CommonTableByAgGrid
          v-else
          class="table-in"
          :height="tableHeight? `${tableHeight}px` :'calc(100% - 10px)'"
          border
          mode="commonTable"
          :columns="columns"
          :data="tabledata"
          :render-params="renderParams"
          :options="{
            suppressMovableColumns: true,
            afterColumnMoved: afterColumnMoved,
            ...agGridOptions,
            datas: dataSource,
          }"
          @ag-selection-change="tableSelectedChange"
          @ag-sort-change="tableSortChange"
          @ag-row-dblclick="tableRowDbclick"
        ></CommonTableByAgGrid>
      </div>
      <div
        v-if="isHorizontal"
        slot="detail-queryCondition"
        class="queryCondition"
      >
        查询条件:{{ dataSource.queryDesc }}
      </div>
      
     
  </component>

    </div>
    <!-- 导入弹框 -->
    <ImportDialog
      v-if="importData.importDialog"
      :name="importData.importDialog"
      :visible="importData.importDialog"
      :show-close="true"
      :title="importData.importDialogTitle"
      :tablename="tableName"
      :main-table="mainFormInfo.tablename"
      :main-id="pageItemId"
      @confirmImport="importsuccess"
      @closeDialog="closeImportDialog"
      @imporSuccess="imporSuccess"
    />
    <!-- 自定义弹出框 -->
    <Dialog
      ref="dialogRef"
      :title="dialogConfig.title"
      :mask="dialogConfig.mask"
      :popwin-message="popwinMessage"
      :content-text="dialogConfig.contentText"
      :footer-hide="dialogConfig.footerHide"
      :confirm="dialogConfig.confirm"
      :isrefrsh="isrefrsh"
      :idArray="tableRowSelectedIds"
      :itemId="tableName"
      :dialog-component-name="dialogComponentName"
      :obj-list="dialogComponentName?objList:[]"
      @dialogComponentSaveSuccess="dialogComponentSaveSuccess"
      @clearDialogComponentName="clearDialogComponentName"
    />
  </div>
</template>

<script>
  /* eslint-disable vue/no-reserved-keys,vue/no-dupe-keys,consistent-return,array-callback-return,no-else-return */
  import Vue from 'vue';

  import { mapState, mapMutations, mapActions } from 'vuex';
  // import { setTimeout } from 'timers';
  import { CommonTableByAgGrid } from '@syman/ark-ui-bcl';
  import regExp from '../constants/regExp';
  import {
    Version, LINK_MODULE_COMPONENT_PREFIX, INSTANCE_ROUTE_QUERY, enableActivateSameCustomizePage, ossRealtimeSave
  } from '../constants/global';
  import buttonmap from '../assets/js/buttonmap';
  import ComplexsDialog from './ComplexsDialog.vue'; // emit 选中的行
  import Dialog from './Dialog.vue';
  import ImportDialog from './ImportDialog.vue';
  import router from '../__config__/router.config';
  import network, { getGateway, urlSearchParams } from '../__utils__/network';
  import ComAttachFilter from './ComAttachFilter.vue';
  import Docfile from './docfile/DocFileComponent.vue';
  import { DispatchEvent } from '../__utils__/dispatchEvent';
  import ChineseDictionary from '../assets/js/ChineseDictionary';
  import { getUrl, getLabel } from '../__utils__/url';
  import { updateSessionObject } from '../__utils__/sessionStorage';
  import getUserenv from '../__utils__/getUserenv';
  import createModal from './PreviewPicture/index';
  import TableTemplate from './TableDetailCollectionslot';

  Vue.component('ComAttachFilter', ComAttachFilter);
  Vue.component('TableDocFile', Docfile);

  const fkHttpRequest = () => require(`../__config__/actions/version_${Version()}/formHttpRequest/fkHttpRequest.js`);

  const EXCEPT_COLUMN_NAME = 'ID'; // 排除显示列（ID）
  const COLLECTION_INDEX = 'COLLECTION_INDEX'; // 序号
  const pageType = {
    Horizontal: 'horizontal',
    Vertical: 'vertical'
  };
  const TABLE_BEFORE_DATA = 'tableBeforeData'; // emit beforedata
  const TABLE_BEFORE_LABEL_DATA = 'tableBeforeLabelData'; // emit beforedatalabel
  const TABLE_DATA_CHANGE = 'tableDataChange'; // emit 修改数据
  const TABLE_DATA_CHANGE_LABEL = 'tableDataChangeLabel'; // emit 修改数据的label
  const TABLE_DATA_CHANGE_LABEL_BEFORE = 'tableDataChangeLabelBefore'; // emit 修改数据的label
  const TABLE_VERIFY_MESSAGE = 'tableVerifyMessage'; // emit 修改数据
  const TABLE_SELECTED_ROW = 'tableSelectedRow';
  const FLEX_ALIGN = {
    left: 'flex-start',
    center: 'center',
    right: 'flex-end'
  }
  export default {
    inject: [INSTANCE_ROUTE_QUERY],
    components: {
      Dialog,
      ImportDialog, // 导入弹框
      CommonTableByAgGrid,
      // TableTemplate // slot 的模板
    },
    data() {
      return {
        popwinMessage: {},
        saveButtonPath: '', // 类型为保存的按钮path
        saveEventAfter: '', // 保存事件执行完成后的操作
        objTabActionSlientData: {}, // 静默程序配置字段
        isrefrsh: '', // 控制自定义类型按钮执行后是否刷新
        dialogComponentName: null,
        buttonData: [],
        currentPage: 1, // 当前页码
        isRefreshClick: false, // 是否点击了刷新
        slotTableTemplate:{}, // 渲染模板
        fkSelectedChangeData: [], // 保存外键修改的数据
        verifyTipObj: {}, // 保存校验对象
        isTableRender: false, // 表格是否重新渲染
        loading: true,
        buttonPath: {},
        tableRowSelectedIds: [], // 表格选中的ID
        columns: [],
        tabledata: [],
        totalDataNumber: [],
        searchInfo: '', // 输入框搜索内容
        searchCondition: null, // 查询条件
        // pageInfo: { // 列表的分页
        //   currentPageIndex: (this.dataSource.start / this.dataSource.defaultrange) || 1, // 当前页码
        //   pageSize: this.dataSource.defaultrange || 10 // 显示条数
        // },
        fkData: ({ totalRowCount: 0 }), // // 外键下拉选择（drp mrp） 的数据
        fkDropPageInfo: { // 外键下拉选择（drp mrp） 的分页
          currentPageIndex: 1, // 当前页码
          pageSize: 10 // 显示条数
        },
        fkAutoData: [], // 外键关联下拉 模糊搜索数据
        popFilterData: {}, // mop气泡的特殊数据
        popFilterDataList: [{
                              value: '更多筛选',
                              lable: 0
                            },
                            {
                              value: '导入',
                              lable: 2
                            }],
        currentOrderList: [], // 当前排序的内容
        DISPLAY_ENUM: { // 标签映射
          text: { tag: 'Input', event: this.inputRender },
          check: { tag: 'Checkbox', event: this.checkboxRender },
          select: { tag: 'Select', event: this.selectRender },
          radioGroup: { tag: 'Select', event: this.selectRender },
          drp: { tag: 'DropDownSelectFilter', event: this.dropDownSelectFilterRender },
          mrp: { tag: 'DropMultiSelectFilter', event: this.dropMultiSelectFilterRender },
          mop: { tag: 'ComAttachFilter', event: this.comAttachFilterRender },
          pop: { tag: 'ComAttachFilter', event: this.comAttachFilterpopRender },
          OBJ_DATENUMBER: { tag: 'DatePicker', event: this.datePickertRender },
          OBJ_DATE: { tag: 'DatePicker', event: this.datePickertRender },
          OBJ_TIME: { tag: 'TimePicker', event: this.timePickerRender },
          image: { tag: 'Poptip', event: this.imageRender },
          doc: { tag: 'Poptip', event: this.docRender }
        },
        _beforeSendData: {}, // 之前的数据
        get beforeSendData() {
          return this._beforeSendData;
        },
        set beforeSendData(value) {
          this._beforeSendData = value;
        },
        _beforeSendLabelData: {}, // 之前的Label数据
        get beforeSendLabelData() {
          return this._beforeSendLabelData;
        },
        set beforeSendLabelData(value) {
          this._beforeSendLabelData = value;
        },
        importData: {
          importDialog: '',
          importDialogTitle: ''
        },
        afterSendData: {}, // 改后的数据
        afterSendDataLabel: {}, // 改后的数据Label
        afterSendDataLabelBefore: {}, // 改后对应改前的Label
        dialogConfig: { // 弹框配置信息
          title: '提示',
          mask: true,
          footerHide: false,
          contentText: '',
          confirm: () => {
          }
        },

        columnEditElementId: {}, // 保存每列的可编辑元素的id
        editElementId: [], // 表格可编辑元素id 用于回车键使用
        routerParams: {},
        agGridOptions: window.ProjectConfig.agGridOptions || {},
        useAgGrid: window.ProjectConfig.useAgGrid,
      };
    },
    props: {
      webConfSingle: {// 当前子表webconf
        type: Object,
        default: () => ({})
      },
      tabwebact: {// 自定义类型按钮
        type: Object,
        default: () => ({})
      },
      dataSource: {
        // 总数据源
        type: Object,
        default: () => ({})
      },
      readonly: {
        // 能否编辑
        type: Boolean,
        default: false
      },
      tableReadonly: {
        // 表格是否可编辑
        type: Boolean,
        default: false
      },
      
      objreadonly: {
        // 主表按钮的
        type: Boolean,
        default: false
      },
      tableHeight: {
        // 表格高度 默认300px
        type: Number,
        default: 0
      },
      status: {
        type: Number,
        default: 1
      },
      tableName: {
        type: String,
        default: ''
      }, // 表名
      type: {
        type: String,
        default: pageType.Vertical
      },
      itemInfo: {// 当前子表信息
        type: Object,
        default: () => ({})
      },
      tooltipForItemTable: {
        type: Array,
        default: () => ([])
      },
      // 是否用普通表格渲染
      isCommonTable: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      ...mapState('global', {
        // collapseHistoryAndFavorite: ({ collapseHistoryAndFavorite }) => collapseHistoryAndFavorite,
        // menuLists: ({ menuLists }) => menuLists
        LinkUrl: ({ LinkUrl }) => LinkUrl,
        activeTab: ({ activeTab }) => activeTab,
        exportTasks: ({ exportTasks }) => exportTasks

      }),

      currentTabIndex() {
        return this.tabCurrentIndex;

        // if (this.WebConf && this.WebConf.isCustomizeTab && this.type === 'horizontal') {
        //   return this.tabCurrentIndex + 1;
        // } else {
        //   return this.tabCurrentIndex;
        // }
      },
      dynamicRoutingForSinglePage() {
        if (this.itemInfo && this.itemInfo.componentAttribute && this.itemInfo.componentAttribute.buttonsData && this.itemInfo.componentAttribute.buttonsData.data && this.itemInfo.componentAttribute.buttonsData.data.webconf) {
          return this.itemInfo.componentAttribute.buttonsData.data.webconf.dynamicRouting;
        }
        return null;
      },
      objList() { // 返回克隆表定制弹框所需数据
        if (this.type === 'horizontal') { // 横向布局
          return this.itemInfo.componentAttribute.panelData.data.addcolums;
        } if (this.type === 'vertical') {
          if (this.mainFormInfo.formData.data) {
            return this.mainFormInfo.formData.data.addcolums;
          }
        }
        return [];
      },
      filterList() {
        return this.columns.filter(
          ele => ele.name !== EXCEPT_COLUMN_NAME && ele.isfilter
        );
      },
      data() {
        // this.filterBeforeData();
        // return this.filterData(this.dataSource.row); // 每列的数据
      },
      copyDataSource() {
        return JSON.parse(JSON.stringify(this.dataSource));
      },
      //   columns() {
      //     const isTableRender = this.isTableRender;
      //     console.log(this.filterColumns(this.dataSource.tabth, isTableRender));
      //     return this.filterColumns(this.dataSource.tabth, isTableRender); // 每列的属性
      //   },
      isFullRangeSubTotalEnabled() { // 是否显示总计
        return this.dataSource.isFullRangeSubTotalEnabled;
      },
      isSubTotalEnabled() { // 是否显示合计
        return this.dataSource.isSubTotalEnabled;
      },
      isHorizontal() { // 是否是左右结构
        return this.type === pageType.Horizontal;
      },
      
      buttonGroups() { // 按钮组的数据组合
        // let tabIndex = null;
        // if (this.WebConf && this.WebConf.isCustomizeTab && this.type === 'horizontal') {
        //   tabIndex = this.tabCurrentIndex + 1;
        // } else {
        //   tabIndex = this.tabCurrentIndex;
        // }
        const { tabcmd, DisableEXPORT } = this.tabPanel[this.currentTabIndex].componentAttribute.buttonsData.data;
        if (!tabcmd) {
          return [];
        }
        const buttonGroupShow = [];
        if (!this.objreadonly && this.itemInfo.tabinlinemode !== 'N') {
          if (tabcmd.cmds && tabcmd.cmds.length > 0) {
            // 取主表path用于子表
            if (this.mainFormInfo && this.mainFormInfo.buttonsData && this.mainFormInfo.buttonsData.data && this.mainFormInfo.buttonsData.data.tabcmd) {
              this.mainFormInfo.buttonsData.data.tabcmd.cmds.forEach((cmd, index) => {
                if (this.mainFormInfo.buttonsData.data.tabcmd.paths) {
                  this.mainFormInfo.buttonsData.data.tabcmd.paths.forEach((path, i) => {
                    if (index === i) {
                      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                      this.buttonPath[cmd] = path;
                    }
                  });
                }
              });
            }
            tabcmd.cmds.map((item, index) => {
              if (this.status === 2) {
                tabcmd.prem[index] = false;
              } else if (tabcmd.prem[index]) {
                const type = item.split('action');
                const str = `CMD_${type[1].toUpperCase()}`;
                // if (str !== 'CMD_MODIFY') { // 保存不显示
                const buttonConfig = JSON.stringify(buttonmap[str]);// 因此操作会改变store状态值，所以对象字符串之间互转，生成新对象
                let buttonConfigInfo = JSON.parse(buttonConfig);
                if (str === 'CMD_DELETE') { // 删除 -> 删除明细
                  buttonConfigInfo = buttonmap.CMD_REF_DELETE;
                }
                if (tabcmd.paths) {
                  buttonConfigInfo.requestUrlPath = tabcmd.paths[index];
                }
                buttonConfigInfo.path = this.buttonPath[item];
                buttonConfigInfo.eName = item;
                buttonGroupShow.push(
                  buttonConfigInfo
                );
                // }
              }
              return item;
            });
          }
        }

        // 如果子表中objectTab接口返回DisableEXPORT为true则不显示导出按钮
        if (!DisableEXPORT) {
          buttonmap.CMD_EXPORT_LIST.eName = 'actionEXPORT';
          buttonGroupShow.push(buttonmap.CMD_EXPORT_LIST); // 默认有导出
        }

        // 如果配置tabrelation为1:1 去除导入和删除
        if (Version() === '1.4' && this.itemInfo && this.itemInfo.tabrelation === '1:1') {
          buttonGroupShow.forEach((item, index) => {
            if (item.eName !== 'actionEXPORT') {
              buttonGroupShow.splice(index, 1);
            }
          });
        }
        if (this.webConfSingle) {
          if (this.webConfSingle.disableExport) {
            buttonGroupShow.forEach((item, index) => {
              if (item.eName === 'actionEXPORT') {
                buttonGroupShow.splice(index, 1);
              }
            });
          }
          if (this.webConfSingle.disableImport) {
            buttonGroupShow.forEach((item, index) => {
              if (item.eName === 'actionIMPORT') {
                buttonGroupShow.splice(index, 1);
              }
            });
          }
        }
        let buttons = '';
        if (this.tabwebact && this.tabwebact.objtabbutton && this.tabwebact.objtabbutton.length > 0) { // 接入自定义按钮渲染逻辑
          const buttonArray = buttonGroupShow.concat(this.tabwebact.objtabbutton);
          const newButtonArray = buttonArray.map((item) => {
            const objs = Object.keys(item).reduce((newData, key) => {
              if (newData.webdesc) {
                newData.name = newData.webdesc;
                delete (newData.webdesc);
              }
              newData.eName = newData.vuedisplay ? newData.vuedisplay : newData.eName;
              newData[key] = item[key];
              return newData;
            }, {});
            return objs;
          });
          buttons = JSON.stringify(newButtonArray);// 因此操作会改变store状态值，所以对象字符串之间互转，生成新对象
        } else {
          buttons = JSON.stringify(buttonGroupShow);// 因此操作会改变store状态值，所以对象字符串之间互转，生成新对象
        }
        return JSON.parse(buttons);
      },
      isMainTableReadonly() {
        // if (this.type === pageType.Vertical) {
        //   if (this.mainFormInfo.buttonsData) {
        //     return this.mainFormInfo.buttonsData.data.objreadonly;
        //   }
        // } else {
        //   return this.objreadonly;
        // }
        return this.objreadonly;
      },
      pageInfo() {
        return this.itemInfo.tablePageInfo;
      },
      pageItemId() {
        return router.currentRoute.params.itemId;
      }
    },
    watch: {
     
      buttonGroups: {
        handler(val) {
          this.buttonData = val;
        },
        deep: true
      },
      beforeSendData(val) {
        this.$emit(TABLE_BEFORE_DATA, val);
      },
      beforeSendLabelData(val) {
        this.$emit(TABLE_BEFORE_LABEL_DATA, val);
      },
      tooltipForItemTable: {
        handler(val) {
          this.reloadErrorTips(val);
        },
        deep: true
      },
      dataSource: {
        handler(val) {
          setTimeout(() => {
            this.currentPage = this.itemInfo.tablePageInfo.currentPageIndex;
          }, 0);
          if (this.isRefreshClick) {
            this.afterSendData = {};
            this.afterSendDataLabel = {};
            this.afterSendDataLabelBefore = {};
            this.verifyTipObj = {};
            this.fkSelectedChangeData = [];
            this.isRefreshClick = false;
          }
          const isTableRender = this.isTableRender;
          
          setTimeout(() => {
            if(this.isCommonTable || !this.useAgGrid) {
              this.columns = this.filterColumns(this.dataSource.tabth, isTableRender); // 每列的属性
            } else {
              this.columns = this.filterAgColumns(this.dataSource.tabth)
            }
            this.tabledata = this.filterData(this.dataSource.row); // 每列的数据
            this.totalDataNumber = this.totalData();
            this.$emit('setSearchValue') // 设置下拉的默认查询条件
          }, 50);

          this.tableRowSelectedIds = [];
          if (val.row) {
            this.filterBeforeData();
          }
          this.getEditAbleId(JSON.parse(JSON.stringify(this.dataSource)));
        },
        deep: true,
        immediate: true
      },
      objreadonly: {
        handler() {
          const isTableRender = this.isTableRender;
          if(this.useAgGrid) {
            this.columns = this.filterAgColumns(this.dataSource.tabth)
          } else {
            this.columns = this.filterColumns(this.dataSource.tabth, isTableRender); // 每列的属性
          }
          this.getEditAbleId(JSON.parse(JSON.stringify(this.dataSource)));
        }
      }

    },
    created() {
      this.ChineseDictionary = ChineseDictionary;
      this.$once('setSearchValue', () => {
        this.setSelectDefaultValue(); // 设置下拉的默认查询条件
      })
      if(this.$parent.slotTableTemplate!== ''){
        this.slotTableTemplate = this.$parent.slotTableTemplate;
      }else{
          this.slotTableTemplate = TableTemplate;
      }  
    },
    methods: {
      ...mapActions('global', ['getExportedState', 'updataTaskMessageCount']),
      ...mapMutations('global', ['directionalRouter', 'updateCustomizeMessage', 'copyDataForSingleObject', 'tabOpen', 'increaseLinkUrl', 'addKeepAliveLabelMaps', 'updateExportedState']),
      tableRowDbclick(row) {
        if (this.dynamicRoutingForSinglePage) { // 配置了动态路由，双击表格走动态路由
          window.sessionStorage.setItem('dynamicRoutingForSinglePage', true);
          let type = '';
          if (!row._TABLENAME || !row._TABLEID || !row._OBJID) {
            const data = {
              mask: true,
              title: '警告',
              content: '请维护表名或OBJID'
            };
            this.$Modal.fcWarning(data);
            return;
          } else if (row._OBJTYPE === 'object') {
            // 单对象上下结构
            type = 'tableDetailVertical';
          } else if (row._OBJTYPE === 'tabpanle') { // 左右结构
            type = 'tableDetailHorizontal';
          } else {
            const data = {
              mask: true,
              title: '警告',
              content: '请设置外键关联表的显示配置'
            };
            this.$Modal.fcWarning(data);
            return;
          }
          // AD_TABLE/992/24369
          // this.tabOpen({
          //   type,
          //   label: row.reftabdesc,
          //   tableName: 'AD_TABLE',
          //   tableId: 992,
          //   id:'New',
          //   serviceId: 'ad-app'
          // });
          this.tabOpen({
            type,
            label: row.reftabdesc,
            tableName: row._TABLENAME,
            tableId: row._TABLEID,
            id: row._OBJID,
            serviceId: row._SERVICEID
          });
        }
      },

      setColPosition(data) {
        network.post('/p/cs/setColPosition', urlSearchParams(data));
      },

      // ag表格重置列位置的回调
      afterColumnMoved(cols) {
        const { tableId } = this[INSTANCE_ROUTE_QUERY];
        this.setColPosition({
          tableid: tableId,
          colposition: cols
        });
        // this.updateAgConfig({ key: 'colPosition', value: cols });
      },

      // ag表格列组件筛选器
      renderParams(cellData) {
        let componentInfo = null;
        const renderFn = this.collectionCellRender(cellData);

        if (renderFn) {
          componentInfo = {
            renderContainer: 'CellRenderByFunction', // 用专门的render函数容器渲染
            renderComponent: renderFn,
          };
        }
        
        // 序号按正常文本渲染
        if (cellData.colname === EXCEPT_COLUMN_NAME) {
          componentInfo = null;
        }

        return componentInfo;
      },

      // 过滤commonTable列数据给ag用
      filterAgColumns(columns) {
        if (!columns) {
          return [];
        }
        // 整合表头数据
        const newColumns = columns
          .map((ele) => {
            const param = {
              title: ele.name,
              key: ele.colname,
              field: ele.colname,
              align: 'center',
              tdAlign: ele.type === 'NUMBER' ? 'right' : 'center',
              isagfilter: false // 关闭过滤功能
            };

            // 序号按行索引渲染
            if (ele.colname === EXCEPT_COLUMN_NAME) {
              param.field = '__ag_sequence_column_name__.val';
            }

            if (!param.sortable && this.dataSource.ordids && this.dataSource.ordids.length > 0) {
              this.dataSource.ordids.map((order) => {
                if (ele.colname === order.colname && param.title !== '序号') {
                  param.sortType = order.ordasc ? 'asc' : 'desc';
                }
                return order;
              });
            }

            if (ele.isorder) {
              param.sortable = 'custom';
            }

            const item = Object.assign({}, ele, param);
            return item;
          });

        return newColumns;
      },

      // 设置查询条件默认值。默认取选项数组的第一个值
      setSelectDefaultValue() {
        if (this.filterList && this.filterList[0]) {
          const option = this.filterList[0];
          this.searchCondition = option.isfk ? option.inputname : option.colname;
        }
      },

      imporSuccess(id) {
        if (Version() === '1.3') {
          if (id) {
            this.updateExportedState({});
            const promises = new Promise((resolve, reject) => {
              this.getExportedState({
                objid: id, id, resolve, reject
              });
            });
            promises.then(() => {
              this.$R3loading.hide(this.routerParams.tableName);
              this.closeImportDialog();
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
                const data = {
                  mask: true,
                  title: '成功',
                  content: this.exportTasks.resultMsg
                };
                this.$Message.success(data);
              }
              this.refresh();
            }, () => {
              // if (this.exportTasks.warningMsg) {
              //   const data = {
              //     mask: true,
              //     title: '错误',
              //     content: `${this.exportTasks.resultMsg}`
              //   };
              //   this.$Modal.error(data);
              // }
              this.$R3loading.hide(this.routerParams.tableName);
              this.closeImportDialog();
            });
          }
        } else {
          this.$R3loading.hide(this.routerParams.tableName);
        }
      },
      getEditAbleId(data) {
        this.columnEditElementId = {};
        this.editElementId = [];
        data.row.forEach((rowItem, rowIdx) => {
          data.tabth.forEach((tabthItem, tabthIdx) => {
            if (tabthItem.display === 'text' || tabthItem.fkdisplay === 'drp' || tabthItem.fkdisplay === 'mrp'
              || tabthItem.fkdisplay === 'mop' || tabthItem.fkdisplay === 'pop') {
              if (tabthItem.ismodify && !this.objreadonly) {
                this.editElementId.push(`${rowIdx}-${tabthIdx}`);
                if (!this.columnEditElementId[tabthIdx]) {
                  this.columnEditElementId[tabthIdx] = [];
                }
                this.columnEditElementId[tabthIdx].push(`${rowIdx}-${tabthIdx}`);
              }
            }
          });
        });
      }, // 获取表格里可编辑元素的id
      tableCellFocusByEnter(elementId) {
        const findIndex = this.editElementId.findIndex(item => item === elementId);
        let elementIndex = 0;
        if (findIndex !== this.editElementId.length - 1) {
          elementIndex = findIndex + 1;
        }
        const focusDom = document.getElementById(this.editElementId[elementIndex]);
        if (focusDom && !focusDom.getElementsByTagName('input')[0].disabled) {
          focusDom.getElementsByTagName('input')[0].focus();
          focusDom.getElementsByTagName('input')[0].select();
        } else {
          this.tableCellFocusByEnter(this.editElementId[elementIndex]);
        }
        // document.getElementById(this.editElementId[elementIndex]).querySelectorAll('input')[0].focus();
      }, // 回车的时候聚焦下一个可编辑的输入框
      tableCellFocusByUpOrDown(elementId, currentColumn, type) {
        const findIndex = this.columnEditElementId[currentColumn].findIndex(item => item === elementId);
        let elementIndex = 0;
        if (type === 'up') {
          if (findIndex === 0) {
            elementIndex = this.columnEditElementId[currentColumn].length - 1;
          } else {
            elementIndex = findIndex - 1;
          }
        } else if (type === 'down') {
          elementIndex = findIndex + 1;
        }
        const focusDom = document.getElementById(this.columnEditElementId[currentColumn][elementIndex]);
        if (focusDom && !focusDom.getElementsByTagName('input')[0].disabled) {
          focusDom.getElementsByTagName('input')[0].focus();
          setTimeout(() => {
            focusDom.getElementsByTagName('input')[0].select();
          }, 0);
        } else {
          this.tableCellFocusByUpOrDown(this.columnEditElementId[currentColumn][elementIndex], currentColumn, type);
        }
      }, // 按下上键或者下键的时候聚焦下一个可编辑的输入框
      clearSearchData() {
        this.searchCondition = null;
        this.searchInfo = '';
        this.currentPage = 1;
      }, // 清空搜索框里的值
      totalData() {
        const total = [];
        if (this.dataSource.isSubTotalEnabled) {
          const cell = {
            COLLECTION_INDEX: '<div class="text-center">合计</div>'
          };
          // const needSubtotalList = this.columns.filter(ele => ele.issubtotal);
          // needSubtotalList.map((ele) => {
          //   const needSubtotalDatas = [];
          //   this.tabledata.reduce((a, c) => needSubtotalDatas.push(c[ele.colname]), []); //
          //   const totalNumber = needSubtotalDatas.reduce((a, c) => Number(a) + Number(c), []);
          //   cell[ele.colname] = `${totalNumber}`;
          //   return ele;
          // });
          if (this.dataSource.subtotalRow && Object.keys(this.dataSource.subtotalRow).length > 0) {
            Object.keys(this.dataSource.subtotalRow).forEach((key) => {
              cell[key] = `<div class="text-right">${this.dataSource.subtotalRow[key]}</div>`;
            });
          }
          total.push(cell);
        }
        // if (this.isHorizontal) {
        if (this.dataSource.isFullRangeSubTotalEnabled) {
          // 总计
          const cell = {
            COLLECTION_INDEX: '<div class="text-center">总计</div>',
          };
          if (this.dataSource.fullRangeSubTotalRow) {
            for (const key in this.dataSource.fullRangeSubTotalRow) {
              if (Object.prototype.hasOwnProperty.call(this.dataSource.fullRangeSubTotalRow, key)) {
                const element = this.dataSource.fullRangeSubTotalRow[key];
                cell[key] = `<div class="text-right">${element.val}</div>`;
              }
            }
          }
          total.push(cell);
        }
        // }
        return total;
      },
      buttonClick(obj) {
        if (obj.confirm) {
          // 有提示
          if (obj.confirm.indexOf('{') >= 0) {
            if (JSON.parse(obj.confirm).isselect) {
              if (this.tableRowSelectedIds && this.tableRowSelectedIds.length === 0) {
                const title = this.ChineseDictionary.WARNING;
                const contentText = `${JSON.parse(obj.confirm).nodesc}`;
                const data = {
                  mask: true,
                  title,
                  content: contentText
                };
                this.$Modal.fcWarning(data);
              } else if (
                JSON.parse(obj.confirm).isradio
                && this.tableRowSelectedIds.length !== 1
              ) {
                const title = this.ChineseDictionary.WARNING;
                const contentText = `${JSON.parse(obj.confirm).radiodesc}`;
                const data = {
                  mask: true,
                  title,
                  content: contentText
                };
                this.$Modal.fcWarning(data);
              } else if (JSON.parse(obj.confirm).desc) {
                const title = this.ChineseDictionary.WARNING;
                const content = `${JSON.parse(obj.confirm).desc}`;
                let contentText = '';
                const confirm = JSON.parse(obj.confirm);
                if (content.indexOf('{isselect}') !== '-1') {
                  contentText = `${confirm.desc.replace('{isselect}', this.tableRowSelectedIds.length)}`;
                } else {
                  contentText = `${JSON.parse(obj.confirm).desc}`;
                }
                this.dialogMessage(title, contentText, obj);
              } else {
                this.buttonEvent(obj);
              }
            } else if (JSON.parse(obj.confirm).desc) {
              if (JSON.parse(obj.confirm).isSave) { // 配置保存以及刷新后，重置刷新
                obj.isrefrsh = false;
              }
              const title = this.ChineseDictionary.WARNING;
              const contentText = `${JSON.parse(obj.confirm).desc}`;
              this.dialogMessage(title, contentText, obj);
            } else if (JSON.parse(obj.confirm).isSave) { // 静默执行保存
              const type = 'objTabActionSlient';
              this.objTabActionSlientData = obj;
              this.clickSave({ type });
            }
          } else {
            const title = this.ChineseDictionary.WARNING;
            const contentText = `${obj.confirm}`;
            this.dialogMessage(title, contentText, obj);
          }
        } else {
          this.buttonEvent(obj);
        }
      },
      clickSave(data) {
        if (data && data.requestUrlPath) {
          if (data.requestUrlPath) {
            this.saveButtonPath = data.requestUrlPath;
          } else if (data.type) {
            this.saveEventAfter = data.type;
          }
        }
        const dom = document.getElementById('actionMODIFY');
        const myEvent = new Event('click');
        dom.dispatchEvent(myEvent);
      },
      objTabActionSlientForItemTable(data) {
        if (data.detail.type === 'resolve') {
          this.objTabActionSlientConfirm(this.objTabActionSlientData);
        }
      },
      dialogMessage(title, contentText, obj) {
        const data = {
          mask: true,
          title,
          content: contentText,
          showCancel: true,
          onOk: () => {
            if (JSON.parse(obj.confirm).isSave) {
              const type = 'objTabActionSlient';
              this.objTabActionSlientData = obj;
              this.clickSave({ type });
            } else {
              this.errorconfirmDialog(obj);
            }
          }
        };
        this.$Modal.fcWarning(data);
      },
      errorconfirmDialog(obj) {
        this.buttonEvent(obj);
      },
      buttonEvent(obj) {
        switch (obj.eName || obj.vuedisplay || obj.isJflow) {
        case 'actionMODIFY': // 保存
          this.objectMODIFY();
          break;
        case 'actionIMPORT': // 导入
          this.objectIMPORT();
          break;
        case 'actionEXPORT': // 导出
          if (this.R3_openedApi_export && typeof this.R3_openedApi_export === 'function') {
            this.R3_openedApi_export();
          } else {
            this.objectEXPORT();
          }
          // this.objectEXPORT();
          break;
        case 'actionDELETE': // 删除
          this.objectTryDelete(obj);
          break;
        case 'slient':
        case 'slient_custom':
          this.objTabActionSlient(obj);// 静默类型
          break;
        case 'download':
          this.objTabActiondDownload(obj);// 下载类型
          break;
        case 'dialog':
          this.objTabActionDialog(obj);// 自定义弹出框类型
          break;
        case 'navbar':
          this.objTabActionNavbar(obj);// 跳转类型
          break;
        case 'isJflow':
          this.clickExtraposition(obj);// jflow按钮执行方法
          break;

        default:
          break;
        }
      },
      objectMODIFY() { // 保存
        this.clickSave();
      },
      clickExtraposition(obj) { // jflow方法
        DispatchEvent('jflowPlugin', {
          detail: {
            obj
          }
        });
      },
      objTabActionSlient(tab) { // 动作定义静默
        this.objTabActionSlientConfirm(tab);
      },
      // 动作定义静默执行
      objTabActionSlientConfirm(tab) {
        let obj = {};
        let params = {};
        const { tableName } = router.currentRoute.params;
        if (Version() === '1.3') {
          const label = `${this.activeTab.label.replace('编辑', '')}`;
          const ids = this.tableRowSelectedIds.map(item => item.ID);
          if (tab.action && tab.action.search('/') === -1) {
            const param = {// param层动态参数
              // objid: itemId,
              table: this.tableName,
              menu: label,
              ids, // 子表勾选ID
            };
            params = param;
          } else {
            // console.log('请检查子表静默类型按钮action配置，例如:action: com.jackrain.nea.oc.oms.api.OcbOrderMergeMenuCmd:1.0:oms-fi');
          }
        } else if (Version() === '1.4') {
          const ids = this.tableRowSelectedIds.map(item => parseInt(item.ID));
          obj = {
            tableName: this.tableName,
            ids
          };
          params = obj;
        }

        const promise = new Promise((resolve, reject) => {
          this.getObjTabActionSlientConfirm({
            tab, params, path: tab.action, resolve, reject, vuedisplay: tab.vuedisplay
          });
          this.$R3loading.show();
        });
        if (tab.cuscomponent) {
          const nextOperate = JSON.parse(// 配置信息
            tab.cuscomponent
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
              const promiseForSuccess = new Promise((resolve) => {
                this.getActionDataForButtons({ param: successActionParam, resolve });
              });
              promiseForSuccess.then(() => {
                const exeActionDataForComponent = this.ExeActionDataForComponent.data;
                this.buttonEvent(exeActionDataForComponent);
              });
            } else {
              const message = this.ExeActionData;
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
              const promises = new Promise((resolve) => {
                this.getActionDataForButtons({ param: errorActionParam, resolve });
              });
              promises.then(() => {
                const exeActionDataForComponent = this.ExeActionDataForComponent.data;
                this.buttonEvent(exeActionDataForComponent);
              });
            }
          });
        } else {
          promise.then(() => {
            this.$R3loading.hide(tableName);
            const message = this.objTabActionSlientConfirmData.message;
            const data = {
              mask: true,
              title: '成功',
              content: `${message}`
            };
            this.$Modal.fcSuccess(data);
            if (tab.isrefrsh) { // 如果配置isrefrsh则静默执行成功刷新界面
              this.refresh();
            }
          }, () => {
            this.$R3loading.hide(this.routerParams.tableName);
          });
        }
      },
      objTabActiondDownload(tab) {
        const downloadId = this.tableRowSelectedIds.map(item => item.ID).toString();
        const paths = tab.action.replace('$objid$', downloadId);
        const eleLink = document.createElement('a');
        const path = getGateway(`${paths}`);
        eleLink.setAttribute('href', path);
        eleLink.style.display = 'none';
        document.body.appendChild(eleLink);
        eleLink.click();
        document.body.removeChild(eleLink);
      },
      objTabActionDialog(tab) { // 动作定义弹出框
        this.$refs.dialogRef.open();
        this.isrefrsh = tab.isrefrsh;
        this.dialogConfig.title = tab.name;
        this.dialogConfig.footerHide = true;
        const url = tab.action;
        const index = url.lastIndexOf('/');
        const filePath = url.substring(index + 1, url.length);
        // Vue.component(filePath, CustomizeModule[filePath].component);
        this.dialogComponentName = filePath;
        // }
      },
      dialogComponentSaveSuccess() { // 自定义弹框执行确定按钮操作
        if (this.isrefrsh) {
          this.refresh();
          this.isrefrsh = '';
          // const dom = document.getElementById('hideRefresh');
          // const myEvent = new Event('click');
          // dom.dispatchEvent(myEvent);
        }
      },
      refresh() {
        // let tabIndex = null;
        // if (this.WebConf && this.WebConf.isCustomizeTab && this.type === 'horizontal') {
        //   tabIndex = this.tabCurrentIndex + 1;
        // } else {
        //   tabIndex = this.tabCurrentIndex;
        // }
        const { itemId, tableName } = this.$route.params;
      
        if (this.type === 'vertical') { // 上下结构
          new Promise((resolve, reject) => {
            this.getObjectTabForMainTable({
              table: tableName, objid: itemId, tabIndex: this.currentTabIndex, itemTabelPageInfo: this.pageInfo, resolve, reject
            });
          }).then(() => {
          });
          this.getObjectForMainTableForm({
            table: tableName, objid: itemId, tabIndex: this.currentTabIndex
          });
        } else { //  左右结构
          this.getObjectForMainTableForm({
            table: tableName, objid: itemId, tabIndex: this.currentTabIndex
          });
          const fixedcolumns = {};
          if (this.searchCondition) {
            fixedcolumns[this.searchCondition] = this.searchInfo;
          }
          const params = {
            table: tableName,
            objid: itemId,
            refcolid: this.tabPanel[this.currentTabIndex].refcolid,
            searchdata: {
              column_include_uicontroller: true,
              startindex: (Number(this.pageInfo.currentPageIndex) - 1) * Number(this.pageInfo.pageSize),
              range: this.pageInfo.pageSize,
              fixedcolumns
            },
            tabIndex: this.currentTabIndex
          };
          if (this.currentOrderList.length > 0) {
            // 如果没有排序则不传该参数
            params.searchdata.orderby = this.currentOrderList;
          }
          this.getObjectTableItemForTableData(params);
        }
      },
      clearDialogComponentName() {
        this.dialogComponentName = null;
      },
      isCheck() { // 校验是否勾选了明细
        const id = this.tableRowSelectedIds.map(item => item.ID);
        if (id.length === 0) {
          this.$Message.warning('请勾选ID');
          return false;
        } if (id.length > 1) {
          this.$Message.warning('只能勾选单个ID');
          return false;
        }
        return id;
      },
      objTabActionNavbar(tab) {
        // tab.action = 'CUSTOMIZED/FUNCTIONPERMISSION?id=1&&name=2';
        let tabAction = '';
        if (tab.action && tab.action.includes('?')) {
          tabAction = getUserenv({ url: tab.action });
        } else {
          tabAction = tab.action;
        }
        if (tabAction) {
          // const { itemId } = router.currentRoute.params;
          const actionType = tabAction.substring(0, tabAction.indexOf('/'));
          let singleEditType = tabAction.substring(tabAction.lastIndexOf('/') + 1, tabAction.length);
          if (actionType === 'SYSTEM') {
            if (singleEditType === ':itemId') {
              if (this.tableRowSelectedIds.length === 0) {
                this.$Message.warning('请勾选ID');
                return;
              } if (this.tableRowSelectedIds.length > 1) {
                this.$Message.warning('只能勾选单个ID');
                return;
              }
              const itemId = this.tableRowSelectedIds.map(item => item.ID).toString();
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
            const name = `${LINK_MODULE_COMPONENT_PREFIX}.${tab.webname.toUpperCase()}.${tab.webid}`;
            this.addKeepAliveLabelMaps({ name, label: tab.name });
            const linkUrl = tabAction;
            // const linkId = tab.webid;
            const linkModuleName = tab.webname.toUpperCase();
            if (!this.LinkUrl[linkModuleName]) {
              this.increaseLinkUrl({ linkModuleName, linkUrl });
            }
            const obj = {
              linkName: tab.webname.toUpperCase(),
              linkId: tab.webid,
              linkUrl,
              linkLabel: tab.name
            };
            window.sessionStorage.setItem('tableDetailUrlMessage', JSON.stringify(obj));
            const type = 'tableDetailUrl';
            this.tabOpen({
              type,
              linkName: tab.webname,
              linkId: tab.webid
            });
            const data = {
              type: 'singleLinkButton',
              value: tab,
              customizedModuleId: tab.webname.toUpperCase()
            // 因外链界面tablinkName相同时，只激活一个tab,所以外链界面用linkName作为key存入session,避免因勾选的id不同存入多个，导致关闭当前tab时无法清除存入的多个
              
            };
            this.updateCustomizeMessage(data);
          } else if (actionType.toUpperCase() === 'CUSTOMIZED') {
            const id = this.tableRowSelectedIds.map(item => item.ID).toString();

            let path = tabAction;
            let name = '';
            if (tabAction && tabAction.includes('?')) {
              singleEditType = tabAction.substring(tabAction.lastIndexOf('/') + 1, tabAction.lastIndexOf('?'));// 动态id标记，：itemId
            }
            if (this.itemInfo.tabrelation === '1:m') {
              if (singleEditType === ':itemId') {
                if (this.isCheck()) {
                  path = `/${tabAction.replace(/:itemId/, id)}`;
                  name = getLabel({ url: tabAction, id, type: 'customized' });
                } else {
                  return;
                }
              } else {
                path = getUrl({ url: path, id: tab.webid, type: 'customized' });
                name = getLabel({ url: tabAction, id: tab.webid, type: 'customized' });
              }
            } else {
              if (singleEditType === ':itemId') {
                alert('当前跳转路径不可配置动态id，无可勾选的明细');
                return;
              }
              path = getUrl({ url: path, id: tab.webid, type: 'customized' });
              name = getLabel({ url: tabAction, id: tab.webid, type: 'customized' });
            }
            // this.addKeepAliveLabelMaps({ name, label: tab.name });


            // 支持直接在跳转定制界面类型的按钮tabAction上配置参数
            // 如：CUSTOMIZED/FUNCTIONPERMISSION？id=1&&name=2
            // const keepAliveLabelMapsObj = {
            //   k: name,
            //   v: tab.name
            // };
            const undataFromPageCustomizeButtonInfo = {
              k: name,
              v: this[INSTANCE_ROUTE_QUERY]
            };
            // updateSessionObject('keepAliveLabelMaps', keepAliveLabelMapsObj);// keepAliveLabel因刷新后来源信息消失，存入session
            updateSessionObject('undataFromPageCustomizeButtonInfo', undataFromPageCustomizeButtonInfo);// 将自定义按钮为跳转自定义界面类型的自定义按钮信息存入session

           
            const customizedModuleName = tabAction.split('/')[1];
            const urlRes = `${actionType}/${customizedModuleName.toLocaleUpperCase()}/${tab.webid}`;
            const param = {
              url: urlRes,
              id: tab.webid,
              // label: tab.webdesc,
              isMenu: true,
            };
            this.directionalRouter(param);// 定向路由跳转方法
            const data = {
              type: 'singleCustomizeButton',
              value: tab,
              // customizedModuleId: tab.webid
              // customizedModuleName: customizedModuleName.toLocaleUpperCase()
            // 自定义界面：相同自定义界面标记，ID不同时，只激活同一个tab
            };
            if (enableActivateSameCustomizePage()) {
              data.customizedModuleName = customizedModuleName.toLocaleUpperCase();
            } else {
              data.customizedModuleId = id;
            }
            this.updateCustomizeMessage(data);
          } 
          
          
          // else if (actionType.toUpperCase() === 'CUSTOMIZED') {
          //   const name = getLabel({ url: tabAction, id: tab.webid, type: 'customized' });
          //   this.addKeepAliveLabelMaps({ name, label: tab.webdesc });
          //   const path = getUrl({ url: tabAction, id: tab.webid, type: 'customized' });
          //   const keepAliveLabelMapsObj = {
          //     k: name,
          //     v: tab.webdesc
          //   };
          //   updateSessionObject('keepAliveLabelMaps', keepAliveLabelMapsObj);// keepAliveLabel因刷新后来源信息消失，存入session
          //   router.push(
          //     path
          //   );
          //   const data = {
          //     type: 'singleCustomizeButton',
          //     value: tab,
          //     customizedModuleId: tab.webid
          //   };
          //   this.updateCustomizeMessage(data);
         
          // }
        }


        // // 判断跳转到哪个页面
        // const url = tab.action;
        // const index = url.lastIndexOf('/');
        // const customizedModuleName = url.substring(index + 1, url.length);
        // const label = tab.webdesc;
        // const type = 'tableDetailAction';
        // const name = Object.keys(this.keepAliveLabelMaps);
        // let customizedModuleId = '';
        // name.forEach((item) => {
        //   if (item.includes(`${customizedModuleName.toUpperCase()}`)) {
        //     customizedModuleId = item.split(/\./)[2];
        //   }
        // });
        // // if (tab.actiontype === 'url') {
        // //   this.objTabActionUrl(tab);
        // // } else
        // if (tab.action) {
        //   this.tabOpen({
        //     type,
        //     customizedModuleName,
        //     customizedModuleId,
        //     label
        //   });
        // }
      },
      objectTryDelete(obj) { // 按钮删除方法
        if (obj && obj.path && obj.path.includes('sp|')) {
          obj.path = null;
        }
        if (this.tableRowSelectedIds.length === 0) {
          const data = {
            mask: true,
            title: '警告',
            content: '请先选择需要删除的记录！'
          };
          this.$Modal.fcWarning(data);
          return;
        }
        // this.$refs.dialogRef.showModal = true;
        this.$Modal.fcWarning({
          title: '提示',
          mask: true,
          showCancel: true,
          content: '确认执行删除?',
          onOk: () => {
            let params = {};
            const { tableName, tableId, itemId } = router.currentRoute.params;
            const path = obj.path;
            const itemTable = this.updateData[this.tableName].delete;
            if (obj.path) {
              const mainTable = this.updateData[tableName].delete;

              mainTable[tableName].ID = itemId;
              mainTable[tableName].isdelmtable = false;

              params = {
                ...mainTable,
                ...itemTable
              };
            } else {
              params = {
                delMTable: false,
                objId: itemId,
                tabItem: { ...itemTable },
                table: tableName
              };
            }

            fkHttpRequest().itemTableDelete({
              params,
              path,
              success: (res) => {
                if (res.data.code === -1) {
                  // 删除失败
                  this.reloadErrorTips(res.data.data);
                  this.updateModifyData({ tableName: this.tableName, value: {} });
                  this.updateDeleteData({ tableName: this.tableName, value: {} });
                  this.updateLabelData({ tableName: this.tableName, value: {} });
                } else {
                  const deleteMessage = res.data.message;
                  this.$Message.success(`${deleteMessage}`);
                  const { refcolid } = this.itemInfo;

                  // let tabIndex = null;
                  // if (this.WebConf && this.WebConf.isCustomizeTab && this.type === 'horizontal') {
                  //   tabIndex = this.tabCurrentIndex + 1;
                  // } else {
                  //   tabIndex = this.tabCurrentIndex;
                  // }
                  this.getObjectForMainTableForm({ table: tableName, objid: itemId, tabIndex: this.currentTabIndex });
                  const {
                    allPages, currentPage, currentPageSize, total
                  } = this.$refs.page;
                  let startIndex = 0;
                  const tableRowSelectedIdsLength = this.tableRowSelectedIds.length;
                  let currentPageSizes = Math.ceil(total % currentPageSize);
                  if (currentPageSizes === 0) {
                    currentPageSizes = currentPageSize;
                  }
                  if (tableRowSelectedIdsLength === currentPageSizes && allPages === currentPage) { // 如果分页在最后一页并且删除当页全部
                    startIndex = currentPageSize * ((total - tableRowSelectedIdsLength) / currentPageSize - 1);
                  } else {
                    startIndex = (Number(this.pageInfo.currentPageIndex) - 1) * Number(this.pageInfo.pageSize);
                  }
                  this.getObjectTableItemForTableData({
                    table: this.tableName,
                    objid: itemId,
                    refcolid,
                    searchdata: {
                      column_include_uicontroller: true,
                      startindex: startIndex,
                      range: this.pageInfo.pageSize,
                      fixedcolumns: {}
                    },
                    tabIndex: this.currentTabIndex
                  });


                  this.updateModifyData({ tableName: this.tableName, value: {} });
                  this.updateDeleteData({ tableName: this.tableName, value: {} });
                  this.updateLabelData({ tableName: this.tableName, value: {} });
                }
              }
            });
          },
          onCancel: () => {
          }
        });
        // this.$refs.dialogRef.open();
        // this.dialogConfig = {
        //   contentText: '确认执行删除?',
        //   confirm: () => {
        //     let params = {};
        //     const { tableName, tableId, itemId } = router.currentRoute.params;
        //     const path = obj.path;
        //     const itemTable = this.updateData[this.tableName].delete;
        //     if (obj.path) {
        //       const mainTable = this.updateData[tableName].delete;
        //
        //       mainTable[tableName].ID = itemId;
        //       mainTable[tableName].isdelmtable = false;
        //
        //       params = {
        //         ...mainTable,
        //         ...itemTable
        //       };
        //     } else {
        //       params = {
        //         delMTable: false,
        //         objId: tableId,
        //         tabItem: { ...itemTable },
        //         table: tableName
        //       };
        //     }
        //
        //     itemTableDelete({
        //       params,
        //       path,
        //       success: (res) => {
        //         if (res.data.code === -1) {
        //           // 删除失败
        //           this.reloadErrorTips(res.data.data);
        //         } else {
        //           const deleteMessage = res.data.message;
        //           this.$Message.success(`${deleteMessage}`);
        //           const { refcolid } = this.itemInfo;
        //           const tabIndex = this.tabCurrentIndex;
        //           this.getObjectForMainTableForm({ table: tableName, objid: itemId, tabIndex });
        //           this.getObjectTableItemForTableData({
        //             table: this.tableName,
        //             objid: itemId,
        //             refcolid,
        //             searchdata: {
        //               column_include_uicontroller: true,
        //               startindex: (Number(this.pageInfo.currentPageIndex) - 1) * Number(this.pageInfo.pageSize),
        //               range: this.pageInfo.pageSize,
        //               fixedcolumns: {}
        //             },
        //             tabIndex
        //           });
        //         }
        //       }
        //     });
        //   }
        // };
      },
      changePageForSeleteData() {
        const { itemId } = router.currentRoute.params;
        const { refcolid } = this.itemInfo;
        // let tabIndex = null;
        // if (this.WebConf && this.WebConf.isCustomizeTab && this.type === 'horizontal') {
        //   tabIndex = this.tabCurrentIndex + 1;
        // } else {
        //   tabIndex = this.tabCurrentIndex;
        // }
        const {
          allPages, currentPage, currentPageSize, total
        } = this.$refs.page;
        let startIndex = 0;
        const tableRowSelectedIdsLength = this.tableRowSelectedIds.length;
        let currentPageSizes = Math.ceil(total % currentPageSize);
        if (currentPageSizes === 0) {
          currentPageSizes = currentPageSize;
        }
        if (tableRowSelectedIdsLength === currentPageSizes && allPages === currentPage) { // 如果分页在最后一页并且删除当页全部
          startIndex = currentPageSize * ((total - tableRowSelectedIdsLength) / currentPageSize - 1);
        } else {
          startIndex = (Number(this.pageInfo.currentPageIndex) - 1) * Number(this.pageInfo.pageSize);
        }
        this.getObjectTableItemForTableData({
          table: this.tableName,
          objid: itemId,
          refcolid,
          searchdata: {
            column_include_uicontroller: true,
            startindex: startIndex,
            range: this.pageInfo.pageSize,
            fixedcolumns: {}
          },
          tabIndex: this.currentTabIndex
        });
      },
      filterColumns(data) {
        if (!data) {
          return [];
        }
        // 整合表头数据
        const columns = data
          .filter(ele => ele.name !== EXCEPT_COLUMN_NAME)
          .map((ele) => {
            const param = {
              title: ele.name,
              key: ele.colname,
              align: 'center',
              tdAlign: ele.type === 'NUMBER' ? 'right' : 'center',
              width: ele.webconf && ele.webconf.standard_width
            };
            
            if (ele.comment) {
              param.renderHeader = this.tooltipRenderHeader();
            }
            // warning 2019/06/17注释 数据后端已经排序好了 但是 ！！！ 点击后排序  刷新列表 默认展示的排序的图标颜色显示也会丢失
            if (!param.sortable && this.dataSource.ordids && this.dataSource.ordids.length > 0) {
              this.dataSource.ordids.map((order) => {
                if (ele.colname === order.colname && param.title !== '序号') {
                  param.sortType = order.ordasc ? 'asc' : 'desc';
                }
                return order;
              });
            }
            // 2021-04-01 禁用掉表格的默认排序，这样在初始化时不会对后端返回的数据进行二次排序
            param.sortMethod = () => {
            };

            if (ele.isorder) {
              param.sortable = 'custom';
            }
            
            const item = Object.assign({}, ele, param);
            return item;
          });
        const renderColumns = this.renderData(columns);
        // 复选框 + 序号
        const headColumn = [
          {
            type: 'selection',
            width: 40,
            align: 'center',
            fixed: 'left'
          },
          {
            title: '序号',
            width: 60,
            align: 'center',
            fixed: 'left',
            key: COLLECTION_INDEX,
            render: this.collectionIndexRender(columns)
          }
        ];
        return headColumn.concat(renderColumns);
      },
      tooltipRenderHeader() {
        return (h, params) => h('span', [
          h('Poptip', {
            style: {},
            props: {
              trigger: 'hover',
              transfer: true,
              wordWrap: true,
              content: 'content',
              placement: 'top'

            },
            scopedSlots: {
              default: () => h('div', {
                style: {},
                domProps: {
                  innerHTML: `<i class="iconfont iconios-information-circle-outline" style="color: orangered; font-size: 13px"></i> <span>${params.column.name}</span>`
                }
              }),
              content: () => h('div', {
                style: {},
                domProps: {
                  innerHTML: `<span>${params.column.comment}</span>`
                }
              }),
            },
          })
        ]);
      }, // 表头提示的render
      filterData(rows) {
        if (!rows) {
          return [];
        }
        // 整合数据源
        const data = rows.map((ele) => {
          const item = {
            // COLLECTION_INDEX: Number(this.dataSource.start) + index + 1
          };
          for (const key in ele) {
            if (Object.prototype.hasOwnProperty.call(ele, key)) {
              if (ele[key].val !== undefined) {
                item[key] = ele[key].val;
              } else {
                item[key] = ele[key];
              }
            }
          }
          return item;
        });
        setTimeout(() => {
          this.loading = false;
        }, 200);
        return data;
      },
      filterBeforeLabelData() {
        const copyDataSoucre = JSON.parse(JSON.stringify(this.deepClone(this.dataSource)));
        const beforeData = {};
        beforeData[this.tableName] = [];
        copyDataSoucre.row.forEach((ele) => {
          const param = {
            [EXCEPT_COLUMN_NAME]: ele[EXCEPT_COLUMN_NAME].val
          };
          const tabth = copyDataSoucre.tabth.filter(item => item.colname !== EXCEPT_COLUMN_NAME);
          tabth.forEach((tab) => {
            const val = ele[tab.colname].val;
            param[tab.colname] = val;
          });
          beforeData[this.tableName].push(param);
        });
        this.beforeSendLabelData = beforeData;
      }, // 获取默认的label数据
      filterBeforeData() {
        // 分页数据初始化
        this.updateTablePageInfo({
          currentPageIndex: Math.floor((this.dataSource.start / this.dataSource.defaultrange)) + 1,
          pageSize: this.dataSource.defaultrange
        });
        // 组装beforeData
        if ((!this.dataSource.row || this.dataSource.row.length === 0) && !this.beforeSendData[this.tableName]) {
          return;
        }
        this.filterBeforeLabelData();
        const copyDataSoucre = this.deepClone(this.dataSource);
        const beforeData = {};
        beforeData[this.tableName] = [];
        copyDataSoucre.row.map((ele) => {
          const param = {
            EXCEPT_COLUMN_NAME: ele[EXCEPT_COLUMN_NAME].val
          };
          const tabth = copyDataSoucre.tabth.filter(item => item.colname !== EXCEPT_COLUMN_NAME);
          tabth.map((tab) => {
            let val = ele[tab.colname].val;
            switch (tab.display) {
            case 'check': {
                            const currentCheck = tab.combobox.filter(box => box.limitdesc === ele[tab.colname].val);
                            const limitval = currentCheck.length > 0 ? currentCheck[0].limitval : null;
                            val = limitval;
                          }
                          break;
            case 'OBJ_DATENUMBER':
              val = ele[tab.colname].val.replace(/\-/g, '');
              break;
            default:
              break;
            }
            if (tab.isfk) {
              switch (tab.fkdisplay) {
              case 'drp':
                val = ele[tab.colname].refobjid;
                break;
              case 'mrp':
                val = ele[tab.colname].refobjid; // mrp快鱼之前是存的val
                break;
              case 'mop':
                val = ele[tab.colname].refobjid;
                break;
              default:
                break;
              }
            }
            param[tab.colname] = val;
            return tab;
          });
          beforeData[this.tableName].push(param);
          return ele;
        });
        this.beforeSendData = beforeData;
      },
      renderData(columns) {
        const renderColumns = columns.map((ele, index) => {
          ele.render = this.collectionCellRender(ele, index);
          return ele;
        });
        return renderColumns;
      },
      collectionCellRender(cellData) {
        if (cellData.customerurl && Object.keys(cellData.customerurl).length > 0) {
          return this.customerurlRender(cellData);
        }
        // 给cell赋render
        if (!cellData.ismodify || this.tableReadonly || this.isMainTableReadonly || this.itemInfo.tabinlinemode === 'N') {
          // 不可编辑状态 显示label
          if (cellData.isfk && cellData.fkdisplay !== 'mrp' && cellData.fkdisplay !== 'mop') {
            // 如果是外键关联 显示 别针icon
            return this.fkIconRender(cellData);
          }
          if (cellData.display === 'image') {
            // 不可编辑话 图片也是能照常render出来的
            return this.imageRender(cellData, this.DISPLAY_ENUM[cellData.display].tag);
          }
          if (cellData.display === 'doc') {
            // 不可编辑话 文件也是能照常render出来的，只能下载
            return this.docReadonlyRender(cellData, this.DISPLAY_ENUM[cellData.display].tag);
          }
          if (cellData.display === 'text') {
            return this.textRender(cellData, this.DISPLAY_ENUM[cellData.display].tag);
          }
          return null;
        }
        if (cellData.isfk && cellData.fkdisplay) {
          if (!this.DISPLAY_ENUM[cellData.fkdisplay]) {
            return null;
          }
          return this.DISPLAY_ENUM[cellData.fkdisplay].event(cellData, this.DISPLAY_ENUM[cellData.fkdisplay].tag);
        }
        if (!this.DISPLAY_ENUM[cellData.display]) {
          return null;
        }
        return this.DISPLAY_ENUM[cellData.display].event(cellData, this.DISPLAY_ENUM[cellData.display].tag);
      },
      strLen(str) {  
        let len = 0;  
        for (let i = 0; i < str.length; i++) {  
          if (str.charCodeAt(i) > 127 || str.charCodeAt(i) === 94) {  
            len += 2;  
          } else {  
            len++;  
          }  
        }  
        return len;  
      },
      textRender(cellData) {
        return (h, params) => {
          let maxlength = '';
          
          if (params.column.webconf && params.column.webconf.maxlength) {
            maxlength = params.column.webconf.maxlength;
          }
          const dom = document.createElement('div');// 创建dom
          dom.id = 'domID';
          dom.innerHTML = '';
          let content = ''; // 展示的文字
          if (maxlength && params.row[cellData.colname] && params.row[cellData.colname].length > maxlength) {
            content = params.row[cellData.colname].slice(0, maxlength);
            dom.innerHTML = content;
          } else {
            content = params.row[cellData.colname];
            dom.innerHTML = content;
          }
          dom.style.width = 'auto';
          dom.style.display = 'inline';
          const parentNode = document.getElementsByTagName('body')[0];
          parentNode.appendChild(dom);
          const getWIdth = dom.offsetWidth;
          dom.remove();

          let width = maxlength > 0 ? `${getWIdth + 18}px` : '100%';
          if (cellData.width) {
            // 这里需要减掉单元格左右padding宽度，才是真实宽度
            const paddingWidh = 22
            width = `${cellData.width - paddingWidh}px`;
          }
          const innerHTML = content;
          const overflow = maxlength || cellData.width ? 'hidden' : 'none';

          return h('div', [h('div', {
            style: {
              width,
              overflow,
              'text-overflow': 'ellipsis',
              'white-space': 'nowrap',
              'text-align': cellData.type === 'NUMBER' ? 'right' : 'center',
            },
            attrs: {
              title: params.row[cellData.colname]
            },
            class: {
              numberTd: cellData.type === 'NUMBER'
            },
            domProps: {
              innerHTML,
            },
        
          })],);
        };
      },
      inputRender(cellData, tag) {
        // 输入框
        return (h, params) => {
          return h('div', [
            h(tag, {
              style: {
                width: '100px'
              },
              class: {
                'input-align-right': cellData.type === 'NUMBER',
                'input-align-center': cellData.type !== 'NUMBER'
              },
              domProps: {
                id: `${params.index}-${params.column._index - 1}`,
                title: this.copyDataSource.row[params.index] ? this.copyDataSource.row[params.index][cellData.colname].val : ''

              },
              props: {
                // value: this.afterSendData[this.tableName] && this.afterSendData[this.tableName][params.index] && this.afterSendData[this.tableName][params.index][cellData.colname] !== undefined ? this.afterSendData[this.tableName][params.index][cellData.colname] : params.row[cellData.colname],
                value: this.copyDataSource.row[params.index] ? this.copyDataSource.row[params.index][cellData.colname].val : '',
                regx: this.inputRegx(cellData, params),
                maxlength: cellData.length
              },
              nativeOn: {
                // click: (e) => {
                //   e.stopPropagation();
                // }
              },
              on: {
                'on-change': (event, data) => {
                  this.copyDataSource.row[params.index][cellData.colname].val = event.target.value;
                  this.putDataFromCell(event.target.value, this.dataSource.row[params.index][cellData.colname].val, cellData.colname, this.dataSource.row[params.index][EXCEPT_COLUMN_NAME].val, params.column.type);
                  this.putLabelDataFromCell(event.target.value, data.value, cellData.colname, this.dataSource.row[params.index][EXCEPT_COLUMN_NAME].val, this.dataSource.row[params.index][cellData.colname].val);
                },
                'on-focus': (e, i) => {
                },
                'on-keydown': (e, i) => {
                  if (e.keyCode === 13) {
                    // 回车
                    const elementId = i.$el.id;
                    this.tableCellFocusByEnter(elementId);
                  } else if (e.keyCode === 40) {
                    // 下键
                    const elementId = i.$el.id;
                    const currentColumn = params.column._index - 1;
                    this.tableCellFocusByUpOrDown(elementId, currentColumn, 'down');
                  } else if (e.keyCode === 38) {
                    // 上键
                    const elementId = i.$el.id;
                    const currentColumn = params.column._index - 1;
                    this.tableCellFocusByUpOrDown(elementId, currentColumn, 'up');
                  }
                }
              }
            })
          ])
        };
      },
      checkboxRender(cellData, tag) {
        // 999
        // 复选框
        return (h, params) => h('div', [
          h(tag, {
            style: {
              width: '40px'
            },
            props: {
              value: cellData.combobox.filter(
                ele => ele.limitdesc === params.row[cellData.colname]
              ).length > 0 ? cellData.combobox.filter(
                ele => ele.limitdesc === params.row[cellData.colname]
              )[0].limitdis : null
            },
            nativeOn: {
              // click: (e) => {
              //   e.stopPropagation();
              // }
            },
            on: {
              'on-change': (currentValue, data) => {
                const currentCheck = cellData.combobox.filter(ele => ele.limitdis === currentValue);
                const limitval = currentCheck.length > 0 ? currentCheck[0].limitval : null;
                const limitdesc = currentCheck.length > 0 ? currentCheck[0].limitdesc : null;
                const oldcurrentCheck = cellData.combobox.filter(ele => ele.limitdis === data.value);
                const oldLimitval = oldcurrentCheck.length > 0 ? oldcurrentCheck[0].limitval : null;
                this.putDataFromCell(limitval, oldLimitval, cellData.colname, this.dataSource.row[params.index][EXCEPT_COLUMN_NAME].val, params.column.type);
                const type = 'checkbox';
                this.putLabelDataFromCell(limitdesc, oldLimitval, cellData.colname, this.dataSource.row[params.index][EXCEPT_COLUMN_NAME].val, limitval, null, type);
              }
            }
          })
        ]);
      },
      selectRender(cellData, tag) {
        // 下拉框
        return (h, params) => h('div', [
          h(tag, {
              style: {
                width: '100px'
              },
              props: {
                transfer: true,
                clearable: true,
                value: this.getSelectValue(params, cellData)
              },
              nativeOn: {
                // click: (e) => {
                //   e.stopPropagation();
                // }
              },
              on: {
                'on-change': (event, data) => {
                  this.putDataFromCell(event, data.value, cellData.colname, this.dataSource.row[params.index][EXCEPT_COLUMN_NAME].val, params.column.type);
                  const labelValue = data.values.length > 0 ? data.values[0].label : '';
                  this.putLabelDataFromCell(labelValue, data.value, cellData.colname, this.dataSource.row[params.index][EXCEPT_COLUMN_NAME].val, event);
                },
                'on-open-change': (state, data) => {
                  if (!state) {
                    const labelValue = data.values.length > 0 ? data.values[0].label : '';
                    this.putDataFromCell(data.publicValue, data.value, cellData.colname, this.dataSource.row[params.index][EXCEPT_COLUMN_NAME].val, params.column.type);
                    this.putLabelDataFromCell(labelValue, data.value, cellData.colname, this.dataSource.row[params.index][EXCEPT_COLUMN_NAME].val, this.dataSource.row[params.index][cellData.colname].val);
                  }
                }
              }
            },
            this.getSelectValueCombobox(h, cellData))
        ]);
      },
      dropDownIsShowPopTip(cellData, params) {
        if (cellData.refcolval.srccol === '$OBJID$') {
          return true;
        } else if (cellData.refcolval.maintable) {
          const { tableName } = this.$router.currentRoute.params;
          const mainTablePanelData = this.$store.state[this.moduleComponentName].updateData[tableName];
          const defaultValue = mainTablePanelData.default;
          const modifyValue = mainTablePanelData.modify;
          // 先从修改里找 如果修改的里面没有 就从默认值里取
          if (modifyValue[tableName] && modifyValue[tableName][cellData.refcolval.srccol]) {
            return true;
          }
          if (modifyValue[tableName] && Object.keys(modifyValue[tableName]).length > 0 && modifyValue[tableName][cellData.refcolval.srccol] !== undefined) {
            if (modifyValue[tableName][cellData.refcolval.srccol] === '' || modifyValue[tableName][cellData.refcolval.srccol] === 0) {
              return false;
            }
          } else {
            // 默认值取
            const colname = defaultValue[tableName][cellData.refcolval.srccol];
            if (colname) {
              return true;
            } else {
              return false;
            }
          }
        } else if (cellData.refcolval && this.copyDataSource.row[params.index][cellData.refcolval.srccol].val === '') {
          return false;
        }
        return true;
      }, // 下拉外键是否显示弹出框
      dropDownSelectFilterRender(cellData, tag) { // 外键关联下拉选择(drp mrp)Y
        return (h, params) => h('div', [
          h(tag, {
            style: {
              width: '100px'
            },
            domProps: {
              id: `${params.index}-${params.column._index - 1}`
            },
            props: {
              defaultSelected: this.dropDefaultSelectedData(params, cellData),
              // defaultSelected: () =>{},
              single: cellData.fkdisplay === 'drp',
              singleTurn:true,
              pageSize: this.fkDropPageInfo.pageSize,
              totalRowCount: this.fkData.totalRowCount,
              data: this.fkData,
              isShowPopTip: () => {
                if (cellData.refcolval) {
                  if (cellData.refcolval.maintable) {
                    if (this.type === pageType.Vertical) {
                      if (!this.dropDownIsShowPopTip(cellData, params)) {
                        const obj = this.mainFormInfo.formData.data.addcolums.reduce((acc, cur) => {
                          if (cur.childs) {
                            cur.childs.forEach((item) => {
                              acc.push(item);
                            });
                          }
                          if (cur.child) {
                            acc.push(cur.child);
                          }
                          return acc;
                        }, [])
                          .find(item => item.colname === cellData.refcolval.srccol);
                        // const obj = this.$store.state[this.moduleComponentName].LinkageForm.find(item => item.key === cellData.refcolval.srccol);
                        this.$Message.info(`请选择主表${obj.name}`);
                      }
                    } else if (!this.dropDownIsShowPopTip(cellData, params)) {
                      const obj = this.tabPanel[0].componentAttribute.panelData.data.addcolums.reduce((acc, cur) => {
                        if (cur.childs) {
                          cur.childs.forEach((item) => {
                            acc.push(item);
                          });
                        }
                        if (cur.child) {
                          acc.push(cur.child);
                        }
                        return acc;
                      }, [])
                        .find(item => item.colname === cellData.refcolval.srccol);
                      this.$Message.info(`请选择主表${obj.name}`);
                    }
                  } else if (!this.dropDownIsShowPopTip(cellData, params)) {
                    const obj = this.copyDataSource.tabth.find(item => item.key === cellData.refcolval.srccol);
                    this.$Message.info(`请选择${obj.name}`);
                  }
                  return this.dropDownIsShowPopTip(cellData, params);
                }
                return true;
              },
              transfer: true,
              enterType: true,
              AutoData: this.fkAutoData,
              hidecolumns: ['id', 'value']
            },
            // nativeOn: {
            //   click: (e) => {
            //     e.stopPropagation();
            //   }
            // },
            on: {
              'on-popper-show': () => {
                this.fkDropPageInfo.currentPageIndex = 1;
                this.fkAutoData = [];
                this.getFKList(params, cellData);
              },
              'on-popper-hide': () => {
                this.fkData = {};
              },
              'on-page-change': (value) => {
                this.fkDropPageInfo.currentPageIndex = value;
                this.getFKList(params, cellData);
              },
              'on-input-value-change': (data, value) => {
                if (cellData.refcolval) {
                  if (cellData.refcolval.maintable) {
                    if (this.type === pageType.Vertical) {
                      if (!this.dropDownIsShowPopTip(cellData, params)) {
                        const obj = this.mainFormInfo.formData.data.addcolums.reduce((acc, cur) => {
                          if (cur.childs) {
                            cur.childs.forEach((item) => {
                              acc.push(item);
                            });
                          }
                          if (cur.child) {
                            acc.push(cur.child);
                          }
                          return acc;
                        }, [])
                          .find(item => item.colname === cellData.refcolval.srccol);
                        // const obj = this.$store.state[this.moduleComponentName].LinkageForm.find(item => item.key === cellData.refcolval.srccol);
                        this.$Message.info(`请选择主表${obj.name}`);
                      } else {
                        if (this.fkSelectedChangeData[params.index]) {
                          this.fkSelectedChangeData[params.index] = Object.assign(this.fkSelectedChangeData[params.index], {
                            [cellData.key]: [{
                              Label: data,
                              ID: ''
                            }]
                          });
                        } else {
                          this.fkSelectedChangeData[params.index] = Object.assign({}, {
                            [cellData.key]: [{
                              Label: data,
                              ID: ''
                            }]
                          });
                        }
                        if (!value.inputValue) {
                          value.transferDefaultSelected = [];
                        }
                        this.fkAutoData = [];
                        const serviceId = this.copyDataSource.tabth.find(item => item.colname === params.column.colname).serviceId;
                        fkHttpRequest().fkFuzzyquerybyak({
                          searchObject: {
                            ak: data,
                            colid: this.dataSource.row[params.index][cellData.colname].colid,
                            fixedcolumns: {
                              whereKeys: this.getMainRefobjid(params, cellData)
                            },
                          },
                          serviceId,
                          success: (res) => {
                            this.fkAutoData = res.data.data;
                            const autoData = this.fkAutoData.filter(ele => (value.inputValue && ele.value.toUpperCase().indexOf(value.inputValue.toUpperCase()) > -1));
                            if (autoData.length === 0) {
                              // autodata中没有 清空输入框
                              value.notAutoData = true;
                            } else {
                              delete value.notAutoData;
                            }
                          }
                        });
                      }
                    } else if (!this.dropDownIsShowPopTip(cellData, params)) {
                      const obj = this.tabPanel[0].componentAttribute.panelData.data.addcolums.reduce((acc, cur) => {
                        if (cur.childs) {
                          cur.childs.forEach((item) => {
                            acc.push(item);
                          });
                        }
                        if (cur.child) {
                          acc.push(cur.child);
                        }
                        return acc;
                      }, [])
                        .find(item => item.colname === cellData.refcolval.srccol);
                      this.$Message.info(`请选择主表${obj.name}`);
                    } else {
                      if (this.fkSelectedChangeData[params.index]) {
                        this.fkSelectedChangeData[params.index] = Object.assign(this.fkSelectedChangeData[params.index], {
                          [cellData.key]: [{
                            Label: data,
                            ID: ''
                          }]
                        });
                      } else {
                        this.fkSelectedChangeData[params.index] = Object.assign({}, {
                          [cellData.key]: [{
                            Label: data,
                            ID: ''
                          }]
                        });
                      }
                      if (!value.inputValue) {
                        value.transferDefaultSelected = [];
                      }
                      this.fkAutoData = [];
                      const serviceId = this.copyDataSource.tabth.find(item => item.colname === params.column.colname).serviceId;
                      fkHttpRequest().fkFuzzyquerybyak({
                        searchObject: {
                          ak: data,
                          colid: this.dataSource.row[params.index][cellData.colname].colid,
                          fixedcolumns: {
                            whereKeys: this.getMainRefobjid(params, cellData)
                          },
                        },
                        serviceId,
                        success: (res) => {
                          this.fkAutoData = res.data.data;
                          const autoData = this.fkAutoData.filter(ele => (value.inputValue && ele.value.toUpperCase().indexOf(value.inputValue.toUpperCase()) > -1));
                          if (autoData.length === 0) {
                            // autodata中没有 清空输入框
                            value.notAutoData = true;
                          } else {
                            delete value.notAutoData;
                          }
                        }
                      });
                    }
                  } else if (!this.dropDownIsShowPopTip(cellData, params)) {
                    const obj = this.copyDataSource.tabth.find(item => item.key === cellData.refcolval.srccol);
                    this.$Message.info(`请选择${obj.name}`);
                  } else {
                    if (this.fkSelectedChangeData[params.index]) {
                      this.fkSelectedChangeData[params.index] = Object.assign(this.fkSelectedChangeData[params.index], {
                        [cellData.key]: [{
                          Label: data,
                          ID: ''
                        }]
                      });
                    } else {
                      this.fkSelectedChangeData[params.index] = Object.assign({}, {
                        [cellData.key]: [{
                          Label: data,
                          ID: ''
                        }]
                      });
                    }
                    if (!value.inputValue) {
                      value.transferDefaultSelected = [];
                    }
                    this.fkAutoData = [];
                    
                    const serviceId = this.copyDataSource.tabth.find(item => item.colname === params.column.colname).serviceId;
                    fkHttpRequest().fkFuzzyquerybyak({
                      searchObject: {
                        ak: data,
                        colid: this.dataSource.row[params.index][cellData.colname].colid,
                        fixedcolumns: {
                          whereKeys: this.getMainRefobjid(params, cellData)
                        },
                      },
                      serviceId,
                      success: (res) => {
                        this.fkAutoData = res.data.data;
                        const autoData = this.fkAutoData.filter(ele => (value.inputValue && ele.value.toUpperCase().indexOf(value.inputValue.toUpperCase()) > -1));
                        if (autoData.length === 0) {
                          // autodata中没有 清空输入框
                          value.notAutoData = true;
                        } else {
                          delete value.notAutoData;
                        }
                      }
                    });
                  }
                } else {
                  if (this.fkSelectedChangeData[params.index]) {
                    this.fkSelectedChangeData[params.index] = Object.assign(this.fkSelectedChangeData[params.index], {
                      [cellData.key]: [{
                        Label: data,
                        ID: ''
                      }]
                    });
                  } else {
                    this.fkSelectedChangeData[params.index] = Object.assign({}, {
                      [cellData.key]: [{
                        Label: data,
                        ID: ''
                      }]
                    });
                  }
                  if (!value.inputValue) {
                    value.transferDefaultSelected = [];
                  }
                  this.fkAutoData = [];
                  const serviceId = this.copyDataSource.tabth.find(item => item.colname === params.column.colname).serviceId;
                  fkHttpRequest().fkFuzzyquerybyak({
                    searchObject: {
                      ak: data,
                      colid: this.dataSource.row[params.index][cellData.colname].colid,
                      fixedcolumns: {
                        whereKeys: this.getMainRefobjid(params, cellData)
                      },
                    },
                    serviceId,
                    success: (res) => {
                      this.fkAutoData = res.data.data;
                      const autoData = this.fkAutoData.filter(ele => (value.inputValue && ele.value.toUpperCase().indexOf(value.inputValue.toUpperCase()) > -1));
                      if (autoData.length === 0) {
                        // autodata中没有 清空输入框
                        value.notAutoData = true;
                      } else {
                        delete value.notAutoData;
                      }
                    }
                  });
                }
              },
              'on-keydown': (e, i) => {
                if (e.keyCode === 13) {
                  const elementId = i.$el.id;
                  this.tableCellFocusByEnter(elementId);
                } else if (e.keyCode === 40) {
                  // 下键
                  const elementId = i.$el.id;
                  const currentColumn = params.column._index - 1;
                  this.tableCellFocusByUpOrDown(elementId, currentColumn, 'down');
                } else if (e.keyCode === 38) {
                  // 上键
                  const elementId = i.$el.id;
                  const currentColumn = params.column._index - 1;
                  this.tableCellFocusByUpOrDown(elementId, currentColumn, 'up');
                }
              },
              'on-blur': () => {
                this.fkAutoData = [];
                // if (value.notAutoData) {
                //   // autodata中没有 清空输入框 及上次选中的值
                //   value.inputValue = '';
                //   delete value.notAutoData;
                // } else if (this.fkAutoData.length > 0) {
                //   // 当选择模糊搜索结果的时候
                //   const autoData = this.fkAutoData.filter(ele => (value.inputValue && ele.value.toUpperCase().indexOf(value.inputValue.toUpperCase()) > -1));
                //   value.inputValue = autoData[0].value;
                //   value.transferDefaultSelected = [{
                //     ID: autoData[0].id,
                //     Label: autoData[0].value
                //   }];
                // }
                // let ids = null;
                // if (value.transferDefaultSelected.length > 0) {
                //   ids = value.transferDefaultSelected.reduce((acc, cur) => (typeof acc !== 'object' ? `${acc},${cur.ID}` : cur.ID), []);
                // }
                // this.putDataFromCell(ids, value.defaultSelected && value.defaultSelected.length > 0 ? value.defaultSelected[0].ID : null, cellData.colname, this.dataSource.row[params.index][EXCEPT_COLUMN_NAME].val);
              },
              'on-fkrp-selected': (data, value) => {
                this.fkAutoData = [];
                if (this.fkSelectedChangeData[params.index]) {
                  this.fkSelectedChangeData[params.index] = Object.assign(this.fkSelectedChangeData[params.index], { [cellData.key]: data });
                } else {
                  this.fkSelectedChangeData[params.index] = Object.assign({}, { [cellData.key]: data });
                }
                let ids = null;
                if (value.transferDefaultSelected.length > 0) {
                  ids = value.transferDefaultSelected.reduce((acc, cur) => (typeof acc !== 'object' ? `${acc},${cur.ID}` : cur.ID), []);
                }
                this.copyDataSource.row[params.index][cellData.colname].val = data.reduce((acc, cur) => {
                  acc.push(cur.Label);
                  return acc;
                }, []).join(',');
                const labelValue = data.reduce((acc, cur) => {
                  acc.push(cur.Label);
                  return acc;
                }, []).join(',');
                const labelValueID = data.reduce((acc, cur) => {
                  acc.push(cur.ID);
                  return acc;
                }, []).join(',');
                this.putDataFromCell(ids, this.dataSource.row[params.index][cellData.colname].refobjid > -1 ? this.dataSource.row[params.index][cellData.colname].refobjid.toString() : null, cellData.colname, this.dataSource.row[params.index][EXCEPT_COLUMN_NAME].val, params.column.type, cellData.fkdisplay, labelValueID);

                this.putLabelDataFromCell(labelValue, this.dataSource.row[params.index][cellData.colname].refobjid > -1 ? this.dataSource.row[params.index][cellData.colname].refobjid : null, cellData.colname, this.dataSource.row[params.index][EXCEPT_COLUMN_NAME].val, this.dataSource.row[params.index][cellData.colname].val, labelValueID);
              },
              'on-clear': (value) => {
                if (this.fkSelectedChangeData[params.index]) {
                  this.fkSelectedChangeData[params.index] = Object.assign(this.fkSelectedChangeData[params.index], {
                    [cellData.key]: [{
                      Label: '',
                      ID: ''
                    }]
                  });
                } else {
                  this.fkSelectedChangeData[params.index] = Object.assign({}, { [cellData.key]: [{ Label: '', ID: '' }] });
                }
                this.copyDataSource.row[params.index][cellData.colname].val = '';
                this.fkAutoData = [];
                this.putDataFromCell(null, this.dataSource.row[params.index][cellData.colname].refobjid > -1 ? this.dataSource.row[params.index][cellData.colname].refobjid : null, cellData.colname, this.dataSource.row[params.index][EXCEPT_COLUMN_NAME].val, params.column.type, cellData.fkdisplay);
                this.putLabelDataFromCell('', this.dataSource.row[params.index][cellData.colname].refobjid > -1 ? this.dataSource.row[params.index][cellData.colname].refobjid : null, cellData.colname, this.dataSource.row[params.index][EXCEPT_COLUMN_NAME].val, null);
              }
            }
          })
        ]);
      },
      dropMultiSelectFilterRender(cellData, tag) { // 外键关联下拉选择(drp mrp)
        return (h, params) => h('div', [
          h(tag, {
            style: {
              width: '100px'
            },
            domProps: {
              id: `${params.index}-${params.column._index - 1}`
            },
            props: {
              // defaultSelected: this.dataSource.row[params.index][cellData.colname].refobjid === -1 ? [] : this.dataSource.row[params.index][cellData.colname].refobjid.split(',').reduce((acc, cur, idx) => {
              //   this.dataSource.row[params.index][cellData.colname].val.split(',').forEach((item, ind) => {
              //   if (idx === ind) {
              //     acc.push({
              //       ID: cur.toString(),
              //       Label: item
              //     });
              //   }
              // });
              // return acc;
              // }, []),
              defaultSelected: this.dropDefaultSelectedData(params, cellData),
              // defaultSelected: () =>{},
              single: cellData.fkdisplay === 'drp',
              singleTurn:true,
              pageSize: this.fkDropPageInfo.pageSize,
              totalRowCount: this.fkData.totalRowCount,
              data: this.fkData,
              isShowPopTip: () => {
                if (cellData.refcolval) {
                  if (cellData.refcolval.maintable) {
                    if (this.type === pageType.Vertical) {
                      if (!this.dropDownIsShowPopTip(cellData, params)) {
                        const obj = this.mainFormInfo.formData.data.addcolums.reduce((acc, cur) => {
                          if (cur.childs) {
                            cur.childs.forEach((item) => {
                              acc.push(item);
                            });
                          }
                          if (cur.child) {
                            acc.push(cur.child);
                          }
                          return acc;
                        }, [])
                          .find(item => item.colname === cellData.refcolval.srccol);
                        // const obj = this.$store.state[this.moduleComponentName].LinkageForm.find(item => item.key === cellData.refcolval.srccol);
                        this.$Message.info(`请选择主表${obj.name}`);
                      }
                    } else if (!this.dropDownIsShowPopTip(cellData, params)) {
                      const obj = this.tabPanel[0].componentAttribute.panelData.data.addcolums.reduce((acc, cur) => {
                        if (cur.childs) {
                          cur.childs.forEach((item) => {
                            acc.push(item);
                          });
                        }
                        if (cur.child) {
                          acc.push(cur.child);
                        }
                        return acc;
                      }, [])
                        .find(item => item.colname === cellData.refcolval.srccol);
                      this.$Message.info(`请选择主表${obj.name}`);
                    }
                  } else if (!this.dropDownIsShowPopTip(cellData, params)) {
                    const obj = this.copyDataSource.tabth.find(item => item.key === cellData.refcolval.srccol);
                    this.$Message.info(`请选择${obj.name}`);
                  }
                  return this.dropDownIsShowPopTip(cellData, params);
                }
                return true;
              },
              transfer: true,
              enterType: true,
              AutoData: this.fkAutoData,
              hidecolumns: ['id', 'value']
            },
            // nativeOn: {
            //   click: (e) => {
            //     e.stopPropagation();
            //   }
            // },
            on: {
              'on-popper-show': () => {
                this.fkDropPageInfo.currentPageIndex = 1;
                this.fkAutoData = [];
                this.getFKList(params, cellData);
              },
              'on-popper-hide': () => {
                this.fkData = {};
              },
              'on-page-change': (value) => {
                this.fkDropPageInfo.currentPageIndex = value;
                this.getFKList(params, cellData);
              },
              'on-input-value-change': (data, value) => {
                // if (this.fkSelectedChangeData[params.index]) {
                //   this.fkSelectedChangeData[params.index] = Object.assign(this.fkSelectedChangeData[params.index], {
                //     [cellData.key]: [{
                //       Label: data,
                //       ID: ''
                //     }]
                //   });
                // } else {
                //   this.fkSelectedChangeData[params.index] = Object.assign({}, {
                //     [cellData.key]: [{
                //       Label: data,
                //       ID: ''
                //     }]
                //   });
                // }
                if (cellData.refcolval) {
                  if (cellData.refcolval.maintable) {
                    if (this.type === pageType.Vertical) {
                      if (!this.dropDownIsShowPopTip(cellData, params)) {
                        const obj = this.mainFormInfo.formData.data.addcolums.reduce((acc, cur) => {
                          if (cur.childs) {
                            cur.childs.forEach((item) => {
                              acc.push(item);
                            });
                          }
                          if (cur.child) {
                            acc.push(cur.child);
                          }
                          return acc;
                        }, [])
                          .find(item => item.colname === cellData.refcolval.srccol);
                        // const obj = this.$store.state[this.moduleComponentName].LinkageForm.find(item => item.key === cellData.refcolval.srccol);
                        this.$Message.info(`请选择${obj.name}`);
                      } else {
                        if (!value.inputValue) {
                          value.transferDefaultSelected = [];
                        }
                        this.fkAutoData = [];
                        
              
                        const serviceId = this.copyDataSource.tabth.find(item => item.colname === params.column.colname).serviceId;

                        fkHttpRequest().fkFuzzyquerybyak({
                          searchObject: {
                            ak: data,
                            colid: this.dataSource.row[params.index][cellData.colname].colid,
                            fixedcolumns: {
                              whereKeys: this.getMainRefobjid(params, cellData)
                            },

                          },
                          serviceId,

                          success: (res) => {
                            this.fkAutoData = res.data.data;
                            const autoData = this.fkAutoData.filter(ele => (value.inputValue && ele.value.toUpperCase().indexOf(value.inputValue.toUpperCase()) > -1));
                            if (autoData.length === 0) {
                              // autodata中没有 清空输入框
                              value.notAutoData = true;
                            } else {
                              delete value.notAutoData;
                            }
                          }
                        });
                      }
                    } else if (!this.dropDownIsShowPopTip(cellData, params)) {
                      const obj = this.tabPanel[0].componentAttribute.panelData.data.addcolums.reduce((acc, cur) => {
                        if (cur.childs) {
                          cur.childs.forEach((item) => {
                            acc.push(item);
                          });
                        }
                        if (cur.child) {
                          acc.push(cur.child);
                        }
                        return acc;
                      }, [])
                        .find(item => item.colname === cellData.refcolval.srccol);
                      this.$Message.info(`请选择${obj.name}`);
                    } else {
                      if (!value.inputValue) {
                        value.transferDefaultSelected = [];
                      }
                      this.fkAutoData = [];
                      const serviceId = this.copyDataSource.tabth.find(item => item.colname === params.column.colname).serviceId;
                      fkHttpRequest().fkFuzzyquerybyak({
                        searchObject: {
                          ak: data,
                          colid: this.dataSource.row[params.index][cellData.colname].colid,
                          fixedcolumns: {
                            whereKeys: this.getMainRefobjid(params, cellData)
                          },
                        },
                        serviceId,

                        success: (res) => {
                          this.fkAutoData = res.data.data;
                          const autoData = this.fkAutoData.filter(ele => (value.inputValue && ele.value.toUpperCase().indexOf(value.inputValue.toUpperCase()) > -1));
                          if (autoData.length === 0) {
                            // autodata中没有 清空输入框
                            value.notAutoData = true;
                          } else {
                            delete value.notAutoData;
                          }
                        }
                      });
                    }
                  } else if (!this.dropDownIsShowPopTip(cellData, params)) {
                    const obj = this.copyDataSource.tabth.find(item => item.key === cellData.refcolval.srccol);
                    this.$Message.info(`请选择${obj.name}`);
                  } else {
                    if (!value.inputValue) {
                      value.transferDefaultSelected = [];
                    }
                    this.fkAutoData = [];
                    const serviceId = this.copyDataSource.tabth.find(item => item.colname === params.column.colname).serviceId;
                    fkHttpRequest().fkFuzzyquerybyak({
                      searchObject: {
                        ak: data,
                        colid: this.dataSource.row[params.index][cellData.colname].colid,
                        fixedcolumns: {
                          whereKeys: this.getMainRefobjid(params, cellData)
                        },
                      },
                      serviceId,
                      success: (res) => {
                        this.fkAutoData = res.data.data;
                        const autoData = this.fkAutoData.filter(ele => (value.inputValue && ele.value.toUpperCase().indexOf(value.inputValue.toUpperCase()) > -1));
                        if (autoData.length === 0) {
                          // autodata中没有 清空输入框
                          value.notAutoData = true;
                        } else {
                          delete value.notAutoData;
                        }
                      }
                    });
                  }
                } else {
                  if (!value.inputValue) {
                    value.transferDefaultSelected = [];
                  }
                  this.fkAutoData = [];
                  const serviceId = this.copyDataSource.tabth.find(item => item.colname === params.column.colname).serviceId;
                  fkHttpRequest().fkFuzzyquerybyak({
                    searchObject: {
                      ak: data,
                      colid: this.dataSource.row[params.index][cellData.colname].colid,
                      fixedcolumns: {
                        whereKeys: this.getMainRefobjid(params, cellData)
                      },
                    },
                    serviceId,
                    success: (res) => {
                      this.fkAutoData = res.data.data;
                      const autoData = this.fkAutoData.filter(ele => (value.inputValue && ele.value.toUpperCase().indexOf(value.inputValue.toUpperCase()) > -1));
                      if (autoData.length === 0) {
                        // autodata中没有 清空输入框
                        value.notAutoData = true;
                      } else {
                        delete value.notAutoData;
                      }
                    }
                  });
                }
              },
              'on-keydown': (e, i) => {
                // if (e.keyCode === 13) {
                //   const elementId = i.$el.id;
                //   this.tableCellFocusByEnter(elementId);
                // } else if (e.keyCode === 40) {
                //   // 下键
                //   const elementId = i.$el.id;
                //   const currentColumn = params.column._index - 1;
                //   this.tableCellFocusByUpOrDown(elementId, currentColumn, 'down');
                // } else if (e.keyCode === 38) {
                //   // 上键
                //   const elementId = i.$el.id;
                //   const currentColumn = params.column._index - 1;
                //   this.tableCellFocusByUpOrDown(elementId, currentColumn, 'up');
                // }
              },
              'on-blur': () => {
                this.fkAutoData = [];
                // if (value.notAutoData) {
                //   // autodata中没有 清空输入框 及上次选中的值
                //   value.inputValue = '';
                //   delete value.notAutoData;
                // } else if (this.fkAutoData.length > 0) {
                //   // 当选择模糊搜索结果的时候
                //   const autoData = this.fkAutoData.filter(ele => (value.inputValue && ele.value.toUpperCase().indexOf(value.inputValue.toUpperCase()) > -1));
                //   value.inputValue = autoData[0].value;
                //   value.transferDefaultSelected = [{
                //     ID: autoData[0].id,
                //     Label: autoData[0].value
                //   }];
                // }
                // let ids = null;
                // if (value.transferDefaultSelected.length > 0) {
                //   ids = value.transferDefaultSelected.reduce((acc, cur) => (typeof acc !== 'object' ? `${acc},${cur.ID}` : cur.ID), []);
                // }
                // this.putDataFromCell(ids, value.defaultSelected && value.defaultSelected.length > 0 ? value.defaultSelected[0].ID : null, cellData.colname, this.dataSource.row[params.index][EXCEPT_COLUMN_NAME].val);
              },
              'on-fkrp-selected': (data, value) => {
                this.fkAutoData = [];
                if (this.fkSelectedChangeData[params.index]) {
                  if (data.length === 0) {
                    data = [{
                      Label: '',
                      ID: ''
                    }];
                  }
                  this.fkSelectedChangeData[params.index] = Object.assign(this.fkSelectedChangeData[params.index], { [cellData.key]: data });
                } else {
                  this.fkSelectedChangeData[params.index] = Object.assign({}, { [cellData.key]: data });
                }
                let ids = null;
                if (value.transferDefaultSelected.length > 0) {
                  ids = value.transferDefaultSelected.reduce((acc, cur) => (typeof acc !== 'object' ? `${acc},${cur.ID}` : cur.ID), []);
                }
                this.copyDataSource.row[params.index][cellData.colname].val = data.reduce((acc, cur) => {
                  acc.push(cur.Label);
                  return acc;
                }, []).join(',');
                const labelValue = data.reduce((acc, cur) => {
                  acc.push(cur.Label);
                  return acc;
                }, []).sort().join(',');
                const oldLabelValue = this.dataSource.row[params.index][cellData.colname].val.split(',').sort().join(',');
                const idValues = ids ? ids.split(',').sort((a, b) => a - b).join(',') : null;
                const oldIdValues = this.dataSource.row[params.index][cellData.colname].refobjid === -1 ? null : this.dataSource.row[params.index][cellData.colname].refobjid.split(',').sort((a, b) => a - b).join(',');
                this.putDataFromCell(idValues, oldIdValues, cellData.colname, this.dataSource.row[params.index][EXCEPT_COLUMN_NAME].val, params.column.type, cellData.fkdisplay);
                this.putLabelDataFromCell(labelValue, oldIdValues, cellData.colname, this.dataSource.row[params.index][EXCEPT_COLUMN_NAME].val, oldLabelValue);
              },
              'on-clear': (value) => {
                if (this.fkSelectedChangeData[params.index]) {
                  this.fkSelectedChangeData[params.index] = Object.assign(this.fkSelectedChangeData[params.index], {
                    [cellData.key]: [{
                      Label: '',
                      ID: ''
                    }]
                  });
                } else {
                  this.fkSelectedChangeData[params.index] = Object.assign({}, { [cellData.key]: [{ Label: '', ID: '' }] });
                }
                this.copyDataSource.row[params.index][cellData.colname].val = '';
                this.fkAutoData = [];
                this.putDataFromCell(null, this.dataSource.row[params.index][cellData.colname].refobjid !== -1 ? this.dataSource.row[params.index][cellData.colname].refobjid : null, cellData.colname, this.dataSource.row[params.index][EXCEPT_COLUMN_NAME].val, params.column.type, cellData.fkdisplay);
                
                this.putLabelDataFromCell('', this.dataSource.row[params.index][cellData.colname].refobjid > -1 ? this.dataSource.row[params.index][cellData.colname].refobjid : null, cellData.colname, this.dataSource.row[params.index][EXCEPT_COLUMN_NAME].val, this.dataSource.row[params.index][cellData.colname].val);
              }
            }
          })
        ]);
      },
      comAttachFilterRender(cellData, tag) {
        return (h, params) => {
          if(!this.copyDataSource.row[params.index]) {
            return null
          }
          const valueObj = this.copyDataSource.row[params.index][cellData.colname]
          const defaultValue = valueObj.val
          const defaultSelected = valueObj.val ? [{
            ID:  /选中/.test(valueObj.val) ? valueObj.refobjid : valueObj.val,
            Label: /选中/.test(valueObj.val) ? valueObj.val : `已经选中${JSON.parse(valueObj.val).total}条数据`
          }] : []
          return h('div', [
            h(tag, {
              style: {
                width: '130px'
              },
              domProps: {
                id: `${params.index}-${params.column._index - 1}`
              },
              props: {
                defaultValue,
                defaultSelected,
                propstype: {
                  optionTip: true,
                  // 是否显示输入完成后是否禁用 true、false
                  show: true,
                  // 是否显示筛选提示弹窗 true、false
                  filterTip: true,
                  // 是否选中后禁止编辑 true、false
                  enterType: true,
                  // 是否回车选中第一行
                  disabled: false,
                  // 默认提示框
                  placeholder: null,
                  // 定义选中展示的文字的key
                  hideColumnsKey: ['id'],
                  // 配置弹窗的配置项 model
                  dialog: {
                    model: {
                      title: '弹窗多选',
                      mask: true,
                      draggable: true,
                      scrollable: true,
                      width: 920
                    }
                  },
                  fkobj: {
                    refobjid: cellData.refobjid,
                    reftable: cellData.reftable,
                    colid: this.dataSource.row[params.index][cellData.colname].colid,
                    reftableid: cellData.reftableid,
                    saveType: 'object',
                    show: true,
                    url: `${cellData.serviceId ? +'/' + cellData.serviceId : ''}/p/cs/menuimport`

                  },
                  datalist: this.popFilterDataList,
                  ...cellData,
                // 模糊查询的文字信息，支持多列
                },

              },
              on: {
                'on-keydown': (v, e, i) => {
                  if (e.keyCode === 13) {
                    const elementId = i.$parent.$el.id;
                    this.tableCellFocusByEnter(elementId);
                  } else if (e.keyCode === 40) {
                    // 下键
                    const elementId = i.$parent.$el.id;
                    const currentColumn = params.column._index - 1;
                    this.tableCellFocusByUpOrDown(elementId, currentColumn, 'down');
                  } else if (e.keyCode === 38) {
                    // 上键
                    const elementId = i.$parent.$el.id;
                    const currentColumn = params.column._index - 1;
                    this.tableCellFocusByUpOrDown(elementId, currentColumn, 'up');
                  }
                },
                valuechange: (item) => {
                  this.copyDataSource.row[params.index][cellData.colname].val = item.value;
                  this.copyDataSource.row[params.index][cellData.colname].defaultSelected = item.selected;
                  if (item.selected[0]) {
                    this.putDataFromCell(item.selected[0].ID, params.row[cellData.colname], cellData.colname, this.dataSource.row[params.index][EXCEPT_COLUMN_NAME].val, params.column.type);
                    this.putLabelDataFromCell(item.selected[0].Label, params.row[cellData.colname], cellData.colname, this.dataSource.row[params.index][EXCEPT_COLUMN_NAME].val, item.selected[0].ID);
                  } else {
                    this.putDataFromCell('', params.row[cellData.colname], cellData.colname, this.dataSource.row[params.index][EXCEPT_COLUMN_NAME].val, params.column.type);
                    this.putLabelDataFromCell('', params.row[cellData.colname], cellData.colname, this.dataSource.row[params.index][EXCEPT_COLUMN_NAME].val, '');
                  }
                }
              }
            })
          ]);
        };
      },
      comAttachFilterpopRender(cellData, tag) {
        return (h, params) => {
          return h('div', [
            h(tag, {
              style: {
                width: '130px'
              },
              domProps: {
                id: `${params.index}-${params.column._index - 1}`
              },
              props: {
                defaultValue: this.copyDataSource.row[params.index] ? this.copyDataSource.row[params.index][cellData.colname].val : undefined,
                defaultSelected: (this.copyDataSource.row[params.index] ? this.copyDataSource.row[params.index][cellData.colname].defaultSelected : undefined) ? this.copyDataSource.row[params.index][cellData.colname].defaultSelected : [],
                propstype: {
                  // 是否显示输入完成后是否禁用 true、false
                  show: true,
                  // 是否显示筛选提示弹窗 true、false
                  filterTip: true,
                  // 是否选中后禁止编辑 true、false
                  enterType: true,
                  // 是否回车选中第一行
                  disabled: false,
                  // 默认提示框
                  placeholder: null,
                  // 定义选中展示的文字的key
                  hideColumnsKey: ['id'],
                  // 配置弹窗的配置项 model
                  dialog: {
                    model: {
                      title: cellData.fkdesc,
                      mask: true,
                      draggable: true,
                      scrollable: true,
                      'footer-hide': true,
                      width: 920
                    }
                  },
                  fkobj: {
                    refobjid: cellData.refobjid,
                    reftable: cellData.reftable,
                    colid: this.dataSource.row[params.index] ? this.dataSource.row[params.index][cellData.colname].colid : undefined,
                    reftableid: cellData.reftableid,
                    saveType: 'object',
                    show: true,
                  },
                  ...cellData,
                // 模糊查询的文字信息，支持多列
                },

              },
              on: {
                'on-keydown': (v, e, i) => {
                  if (e.keyCode === 13) {
                    const elementId = i.$parent.$el.id;
                    this.tableCellFocusByEnter(elementId);
                  } else if (e.keyCode === 40) {
                    // 下键
                    const elementId = i.$parent.$el.id;
                    const currentColumn = params.column._index - 1;
                    this.tableCellFocusByUpOrDown(elementId, currentColumn, 'down');
                  } else if (e.keyCode === 38) {
                    // 上键
                    const elementId = i.$parent.$el.id;
                    const currentColumn = params.column._index - 1;
                    this.tableCellFocusByUpOrDown(elementId, currentColumn, 'up');
                  }
                },
                valuechange: (item) => {
                  this.copyDataSource.row[params.index][cellData.colname].val = item.value;
                  this.copyDataSource.row[params.index][cellData.colname].defaultSelected = item.selected;
                  if (item.selected[0]) {
                    this.putDataFromCell(item.selected[0].ID, params.row[cellData.colname], cellData.colname, this.dataSource.row[params.index][EXCEPT_COLUMN_NAME].val, params.column.type);
                    this.putLabelDataFromCell(item.selected[0].Label, params.row[cellData.colname], cellData.colname, this.dataSource.row[params.index][EXCEPT_COLUMN_NAME].val, item.selected[0].ID);
                  } else {
                    this.putDataFromCell('', params.row[cellData.colname], cellData.colname, this.dataSource.row[params.index][EXCEPT_COLUMN_NAME].val, params.column.type);
                    this.putLabelDataFromCell('', params.row[cellData.colname], cellData.colname, this.dataSource.row[params.index][EXCEPT_COLUMN_NAME].val, '');
                  }
                }
              }
            })
          ]);
        };
      },
      attachFilterRender(cellData, tag) {
        return (h, params) => h('div', [
          h(tag, {
            style: {
              width: '130px'
            },
            props: {
              value: this.copyDataSource.row[params.index][cellData.colname].val,
              // Selected: typeof this.copyDataSource.row[params.index][cellData.colname].refobjid === 'string' ? this.dataSource.row[params.index][cellData.colname].refobjid.split(',') : [this.dataSource.row[params.index][cellData.colname].refobjid], // 组件暂无该props
              optionTip: true,
              // 是否显示输入完成后是否禁用 true、false
              show: true,
              // 是否显示筛选提示弹窗 true、false
              filterTip: true,
              // 是否选中后禁止编辑 true、false
              enterType: true,
              // 是否回车选中第一行
              disabled: false,
              // 默认提示框
              placeholder: null,
              // 定义选中展示的文字的key
              hideColumnsKey: ['id'],
              // 配置弹窗的配置项 model
              dialog: {
                model: {
                  title: '弹窗多选',
                  mask: true,
                  draggable: true,
                  scrollable: true,
                  width: 920
                }
              },
              datalist: this.popFilterDataList,
              ...cellData,
              // 模糊查询的文字信息，支持多列
              AuotData: this.fkAutoData,
              // 选中的数据
              defaultSelected: this.copyDataSource.row[params.index][cellData.colname].defaultSelected ? this.copyDataSource.row[params.index][cellData.colname].defaultSelected : []
            },
            nativeOn: {
              // click: (e) => {
              //   e.stopPropagation();
              // }
            },
            on: {
              'on-show': (value, item) => { // 当气泡拉展开时去请求数据
                this.popFilterDataList = [{
                                            value: '更多筛选',
                                            lable: 0
                                          },
                                          {
                                            value: '导入',
                                            lable: 2
                                          }];
                fkHttpRequest().fkGetMultiQuery({
                  searchObject: {
                    tableid: cellData.reftableid
                  },
                  success: (res) => {
                    this.freshDropDownPopFilterData(res, cellData);
                  }
                });
                this.copyDataSource.row[params.index][cellData.colname].inputComponent = item;
              },
              'on-ok': ($this) => {
                if ($this._data.IN.length > 0) {
                  const value = `已经选中${$this._data.IN.length}条数据`;
                  this.copyDataSource.row[params.index][cellData.colname].val = value;
                  this.copyDataSource.row[params.index][cellData.colname].Selected = $this._data.IN;
                  this.copyDataSource.row[params.index][cellData.colname].inputComponent.InputVale = value;
                  this.copyDataSource.row[params.index][cellData.colname].defaultSelected = $this._data.IN.reduce((acc, cur) => {
                    acc.push({
                      Label: value,
                      ID: cur
                    });
                    return acc;
                  }, []);
                } else {
                  this.copyDataSource.row[params.index][cellData.colname].val = '';
                  this.copyDataSource.row[params.index][cellData.colname].Selected = [];
                }
                // if (this.copyDataSource.row[params.index][cellData.colname].Selected && this.copyDataSource.row[params.index][cellData.colname].Selected.length > 0) {
                //   ids = this.copyDataSource.row[params.index][cellData.colname].Selected.reduce((acc, cur) => (typeof acc !== 'object' ? `${acc},${cur}` : cur), []);
                // }
                const ids = $this.savObjemessage();
                this.putDataFromCell(ids, params.row[cellData.colname], cellData.colname, this.dataSource.row[params.index][EXCEPT_COLUMN_NAME].val, params.column.type);
              },
              'on-clear': () => {
                this.copyDataSource.row[params.index][cellData.colname].val = '';
                this.copyDataSource.row[params.index][cellData.colname].Selected = [];
                this.putDataFromCell(null, params.row[cellData.colname], cellData.colname, this.dataSource.row[params.index][EXCEPT_COLUMN_NAME].val, params.column.type);
              },
              'on-popclick': (event, row, targName, $this) => {
                if (targName !== 'I' && event !== 1) {
                  // 打开弹窗
                  $this.showModal = true;
                  if (event !== 0) {
                    this.popFilterData = JSON.parse(row.label);
                  }
                }
              },
              'on-change': (data, data2, value) => {
                this.fkAutoData = [];
                if (!data) {
                  this.copyDataSource.row[params.index][cellData.colname].val = '';
                  this.copyDataSource.row[params.index][cellData.colname].Selected = [];
                  return;
                }
                const serviceId = this.copyDataSource.tabth.find(item => item.colname === params.column.colname).serviceId;
                fkHttpRequest().fkFuzzyquerybyak({
                  searchObject: {
                    ak: data,
                    colid: this.copyDataSource.row[params.index][cellData.colname].colid,
                    fixedcolumns: {
                      whereKeys: this.getMainRefobjid(params, cellData)
                    },
                  },
                  serviceId,
                  success: (res) => {
                    this.fkAutoData = res.data.data;
                    const autoData = this.fkAutoData.filter(ele => (data && ele.value.toUpperCase().indexOf(data.toUpperCase()) > -1));
                    if (autoData.length === 0) {
                      // autodata中没有 清空输入框
                      value.notAutoData = true;
                    } else {
                      delete value.notAutoData;
                    }
                  }
                });
              },
              'on-blur': (data, event, value) => {
                if (value.notAutoData) {
                  // autodata中没有 清空输入框 及上次选中的值
                  value.InputVale = '';
                  delete value.notAutoData;
                } else if (this.fkAutoData.length > 0) {
                  // 当选择模糊搜索结果的时候
                  const autoData = this.fkAutoData.filter(ele => (data && ele.value.toUpperCase().indexOf(data.toUpperCase()) > -1));
                  this.copyDataSource.row[params.index][cellData.colname].val = autoData[0].value;
                  this.copyDataSource.row[params.index][cellData.colname].Selected = [autoData[0].id];
                }
                this.fkAutoData = [];
                let ids = null;
                if (this.copyDataSource.row[params.index][cellData.colname].Selected && this.copyDataSource.row[params.index][cellData.colname].Selected.length > 0) {
                  ids = this.copyDataSource.row[params.index][cellData.colname].Selected.reduce((acc, cur) => (typeof acc !== 'object' ? `${acc},${cur}` : cur), []);
                }
                this.putDataFromCell(ids, params.row[cellData.colname], cellData.colname, this.dataSource.row[params.index][EXCEPT_COLUMN_NAME].val, params.column.type);
              },
              'on-select': (data) => {
                this.fkAutoData = [];
                this.copyDataSource.row[params.index][cellData.colname].val = data.label;
                this.copyDataSource.row[params.index][cellData.colname].Selected = [data.value];
                this.putDataFromCell(data.value, params.row[cellData.colname], cellData.colname, this.dataSource.row[params.index][EXCEPT_COLUMN_NAME].val, params.column.type);
              }
            }
          }, [
            h('div', {
                slot: 'daigo',
              },
              [
                h(ComplexsDialog, {
                  props: {
                    fkobj: {
                      refobjid: cellData.refobjid,
                      reftable: cellData.reftable,
                      reftableid: cellData.reftableid
                    },
                    filter: this.popFilterData
                  }
                })
              ]),
          ])
        ]);
      },
      datePickertRender(cellData, tag) { // 日期选择
        return (h, params) => h('div', [
          h(tag, {
            style: {
              width: cellData.display === 'OBJ_DATENUMBER' ? '110px' : '160px'
            },
            props: {
              value: params.row[cellData.colname],
              type: cellData.display === 'OBJ_DATENUMBER' ? 'date' : 'datetime',
              transfer: true
            },
            nativeOn: {
              // click: (e) => {
              //   e.stopPropagation();
              // }
            },
            on: {
              'on-change': (event, dateType, data) => {
                let value = event;
                let oldIdValue = this.dataSource.row[params.index][cellData.colname].val;
                if (cellData.display === 'OBJ_DATENUMBER') {
                  //  YYYYmmdd
                  if (value) {
                    value = value.replace(/\-/g, '');
                  }
                  if (oldIdValue) {
                    oldIdValue = oldIdValue.replace(/\-/g, '');
                  }
                }
                this.putDataFromCell(value, oldIdValue, cellData.colname, this.dataSource.row[params.index][EXCEPT_COLUMN_NAME].val, params.column.type);
                this.putLabelDataFromCell(value, data.value, cellData.colname, this.dataSource.row[params.index][EXCEPT_COLUMN_NAME].val, oldIdValue);
              }
            }
          })
        ]);
      },
      timePickerRender(cellData, tag) { // 时间选择
        return (h, params) => h('div', [
          h(tag, {
            style: {
              width: '100px'
            },
            props: {
              value: params.row[cellData.colname],
              type: 'time',
              // value: new Date(Date.parse(`${new Date().getFullYear()} - ${params.row[cellData.colname]}`.replace(/-/g, '/'))),
              transfer: true
            },
            nativeOn: {
              // click: (e) => {
              //   e.stopPropagation();
              // }
            },
            on: {
              'on-change': (event, dateType, data) => {
                this.putDataFromCell(event, data.value, cellData.colname, this.dataSource.row[params.index][EXCEPT_COLUMN_NAME].val, params.column.type);
                this.putLabelDataFromCell(event, data.value, cellData.colname, this.dataSource.row[params.index][EXCEPT_COLUMN_NAME].val, event);
              }
            }
          })
        ]);
      },
      collectionIndexRender() {
        // 序号的render
        return (h, params) => {
          const index = Number(this.dataSource.start) + params.index + 1;
          // if (this.dataSource.row[params.index].errorTips && this.dataSource.row[params.index].errorTips.length > 0) {
          if (Object.keys(this.verifyTipObj).length > 0 && this.verifyTipObj[params.row.ID]) {
            return h('div', [
              h('Poptip', {
                style: {
                  width: '60px',
                },
                props: {
                  trigger: 'hover',
                  transfer: true,
                  wordWrap: true,
                  content: 'content',
                  placement: 'right'

                },
                scopedSlots: {
                  default: () => h('div', {
                    style: {},
                    domProps: {
                      innerHTML: `<span>${index}</span>
                            <i class="iconfont iconios-warning-outlin" style="margin-left:5px; color: red" />`
                    }
                  }),
                  content: () => h('div', {
                    style: {
                      width: '180px',
                    },
                    domProps: {
                      innerHTML: `<span>${this.verifyTipObj[params.row.ID]}</span>`
                    }
                  }),
                },
              })
            ]);
          }
          return h('div', {
            domProps: {
              innerHTML: `<span>${index}</span>`
            }
          });
        };
      },
      fkIconRender(cellData) {
        // 外键关联到icon
        return (h, params) => {
          const dom = params.row[cellData.colname] ? `<i class="iconfont iconbj_link" data-target-tag="fkIcon" style="color: #0f8ee9; cursor: pointer; font-size: 12px" ></i>${params.row[cellData.colname]}` : '';
          return h('div', {
            domProps: {
              innerHTML: dom
            },
            style: {
              width: cellData.width,
              overflow: cellData.width ? 'hidden' : '',
              'text-overflow': cellData.width ? 'ellipsis' : '',
              'white-space': cellData.width ? 'nowrap' : '',
            },
            attrs: {
              title: params.row[cellData.colname] || ''
            },
            on: {
              click: (event) => {
                // TODO 外键关联跳转
                if (event.target.className) {
                  const data = this.dataSource.row[params.index][cellData.colname];
                  let type = '';
                  if (cellData.objdistype === 'object') {
                    type = 'V';
                  } else if (cellData.objdistype === 'tabpanle') {
                    type = 'H';
                  } else {
                    const datas = {
                      mask: true,
                      title: '警告',
                      content: '请设置外键关联表的显示配置'
                    };
                    this.$Modal.fcWarning(datas);
                    return;
                  }
                  window.sessionStorage.setItem('dynamicRoutingForHideBackButton', true);
                  this.tabOpen({
                    type,
                    tableName: data.reftablename,
                    tableId: data.reftableid,
                    id: data.refobjid,
                    serviceId: data.serviceId,
                    label: data.reftabdesc
                  });
                }
              // event.stopPropagation();
              }
            }
          });
        };
      },
      customerurlRender(cellData) {
        // 外键关联到icon
        return (h, params) => h('div', {
          style: {
            color: '#0f8ee9',
            'text-decoration': 'underline',
            cursor: 'pointer',
            overflow: cellData.width ? 'hidden' : '',
            'text-overflow': cellData.width ? 'ellipsis' : '',
            'white-space': cellData.width ? 'nowrap' : '',
          },
          attrs: {
            title: params.row[cellData.colname]
          },
          domProps: {
            innerHTML: params.row[cellData.colname] ? `${params.row[cellData.colname]}` : ''
          },
          on: {
            click: (event) => {
              // customerurl跳转
              const data = cellData.customerurl;

              if (data.objdistype === 'object') {
                this.tabOpen({
                  type: 'tableDetailVertical',
                  tableName: data.reftablename,
                  tableId: data.reftableid,
                  label: data.reftabdesc,
                  id: params.row[data.refobjid]
                });
              } else if (data.objdistype === 'tabpanle') {
                this.tabOpen({
                  type: 'tableDetailHorizontal',
                  tableName: data.reftablename,
                  tableId: data.reftableid,
                  label: data.reftabdesc,
                  id: params.row[data.refobjid]
                });
              } else if (data.objdistype === 'customized') {
                // 自定义界面
                // let customizeMessage = null;
                // const param = cellData.customerurl.refobjid.split(',');
                // if (Object.keys(params.row).length > 0 && param && param.length > 0) {
                //   customizeMessage = Object.keys(params.row).reduce((arr, obj) => {
                //     if (param.includes(obj)) {
                //       arr[obj] = params.row[obj];
                //     }
                //     return arr;
                //   }, {});
                // }
                const customizedModuleName = cellData.customerurl.tableurl.split('/')[1];
                const datas = {
                  type: 'singleCustomerurlCustomized',
                  value: params.row,
                  // customizedModuleId: params.row[cellData.customerurl.refobjid]
                };
                if (enableActivateSameCustomizePage()) {
                  datas.customizedModuleName = customizedModuleName.toLocaleUpperCase();
                } else {
                  datas.customizedModuleId = params.row[cellData.customerurl.refobjid];
                }
                this.updateCustomizeMessage(datas);
                // 将元数据配置的refobjid，字符串，可配置多个字段，将配置的字段解析后用作lu y，供弹框作为参数使用
                const type = 'tableDetailAction';
            
                const url = `/${cellData.customerurl.tableurl.toUpperCase()}/${params.row[cellData.customerurl.refobjid]}`;
                const tab = {
                  type,
                  label: cellData.customerurl.reftabdesc,
                  url
                };
                this.tabOpen(tab);
              } else if (data.objdistype === 'link') { // 支持跳转外链界面配置动态参数
                const query = {};
                const queryArray = cellData.customerurl.refobjid.split(',');
                if (queryArray.length > 1) {
                  queryArray.reduce((a, o) => {
                    if (params.row[o] && params.row[o]) query[o] = params.row[o];
                  }, {});
                } else if (queryArray.length === 1) {
                  query.objId = params.row[cellData.customerurl.refobjid];
                }

                const param = {
                  url: cellData.customerurl.tableurl, // 跳转的外链界面内加载的iframe的src地址，即加载的页面地址
                  query, // 地址携带的参数
                  label: cellData.customerurl.reftabdesc, // 外链界面对应的Tab展示名称
                  isMenu: true, // 设置了label则该参数必须设置为true
                  linkName: cellData.customerurl.linkname, // 外链界面表名，作为路由参数
                  linkId: queryArray.length > 1 ? params.row.ID : params.row[cellData.customerurl.refobjid], // 外链界面表ID，作为路由参数
                };

                // const param = {
                //   url: cellData.customerurl.tableurl,
                //   query: params.row[cellData.customerurl.refobjid],
                //   label: cellData.customerurl.reftabdesc,
                //   isMenu: true,
                //   linkName: cellData.customerurl.linkname,
                //   linkId: params.row[cellData.customerurl.refobjid],
                // };
                this.directionalRouter(param);// 定向路由跳转方法
                const datas = {
                  type: 'singleCustomerurlLink',
                  value: params.row,
                  customizedModuleId: cellData.customerurl.linkname.toUpperCase()
                };
                // 因外链界面tablinkName相同时，只激活一个tab,所以外链界面用linkName作为key存入session,避免因勾选的id不同存入多个，导致关闭当前tab时无法清除存入的多个

                this.updateCustomizeMessage(datas);
              } else if (data.objdistype === 'popwin') {
                // 自定义弹窗
                this.$refs.dialogRef.open();
                this.dialogConfig.title = cellData.customerurl.reftabdesc;
                this.dialogConfig.footerHide = true;
                this.dialogComponentName = cellData.customerurl.tableurl;
                const param = cellData.customerurl.refobjid.split(',');
                if (Object.keys(params.row).length > 0 && param && param.length > 0) {
                  this.popwinMessage = Object.keys(params.row).reduce((arr, obj) => {
                    if (param.includes(obj)) {
                      arr[obj] = params.row[obj];
                    }
                    return arr;
                  }, {});
                }
                // 将元数据配置的refobjid，字符串，可配置多个字段，将配置的字段解析后传入自定义弹框，供弹框作为参数使用
              }
              // event.stopPropagation();
            }
          }
        });
      },
      imageRender(cellData, tag) {
        return (h, params) => {
          if (!params.row[cellData.colname]) {
            return null;
          }
          return h('div', {
            on: {
              dblclick: () => {
                const item = {
                  field: `${params.column.colname}_${params.row.ID}`
                };
                createModal(JSON.parse(params.row[cellData.colname]), item);
              }
            }
          }, [
            h(tag, {
              style: {
                width: '40px'
              },
              props: {
                trigger: 'hover',
                transfer: true,
                content: 'content'
              },
              scopedSlots: {
                default: () => h('img', {
                  style: {
                    height: '20px',
                    'vertical-align': 'middle',
                  },
                  domProps: {
                    src: params.row[cellData.colname] && this.isJsonString(params.row[cellData.colname]) ? JSON.parse(params.row[cellData.colname])[0].URL : params.row[cellData.colname]
                  }
                }),
                content: () => h('img', {
                  style: {
                    width: '150px',
                    'vertical-align': 'middle',
                    padding: '8px 0px'
                  },
                  domProps: {
                    src: params.row[cellData.colname] && this.isJsonString(params.row[cellData.colname]) ? JSON.parse(params.row[cellData.colname])[0].URL : params.row[cellData.colname]
                  }
                }),
              },
              nativeOn: {
                // click: (e) => {
                //   e.stopPropagation();
                // }
              },
              // on: {
              //   'on-change': (event, dateType, data) => {
              //     this.putDataFromCell(event, data.value, cellData.colname, this.dataSource.row[params.index][EXCEPT_COLUMN_NAME].val);
              //   }
              // }
            })
          ]);
        };
      },
      docRender(cellData, tag) {
        const that = this;
        return (h, params) => {
          if(!this.copyDataSource.row[params.index]){
              return false;
          }
          const content = `${this.copyDataSource.row[params.index][cellData.colname].val ? JSON.parse(this.copyDataSource.row[params.index][cellData.colname].val).reduce((acc, cur) => {
            acc.push(`【${cur.name}】`);
            return acc;
          }, []).join('') : ''}`;
          const align = cellData.tdAlign || cellData.align || 'center'
          return h('div', {
            style: {
              display: 'flex',
              'justify-content':FLEX_ALIGN[align],
              'align-items': 'center',
            },
          }, [
            h('div', {
              style: {
                display: cellData.width ? 'block' : 'flex',
                width: cellData.width,
                overflow: cellData.width ? 'hidden' : '',
                'text-overflow': cellData.width ? 'ellipsis' : '',
                'white-space': cellData.width ? 'nowrap' : '',
                width: cellData.width? `${cellData.width - 38}px` : ''
              },
              attrs: {
                title: content
              },
              domProps: {
              },
            }, content),
            h(tag, {
              style: {
                'text-align': 'center',
                cursor: 'pointer',
                color: '#2D8CF0'
              },
              props: {
                trigger: 'click',
                transfer: true,
                content: 'content'
              },
              scopedSlots: {
                default: () => h('div', {
                  style: {
                    'padding-left': '10px',
                    'padding-right': '10px',
                  },
                  domProps: {
                    innerHTML: '<i class="iconfont iconbj_listedit" style="color: #2D8CF0; font-size: 16px"></i>'
                  }
                }),
                content: () => h('TableDocFile', {
                  props: {
                    dataitem: {
                      filesLength: Number(params.column.webconf && params.column.webconf.filesLength),
                      sendData: {
                        path: `${that.$route.params.tableName}/${that.$route.params.itemId}/`
                      },
                      url: getGateway('/p/cs/batchUpload'),
                      valuedata: this.copyDataSource.row[params.index][cellData.colname].val ? JSON.parse(this.copyDataSource.row[params.index][cellData.colname].val) : []
                    },
                    webConfSingle: this.webConfSingle,
                    accept: cellData.webconf && cellData.webconf.UploadAccept
                  },
                  on: {
                    filechange: (val) => {
                      this.copyDataSource.row[params.index][cellData.colname].val = JSON.stringify(val);
                      this.putDataFromCell(val.length > 0 ? JSON.stringify(val) : '', params.row[cellData.colname], cellData.colname, this.dataSource.row[params.index][EXCEPT_COLUMN_NAME].val, params.column.type);
                      this.putLabelDataFromCell(val.length > 0 ? JSON.stringify(val) : '', params.row[cellData.colname], cellData.colname, this.dataSource.row[params.index][EXCEPT_COLUMN_NAME].val, params.column.type);
                    
                      if (!ossRealtimeSave()) {
                        DispatchEvent('childTableSaveFile', { detail: { type: 'save' } });
                      }
                    }
                  }
                }),
              },
            // on: {
            //   'on-change': (event, dateType, data) => {
            //     this.putDataFromCell(event, data.value, cellData.colname, this.dataSource.row[params.index][EXCEPT_COLUMN_NAME].val);
            //   }
            // }
            })
          ]);
        };
      },
      docReadonlyRender(cellData, tag) {
        const that = this;
        return (h, params) => {
          if(!this.copyDataSource.row[params.index]){
              return false;
          }
          const content = `${this.copyDataSource.row[params.index][cellData.colname].val ? JSON.parse(this.copyDataSource.row[params.index][cellData.colname].val).reduce((acc, cur) => {
            acc.push(`【${cur.name}】`);
            return acc;
          }, []).join('') : '暂无文件'}`;
          const align = cellData.tdAlign || cellData.align || 'center'
          return h('div', {
            style: {
              display: 'flex',
              'justify-content':FLEX_ALIGN[align],
              'align-items': 'center',
            },
          }, [
            h('div', {
              style: {
                display: cellData.width ? 'block' : 'flex',
                width: cellData.width,
                overflow: cellData.width ? 'hidden' : '',
                'text-overflow': cellData.width ? 'ellipsis' : '',
                'white-space': cellData.width ? 'nowrap' : '',
              },
              attrs: {
                title: content
              },
              domProps: {
              },
            }, content),
            h(tag, {
              style: {
                width: '100%',
                'text-align': 'center',
                cursor: 'pointer',
                color: '#2D8CF0'
              },
              props: {
                trigger: 'click',
                transfer: true,
                content: 'content'
              },
              scopedSlots: {
                default: () => h('div', {
                  style: {
                    'padding-left': '10px',
                    'padding-right': '10px',
                  },
                  domProps: {
                    innerHTML: this.copyDataSource.row[params.index][cellData.colname].val ? '<i class="iconfont iconbj_listedit" style="color: #2D8CF0; font-size: 16px"></i>' : ''
                  }
                }),
                content: () => {
                  if (params.row[cellData.colname]) {
                    return h('TableDocFile', {
                      props: {
                        dataitem: {
                          readonly: true,
                          sendData: {
                            path: `${that.$route.params.tableName}/${that.$route.params.itemId}/`
                          },
                          url: getGateway('/p/cs/batchUpload'),
                          valuedata: params.row[cellData.colname]
                        }
                      },
                    });
                  }
                  return h('div', {
                    domProps: {
                      innerHTML: '暂无文件'
                    },
                  });
                },
              },
            // on: {
            //   'on-change': (event, dateType, data) => {
            //     this.putDataFromCell(event, data.value, cellData.colname, this.dataSource.row[params.index][EXCEPT_COLUMN_NAME].val);
            //   }
            // }
            })
          ]);
        };
      },
      dropDefaultSelectedData(params, cellData) {
        // drp mrp 初始数据赋值
        let defaultData = [];
        if (cellData.fkdisplay === 'drp') {
          if (this.dataSource.row[params.index] && this.dataSource.row[params.index][cellData.colname] && this.fkSelectedChangeData[params.index] && this.fkSelectedChangeData[params.index][cellData.key] && this.fkSelectedChangeData[params.index][cellData.key][0]) {
            defaultData.push(this.fkSelectedChangeData[params.index][cellData.key][0]);
          } else if (this.dataSource.row[params.index] && this.dataSource.row[params.index][cellData.colname]) {
            const data = {
              ID: this.dataSource.row[params.index][cellData.colname].refobjid.toString(),
              Label: params.row[cellData.colname]
            };
            defaultData.push(data);
          }
        } else if (this.dataSource.row[params.index] && this.dataSource.row[params.index][cellData.colname]) {
          if (this.fkSelectedChangeData[params.index] && this.fkSelectedChangeData[params.index][cellData.key] && this.fkSelectedChangeData[params.index][cellData.key].length > 0) {
            if (this.fkSelectedChangeData[params.index][cellData.key][0].ID) {
              defaultData = this.fkSelectedChangeData[params.index][cellData.key];
            } else {
              defaultData = [];
            }
          } else {
            let ids = [];
            const refobjid = this.dataSource.row[params.index][cellData.colname].refobjid;
            const val = this.dataSource.row[params.index][cellData.colname].val;
            if (typeof refobjid === 'string') {
              ids = refobjid.split(',');
            }
            if (ids.length > 0) {
              ids.map((ele, index) => {
                val.split(',').map((item, ind) => {
                  if (index === ind) {
                    defaultData.push({
                      ID: ele.toString(),
                      Label: item
                    });
                  }
                  return item;
                });
                return ele;
              });
            }
          }
        }
        return defaultData;
      },
      freshDropDownPopFilterData(res) {
        // mop 气泡点击事件
        if (res.length > 0) {
          res.forEach((item) => {
            item.label = item.value;
            item.value = item.key;
            item.delete = true;
          });
          // let item = [];
          // if (cellData.formIndex !== 'inpubobj') {
          //   item = this.$refs[`FormComponent_${cellData.formIndex}`][0].newFormItemLists;
          // } else {
          //   item = this.$refs[`FormComponent_0`].newFormItemLists;
          // }
          this.popFilterDataList = this.popFilterDataList.concat(res);
        }
      },
      tableSelectedChange(data) {
        const param = {};
        const datas = data.reduce((acc, cur) => {
          acc.push({ ID: cur[EXCEPT_COLUMN_NAME] });
          return acc;
        }, []);
        this.tableRowSelectedIds = datas;
        param[this.tableName] = datas;

        this.$emit(TABLE_SELECTED_ROW, param);
      },
      reloadErrorTips(data) {
        // const indexColumn = this.columns.filter(ele => ele.key === COLLECTION_INDEX);
        this.dataSource.row.map((ele) => {
          if (data && data.every) {
            const exceptFlag = data.every((item) => {
              if (Number(ele[EXCEPT_COLUMN_NAME].val) !== Number(item.objid)) {
                return true;
              }
              ele.errorTips = item.message; // 通过error字段去区分是否有错误提示
              return false;
            });
            if (exceptFlag) {
              ele.errorTips = '';
            }
          }
          return ele;
        });
        // 因为 要刷新render 就要修改this.dataSource.tabth  直接修改会报不能修改异步结果，所以需要store.commit 修改数据源
        const assignDataSource = Object.assign({}, this.dataSource);
        assignDataSource.tabth.timestamp = new Date().getTime(); // 确保会改变并刷新

        this.isRefreshClick = true;// 清除删除前修改的存储在表格组件内用于存入模块状态内的表格数据，不清除则下次修改表格数据时，会再次抛出上一次的，因为删除失败是模拟刷新，通过数据重新的方式触发表格数据更新，不是通过接口的方式 

        if (this.isHorizontal) {
          this.updateTableData(assignDataSource);
        } else {
          this.updateTableListForRefTable(assignDataSource);
        }
      },
      inputRegx(cellData) {
        // 输入框正则
        if (cellData.webconf && cellData.webconf.ispositive) {
          if (cellData.type === 'NUMBER' && cellData.scale && cellData.scale > 0) {
            return new RegExp(`^[\\-\\+]?\\d+(\\.{0,${cellData.scale}})?$`);
          }
          if (cellData.type === 'NUMBER') {
            return new RegExp('^[\\-\\+]?\\d+(\\.[0-9]{0,2)?$');
          }
        } else {
          if (cellData.type === 'NUMBER' && cellData.scale && cellData.scale > 0) {
            return new RegExp(`^(\\-|\\+)?\\d{0,8}(\\.[0-9]{0,${cellData.scale}})?$`);
          }
          if (cellData.type === 'NUMBER') {
            return new RegExp('^(\\-|\\+)?\\d{0,20}?$');
          }
        }
        if (cellData.type === 'STRING' && cellData.isuppercase) { // 大写
          return regExp.toUpperCase;
        }
        return null;
      },
      putDataFromCell(currentValue, oldValue, colname, IDValue, type, fkdisplay, oldFkIdValue) {
        // 组装数据 存入store
        if (!currentValue) {
          if (fkdisplay === 'mrp' || fkdisplay === 'mop') {
            currentValue = '';
          } else if (fkdisplay === 'drp' || fkdisplay === 'pop') {
            currentValue = 0;
          } else if (type === 'NUMBER') {
            currentValue = 0;
          } else if (type !== 'NUMBER') {
            currentValue = '';
          }
        }
        if (Version() === '1.3' && !currentValue) {
          currentValue = null;
        }
        if (Version() === '1.3' && !oldValue) {
          oldValue = null;
        }
        if (this.afterSendData[this.tableName]) {
          const rowDatas = this.afterSendData[this.tableName].filter(ele => ele[EXCEPT_COLUMN_NAME] === IDValue);
          if (currentValue !== oldValue || (fkdisplay === 'drp' && oldFkIdValue !== oldValue)) {
            if (rowDatas.length > 0) {
              rowDatas[0][colname] = currentValue;
            } else {
              const param = {};
              param[EXCEPT_COLUMN_NAME] = IDValue;
              param[colname] = currentValue;
              this.afterSendData[this.tableName].push(param);
            }
          } else if (rowDatas.length > 0 && rowDatas[0][colname] !== undefined) {
            delete rowDatas[0][colname];
            // if (rowDatas && rowDatas.length === 1 && rowDatas[0].ID) {
            //   const rowDatasIndex = this.afterSendData[this.tableName].map((ele, i) => {
            //     if (ele[EXCEPT_COLUMN_NAME] === IDValue) {
            //       return i;
            //     }
            //   })[0];
            //   delete rowDatas[0][colname];
            // delete rowDatas[0].ID;
            //   this.afterSendData[this.tableName] = this.afterSendData[this.tableName].filter((item, i) => i !== rowDatasIndex);
            //   console.log(333, this.afterSendData[this.tableName]);
            // }
            this.afterSendData[this.tableName] = this.afterSendData[this.tableName].filter((item, i) => {
              if (item && Object.keys(item).length && Object.keys(item).length === 1 && item.ID) {
              } else {
                return item;
              }
            });
          }
        } else {
          this.afterSendData[this.tableName] = [];
          const param = {};
          if (currentValue !== oldValue || (fkdisplay === 'drp' && oldFkIdValue !== oldValue)) {
            param[EXCEPT_COLUMN_NAME] = IDValue;
            param[colname] = currentValue;
            this.afterSendData[this.tableName].push(param);
          }
        }
        // if (Version() === '1.3') {
        //
        // } else {
        // if (this.afterSendData[this.tableName]) {
        //   const rowDatas = this.afterSendData[this.tableName].filter(ele => ele[EXCEPT_COLUMN_NAME] === IDValue);
        //   if (rowDatas.length > 0) {
        //     rowDatas[0][colname] = currentValue;
        //   } else {
        //     const param = {};
        //     param[EXCEPT_COLUMN_NAME] = IDValue;
        //     param[colname] = currentValue;
        //     this.afterSendData[this.tableName].push(param);
        //   }
        // } else {
        //   this.afterSendData[this.tableName] = [];
        //   const param = {};
        //   param[EXCEPT_COLUMN_NAME] = IDValue;
        //   param[colname] = currentValue;
        //   this.afterSendData[this.tableName].push(param);
        // }

        // console.log(currentValue, oldValue);
        // if (this.beforeSendData[this.tableName]) {
        //   const rowDatas = this.beforeSendData[this.tableName].filter(ele => ele[EXCEPT_COLUMN_NAME] === IDValue);
        //   if (rowDatas.length > 0) {
        //     rowDatas[0][colname] = oldValue;
        //   } else {
        //     const param = {};
        //     param[EXCEPT_COLUMN_NAME] = IDValue;
        //     param[colname] = oldValue;
        //     this.beforeSendData[this.tableName].push(param);
        //   }
        // } else {
        //   this.beforeSendData[this.tableName] = [];
        //   const param = {};
        //   param[EXCEPT_COLUMN_NAME] = IDValue;
        //   param[colname] = oldValue;
        //   this.beforeSendData[this.tableName].push(param);
        // }
        this.$emit(TABLE_DATA_CHANGE, this.afterSendData);
        // 表单验证
        this.verifyMessage();
      },
      putLabelDataFromCell(currentValue, oldValue, colname, IDValue, oldIdValue, oldFkIdValue, type) {
        // currentValue：当前修改的值
        // oldFkIdValue:修改过后的值的ID
        // type:改动值的组件的类型
        // 组装数据 存入store
        if (this.afterSendDataLabel[this.tableName] && this.afterSendDataLabel[this.tableName].length && this.afterSendDataLabel[this.tableName].length > 0) {
          const rowDatas = this.afterSendDataLabel[this.tableName].filter(ele => ele[EXCEPT_COLUMN_NAME] === IDValue);
          oldIdValue = oldIdValue || '';
          // if (colname === 'ISACTIVE') {
          //   console.log(444, currentValue === '是' && (oldIdValue === 'Y' || oldIdValue === '1'));
          //   if (currentValue === '是' && (oldIdValue === 'Y' || oldIdValue === '1')) {
          //     oldIdValue = '是';
          //   } else if (currentValue === '否' && (oldIdValue === 'N' || oldIdValue === '0')) {
          //     oldIdValue = '否';
          //   }
          // }
          if (type === 'checkbox') { // checkbox类型
            // 有改动
            if ((currentValue !== oldIdValue || (oldValue && oldFkIdValue && Number(oldFkIdValue) !== Number(oldValue))) && (oldValue && oldIdValue && Number(oldValue) !== Number(oldIdValue))) {
              if (rowDatas.length > 0) {
                rowDatas[0][colname] = currentValue;
              } else {
                const param = {};
                param[EXCEPT_COLUMN_NAME] = IDValue;
                param[colname] = currentValue;
                this.afterSendDataLabel[this.tableName].push(param);
              }
            // 改动值相同
            } else if (rowDatas.length > 0 && rowDatas[0][colname] !== undefined) {
              delete rowDatas[0][colname];

              // const rowDatasIndex = this.afterSendDataLabel[this.tableName].map((ele, i) => {
              //   if (ele[EXCEPT_COLUMN_NAME] === IDValue) {
              //     return i;
              //   }
              // })[0];
              // delete rowDatas[0].ID;
              this.afterSendDataLabel[this.tableName] = this.afterSendDataLabel[this.tableName].filter((item, i) => { // 改动值相同不抛出值
                if (item && Object.keys(item).length && Object.keys(item).length === 1 && item.ID) {
                } else {
                  return item;
                }
              });
            // this.afterSendDataLabel[this.tableName] = this.afterSendDataLabel[this.tableName].filter((item, i) => i !== rowDatasIndex);
            }
          } else if (currentValue !== oldIdValue || (oldValue && oldFkIdValue && Number(oldFkIdValue) !== Number(oldValue))) { // 除checkbox类型外，有改动
            if (rowDatas.length > 0) {
              rowDatas[0][colname] = currentValue;
            } else {
              const param = {};
              param[EXCEPT_COLUMN_NAME] = IDValue;
              param[colname] = currentValue;
              this.afterSendDataLabel[this.tableName].push(param);
            }
          } else if (rowDatas.length > 0 && rowDatas[0][colname] !== undefined) { // 除checkbox类型外，改动值相同
            delete rowDatas[0][colname];

            // const rowDatasIndex = this.afterSendDataLabel[this.tableName].map((ele, i) => {
            //   if (ele[EXCEPT_COLUMN_NAME] === IDValue) {
            //     return i;
            //   }
            // })[0];
            // delete rowDatas[0].ID;
            this.afterSendDataLabel[this.tableName] = this.afterSendDataLabel[this.tableName].filter((item, i) => { // 改动值相同不抛出值
              if (item && Object.keys(item).length && Object.keys(item).length === 1 && item.ID) {
              } else {
                return item;
              }
            });
            // this.afterSendDataLabel[this.tableName] = this.afterSendDataLabel[this.tableName].filter((item, i) => i !== rowDatasIndex);
          }
        } else {
          this.afterSendDataLabel[this.tableName] = [];
          const param = {};
          if (currentValue !== oldIdValue || (oldValue && oldFkIdValue && Number(oldFkIdValue) !== Number(oldValue))) {
            param[EXCEPT_COLUMN_NAME] = IDValue;
            param[colname] = currentValue;
            this.afterSendDataLabel[this.tableName].push(param);
          }
        }
        this.$emit(TABLE_DATA_CHANGE_LABEL, this.afterSendDataLabel);

        this.putBeforeLabelDataFromCell(currentValue, oldValue, colname, IDValue, oldIdValue, oldFkIdValue, type);
      }, // 获取label
      putBeforeLabelDataFromCell(value, oldValue, colname, IDValue, oldIdValue, oldFkIdValue, type) {
        // if (oldIdValue === null) {
        //   oldIdValue = '';
        // }
        const tableDataSource = JSON.parse(JSON.stringify(this.dataSource));
        const currentValue = tableDataSource.row.find(item => item[EXCEPT_COLUMN_NAME].val === IDValue)[colname].val;

        if (this.afterSendDataLabelBefore[this.tableName] && this.afterSendDataLabelBefore[this.tableName].length > 0) {
          const rowDatas = this.afterSendDataLabelBefore[this.tableName].filter(ele => ele[EXCEPT_COLUMN_NAME] === IDValue);
          if (type === 'checkbox') {
            if ((value !== oldIdValue || (oldValue && oldFkIdValue && Number(oldFkIdValue) !== Number(oldValue))) && (oldValue && oldIdValue && Number(oldValue) !== Number(oldIdValue))) {
              if (rowDatas.length > 0) {
                rowDatas[0][colname] = currentValue;
              } else {
                const param = {};
                param[EXCEPT_COLUMN_NAME] = IDValue;
                param[colname] = currentValue;
                this.afterSendDataLabelBefore[this.tableName].push(param);
              }
            } else if (rowDatas.length > 0 && rowDatas[0][colname] !== undefined) {
              delete rowDatas[0][colname];
              this.afterSendDataLabelBefore[this.tableName] = this.afterSendDataLabelBefore[this.tableName].filter((item, i) => {
                if (item && Object.keys(item).length && Object.keys(item).length === 1 && item.ID) {
                } else {
                  return item;
                }
              });
            }
          } else if (value !== oldIdValue || (oldValue && oldFkIdValue && Number(oldFkIdValue) !== Number(oldValue))) {
            if (rowDatas.length > 0) {
              rowDatas[0][colname] = currentValue;
            } else {
              const param = {};
              param[EXCEPT_COLUMN_NAME] = IDValue;
              param[colname] = currentValue;
              this.afterSendDataLabelBefore[this.tableName].push(param);
            }
          } else if (rowDatas.length > 0 && rowDatas[0][colname] !== undefined) {
            delete rowDatas[0][colname];
            this.afterSendDataLabelBefore[this.tableName] = this.afterSendDataLabelBefore[this.tableName].filter((item, i) => {
              if (item && Object.keys(item).length && Object.keys(item).length === 1 && item.ID) {
              } else {
                return item;
              }
            });
          }
        } else {
          this.afterSendDataLabelBefore[this.tableName] = [];
          const param = {};
          if (value !== oldIdValue || (oldValue && oldFkIdValue && Number(oldFkIdValue) !== Number(oldValue))) {
            param[EXCEPT_COLUMN_NAME] = IDValue;
            param[colname] = currentValue;
            this.afterSendDataLabelBefore[this.tableName].push(param);
          }
        }
        this.$emit(TABLE_DATA_CHANGE_LABEL_BEFORE, this.afterSendDataLabelBefore);
      }, // 改后对应改前的label
      selectedChange(val) {
        this.updateTableSearchData({
          selectedValue: val,
          inputValue: this.searchInfo
        });
      }, // 查询条件下拉框改变时触发
      onInputChange(e) {
        this.updateTableSearchData({
          selectedValue: this.searchCondition,
          inputValue: e.target.value
        });
      }, // 输入框值改变时触发
      searTabelList() {
        this.currentPage = 1;
        this.getTabelList(1);
      }, // 输入框搜索触发
      getTabelList(index) {
        // 搜索事件
        const fixedcolumns = {};
        if (this.searchCondition) {
          fixedcolumns[this.searchCondition] = this.searchInfo;
        }

         
        const { itemId } = this.$route.params;
        // table, objid, refcolid, startindex, range, fixedcolumns
        // let tabIndex = null;
        // if (this.WebConf && this.WebConf.isCustomizeTab && this.type === 'horizontal') {
        //   tabIndex = this.tabCurrentIndex + 1;
        // } else {
        //   tabIndex = this.tabCurrentIndex;
        // }
        const params = {
          table: this.tableName,
          objid: itemId,
          refcolid: this.itemInfo.refcolid,
          searchdata: {
            column_include_uicontroller: true,
            startindex: (index - 1) * this.pageInfo.pageSize,
            range: this.pageInfo.pageSize,
            fixedcolumns
          },
          tabIndex: this.currentTabIndex
        };
        if (this.currentOrderList.length > 0) {
          // 如果没有排序则不传该参数
          params.searchdata.orderby = this.currentOrderList;
        }
        // 过滤空字段
        const columns = params.searchdata.fixedcolumns;
        const paramsKeys = Object.keys(columns);
        if (paramsKeys.length > 0) {
          paramsKeys.forEach((key) => {
            if (columns[key] === '') {
              delete columns[key];
            }
          });
        }

        this.getObjectTableItemForTableData(params);
      },
      getFKList(params, cellData) {
        // 获取外键关联的数据  TODO 2019/4/23 发现点击分页弹框自动消失，必须要注释初始化数据的代码才不会关闭弹框
        // this.fkData.totalRowCount = 0;
        // this.fkData = ({});
        const searchdata = {
          isdroplistsearch: true,
          refcolid: this.dataSource.row[params.index][cellData.colname].colid, // TODO
          fixedcolumns: this.getMainRefobjid(params, cellData),
          startindex: (this.fkDropPageInfo.currentPageIndex - 1) * this.fkDropPageInfo.pageSize,
          range: this.fkDropPageInfo.pageSize
        };
        fkHttpRequest().fkQueryList({
          searchObject: searchdata,
          serviceId: cellData.serviceId,
          success: (res) => {
            this.fkData = res.data.data;
          }
        });
      },
      getMainRefobjid(params, cellData) {
        // 外键关联的情况下 取行colid
        const fixedcolumns = {};
        const row = this.dataSource.row[params.index][cellData.colname];
        const { itemId } = this.$route.params;
        if (cellData.refcolval) {
          if (cellData.refcolval.srccol === '$OBJID$') {
            fixedcolumns[cellData.refcolval.fixcolumn] = itemId;
          } else if (this.type === pageType.Horizontal) {
            const express = cellData.refcolval.expre === 'equal' ? '=' : '';
            if (cellData.refcolval.maintable) {
              // 需要从主表取
              const { tableName } = this.$router.currentRoute.params;
              const mainTablePanelData = this.$store.state[this.moduleComponentName].updateData[tableName];
              const defaultValue = mainTablePanelData.default;
              const modifyValue = mainTablePanelData.modify;
              // 先从修改里找 如果修改的里面没有 就从默认值里取
              if (modifyValue[tableName] && modifyValue[tableName][cellData.refcolval.srccol]) {
                const colname = modifyValue[tableName][cellData.refcolval.srccol];
                if (colname) {
                  fixedcolumns[cellData.refcolval.fixcolumn] = `${express}${colname}`;
                }
              } else {
                // 默认值取
                const colname = defaultValue[tableName][cellData.refcolval.srccol];
                if (colname) {
                  fixedcolumns[cellData.refcolval.fixcolumn] = `${express}${colname}`;
                }
              }
              const colname = mainTablePanelData[cellData.refcolval.srccol];
              if (colname && mainTablePanelData.isfk) {
                fixedcolumns[cellData.refcolval.fixcolumn] = `${express}${mainTablePanelData.refobjid}`;
              }
            } else if (this.copyDataSource.row[params.index][cellData.refcolval.srccol].val !== '') {
              // 左右结构取行内的colid
              const obj = this.afterSendData[this.tableName] ? this.afterSendData[this.tableName].find(item => item.ID === params.row.ID && item[cellData.refcolval.srccol]) : undefined;
              if (obj) {
                // 有修改过的，取修改过的。
                fixedcolumns[cellData.refcolval.fixcolumn] = express + obj[cellData.refcolval.srccol];
              } else {
                // ，没有修改过的取默认的
                // this.$Message.info('请选择关联的表字段');
                fixedcolumns[cellData.refcolval.fixcolumn] = express + this.dataSource.row[params.index][cellData.refcolval.srccol].refobjid;
              }
            }
            // fixedcolumns[cellData.refcolval.fixcolumn] = row.colid;
          } else {
            // 先判断主表是否有关联字段  没有则取行的colid
            const express = cellData.refcolval.expre === 'equal' ? '=' : '';
            if (cellData.refcolval.maintable) {
              // 需要从主表取
              const mainTablePanelData = this.$store.state[this.moduleComponentName].updateData[this.mainFormInfo.tablename];
              const defaultValue = mainTablePanelData.default;
              const modifyValue = mainTablePanelData.modify;
              // 先从修改里找 如果修改的里面没有 就从默认值里取
              if (modifyValue[this.mainFormInfo.tablename] && modifyValue[this.mainFormInfo.tablename][cellData.refcolval.srccol]) {
                const colname = modifyValue[this.mainFormInfo.tablename][cellData.refcolval.srccol];
                if (colname) {
                  fixedcolumns[cellData.refcolval.fixcolumn] = `${express}${colname}`;
                }
              } else {
                // 默认值取
                const colname = defaultValue[this.mainFormInfo.tablename][cellData.refcolval.srccol];
                if (colname) {
                  fixedcolumns[cellData.refcolval.fixcolumn] = `${express}${colname}`;
                }
              }
              const colname = mainTablePanelData[cellData.refcolval.srccol];
              if (colname && mainTablePanelData.isfk) {
                fixedcolumns[cellData.refcolval.fixcolumn] = `${express}${mainTablePanelData.refobjid}`;
              }
            } else {
              // fixedcolumns[cellData.refcolval.fixcolumn] = `${express}${row.refobjid}`;
              // 上下结构子表
              // 左右结构取行内的colid
              const obj = this.afterSendData[this.tableName] ? this.afterSendData[this.tableName].find(item => item.ID === params.row.ID && item[cellData.refcolval.srccol]) : undefined;
              if (obj) {
                // 有修改过的，取修改过的。
                fixedcolumns[cellData.refcolval.fixcolumn] = express + obj[cellData.refcolval.srccol];
              } else {
                // ，没有修改过的取默认的
                // this.$Message.info('请选择关联的表字段');
                fixedcolumns[cellData.refcolval.fixcolumn] = express + this.dataSource.row[params.index][cellData.refcolval.srccol].refobjid;
              }
            }
          }
        } else if (cellData.webconf && cellData.webconf.refcolvalArray && cellData.webconf.refcolvalArray.length > 0) { // webconf
          cellData.webconf.refcolvalArray.forEach((cur) => {
            if (this.type === pageType.Horizontal) {
              const express = '=';
              if (cur.maintable) {
                // 需要从主表取
                const { tableName } = this.$router.currentRoute.params;
                const mainTablePanelData = this.$store.state[this.moduleComponentName].updateData[tableName];
                const defaultValue = mainTablePanelData.default;
                const modifyValue = mainTablePanelData.modify;
                // 先从修改里找 如果修改的里面没有 就从默认值里取
                if (modifyValue[tableName] && modifyValue[tableName][cur.srccol]) {
                  const colname = modifyValue[tableName][cur.srccol];
                  if (colname) {
                    fixedcolumns[cur.fixcolumn] = `${express}${colname}`;
                  } else {
                    fixedcolumns[cur.fixcolumn] = '';
                  }
                } else {
                  // 默认值取
                  const colname = defaultValue[tableName][cur.srccol];
                  if (colname) {
                    fixedcolumns[cur.fixcolumn] = `${express}${colname}`;
                  } else {
                    fixedcolumns[cur.fixcolumn] = '';
                  }
                }
                const colname = mainTablePanelData[cur.srccol];
                if (colname && mainTablePanelData.isfk) {
                  fixedcolumns[cur.fixcolumn] = `${express}${mainTablePanelData.refobjid}`;
                }
              } else if (this.copyDataSource.row[params.index][cur.srccol].val !== '') {
                // 左右结构取行内的colid
                const obj = this.afterSendData[this.tableName] ? this.afterSendData[this.tableName].find(item => item.ID === params.row.ID && item[cur.srccol]) : undefined;
                if (obj) {
                  // 有修改过的，取修改过的。
                  fixedcolumns[cur.fixcolumn] = obj[cur.srccol].toString() ? express + obj[cur.srccol] : '';
                } else {
                  const fixedcolumnsKeyValue = this.dataSource.row[params.index][cur.srccol].refobjid ? this.dataSource.row[params.index][cur.srccol].refobjid : this.dataSource.row[params.index][cur.srccol].val;
                  fixedcolumns[cur.fixcolumn] = express + fixedcolumnsKeyValue;
                }
              } else if (this.copyDataSource.row[params.index][cur.srccol].val === '') {
                fixedcolumns[cur.fixcolumn] = '';
              }
            } else {
              // 先判断主表是否有关联字段  没有则取行的refobjid
              const express = '=';
              if (cur.maintable) {
                // 需要从主表取
                const mainTablePanelData = this.$store.state[this.moduleComponentName].updateData[this.mainFormInfo.tablename];
                const defaultValue = mainTablePanelData.default;
                const modifyValue = mainTablePanelData.modify;
                // 先从修改里找 如果修改的里面没有 就从默认值里取
                if (modifyValue[this.mainFormInfo.tablename] && modifyValue[this.mainFormInfo.tablename][cur.srccol]) {
                  const colname = modifyValue[this.mainFormInfo.tablename][cur.srccol];
                  if (colname) {
                    fixedcolumns[cur.fixcolumn] = `${express}${colname}`;
                  } else {
                    fixedcolumns[cur.fixcolumn] = '';
                  }
                } else {
                  // 默认值取
                  const colname = defaultValue[this.mainFormInfo.tablename][cur.srccol];
                  if (colname) {
                    fixedcolumns[cur.fixcolumn] = `${express}${colname}`;
                  } else {
                    fixedcolumns[cur.fixcolumn] = '';
                  }
                }
                const colname = mainTablePanelData[cur.srccol];
                if (colname && mainTablePanelData.isfk) {
                  fixedcolumns[cur.fixcolumn] = `${express}${mainTablePanelData.refobjid}`;
                }
              } else {
                // fixedcolumns[cellData.refcolval.fixcolumn] = `${express}${row.refobjid}`;
                // 上下结构子表
                // 左右结构取行内的colid
                const obj = this.afterSendData[this.tableName] ? this.afterSendData[this.tableName].find(item => item.ID === params.row.ID && item[cur.srccol]) : undefined;
                if (obj) {
                  // 有修改过的，取修改过的。
                  fixedcolumns[cur.fixcolumn] = express + obj[cur.srccol];
                } else if (this.copyDataSource.row[params.index][cur.srccol].val !== '') {
                  // ，没有修改过的取默认的
                  const fixedcolumnsKeyValue = this.dataSource.row[params.index][cur.srccol].refobjid ? this.dataSource.row[params.index][cur.srccol].refobjid : this.dataSource.row[params.index][cur.srccol].val;
                  fixedcolumns[cur.fixcolumn] = express + fixedcolumnsKeyValue;
                } else if (this.copyDataSource.row[params.index][cur.srccol].val === '') {
                  fixedcolumns[cur.fixcolumn] = '';
                }
              }
            }
          });
        }
        return fixedcolumns;
      },
      verifyMessage() {
        // 表单验证
        const verifyData = [];
        const data = this.afterSendData[this.tableName];
        if (data && data.length > 0) {
          data.map((ele) => {
            Reflect.ownKeys(ele).forEach((key) => {
              const value = ele[key];
              if (value === null || value === undefined || value === '') {
                const titleArray = this.dataSource.tabth.filter(col => col.colname === key && col.isnotnull && col.colname !== EXCEPT_COLUMN_NAME);
                if (titleArray.length > 0) {
                  verifyData.push(`请输入${titleArray[0].name}`);
                }
              }
            });
            return ele;
          });
        }
        this.$emit(TABLE_VERIFY_MESSAGE, verifyData);
      },
      tableFormVerify() {
        this.verifyTipObj = {};
        const data = this.afterSendData[this.tableName] ? JSON.parse(JSON.stringify(this.afterSendData[this.tableName])) : [];
        const tabthData = JSON.parse(JSON.stringify(this.dataSource.tabth)).reverse();
        data.map((ele) => {
          tabthData.forEach((col) => {
            if (col.isnotnull && col.colname !== EXCEPT_COLUMN_NAME && ele[col.colname] !== undefined) {
              if (ele[col.colname] === '' || ele[col.colname] === 0 || ele[col.colname] === null) {
                this.verifyTipObj[ele.ID] = `${col.name}不能为空，请输入！`;
              }
            }
          });
          return ele;
        });
        if (Object.keys(this.verifyTipObj) > 0) {
          this.isTableRender = !this.isTableRender;
        }
        return this.verifyTipObj;
      }, // 表格里的表单验证 true为校验通过，false为校验不通过

      tableSortChange(value) {
        const tableName = this.tableName;
        let flag = this.currentOrderList.some((ele) => {
          if (`${tableName}.${value.key}` === ele.column) {
            ele.asc = value.order === 'asc';
            return true;
          }
        });
        if (value.order === 'normal') {
          this.currentOrderList = this.currentOrderList.filter(ele => `${tableName}.${value.key}` !== ele.column);
          flag = true;
        }
        if (!flag) {
          // this.currentOrderList.push({
          //   column: `${tableName}.${value.key}`,
          //   asc: value.order === 'asc'
          // });
          this.currentOrderList = this.currentOrderList.concat([{
            column: `${tableName}.${value.key}`,
            asc: value.order === 'asc'
          }]);
        }

        const fixedcolumns = {};
        if (this.searchCondition) {
          fixedcolumns[this.searchCondition] = this.searchInfo;
        }
        const { itemId } = this.$route.params;
        // table, objid, refcolid, startindex, range, fixedcolumns
        // let tabIndex = null;
        // if (this.WebConf && this.WebConf.isCustomizeTab && this.type === 'horizontal') {
        //   tabIndex = this.tabCurrentIndex + 1;
        // } else {
        //   tabIndex = this.tabCurrentIndex;
        // }
        const params = {
          table: this.tableName,
          objid: itemId,
          refcolid: this.tabPanel[this.currentTabIndex].refcolid,
          searchdata: {
            column_include_uicontroller: true,
            startindex: (Number(this.pageInfo.currentPageIndex) - 1) * Number(this.pageInfo.pageSize),
            range: this.pageInfo.pageSize,
            fixedcolumns
          },
          tabIndex: this.currentTabIndex
        };
        if (this.currentOrderList.length > 0) {
          // 如果没有排序则不传该参数
          params.searchdata.orderby = this.currentOrderList;
        }
        this.getObjectTableItemForTableData(params);
      },
      pageChangeEvent(index) {
        // 分页 页码改变的回调
        // if (index === this.pageInfo.currentPageIndex) {
        //   return;
        // }
        this.currentPage = index;
        this.updateTablePageInfo({
          currentPageIndex: index,
          pageSize: this.pageInfo.pageSize
        });
        // this.pageInfo.currentPageIndex = index;
        this.getTabelList(index);
      },
      pageSizeChangeEvent(index) {
        // 分页 切换每页条数时的回调
        if (index === this.pageInfo.pageSize) {
          return;
        }
        this.updateTablePageInfo({
          currentPageIndex: this.pageInfo.currentPageIndex,
          pageSize: index
        });
        // this.pageInfo.pageSize = index;
        // this.getTabelList();
      },
      objectEXPORT() { // 导出
        const { itemId } = router.currentRoute.params;
        const tableRowSelectedIds = [];
        this.tableRowSelectedIds.map(ele => tableRowSelectedIds.push(ele.ID));
        const searchData = {
          table: this.tableName,
          column_include_uicontroller: true,
          fixedcolumns: { ID: tableRowSelectedIds.length === 0 ? null : tableRowSelectedIds },
          objectIds: `${this.itemInfo.refcolid}=${itemId}`,
          startindex: (Number(this.pageInfo.currentPageIndex) - 1) * Number(this.pageInfo.pageSize),
          range: this.pageInfo.pageSize,
        };
        if (this.currentOrderList.length > 0) {
          // 如果没有排序则不传该参数
          searchData.orderby = this.currentOrderList;
        }
        const OBJ = {
          searchdata: searchData,
          filename: this.itemInfo.tabledesc,
          filetype: '.xlsx',
          showColumnName: true,
          menu: this.itemInfo.tabledesc
        };
        const promise = new Promise((resolve, reject) => {
          this.$R3loading.show();
          this.getExportQueryForButtons({ OBJ, resolve, reject });
        });
        promise.then(() => {
          if (this.buttonsData.exportdata) {
            if (Version() === '1.4') {
              this.$R3loading.hide(this.routerParams.tableName);
              this.searchCondition = null;
              this.searchInfo = '';
              this.currentPage = 1;
              const eleLink = document.createElement('a');
              const path = getGateway(`/p/cs/download?filename=${this.buttonsData.exportdata}`);
              eleLink.setAttribute('href', path);
              eleLink.style.display = 'none';
              document.body.appendChild(eleLink);
              eleLink.click();
              document.body.removeChild(eleLink);
            } else {
              this.updateExportedState({});
              const promises = new Promise((resolve, reject) => {
                this.getExportedState({
                  objid: '0000', resolve, reject
                });
              });
              promises.then(() => {
                this.$R3loading.hide(this.routerParams.tableName);
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
                        tableName: Version() === '1.3' ? 'CP_C_TASK' : 'U_NOTE',
                        tableId: Version() === '1.3' ? 24386 : 963,
                        id: this.buttonsData.exportdata
                      };
                      this.tabOpen(tab);
                      this.updataTaskMessageCount({ id: this.buttonsData.exportdata, stopUpdataQuantity: true });
                    }
                  };
                  this.$Modal.fcWarning(message);
                }
                if (this.exportTasks.successMsg) {
                  const contents = {
                    mask: true,
                    title: '成功',
                    content: this.exportTasks.resultMsg
                  };
                  this.$Message.success(contents);
                  // this.$Message.fcSuccess(contents);
                }
              }, () => {
                if (this.exportTasks.warningMsg) {
                  this.$Modal.fcError({
                    mask: true,
                    title: '错误',
                    content: `${this.exportTasks.resultMsg}`,
                  });
                }
                this.$R3loading.hide(this.routerParams.tableName);
              });
              this.getTabelList(1);
            }
          } else {
            this.$R3loading.hide(this.routerParams.tableName);
          }
        }, () => {
          // 导出失败时，刷新当前表格
          this.getTabelList(1);
          this.$R3loading.hide(this.routerParams.tableName);
        });
      },
      objectIMPORT() { // 导入
        const { itemId } = router.currentRoute.params;
        if (itemId === 'New') {
          this.$Message.warning('请先保存主表');
        } else {
          this.importData.importDialog = true;
          this.importData.importDialogTitle = this.itemInfo.tabledesc;
        }
      },
      closeImportDialog() { // 关闭导入弹框
        this.importData.importDialog = false;
      },
      importsuccess() { //
        this.currentPage = 1;
        this.getTabelList(1);
      },
      isJsonString(str) {
        if (typeof JSON.parse(str) === 'object') {
          return true;
        }
        return false;
      },
      // 深拷贝
      deepClone(source) {
        if (!source || typeof source !== 'object') {
          return source;
        }
        const targetObj = source.constructor === Array ? [] : {};
        for (const keys in source) {
          if (Object.prototype.hasOwnProperty.call(source, keys)) {
            if (source[keys] && typeof source[keys] === 'object') {
              targetObj[keys] = source[keys].constructor === Array ? [] : {};
              targetObj[keys] = this.deepClone(source[keys]);
            } else {
              targetObj[keys] = source[keys];
            }
          }
        }
        return targetObj;
      },
      getSelectValueCombobox(h, cellData) { // 做SelectValueCombobox 判空处理
        const combobox = [];

        if (cellData.combobox) {
          combobox.push(...cellData.combobox);
          return combobox.map(item => h('Option', {
            props: {
              value: item.limitval,
              label: item.limitdesc
            }
          }));
        }
        return combobox;
      },
      getSelectValue(params, cellData) { // 做SelectValueCombobox 判空处理
        if (cellData.combobox) {
          if (this.afterSendData[this.tableName]) {
            const dataArry = this.afterSendData[this.tableName];
            const findIndex = dataArry.findIndex(item => item.ID === params.row.ID);
            if (findIndex > -1 && dataArry[findIndex] && dataArry[findIndex][cellData.colname] !== undefined) {
              if (!dataArry[findIndex][cellData.colname]) {
                return null;
              }
              return dataArry[findIndex][cellData.colname];
            } else if (params.row[cellData.colname]) {
              const result = cellData.combobox.filter(
                ele => ele.limitdesc === params.row[cellData.colname]
              );
              if (result.length > 0) {
                return result[0].limitval;
              }
            }
          } else if (params.row[cellData.colname]) {
            const result = cellData.combobox.filter(
              ele => ele.limitdesc === params.row[cellData.colname]
            );
            if (result.length > 0) {
              return result[0].limitval;
            }
          }
        }
        return null;
      },
      changePageForSeleteDataForButton(data) {
        const { tableName } = this.$route.params;
        if (!this._inactive) {
          if (tableName === data.detail.tableName) {
            this.changePageForSeleteData();
          }
        }
      }

    },
    mounted() {
      this.buttonData = this.buttonGroups;       
      window.addEventListener('tabRefreshClick', () => {
        if (!this._inactive) {
          this.isRefreshClick = true;
          this.currentOrderList = [];
        }
      });
      if (!this._inactive) {
        window.addEventListener('objTabActionSlientForItemTable', this.objTabActionSlientForItemTable);
        window.addEventListener('changePageForSelete', this.changePageForSeleteDataForButton);
      }
      const { itemId, tableName, tableId } = this.$route.params;
      this.routerParams = {
        tableName,
        itemId,
        tableId
      };
    },
    beforeDestroy() {
      window.removeEventListener('tabRefreshClick', () => {
        if (!this._inactive) {
          this.isRefreshClick = false;
        }
      });
      window.removeEventListener('changePageForSelete', this.changePageForSeleteDataForButton);
      window.removeEventListener('objTabActionSlientForItemTable', this.objTabActionSlientForItemTable);
    },
    activated() {
      this.isRefreshClick = false;
    }
  };
</script>

<style scoped lang="less">
    .TableDetailCollection {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow-y: hidden;
        margin: 10px 5px 10px 5px;
        .detail-collection {
            // height: calc(100% - 38px);
            height: 100%;
            // display: flex;
            // flex: 1;
            flex-direction: column;
            overflow-y: visible; // fix: 表格内下拉框超出表格的部分看不见了
            //.detail-top {  }
                // margin-bottom: 6px;
                // display: flex;
                // justify-content: space-between;
                .page-buttons {
                    display: flex;
                    flex-wrap: wrap;
                }
                .table-page {
                    white-space: nowrap;
                }
                .detail-buttons {
                    margin-left: 10px;
                    a {
                        line-height: 26px;
                        vertical-align: middle;
                    }
                }
                .detail-search {
                    display: inline-block;
                    display: flex;
                    // justify-content: space-around;
                    // align-content: stretch;
                    .ark-select {
                        width: 120px;
                    }
                    .detail-search-input {
                        margin-left: 10px;
                        .ark-input-group {
                            top: 0px;
                        }
                        .ark-input-group-with-prepend {
                            width: 270px;
                        }
                        .ark-input-group-prepend {
                            .ark-btn {
                                display: flex;
                                align-items: center;
                                span {
                                    bottom: 2px;
                                    position: relative;
                                }
                            }
                        }
                    }
                }
          
            .table-outside {
                // flex: 1;
                // overflow-y: hidden;
                display: flex;
                height: calc(100% - 57px);
                .table-in {
                    flex: 1;
                }
            }
            .queryCondition {
                height: 20px;
                padding-top: 10px;
            }
        }
    }
</style>
<style lang="less">
    .table-in {
        flex: 1;
        tbody tr.ark-table-row-hover td {
            background-color: #ecf0f1;
        }
        thead th {
            font-weight: 400;
        }
        .ark-input-wrapper > input {
            height: 22px;
        }
        .ark-select-selection {
            height: 22px;
        }
        .ark-table th, .ark-table td {
            height: 26px;
        }
        .ark-fkrp-select-icon {
            top: 2px;
        }
        .ark-fkrp-select .ark-icon-ios-close-circle {
            top: -2px;
        }
        .ark-fkrp-poptip .fkrp-poptip-text {
            top: 2px;
        }
        .fkrp-poptip-two .ark-icon-ios-close-circle {
            top: -2px;
        }
        .ark-input-icon {
            top: -2px;
        }
    }

    .input-align-center input {
        text-align: center;
    }

    .input-align-right input {
        text-align: right;
    }

    .table-in .ag-cell{
      overflow: visible;
    }

    // ag表格查询控件展示不全
    .table-in .ag-theme-balham .ag-menu {
      overflow-y: auto;
      .ag-column-container {
        overflow: hidden;
      }
    }
</style>
