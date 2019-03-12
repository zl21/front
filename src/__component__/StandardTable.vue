<template>
  <div class="standardTable">
    <Page
      v-if="isPageShow"
      ref="page"
      v-bind="pageAttribute"
      @on-change="pageChange"
      @on-page-size-change="pageSizeChange"
    />
    <div
      ref="agGridTableContainer"
      class="detailTable"
    />

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

  import agTable from '../assets/js/ag-grid-table-pure';

  export default {
    name: 'StandardTable',
    components: {},
    props: {
      isPageShow: {
        type: Boolean,
        default: true
      }, // 是否显示分页
      pageAttribute: {
        required: true,
        type: Object,
        default: () => ({})
      }, // Page 属性
      onPageChange: {
        type: Function,
        default: () => () => {
          // 参数 pageNum 页码
        }
      }, // 页码改变的回调
      onPageSizeChange: {
        type: Function,
        default: () => () => {
          // 参数 pageSize 每页条数
        }
      }, // 切换每页条数时的回调
      isRecreateAgInstance: {
        type: Boolean,
        default: false
      }, // 是否重新创建ag实例
      cssStatus: {
        type: Array,
        default: () => []
      }, // 颜色配置信息  /p/cs/getUserConfig 接口返回
      datas: {
        type: Object,
        default: () => ({})
      }, // 所有返回数据  /p/cs/getTableQuery 接口返回
      hideColumn: {
        // required: true,
        type: String,
        default: ''
      }, // 隐藏列状态   /p/cs/getUserConfig 接口返回
      colPosition: {
        // required: true,
        type: String,
        default: ''
      }, // 移动状态   /p/cs/getUserConfig 接口返回
      fixedColumn: {
        // required: true,
        type: String,
        default: ''
      }, // 固定列   /p/cs/getUserConfig 接口返回
      errorArr: {
        type: Array,
        default: () => []
      }, // 错误信息数组
      onCellSingleClick: {
        type: Function,
        default: () => () => {
          // 参数说明
          // colDef：包含表头信息的对象
          // row：包含当前行所有数据的对象
          // target：事件触发对象，即event.target所返回的dom结点
        }
      }, // 单元格单击回调
      onCellDoubleClick: {
        type: Function,
        default: () => () => {
          // 参数说明同cellSingleClick
        }
      }, // 单元格双击回调
      onRowSingleClick: {
        type: Function,
        default: () => () => {
          // 参数说明同cellSingleClick
        }
      }, // 行单击回调
      onRowDoubleClick: {
        type: Function,
        default: () => () => {
          // 参数说明同cellSingleClick
        }
      }, // 行双击回调
      onSortChanged: {
        type: Function,
        default: () => () => {
          // 参数说明
          // arrayOfSortInfo: 返回当前用户触发的排序信息
          // 形如： [{"colId":"PS_C_BRAND_ID.val","sort":"asc"},{"colId":"ECODE.val","sort":"desc"}]
        }
      }, // 排序事件触发回调
      onColumnVisibleChanged: {
        type: Function,
        default: () => () => {
          // 参数 列名
        }
      }, // 显示或者隐藏列的监听
      onSelectionChanged: {
        type: Function,
        default: () => () => {
          // 参数 rowIdArray选中的数据id数组 rowArray选中的数据数组
        }
      }, // 行选中事件
      onColumnMoved: {
        type: Function,
        default: () => () => {
          // 参数 columnState 移动状态
        }
      }, // 列移动的监听
      onColumnPinned: {
        type: Function,
        default: () => () => {
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
      } // 图例,
    },
    watch: {
      datas(val) {
        this.agGridTable(val.tabth, val.row, val);
      },
    },
    methods: {
      agGridTable(th, row, data) { // agGrid
        const self = this;
        const arr = [];
        data.ordids.forEach((item) => {
          const obj = {};
          obj.sort = item.ordasc ? 'asc' : 'desc';
          obj.colId = item.colname;
        }); // 排序
        const datas = self.datas;
        delete datas.tabth;
        delete datas.row;

        datas.hideColumn = self.hideColumn;
        datas.deleteFailInfo = self.errorArr;
        datas.colPosition = self.colPosition; // 移动列
        datas.pinnedPosition = self.fixedColumn; // 固定列
        // selectIdArr
        agTable(this.$refs.agGridTableContainer, {
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
    }
  };
</script>

<style scoped lang="less">
 .standardTable {
   padding: 20px;
 }
  .detailTable {
    margin-top: 10px;
  }

 .queryDesc {
   height: 20px;
   line-height: 30px;
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
