<template>
  <div class="standardTable">
    <Page
      v-if="isPageShow"
      ref="page"
      size="small"
      v-bind="pageAttribute"
      @on-change="pageChange"
      @on-page-size-change="pageSizeChange"
    />
    <!-- <div
      v-if="isBig"
      class="isBig"
      :style=" { backgroundImage : 'url( ' + bigBackground + ') '} "
    /> -->
    <div
      v-if="isBig" 
      class="isBig"
    >
      <img
        :src="bigBackground"  
      >
    </div>
   
    <div
      v-if="!isCommonTable&&!isBig"
      ref="agGridTableContainer"
      class="detailTable"
    />

    <div
      v-if="isCommonTable&&!isBig"
      class="common-table"
    >
      <CommonTable
        ref="commonTable"
        :datas="datas"
        :buttons-data="buttonsData"
        :is-big="isBig"
        :css-status="cssStatus"
        :error-arr="errorArr"
        :on-row-double-click="onRowDoubleClick"
        :on-sort-changed="onSortChanged"
        :on-selection-changed="onSelectionChanged"
        :on-row-single-click="onRowSingleClick"
        :do-table-search="doTableSearch"
        @CustomizedDialog="customizedDialog"
        @btnclick="btnclick"
      />
    </div>
    <div class="queryDesc">
      <div
        v-if="legend.length > 0 & isLegendShow"
        class="legend"
      >
        <span style="font-weight: bold;">
          图例:
        </span>
        <p
          v-for="(item, index) in legend"
          :key="index"
        >
          <span>{{ item.desc }}:&nbsp;</span>

          <button
            v-for="(temp, index2) in item.value"
            :key="index2"
            :class="item.css[index2]"
          >
            {{ temp }}
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  /* eslint-disable no-lonely-if */

  import { mapState } from 'vuex';
  import agTable from '../assets/js/ag-grid-table-pure';
  import CommonTable from './CommonTable.vue';

  export default {
    name: 'AgTable',
    data() {
      return {
        // bigBackground: require('../assets/image/isBig.png')
        // isCommonTable: true, // 是否显示普通表格
        // isCommonTable: false, // 是否显示普通表格
      };
    },
    components: {
      CommonTable
    },
    computed: {
      ...mapState(('global'), {
        bigBackground: (({ imgSrc }) => imgSrc.bigDataImg)
      })
    },
    props: {
      doTableSearch: {
        type: Function,
        default: () => {},
      },
      userConfigForAgTable: {
        type: Object,
        default: () => ({
          hideColumn: '',
          colPosition: '',
          fixedColumn: ''
        })
      }, // 控制ag列表的固定列、隐藏列、列顺序等显示环节。
      isPageShow: {
        type: Boolean,
        default: true
      }, // 是否显示分页
      pageAttribute: {
        // required: true,
        type: Object,
        default: () => ({})
      }, // Page 属性
      onPageChange: {
        type: Function,
        default: () => {
          // 参数 pageNum 页码
        }
      }, // 页码改变的回调
      onPageSizeChange: {
        type: Function,
        default: () => {
          // 参数 pageSize 每页条数
        }
      }, // 切换每页条数时的回调
      isRecreateAgInstance: {
        type: Boolean,
        default: false
      }, // 是否重新创建ag实例
      buttonsData: {// 获取自定义按钮组
        type: Array,
        default: () => []
      },
      cssStatus: {
        type: Array,
        default: () => []
      }, // 颜色配置信息  /p/cs/getTableQuery 接口返回
      datas: {
        type: Object,
        default: () => ({})
      }, // 所有返回数据  /p/cs/getTableQuery 接口返回
      errorArr: {
        type: Array,
        default: () => []
      }, // 错误信息数组

      onCellSingleClick: {
        type: Function,
        default: () => {
          // 参数说明
          // colDef：包含表头信息的对象
          // row：包含当前行所有数据的对象
          // target：事件触发对象，即event.target所返回的dom结点
        }
      }, // 单元格单击回调
      onCellDoubleClick: {
        type: Function,
        default: () => {
          // 参数说明同cellSingleClick
        }
      }, // 单元格双击回调
      onRowSingleClick: {
        type: Function,
        default: () => {
          // 参数说明同cellSingleClick
        }
      }, // 行单击回调
      onRowDoubleClick: {
        type: Function,
        default: () => {
          // 参数说明同cellSingleClick
        }
      }, // 行双击回调
      onSortChanged: {
        type: Function,
        default: () => {
          // 参数说明
          // arrayOfSortInfo: 返回当前用户触发的排序信息
          // 形如： [{"colId":"PS_C_BRAND_ID.val","sort":"asc"},{"colId":"ECODE.val","sort":"desc"}]
        }
      }, // 排序事件触发回调
      onColumnVisibleChanged: {
        type: Function,
        default: () => {
          // 参数 列名
        }
      }, // 显示或者隐藏列的监听
      onSelectionChanged: {
        type: Function,
        default: () => {
          // 参数 rowIdArray选中的数据id数组 rowArray选中的数据数组
        }
      }, // 行选中事件
      onColumnMoved: {
        type: Function,
        default: () => {
          // 参数 columnState 移动状态
        }
      }, // 列移动的监听
      onColumnPinned: {
        type: Function,
        default: () => {
          // 参数 ColumnPinned 固定列状态
        }
      },
      isLegendShow: {
        type: Boolean,
        default: true
      }, // 是否显示图例,
      legend: {
        type: Array,
        default: () => []
      }, // 图例,
      isCommonTable: {
        type: Boolean,
        default: false
      }, // 是否显示普通表格
      isBig: {// 是否海量
        type: Boolean,
        // default: false
      }  

    },
    watch: {
      userConfigForAgTable(val) {
        if (!this.isCommonTable && !this.isBig) {
          const { agGridTableContainer } = this.$refs;
          if (agGridTableContainer.agTable) {
            agGridTableContainer.agTable.dealWithPinnedColumns(true, val.fixedColumn || '');
          }
        }
      },
      datas(val) {
        if (!this.isCommonTable && !this.isBig) {
          this.agGridTable(val.tabth, val.row, val);
          setTimeout(() => {
            const { agGridTableContainer } = this.$refs;
            if (agGridTableContainer && agGridTableContainer.agTable) {
              agGridTableContainer.agTable.fixContainerHeight();
              agGridTableContainer.agTable.emptyAllFilters();
            }
          }, 30);
        }
      },
    },
    methods: {

      btnclick(obj) {
        this.$emit('btnclick', obj);
      },
      agGridTable(th, row, data) { // agGrid
        const self = this;
        const arr = [];
        if (data.ordids && Object.prototype.toString.call(data.ordids) === '[object Array]') {
          data.ordids.forEach((item) => {
            const obj = {};
            obj.sort = item.ordasc ? 'asc' : 'desc';
            obj.colId = item.colname;
          }); // 排序
        }
        const datas = Object.assign({}, self.datas);
        datas.deleteFailInfo = self.datas.deleteFailInfo ? self.datas.deleteFailInfo : [];
        datas.hideColumn = self.userConfigForAgTable.hideColumn; // 隐藏列
        datas.colPosition = self.userConfigForAgTable.colPosition; // 移动列
        datas.pinnedPosition = self.userConfigForAgTable.fixedColumn; // 固定列
        // selectIdArr
        return agTable(this.$refs.agGridTableContainer, {
          cssStatus: self.legend, // 颜色配置信息
          defaultSort: arr, // 默认排序
          datas, //  所有返回数据
          cellSingleClick: (colDef, rowData, target) => {
            // 参数说明
            // colDef：包含表头信息的对象
            // row：包含当前行所有数据的对象
            // target：事件触发对象，即event.target所返回的dom结点
            if (typeof self.onCellSingleClick === 'function') {
              self.onCellSingleClick(colDef, rowData, target);
            }
          }, // 单元格单击回调
          cellDoubleClick: (colDef, rowData, target) => {
            // 参数说明同cellSingleClick
            if (typeof self.onCellDoubleClick === 'function') {
              self.onCellDoubleClick(colDef, rowData, target);
            }
          }, // 单元格双击回调
          rowSingleClick: (colDef, rowData, target) => {
            // 参数说明同cellSingleClick
            if (typeof self.onRowSingleClick === 'function') {
              self.onRowSingleClick(colDef, rowData, target);
            }
          }, // 行单击回调
          rowDoubleClick: (colDef, rowData, target) => {
            // 参数说明同cellSingleClick
            if (typeof self.onRowDoubleClick === 'function') {
              self.onRowDoubleClick(colDef, rowData, target);
            }
          }, // 行双击回调
          onSortChanged: (arrayOfSortInfo) => {
            // 参数说明
            // arrayOfSortInfo: 返回当前用户触发的排序信息
            // 形如： [{"colId":"PS_C_BRAND_ID.val","sort":"asc"},{"colId":"ECODE.val","sort":"desc"}]
            if (typeof self.onSortChanged === 'function') {
              self.onSortChanged(arrayOfSortInfo);
            }
          }, // 排序事件触发回调
          onColumnVisibleChanged: (colName) => {
            if (typeof self.onColumnVisibleChanged === 'function') {
              self.onColumnVisibleChanged(colName);
            }
          },
          onSelectionChanged: (rowIdArray, rowArray) => {
            if (typeof self.onSelectionChanged === 'function') {
              self.onSelectionChanged(rowIdArray, rowArray);
            }
          },
          onColumnMoved: (columnState) => { // 记住移动列
            if (typeof self.onColumnMoved === 'function') {
              self.onColumnMoved(columnState);
            }
          },
          onColumnPinned: (ColumnPinned) => {
            if (typeof self.onColumnPinned === 'function') {
              self.onColumnPinned(ColumnPinned);
            }
          },
        })
          .setCols(th) // 设置数据列
          .setRows(row); // 设置数据行
      },
      pageChange(pageNum) {
        const self = this;
        if (typeof self.onPageChange === 'function') {
          self.onPageChange(pageNum);
        }
      }, // 页码改变
      pageSizeChange(pageSize) {
        const self = this;
        if (typeof self.onPageSizeChange === 'function') {
          self.onPageSizeChange(pageSize);
        }
      }, // 每页条数改变
      showAgLoading() {
        if (!this.isCommonTable && !this.isBig) {
          const { agGridTableContainer } = this.$refs;
          if (agGridTableContainer.agTable) {
            agGridTableContainer.agTable.showLoading();
          }
        } else {
          this.$refs.commonTable.spinShow = true;
        }
      },
      customizedDialog(params) {
        this.$emit('CommonTableCustomizedDialog', params);
      }
    },
    activated() {
      if (!this.isCommonTable && !this.isBig) {
        const { agGridTableContainer } = this.$refs;
        if (agGridTableContainer.agTable) {
          agGridTableContainer.agTable.fixAgRenderChoke();
          agGridTableContainer.agTable.fixContainerHeight();
        }
      }
    }
  };
</script>

<style lang="less">
 .standardTable {
   overflow: hidden;
   padding: 20px 0 0 0;
   display: flex;
   flex: 1;
   flex-direction: column;
   height: 100%;
   .common-table {
     margin-top: 10px;
     overflow-y: hidden;
     flex: 1;
   }
 }
  .detailTable ,.isBig{
    border: 1px solid #d8d8d8;
    margin-top: 10px;
    height: 100%;
    width: 100%;
  }
  .isBig{
    //  background-repeat: no-repeat;
    //  background-position: center center;
    //  background-size: 24%;
    display: flex;
    height: 100%;
    width: 100%;
    align-items: center;
    justify-content: center;

    >img{
      width: 25%;
      height: 65%;
    }
  }

 .queryDesc {
   height: 20px;
   margin: 5px 0;
   line-height: 18px;
   display: flex;

   > div {
     flex: 1;
   }
   .legend {
     > p {
       display: inline-block;
       button {
         border: 1px solid #575757;
         margin-right: 2px;
         background: white;
         padding: 0 3px;
       }

       margin-right: 3px;
     }
   }
 }
</style>
