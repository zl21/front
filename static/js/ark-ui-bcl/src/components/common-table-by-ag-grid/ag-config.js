/**
 * 由于我们采用的ag版本低原因，有的api在原档上没有，或者配置名换了，所以移植时新文档上一些用法会与实际用法不同，需要注意
 * 此外这里的配置只放属性的配置。有关事件配置统一放到表格的vue文件里维护
 */

import loadingSVG from '../../assets/images/loading.svg'

const agGridEnterpriseLicenseKey =
  'COGITO_SOFTWARE_Co_Ltd_on_behalf_of_FAST_FISH_(CHINA)_APPAREL_LTD._,CO_MultiApp_1Devs2_July_2019__MTU2MjAyMjAwMDAwMA==73f4b2d33a7f2bf6aca17a21940fd8ed'

const AG_SEQUENCE_COLUMN_NAME = '__ag_sequence_column_name__'

const localeText = {
  // filterPanel
  page: '页',
  more: '更多',
  to: '到',
  of: '共',
  next: 'Next',
  previous: 'Previous',
  loadingOoo: '加 载 中 ...',
  // setFilter
  selectAll: '全选',
  searchOoo: '搜索...',
  blanks: '空值',
  // numberFilterAndTextFilter
  filterOoo: '搜索...',
  applyFilter: '开始搜索',
  // numberFilter
  equals: '等于',
  notEqual: '不等于',
  notContains: '不包含',
  lessThanOrEqual: '小于等于',
  greaterThanOrEqual: '大于等于',
  inRange: '在...范围内',
  lessThan: '小于',
  greaterThan: '大于',
  // textFilter
  contains: '包含',
  startsWith: '以...开始',
  endsWith: '以...结尾',
  // headerOfDefaultGroupColumn
  group: '当前分组',
  // toolPanel
  columns: '所有列',
  rowGroupColumns: '透视列',
  rowGroupColumnsEmptyMessage: '将需要分组查询的“列”拖拽至此处',
  valueColumns: '聚合列',
  pivotMode: '透视模式',
  groups: '分组详情',
  values: '聚合分析值',
  pivots: '透视列',
  valueColumnsEmptyMessage: '将需要聚合分析的‘列’拖拽到此处',
  pivotColumnsEmptyMessage: '将需要透视分析的‘列’拖拽至此处',
  // other
  noRowsToShow: '暂无数据',
  // enterPriseMenu
  pinColumn: '固定“列”',
  valueAggregation: '聚合值',
  autosizeThiscolumn: '自适应当前列',
  autosizeAllColumns: '自适应所有列',
  groupBy: '分组',
  ungroupBy: '取消分组',
  resetColumns: '重置所有列位置信息',
  destroyColumnComps: '重置所有列位置信息',
  expandAll: '展开所有',
  collapseAll: '收缩所有',
  toolPanel: '工具栏',
  export: '导出',
  csvExport: '导出CSV',
  excelExport: '导出Excel',
  // enterPriseMenuPinning
  pinLeft: '向左固定',
  pinRight: '向右固定',
  noPin: '取消固定',
  // enterPriseAggregationAndStatusPanel
  sum: '求和',
  min: '最小值',
  max: '最大值',
  first: '首值',
  last: '末值',
  none: 'None',
  count: '计数',
  avg: '平均',
  average: '平均值',
  // standardMenu
  copyWithHeaders: '复制（含表头）',
  copy: '复制',
  ctrlC: 'ctrl+C',
  paste: '粘贴',
  ctrlV: 'ctrl+V',
}

const cssFeatures = {
  hover: 'ag-syman-hover',
  imagePreviewBox: 'image-preview-box',
  tooltipBox: 'tooltip-box',
  tooltipTopBox: 'tooltip-top-box',
  textRight: 'text-right',
  attachment: 'attachment',
  'table-cell-left': 'table-cell-left',
  'table-cell-center': 'table-cell-center',
  'table-cell-right': 'table-cell-right',
}

const defaultConfig = {
  columnDefs: [],
  rowData: [],
  multiSortKey: 'ctrl', // 多列排序组合键（按下ctrl + 鼠标点击某一列）
  animateRows: true, // 显示row动画
  pagination: false, // 是否启用分页
  paginationPageSize: 10, // 分页状态下，默认每页显示条目
  enableColResize: true, // 允许用户调整列宽
  enableSorting: true, // 允许按照列值排序
  suppressAutoSize: false, // 禁止双击某列边缘进行当前列宽自适应
  enableFilter: true, // 是否允许过滤
  toolPanelSuppressSideButtons: true,
  enableStatusBar: true, // 当用户在视图区进行区域选择的时候，是否显示所有可计算数据的[平均、求和、计数、最大、最小]等值
  enableRangeSelection: false, // 是否允许进行单元格区域选择
  rowSelection: 'multiple', // 行选择模式
  suppressRowClickSelection: true, // 禁用单击事件选中行
  rowDeselection: false, // 是否允许按住ctrl + click 取消选中某个已经选中的行
  quickFilterText: null,
  groupSelectsChildren: false, // 当进行分组的时候，控制选择分组的行为，是否连带其children一起选中
  defaultColDef: {
    comparator: function() {
      return 0
    },
    enableRowGroup: true,
    enablePivot: true,
    enableValue: true,
  }, // 默认列配置
  enableCellChangeFlash: true,
  floatingFilter: true, // 是否显表头下方的浮动筛选框
  rowDragManaged: true,
  rowGroupPanelShow: 'onlyWhenGrouping', // 是否显最顶部的group panel
  rowBuffer: 10,
  rowHeight: 32, // 行高
  enterMovesDownAfterEdit: true,
  enterMovesDown: true,
  localeText,
  groupDefaultExpanded: 1,
  domLayout: null,
  groupMultiAutoColumn: true, // 分组时，显示分组原字段
  // components: {
  //   ImageComponent,
  //   fkComponent,
  //   mopFkComponent,
  //   customerUrlComponent,
  //   sequenceComponent,
  //   customHeader,
  //   attachmentComponent,
  // },
  columnTypes: {
    // 防止后台api返回的colDef中有type，会引起columnType警告
    NUMBER: {},
    STRING: {},
  },
  overlayLoadingTemplate: `<img src="${loadingSVG}" />`,
}

export {
  agGridEnterpriseLicenseKey,
  defaultConfig,
  cssFeatures,
  AG_SEQUENCE_COLUMN_NAME,
}
