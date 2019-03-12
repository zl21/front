const props = {
  page: {
    isPageShow: {
      type: Boolean,
      default: true
    }, // 是否显示分页
    pageAttribute: {
      // required: true,
      type: Object,
      default: () => {
      }
    }, // 所有属性
    onPageChange: {
      type: Function,
      default: (pageNum) => {
        // 参数 pageNum 页码
      }
    }, // 页码改变的回调
    onPageSizeChange: {
      type: Function,
      default: (pageSize) => {
        // 参数 pageSize 每页条数
      }
    } // 切换每页条数时的回调
  }, // 分页
  agGrid: {
    isRecreateAgInstance: {
      type: Boolean,
      default: false
    }, // 是否重新创建ag实例
    isShowAgLoading: {
      type: Boolean,
      default: false
    }, // 是否显示ag的loading
    cssStatus: {
      type: Array,
      default: []
    }, // 颜色配置信息  /p/cs/getUserConfig 接口返回
    datas: {
      type: Array,
      default: []
    }, // 所有返回数据  /p/cs/getTableQuery 接口返回
    hideColumn: {
      type: String,
      default: ''
    }, // 隐藏列状态   /p/cs/getUserConfig 接口返回
    colPosition: {
      type: String,
      default: ''
    }, // 移动状态   /p/cs/getUserConfig 接口返回
    fixedColumn: {
      type: String,
      default: ''
    }, // 固定列   /p/cs/getUserConfig 接口返回
    errorArr: {
      type: Array,
      default: () => []
    }, // 错误信息数组
    cellSingleClick: {
      type: Function,
      default: (colDef, row, target) => {
        // 参数说明
        // colDef：包含表头信息的对象
        // row：包含当前行所有数据的对象
        // target：事件触发对象，即event.target所返回的dom结点
      }
    }, // 单元格单击回调
    cellDoubleClick: {
      type: Function,
      default: (colDef, row, target) => {
        // 参数说明同cellSingleClick
      }
    }, // 单元格双击回调
    rowSingleClick: {
      type: Function,
      default: (colDef, row, target) => {
        // 参数说明同cellSingleClick
      }
    }, // 行单击回调
    rowDoubleClick: {
      type: Function,
      default: (colDef, row, target) => {
        // 参数说明同cellSingleClick
      }
    }, // 行双击回调
    onSortChanged: {
      type: Function,
      default: (arrayOfSortInfo) => {
        // 参数说明
        // arrayOfSortInfo: 返回当前用户触发的排序信息
        // 形如： [{"colId":"PS_C_BRAND_ID.val","sort":"asc"},{"colId":"ECODE.val","sort":"desc"}]
      }
    }, // 排序事件触发回调
    onColumnVisibleChanged: {
      type: Function,
      default: (colName) => {
        // 参数 列名
      }
    }, // 显示或者影藏列的监听
    onSelectionChanged: {
      type: Function,
      default: (rowIdArray, rowArray) => {
        // 参数 rowIdArray选中的数据id数组 rowArray选中的数据数组
      }
    }, // 行选中事件
    onColumnMoved: {
      type: Function,
      default: (columnState) => {
        // 参数 columnState 移动状态
      }
    }, // 列移动的监听
    onColumnPinned: {
      type: Function,
      default: (ColumnPinned) => {
        // 参数 ColumnPinned 固定列状态
      }
    }
  }, // ag props
  Legend: {
    isLegendShow: {
      type: Boolean,
      default: true
    }, // 是否显示图例
    legend: {
      type: Array,
      default: []
    } // 图例数组
  } // 图例
};
