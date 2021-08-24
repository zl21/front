/**
 * 由于我们采用的ag版本低原因，有的api在原档上没有，或者配置名换了，所以移植时新文档上一些用法会与实际用法不同，需要注意
 * 此外这里的配置只放属性的配置。有关事件配置统一放到表格的vue文件里维护
 */

import loadingSVG from '../../assets/images/loading.svg'
import i18n from '../../utils/i18n'

const agGridEnterpriseLicenseKey =
  'COGITO_SOFTWARE_Co_Ltd_on_behalf_of_FAST_FISH_(CHINA)_APPAREL_LTD._,CO_MultiApp_1Devs2_July_2019__MTU2MjAyMjAwMDAwMA==73f4b2d33a7f2bf6aca17a21940fd8ed'

const AG_SEQUENCE_COLUMN_NAME = '__ag_sequence_column_name__'

const getLocalText = function() {
  const localeText = {
    // filterPanel
    page: i18n.t('tips.page'),
    more: i18n.t('tips.more'),
    to: i18n.t('tips.to'),
    of: i18n.t('tips.total'),
    next: i18n.t('tips.next'),
    previous: i18n.t('tips.previous'),
    loadingOoo: `${i18n.t('tips.loading')}...`,
    // setFilter
    selectAll: i18n.t('tips.selectAll'),
    searchOoo: `${i18n.t('tips.search')}...`,
    blanks: i18n.t('tips.null'),
    // numberFilterAndTextFilter
    filterOoo: `${i18n.t('tips.search')}...`,
    applyFilter: i18n.t('tips.search'),
    // numberFilter
    equals: i18n.t('tips.equal'),
    notEqual: i18n.t('tips.notEqual'),
    notContains: i18n.t('tips.exclude'),
    lessThanOrEqual: i18n.t('tips.lessThanOrEqual'),
    greaterThanOrEqual: i18n.t('tips.greaterOrEqual'),
    inRange: i18n.t('tips.inRange'),
    lessThan: i18n.t('tips.lessThan'),
    greaterThan: i18n.t('tips.greater'),
    // textFilter
    contains: i18n.t('tips.contain'),
    startsWith: i18n.t('tips.startWith'),
    endsWith: i18n.t('tips.endWith'),
    // headerOfDefaultGroupColumn
    group: i18n.t('table.currentGroup'),
    // toolPanel
    columns: i18n.t('table.allColumns'),
    rowGroupColumns: i18n.t('table.perspectiveColumn'),
    rowGroupColumnsEmptyMessage: i18n.t('table.dropGroupColumnHere'),
    valueColumns: i18n.t('table.aggregateColumn'),
    pivotMode: i18n.t('table.perspectiveMode'),
    groups: i18n.t('table.groupDetails'),
    values: i18n.t('table.aggregateAnalysisValue'),
    pivots: i18n.t('table.perspectiveColumn'),
    valueColumnsEmptyMessage: i18n.t('table.dropAggregatedGroupColumnHere'),
    pivotColumnsEmptyMessage: i18n.t('table.dropPerspectiveGroupColumnHere'),
    // other
    noRowsToShow: i18n.t('tips.noData'),
    // enterPriseMenu
    pinColumn: i18n.t('table.pinnedColumn'),
    valueAggregation: i18n.t('table.aggregateValue'),
    autosizeThiscolumn: i18n.t('table.autosizeThiscolumn'),
    autosizeAllColumns: i18n.t('table.autosizeAllColumns'),
    groupBy: i18n.t('tips.groupBy'),
    ungroupBy: i18n.t('tips.ungroupBy'),
    resetColumns: i18n.t('table.resetColumns'),
    destroyColumnComps: i18n.t('table.resetColumns'),
    expandAll: i18n.t('tips.expandAll'),
    collapseAll: i18n.t('tips.collapseAll'),
    toolPanel: i18n.t('tips.toolPanel'),
    export: i18n.t('tips.export'),
    csvExport: i18n.t('tips.csvExport'),
    excelExport: i18n.t('tips.excelExport'),
    // enterPriseMenuPinning
    pinLeft: i18n.t('tips.pinLeft'),
    pinRight: i18n.t('tips.pinRight'),
    noPin: i18n.t('tips.unpin'),
    // enterPriseAggregationAndStatusPanel
    sum: i18n.t('tips.sum'),
    min: i18n.t('tips.minimum'),
    max: i18n.t('tips.max'),
    first: i18n.t('table.firstValue'),
    last: i18n.t('table.lastValue'),
    none: i18n.t('tips.noData'),
    count: i18n.t('table.count'),
    avg: i18n.t('tips.avg'),
    average: i18n.t('tips.average'),
    // standardMenu
    copyWithHeaders: i18n.t('table.copyWithHeaders'),
    copy: i18n.t('tips.copy'),
    ctrlC: 'ctrl+C',
    paste: i18n.t('tips.paste'),
    ctrlV: 'ctrl+V',
  }
  return localeText
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
  suppressDragLeaveHidesColumns: true, // 禁止列拖动出表格后隐藏
  floatingFilter: true, // 是否显表头下方的浮动筛选框
  rowDragManaged: true,
  rowGroupPanelShow: 'onlyWhenGrouping', // 是否显最顶部的group panel
  rowBuffer: 10,
  rowHeight: 32, // 行高
  enterMovesDownAfterEdit: true,
  enterMovesDown: true,
  localeText: getLocalText(),
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

Object.defineProperty(defaultConfig, 'localeText', {
  get() {
    return getLocalText()
  }
})

export {
  agGridEnterpriseLicenseKey,
  defaultConfig,
  cssFeatures,
  AG_SEQUENCE_COLUMN_NAME,
}
