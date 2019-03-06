props: {
      page: {
      	isPageShow: {
        	type: Boolean,
        	default: true
      	}, // 是否显示分页
        pageAttribute: {
        	required: true,
        	type: Object,
        	default: () => {}
      	},// 所有属性
        onPageChange: {
          type: Function,
          default: (pageNum)=>{
            // 参数 pageNum 页码
          }
        }, // 页码改变的回调
        onPageSizeChange: {
          type: Function,
          default: (pageSize)=>{
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
          type:Function,
          default: (colDef, row, target)=>{
            // 参数说明
            // colDef：包含表头信息的对象
            // row：包含当前行所有数据的对象
            // target：事件触发对象，即event.target所返回的dom结点
          }
        }, // 单元格单击回调
        cellDoubleClick: {
          type: Function,
          default:  (colDef, row, target) => {
            // 参数说明同cellSingleClick
          }
        }, // 单元格双击回调
        rowSingleClick: {
          type: Function,
          default:  (colDef, row, target) => {
            // 参数说明同cellSingleClick
          }
        }, // 行单击回调
        rowDoubleClick: {
          type: Function,
          default:  (colDef, row, target) => {
            // 参数说明同cellSingleClick
          }
        }, // 行双击回调
        onSortChanged: {
          type: Function,
          default:  (arrayOfSortInfo) => {
            // 参数说明
            // arrayOfSortInfo: 返回当前用户触发的排序信息
            // 形如： [{"colId":"PS_C_BRAND_ID.val","sort":"asc"},{"colId":"ECODE.val","sort":"desc"}]
          }
        }, // 排序事件触发回调
        onColumnVisibleChanged: {
          type: Function,
          default: (colName)=>{
            // 参数 列名
          }
        }, // 显示或者影藏列的监听
        onSelectionChanged: {
          type: Function,
          default: (rowIdArray, rowArray)=>{
            // 参数 rowIdArray选中的数据id数组 rowArray选中的数据数组
          }
        }, // 行选中事件
        onColumnMoved: {
          type: Function,
          default: (columnState)=>{
            // 参数 columnState 移动状态
          }
        }, // 列移动的监听
        onColumnPinned: {
          type: Function,
          default: (ColumnPinned)=>{
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
    }


event: {
	page: {
		{
			名称： 'on-page-change'
			说明： '页码改变的回调'
			返回值： 'pageNum页码。组件实例this'
		}，
		{
			名称： 'on-page-size-change'
			说明： '切换每页条数时的回调'
			返回值： 'pageSize。组件实例this'
		}
	}，
	agGrid: {
		{
			名称： 'on-ag-cell-sibgle'
			说明： '单元格单击'
			返回值： 'colDef：包含表头信息的对象。row：包含当前行所有数据的对象。target：事件触发对象，即event.target所返回的dom结点。组件实例this'
		},
		{
			名称： 'on-ag-cell-double'
			说明： '单元格双击'
			返回值： 'colDef：包含表头信息的对象。row：包含当前行所有数据的对象。target：事件触发对象，即event.target所返回的dom结点。组件实例this'
		},
		{
			名称： 'on-ag-row-single'
			说明： '行单击'
			返回值： 'colDef：包含表头信息的对象。row：包含当前行所有数据的对象。target：事件触发对象，即event.target所返回的dom结点。组件实例this'
		},
		{
			名称： 'on-ag-row-double'
			说明： '行双击'
			返回值： 'colDef：包含表头信息的对象。row：包含当前行所有数据的对象。target：事件触发对象，即event.target所返回的dom结点。组件实例this'
		},
		{
			名称： 'on-ag-sort-change'
			说明： '排序'
			返回值： 'arrayOfSortInfo: 返回当前用户触发的排序信息。组件实例this'
		},
		{
			名称： 'on-ag-column-visible-change'
			说明： '显示或者隐藏列'
			返回值： 'colName 列名。组件实例this'
		},
		{
			名称： 'on-ag-selection-change'
			说明： '行选中'
			返回值： 'rowIdArray选中的数据id数组。 rowArray选中的数据数组。 组件实例this'
		},
		{
			名称： 'on-ag-column-move'
			说明： '列移动'
			返回值： 'columnState 移动状态。 组件实例this'
		},
		{
			名称： 'on-ag-column-pinned'
			说明： '列固定'
			返回值： 'ColumnPinned 固定列状态。 组件实例this'
		}
	}
}


