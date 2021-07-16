<template>
  <div
    class="ag-grid-table-wrap"
    :style="tableStyle"
    ref="tableContainer"
  >
    <ag-grid-vue
      ref="table"
      class="ag-grid-table ag-theme-balham"
      :gridOptions="gridOptions"
    >
    </ag-grid-vue>
  </div>
</template>

<script type="text/ecmascript-6">
import 'ag-grid/dist/styles/ag-grid.css'
import 'ag-grid/dist/styles/ag-theme-balham.css'
import { AgGridVue } from 'ag-grid-vue';
import { LicenseManager } from "ag-grid-enterprise/main";
import { agGridEnterpriseLicenseKey, defaultConfig, cssFeatures, AG_SEQUENCE_COLUMN_NAME } from './ag-config'
import deepClone from '../../utils/deepClone'
import { isArray } from '../../utils/array'
import { isFunction } from '../../utils/common'

import CustomHeader from './renderComponents/CustomHeader.vue'
import CellRender from './CellRender.vue'
import CellRenderByFunction from './CellRenderByFunction.vue'
import TextComponent from './renderComponents/TextComponent.vue'
import { toThousands } from '../../utils/number'

LicenseManager.setLicenseKey(agGridEnterpriseLicenseKey);

// 自定义tooltip
const tooltipBox = document.createElement('div');
tooltipBox.classList.add(cssFeatures.tooltipBox);

// 自定义toolTipTop
const tooltipTopBox = document.createElement('div');
tooltipTopBox.classList.add(cssFeatures.tooltipTopBox);
tooltipTopBox.classList.add('arrow-down');
tooltipTopBox.style.display = 'none';


let updateColumnVisibleDelay = null; // column visible 延迟计时器
let updateColumnPositionDelay = null; // column move 延迟计时器

const Common_Table_Mode = 'commonTable'

export default {
  name: 'AgGridTable',

  components: {
    AgGridVue,
    CustomHeader,
    CellRender,
    CellRenderByFunction,
    TextComponent,
  },

  props: {
    // ag配置
    options: {
      type: Object,
      default: () => ({})
    },
    // 表格高度
    height: {
      type: String,
    },
    // 行数据
    data: {
      default: ()=>([])
    },
    // 列数据
    columns: {
      default: ()=>([])
    },
    // 列自定义组件渲染参数
    renderParams: {
      type: Function
    },
    // 表格展示模式，目前有commonTable(普通表格)
    mode: {
      type: String,
      default: ''
    },
  },

  computed: {
    // 表格样式
    tableStyle() {
      return this.height ? `height: ${this.height};` : ''
    },

    // ag表格配置
    gridOptions() {
      // defaultConfig只含属性配置不含事件配置和组件配置
      const otherOptions = {
        onGridReady: this.onGridReady,
        getContextMenuItems: this.getContextMenuItems,
        getMainMenuItems: this.getMainMenuItems,
        onCellClicked: this.onCellClicked,
        onCellDoubleClicked: this.onCellDoubleClicked,
        onRowClicked: this.onRowClicked,
        onRowDoubleClicked: this.onRowDoubleClicked,
        onSelectionChanged: this.onSelectionChanged,
        onSortChanged: this.onSortChanged,
        onVirtualColumnsChanged: this.onVirtualColumnsChanged,
        onColumnVisible: this.onColumnVisible,
        onColumnMoved: this.onColumnMoved,
        onColumnPinned: this.onColumnPinned,
        onRowDataChanged: this.onRowDataChanged,
        onBodyScroll: this.onBodyScroll,
        onFilterChanged: this.onFilterChanged,
        getRowClass: this.getRowClass,
      }
      const defaultColDef = this.options.defaultColDef || {}
      return Object.assign({}, defaultConfig, otherOptions, this.options, {
        defaultColDef: {
          ...defaultConfig.defaultColDef,
          ...defaultColDef
        }
      })
    }
  },

  watch: {
    // 自动更新行数据
    data: {
      handler(newData) {
        if (isArray(newData) && this._gridReady) {
          // $nextTick作用是避免 表格行 在 表格列之前进行渲染
          this.$nextTick(() => {
            this.setRows(newData)
          })
        }
      },
    },

    // 自动更新列数据
    columns: {
      handler(newData) {
        if (isArray(newData) && this._gridReady) {
          this.setCols(newData)
        }
      },
    },
  },

  data() {
    return {
      api: null, // 表的api
      columnApi: null, // 表格列的api
      subtotalRowData: null, // 合计对象
      fullRangeSubTotalRowData: null // 总计对象
    }
  },

  methods: {
    // 网格准备完成
    onGridReady(params) {
      this._gridReady = true
      const { columnApi } = params;
      const agGridDiv = this.$refs.table.$el
      const agGridTableContainer = this.$refs.tableContainer
      // 自适应所有列
      this._horizontalScrollTo(agGridDiv.querySelector('.ag-body-viewport'), agGridTableContainer.getAttribute('data-scroll-left')); // 处理表体的横向滚动问题。
      this._autoSizeColumns()
      agGridDiv.appendChild(tooltipBox);
      document.body.appendChild(tooltipTopBox);
      // 移除ag-tool-panel
      agGridDiv.querySelector('.ag-tool-panel').remove();

      if (isArray(this.columns) && this.columns.length > 0) {
        this.setCols(this.columns)
        if (isArray(this.data) && this.data.length > 0) {
          // $nextTick作用是避免 表格行 在 表格列之前进行渲染
          this.$nextTick(() => {
            this.setRows(this.data)
          })
        }
      }

      this.$emit('grid-ready')
    },

    // 设置行数据
    setRows(data) {
      const agTable = this.$refs.table
      if (!data) {
        return agTable;
      }

      if (!isArray(data)) {
        alert('agTable.setRows requires Array as first param');
        return agTable;
      }
      const { rowData, pinnedBottomRowData } = this._transformRowData(data);
      // 为每行增加序号值
      rowData.forEach((d, i) => {
        d[AG_SEQUENCE_COLUMN_NAME] = { val: i + 1 };
      });
      // console.log('设置行', rowData);
      // console.log('设置底部', pinnedBottomRowData)
      this._pinnedBottomRowData = pinnedBottomRowData;
      this.api.setRowData(rowData);
      this.api.setPinnedBottomRowData(pinnedBottomRowData);
      this._fixAgRenderChoke();
      this.api.hideOverlay();
      return agTable;
    },

    // 设置表格列
    setCols(data) {
      const agTable = this.$refs.table
      if (!data) {
        return agTable;
      }

      if (!isArray(data)) {
        alert('agTable.setCols requires Array as first param');
        return agTable;
      }


      this._colPosition = '';
      this._originColumnDefs = data;

      const options = this.gridOptions;
      const { colPosition } = options.datas;
      let colData
      // 移动列，重新排序
      if (colPosition && colPosition !== '') {
        colData = this._getSortedData(data, colPosition)
      } else {
        // 实现扩展属性配的固定列位置不变。手动添加的固定列只能追加在已有固定列后面
        if (this.options.datas && this.options.datas.pinnedColumns) {
          this._sortPinnedColumns(data)
        }
        colData = data
      }

      this.api.setColumnDefs(this._transformColumnDefs(colData));
      // console.log('设置列', this._transformColumnDefs(colData));
      setTimeout(() => {
        this._autoSizeColumns()
      }, 20)
      return agTable;
    },

    // 表体右击菜单
    getContextMenuItems(param) {
      return [
        'copy',
        'copyWithHeaders',
        'paste',
        // 'export',
        {
          name: '显示所有列',
          action: () => {
            const options = this.options; // 此处必须是指外部传入的参数
            if (isFunction(options.agColumnVisibleChanged)) {
              param.columnApi.resetColumnState();
              // 将所有隐藏列都显示出来
              param.columnApi.setColumnsVisible(param.columnApi.getColumnState().map(d => d.colId), true);
              setTimeout(() => {
                updateColumnVisibleDelay && clearTimeout(updateColumnVisibleDelay);
              }, 0);
              // 处理列排序问题。
              if (this._colPosition && this._colPosition !== '') {
                this._colPosition.split(',').forEach((d, i) => {
                  param.columnApi.moveColumn(d, i);
                });
                setTimeout(() => {
                  updateColumnPositionDelay && clearTimeout(updateColumnPositionDelay);
                }, 0);
              }
              // 向后台发送API，清除所有隐藏列
              options.agColumnVisibleChanged('');
              this._preventPinnedEmit = true;
              setTimeout(function () {
                this._preventPinnedEmit = false;
              }, 100);
            }
          },
        },
      ];
    },

    // 设置每列的general menu item
    getMainMenuItems(params) {
      return [
        'pinSubMenu',
        'separator',
        'autoSizeThis',
        'autoSizeAll',
        'separator',
        {
          name: '隐藏当前列',
          action: ()=> {
            const { columnApi, column } = params
            columnApi.setColumnVisible(column.colId, false)
          }
        },
        {
          name: '重置所有列位置信息',
          action: () => {
            this._isResetAllColumn = true;
            const options = this.options;
            if (isFunction(options.agColumnMoved)) {
              const visibleColumns = [];
              this._originColumnDefs.map(d => d.colname).forEach((d) => {
                if (params.columnApi.getColumn(d).visible) {
                  visibleColumns.push(d);
                }
              });
              visibleColumns.forEach((d, i) => {
                params.columnApi.moveColumn(d, i);
              });
              const { pinnedLeftColumns, pinnedRightColumns } = this._getPinnedColumns(this.options.datas.pinnedColumns)
              const allFixedColumns = params.columnApi.getDisplayedLeftColumns().map(d => d.colId).concat(params.columnApi.getDisplayedRightColumns().map(d => d.colId))

              allFixedColumns.forEach((colId) => {
                  if (colId !== 'ID' && !pinnedLeftColumns.includes(colId) && !pinnedRightColumns.includes(colId)) {
                    params.columnApi.setColumnPinned(colId, false);
                  }
                });
              setTimeout(() => {
                updateColumnPositionDelay && clearTimeout(updateColumnPositionDelay);
              }, 0);
              options.agColumnMoved('');
              this._colPosition = '';
            }
            if (isFunction(options.agColumnPinned)) {
              options.agColumnPinned('ID|')
            }
            setTimeout(() => {
              this._isResetAllColumn = false;
            }, 500);
          },
        },
      ];
    },

    // 单元格单击
    onCellClicked(params) {
      const { colDef, data, event } = params;
      const { __ag_is_statistic_row__ } = data;
      const options = this.options;
      if (isFunction(options.agCellSingleClick) && !__ag_is_statistic_row__) {
        options.agCellSingleClick(colDef, data, event.target);
      }
      this.$emit('on-cell-single-click', params)
    },

    // 单元格双击
    onCellDoubleClicked(params) {
      const { colDef, data, event } = params;
      const { __ag_is_statistic_row__ } = data;
      const options = this.options;
      if (isFunction(options.agCellDoubleClick) && !__ag_is_statistic_row__) {
        options.agCellDoubleClick(colDef, data, event.target);
      }
      this.$emit('on-cell-double-click', params)
    },

    // 行单击
    onRowClicked(params) {
      const { colDef, data, event } = params;
      const { __ag_is_statistic_row__ } = data;
      const options = this.options;
      if (isFunction(options.agRowClick) && !__ag_is_statistic_row__) {
        options.agRowClick(colDef, data, event.target);
      }
      this.$emit('on-row-click', params)
    },

    // 行双击
    onRowDoubleClicked(params) {
      const { colDef, data, event } = params;
      const { __ag_is_statistic_row__ } = data;
      const options = this.options;
      if (isFunction(options.agRowDoubleClick) && !__ag_is_statistic_row__) {
        options.agRowDoubleClick(colDef, data, event.target);
      }
      this.$emit('on-row-dblclick', params)
    },

    // 行选中事件
    onSelectionChanged(params) {
      const options = this.options;
      const ids = [];
      const rows = [];
      params.api.getSelectedRows().forEach((d) => {
        const { val } = d.ID;
        if (val !== '合计' && val !== '总计') {
          ids.push(val);
          rows.push(d);
        }
      });

      if (isFunction(options.agSelectionChanged)) {
        options.agSelectionChanged(ids, rows);
      }

      this.$emit('on-selection-change', rows)
    },

    // 响应排序事件
    onSortChanged(params) {
      const { api } = params;
      const options = this.options;

      if (api.getSortModel().length !== 0) {
        api.showLoadingOverlay();
        this.$emit('on-sort-change', api.getSortModel())
      }

      if (isFunction(options.agSortChanged)) {
        options.agSortChanged(api.getSortModel());
      }
    },

    // 当列很多时，如果用户横向拉动混动条以查看其它不在视口区域的列，则会触发此事件
    onVirtualColumnsChanged(params) {
      // const allVirtualCols = params.columnApi.getAllDisplayedVirtualColumns();
      // const currentLastVirtualColumn = allVirtualCols[allVirtualCols.length - 1].colId;
      // agGridTableContainer.setAttribute('data-last-virtual-column', currentLastVirtualColumn);
    },

    // 显示或者隐藏列的监听
    onColumnVisible(params) {
      const options = this.options;
      updateColumnVisibleDelay && clearTimeout(updateColumnVisibleDelay);
      updateColumnVisibleDelay = setTimeout(() => {
        if (isFunction(options.agColumnVisibleChanged)) {
          const hideColumns = [];
          params.columnApi.getColumnState().forEach((d) => {
            if (d.hide) {
              hideColumns.push(d.colId);
            }
          });
          options.agColumnVisibleChanged(hideColumns.toString(), params);
        }
      }, 10);
      this.$emit('on-column-visible',params)
    },

    // 列移动回调
    onColumnMoved(param) {
      const { columnApi } = param;
      const options = this.options;
      updateColumnPositionDelay && clearTimeout(updateColumnPositionDelay);
      updateColumnPositionDelay = setTimeout(() => {
        if (isFunction(options.agColumnMoved)) {
          const columnState = columnApi.getColumnState().map(d => d.colId);
          const orderedColumns = [];
          const hideColumn = options.datas.hideColumn && options.datas.hideColumn !== '' ? options.datas.hideColumn.split(',') : [];
          columnState.forEach((d) => {
            if (hideColumn.indexOf(d) === -1 && d !== 'ID') {
              // 所有非隐藏列，并且不是ID列，进组。
              orderedColumns.push(d);
            }
          });
          // ID列永远作为显示列，并且永远放在排序的首位，并且记录用户操作后的列的顺序到agTable实例中
          this._colPosition = ['ID'].concat(orderedColumns).toString();
          options.agColumnMoved(['ID'].concat(orderedColumns).toString());
        }
      }, 500);
      this.$emit('on-column-moved',param)
    },

    // 列固定回调
    onColumnPinned(params) {
      const options = this.options;
      const pinnedLeft = params.columnApi.getDisplayedLeftColumns().map(d => d.colId);
      const pinnedRight = params.columnApi.getDisplayedRightColumns().map(d => d.colId);

      //  取消固定列的时候将该固定放到固定位置
      if (isFunction(options.agColumnPinned)) {
        if (!this._isResetAllColumn) {
          if (params.pinned === null) {
            const columnState = params.columnApi.getColumnState().map(d => d.colId);
            const orderedColumns = [];
            const hideColumn = options.datas.hideColumn && options.datas.hideColumn !== '' ? options.datas.hideColumn.split(',') : [];
            columnState.forEach((d) => {
              if (hideColumn.indexOf(d) === -1 && d !== params.column.colId && d !== 'ID') {
                // 所有非隐藏列，并且不是ID列，也不是当前取消的固定列，进组。
                orderedColumns.push(d);
              }
            });

            //  取消固定列的时候将该列移动到所有列的列尾
            // agTable.colPosition = orderedColumns.concat([params.column.colId]).toString();
            // options.agColumnMoved(orderedColumns.concat([params.column.colId]).toString());

            //  取消固定列的时候将该列移动到所有列的列首
            this._colPosition = ['ID'].concat([params.column.colId].concat(orderedColumns)).toString();
            setTimeout(() => {
              this._colPosition.split(',').forEach((d, i) => {
                params.columnApi.moveColumn(d, i);
              });
            }, 48);
            options.agColumnMoved(['ID'].concat([params.column.colId].concat(orderedColumns)).toString());
          }
        }

        //  将固定列保存到数据库
        const pinnedPosition = `${pinnedLeft.join(',')}|${pinnedRight.join(',')}`;
        if (!this._preventPinnedEmit) {
          options.agColumnPinned(pinnedPosition);
        }
      }
      this.$emit('on-column-pinned', params)
    },

    // 使用api.setRowData()或通过更改rowDatabound属性将新数据设置到网格中
    onRowDataChanged() {
      this.$emit('row-data-changed')
    },

    // 主体水平或垂直滚动​​
    onBodyScroll(e) {
      // 水平滚动时，重新计算列宽
      if (e.direction === 'horizontal') {
        if (this.resizeColumnsTimer) {
          clearTimeout(this.resizeColumnsTimer)
          this.resizeColumnsTimer = null
        }
        this.resizeColumnsTimer = setTimeout(() => {
          this._autoSizeColumns()
        }, 100)
      }
    },

    // 处理行级样式
    getRowClass(params) {
      let className = '';
      const { data } = params;
      const options = this.options;
      if (options.cssStatus) {
        options.cssStatus.forEach((d) => {
          if (data && this._zhColumnNameMap[d.desc]) {
            const columnName = this._zhColumnNameMap[d.desc]; // 与d.desc所述中文字段相匹配的英文字段名
            const columnValueOfCurrentRow = data[columnName].val; // 与d.desc所述中文字段相匹配的当前行的columnName的取值
            className += `${d.css[d.value.indexOf(columnValueOfCurrentRow)] || ''} ` || ' ';
          }
        });
      }
      return className;
    },

    // 表格列过滤回调
    onFilterChanged(params) {
      const { api, columnApi } = params;
      const datas = this.options.datas
      if (!datas) {
        return
      }
      const { isFullRangeSubTotalEnabled, isSubTotalEnabled, fullRangeSubTotalRow, subtotalRow } = datas

      if (!isFullRangeSubTotalEnabled && !isSubTotalEnabled) {
        return
      }

      // 获取行数据
      const rows = api.getModel().rowsToDisplay.map(row => row.data)

      // 计算合计
      if (isSubTotalEnabled || isFullRangeSubTotalEnabled) {
        const subTotalResult = this._getSumOfEachColumn(Object.keys(subtotalRow), rows)
        Object.keys(subTotalResult).forEach(columnName => {
          const value = subTotalResult[columnName]
          this.subtotalRowData[columnName].val = toThousands(value) // 转千分位
        })
      }

      // // 总计是根据合计得到结果，所以算总计前要算下合计
      // // 总计可以根据 原始合计与现在合计的差值算出
      // if (isFullRangeSubTotalEnabled) {
      //   Object.keys(fullRangeSubTotalRow).forEach(fieldName => {
      //     const originSubTotal = subtotalRow[fieldName].replace(/,/, '')
      //     const currentSubTotal = this.subtotalRowData[fieldName].val.replace(/,/, '')
      //     const diffValue = Number(originSubTotal) - Number(currentSubTotal) // 获取合计的差值
      //     const originTotal = fullRangeSubTotalRow[fieldName].val.replace(/,/, '')
      //     const currentTotal = Number(originTotal) - Number(diffValue) // 获取总计
      //     const currentColumn = columnApi.getAllColumns().find(d => d.colId === fieldName)
      //     const scale = currentColumn.colDef.scale || 0 // 获取计算精度
      //     const value = currentTotal.toFixed(scale)
      //     this.fullRangeSubTotalRowData[fieldName].val = toThousands(value)
      //   })
      // }

      // 设置底部数据
      const pinnedBottom = []
      if (isSubTotalEnabled) {
        pinnedBottom.push(this.subtotalRowData)
      }
      if (isFullRangeSubTotalEnabled) {
        pinnedBottom.push(this.fullRangeSubTotalRowData)
      }
      if (pinnedBottom.length > 0) {
        api.setPinnedBottomRowData(pinnedBottom)
      }
    },

    /**
     * -----------------------------start-------------------------非ag表格自带事件
     */

    // 暴露纵向滚动方法
    _fixAgRenderChoke() {
      const agTable = this.$refs.table
      const viewport = document.querySelector('.ag-body-viewport');
      if (viewport) {
        const currentViewPortScrollLeft = viewport.scrollLeft;
        viewport.scrollTop = 5;
        viewport.scrollLeft = 1;
        setTimeout(() => {
          viewport.scrollTop = 0;
          viewport.scrollLeft = currentViewPortScrollLeft || 0;
          this._resetColumnWidth()
        }, 50);
      }
      return agTable;
    },

    // 获取固定列
    _getPinnedColumns(pinnedPosition) {
      let pinnedLeftColumns = []
      let pinnedRightColumns = []

      if (pinnedPosition) {
        // 举例：接口返回数据值为 ID, KEY | DATE, NUM ，其中 | 左侧的数据代表固定在右边， | 右侧的数据代表固定在右边
        const pinnedColumns = pinnedPosition.split('|');
        pinnedLeftColumns = pinnedColumns[0].split(',');
        if (pinnedColumns[1]) {
          pinnedRightColumns = pinnedColumns[1].split(',');
        }
      }
      return {
        pinnedLeftColumns,
        pinnedRightColumns
      }
    },

    // 对固定列进行排序
    _sortPinnedColumns(visibleColumns) {
      const { pinnedLeftColumns, pinnedRightColumns } = this._getPinnedColumns(this.options.datas.pinnedColumns)
      let leftPoint = 0 // 左指针
      let rightPoint = Math.max(visibleColumns.length - 1, 0) // 右指针
      visibleColumns.forEach((columnObj, index) => {
        if(index > rightPoint) {
          return
        }
        if (pinnedLeftColumns.includes(columnObj.colname) || columnObj.colname === 'ID') {
          // 与前面的元素交换位置，保持固定列字段在前面
          const temp = visibleColumns[leftPoint]
          visibleColumns[leftPoint] = columnObj
          visibleColumns[index] = temp
          leftPoint++
        }
        if (pinnedRightColumns.includes(columnObj.colname)) {
          // 与前面的元素交换位置，保持固定列字段在前面
          const temp = visibleColumns[rightPoint]
          visibleColumns[rightPoint] = columnObj
          visibleColumns[index] = temp
          rightPoint--
        }
      })
    },

    // 获取顺序改变后的列
    _getSortedData(data, colPosition) {
      // 初始化的时候，记录colPosition，以便点击“显示所有列”按钮时，可以还原已经排序列的顺序
      this._colPosition = colPosition;
      const positionColumns = colPosition.split(',');
      const visibleColumns = [];   // 不可见列
      const unVisibleColumns = [];  // 可见列
      const columnMap = {};

      // 先过滤出不可见列
      data.forEach((d) => {
        columnMap[d.colname] = d;
        if (positionColumns.indexOf(d.colname) === -1) {
          unVisibleColumns.push(d);
        }
      });

      // 按顺序剔除可见列
      positionColumns.forEach((columnName) => {
        if (columnMap[columnName]) {
          visibleColumns.push(columnMap[columnName]);
        }
      });

      // 实现扩展属性配的固定列位置不变。手动添加的固定列只能追加在已有固定列后面
      if (this.options.datas && this.options.datas.pinnedColumns) {
        this._sortPinnedColumns(visibleColumns)
      }
      return visibleColumns.concat(unVisibleColumns)
    },

    // 处理原始列数据
    _transformColumnDefs(data) {
      const agTable = this.$refs.table
      const options = this.gridOptions;
      let hideColumn = [];
      if (options && options.datas && options.datas.hideColumn) {
        hideColumn = deepClone(options.datas.hideColumn.split(','))
      }

      // ---------- 处理默认排序 ---------------
      const defaultSortKeyMap = {};
      if (options && options.datas && options.datas.ordids && isArray(options.datas.ordids)) {
        options.datas.ordids.forEach((d) => {
          if (d.colname !== 'ID') {
            // 不处理ID列的默认排序显示
            defaultSortKeyMap[d.colname] = d.ordasc ? 'asc' : 'desc';
          }
        });
      }

      // ----------for menu tabs begin---------------
      const columnMenus = {
        generalMenuTab: options && options.generalMenuTab ? options.generalMenuTab : true, // generalMenuTab： 通用菜单，用于显示自适应之类的功能菜单
        filterMenuTab: options && options.filterMenuTab ? options.filterMenuTab : true, // filterMenuTab：列值过滤器
        columnsMenuTab: options && options.columnsMenuTab ? options.columnsMenuTab : true, // columnsMenuTab：列名过滤器
      };
      const menuTabs = [];
      ['generalMenuTab', 'filterMenuTab', 'columnsMenuTab'].forEach((tab) => {
        if (columnMenus[tab]) {
          menuTabs.push(tab);
        }
      });
      // ----------for menu tabs end---------------

      const newData = data.map((d) => {
        if (d.colname === 'headerName') {
          alert('headerName : 列名冲突');
        }
        if (d.colname === 'field') {
          alert('field : 列名冲突');
        }
        const item = JSON.parse(decodeURI(encodeURI(JSON.stringify(d))));
        item._index = d._index;
        item.headerName = d.colname === 'ID' ? '序号' : d.name || '未定义';
        item.lockVisible = d.lockVisible || d.colname === 'ID'; // 锁定序号列的隐藏功能
        item.suppressToolPanel = d.suppressToolPanel || d.colname === 'ID'; // 锁定ID列工具栏操作能力
        // item.pinned = d.colname === 'ID' ? 'left' : this._getPinnedState(d.colname); // 将一列固定到一侧
        item.pinned = d.pinned || (d.colname === 'ID' ? 'left' : d.pinned); // 将一列固定到一侧
        item.maxWidth = d.maxWidth || (d.colname === 'ID' ? 80 : null); // 为ID列预设最大宽度
        item.width = d.width || (d.webconf && d.webconf.standard_width ? Number(d.webconf.standard_width) : null); // 为ID列预设宽度
        // 此处加判断条件，是因为autoSizeAllColumns()方法会让width失效，但是如果设置了最小和最大宽，那么width就不会受到api影响
        if (item.width) {
          item.maxWidth = item.width
          item.minWidth = item.width
        }

        item.suppressResize = d.suppressResize || d.colname === 'ID'; // 禁止拖动ID列边缘以改变其列宽
        item.suppressMovable = d.suppressMovable || d.colname === 'ID'; // 禁用ID列拖拽
        item.lockPinned = d.lockPinned || true; // 锁定序号列的pinned功能
        item.lockPosition = d.lockPosition || d.colanme === 'ID'; //  锁定ID列的位置
        item.headerComponentFramework = d.headerComponentFramework || (options && options.useDefaultHeader ? null : 'CustomHeader'); // 如果外界传值useDefaultHeader = true，则不适用headerComponent
        item.headerComponentParams = d.headerComponentParams || { agGridDiv: agTable.$el, tooltipBox, tooltipTopBox };
        item.field = item.field ? item.field : `${d.colname}.val`; // 参与显示和计算的列值
        // ID字段列默认取行索引展示
        if (item.colname === 'ID') {
          item.field = `${AG_SEQUENCE_COLUMN_NAME}.val`
        }
        item.colId = d.colId || d.colname; // 每一列的ID，默认和item.field一致。
        item.sort = d.sort || defaultSortKeyMap[d.colname]; // 设置默认排序列
        item.suppressFilter = d.suppressFilter || !d.isagfilter; // 根据d.isfilter 判断是否需要禁用浮动框

        /**
         * 单元格定制核心逻辑
         */
        const params = this.renderParams && this.renderParams(item) || {} // renderParams存在说明用户开启定制单元格功能
        // 自定义渲染所用组件。内置两种渲染容器CellRenderByFunction和CellRender。默认值为CellRender,CellRenderByFunction需要外部传入覆盖
        // 值为CellRenderByFunction时可以支持render函数渲染，反之支持vue实例渲染
        item.cellRendererFramework = d.cellRendererFramework || (params.renderContainer ? params.renderContainer : 'CellRender')
        // 传给组件的参数。参数里renderComponent属性至往容器里放置的组件。即单元格内展示的组件
        item.cellRendererParams = d.cellRendererParams || {
          renderComponent: TextComponent, // 全局组件传组件名称，局部组件传组件实例。用户如果不定制单元格默认用文本组件渲染
          agGridDiv: agTable.$el,
          options,
          tooltipBox,
          tooltipTopBox,
          failIds: this._getFailIds(),
          mode: this.mode,
          ...params
        };

        // 表格固定底部的自定义渲染。目前只有合计使用
        item.pinnedRowCellRendererFramework = d.pinnedRowCellRendererFramework || 'CellRender'
        item.pinnedRowCellRendererParams = d.pinnedRowCellRendererParams || {
          renderComponent: TextComponent
        }
        // 在cell rendering 中自定义一个agGridDiv 用于以后的寻根定位
        item.sortingOrder = d.sortingOrder || (item.isorder ? ['asc', 'desc'] : [null]); // 处理每列默认的单击后的排序顺序
        item.unSortIcon = d.unSortIcon || item.isorder; // 设置未排序图表Icon
        item.hide = d.hide || hideColumn.includes(item.colname);
        item.suppressMenu = d.suppressMenu || d.colname === 'ID'; // 是否禁用每一列的菜单选择
        if (d.agfilter === 'FUZZY') {
          item.filter = 'agTextColumnFilter';
        }
        item.checkboxSelection = d.colname === 'ID' ? function (params) {
          return params.columnApi.getRowGroupColumns().length === 0 && (params.data.ID && params.data.ID.val !== '合计' && params.data.ID.val !== '总计');
        } : d.checkboxSelection;
        item.headerCheckboxSelection = d.colname === 'ID' ? function (params) {
          return params.columnApi.getRowGroupColumns().length === 0;
        } : d.checkboxSelection;
        item.headerCheckboxSelectionFilteredOnly = d.headerCheckboxSelectionFilteredOnly || d.colname === 'ID';
        item.cellClass = d.cellClass || function (params) {
          const { colDef } = params;
          const { colId, align, tdAlign } = colDef;
          const cellAlign = tdAlign || align || 'center' // 单元格内容对齐
          if (colId === 'ID') {
            return null
          } else {
            return cssFeatures[`table-cell-${cellAlign}`];
          }
        };
        // 所有type=Number, display=text 的列，居右侧显示其数值
        // 最后处理zhColumnNameMap
        this._zhColumnNameMap[item.headerName] = d.colname;
        return item;
      });

      return newData
    },

    // 处理原始行数据
    _transformRowData(data) {
      const options = this.gridOptions;
      const { ids } = options.datas;
      const keySetOfIdSequence = {};
      let rowData = [];
      if (isArray(ids) && ids.length > 0) {
        ids.forEach((d, i) => {
          keySetOfIdSequence[d] = parseInt(i + 1, 10);
        });
        rowData = data.concat([]).sort((a, b) => (keySetOfIdSequence[a.ID.val] || Infinity) - (keySetOfIdSequence[b.ID.val] || Infinity)); // 根据后台返回的ids来排序rowData
      } else {
        rowData = data;
      }
      const pinnedBottomRowData = [];
      let fullRangeSubTotalRow = null;
      let isFullRangeSubTotalEnabled = null;
      let isSubTotalEnabled = null;
      let subtotalRow = null
      if (options.datas) {
        const { datas } = options;
        fullRangeSubTotalRow = datas.fullRangeSubTotalRow;
        isFullRangeSubTotalEnabled = datas.isFullRangeSubTotalEnabled;
        isSubTotalEnabled = datas.isSubTotalEnabled;
        subtotalRow = datas.subtotalRow
      }

      // 计算合计值
      if (isSubTotalEnabled) {
        this.subtotalRowData = this._dealWithSubTotalRow(subtotalRow)
        pinnedBottomRowData.push(this.subtotalRowData);
      }

      // 计算总计值
      if (isFullRangeSubTotalEnabled && fullRangeSubTotalRow) {
        this.fullRangeSubTotalRowData = this._dealWithFullRangeSubTotalRow(fullRangeSubTotalRow)
        pinnedBottomRowData.push(this.fullRangeSubTotalRowData);
      }

      // 兼容普通表格合计
      if (this.mode === Common_Table_Mode) {
        for (let row of pinnedBottomRowData) {
          let staticRow = row.__ag_is_statistic_row__
          for (const key in row) {
            row[key] = row[key].val;
          }
          row[AG_SEQUENCE_COLUMN_NAME] = {
            val: row.ID
          }
          row.__ag_is_statistic_row__ = staticRow;
        }
      }

      return { rowData, pinnedBottomRowData };
    },

    // 处理总计行数据
    _dealWithFullRangeSubTotalRow(fullRangeSubTotalRow) {
      const fullRangeSubTotalRowData = {};
      this.columnApi.getAllColumns().forEach((d) => {
        const { colname } = d.colDef;
        fullRangeSubTotalRowData[colname] = { val: colname === 'ID' ? '总计' : fullRangeSubTotalRow[colname] ? fullRangeSubTotalRow[colname].val : '' };
      });
      if (JSON.stringify(fullRangeSubTotalRow) !== '{}') {
        fullRangeSubTotalRowData.__ag_is_statistic_row__ = true;
      }
      fullRangeSubTotalRowData[AG_SEQUENCE_COLUMN_NAME] = {}
      fullRangeSubTotalRowData[AG_SEQUENCE_COLUMN_NAME].val = '总计'
      return fullRangeSubTotalRowData;
    },

    // 计算每一列的和，返回一个对象，对象key对应是某一列的值
    // 参数1是的存放列字段的数组，参数2是行数据
    _getSumOfEachColumn(columns, rows) {
      const result = {}
      let subtotal = 0
      columns.forEach(fieldName => {
        // 合计值为过滤勾选项之和
        const currentColumn = this.columnApi.getAllColumns().find(d => d.colId === fieldName)
        const scale = currentColumn.colDef.scale || 0 // 获取计算精度
        subtotal = rows.reduce((sum, item) => {
          const value = item[fieldName].val || 0
          return sum + Number(value)
        }, 0)
        subtotal = subtotal.toFixed(scale)
        result[fieldName] = subtotal
      })
      return result
    },

    // 处理合计行
    _dealWithSubTotalRow(subtotalRow) {
      const subtotalRowData = {};
      // 前端计算合计值
      this.columnApi.getAllColumns().forEach((d) => {
        const { colname } = d.colDef;
        subtotalRowData[colname] = { val: colname === 'ID' ? '合计' : (subtotalRow[colname] || '') };
      });
      subtotalRowData.__ag_is_statistic_row__ = true;
      subtotalRowData[AG_SEQUENCE_COLUMN_NAME] = {}
      subtotalRowData[AG_SEQUENCE_COLUMN_NAME].val = '合计'
      return subtotalRowData
    },

    // 处理deleteFailInfo
    _getFailIds() {
      const options = this.gridOptions;
      const failIds = [];
      if (options && options.datas && options.datas.deleteFailInfo && isArray(options.datas.deleteFailInfo)) {
        options.datas.deleteFailInfo.forEach((d) => {
          if (d.objid && d.objid !== '') {
            failIds.push(`${d.objid}`);
          }
        });
        return failIds;
      }
    },

    // 处理ag-body-viewport 横向滚动问题
    _horizontalScrollTo(element, scrollValue) {
      element.scrollLeft = parseFloat(scrollValue);
      this._autoSizeColumns()
    },

    // 重新表头位置。fix: 从别的界面返回表格界面时，表头会消失
    _resetHeaderPosition() {
      const agGridTableContainer = this.$refs.tableContainer
      const header = agGridTableContainer.querySelector('.ag-header-container')
      header.style.left = 0
    },

    // 调整列宽
    // 规则：1.所有列大于表格宽度时，此时用autoSizeAllColumns  2.所有列小于表格宽度时，此时用sizeColumnsToFit
    _autoSizeColumns() {
      const tableDom = this.$refs.table.$el
      const viewport = tableDom.querySelector('.ag-body-viewport') // 表格可视区,不含固定列
      const container = tableDom.querySelector('.ag-body-container') // 表格所有列的容器
      // if(!viewport || !container) {

      // }
      const viewportWidth = viewport.offsetWidth
      const containerWidth = container.offsetWidth

      if(containerWidth <= viewportWidth) {
        this.api.sizeColumnsToFit()
      } else {
        this.columnApi.autoSizeAllColumns()
      }
    },

    // 重新分配列宽
    _resetColumnWidth(callback) {
      // fix: 页面激活后或者数据更新后,列宽没有自动分配
      // 注意，这里不掉两次autoSizeAllColumns的话依然不能把列宽自动分配
      this._autoSizeColumns()
      setTimeout(() => {
        this._autoSizeColumns()
        callback && callback()
      }, 20)
    },
  },

  created() {
    this._zhColumnNameMap = {}; // 每列的中文字段名映射，形如{ '中文字段名': 'english_name' }
    this._colPosition = '' // 记录列的位置,用于排序
    this._originColumnDefs = null // 缓存传入的列数据,用于排序
    this._preventPinnedEmit = null
    this._isResetAllColumn = false // 是否重置所有列位置信息
    this._pinnedBottomRowData = null
    this._gridReady = false // 表格是否渲染完毕
  },

  mounted() {
    this.api = this.gridOptions.api
    this.columnApi = this.gridOptions.columnApi
  },

  activated() {
    this._resetColumnWidth(this._resetHeaderPosition)
  }
}
</script>

<style lang="scss" scoped>
.ag-grid-table-wrap {
  height: calc(100% - 65px);
  box-sizing: border-box;
  .ag-grid-table {
    height: 100%;
    width: 100%;
    margin: 0 auto;
    position: relative;
  }
}

.ag-border {
  border: 1px solid #d8d8d8;
}
</style>

<style lang="scss">
// 隐藏表格右侧多出的1像素宽度
.ag-bl-normal-east {
  display: none;
}

// 单元格垂直居中
.ag-grid-table-wrap {
  .ag-theme-balham .ag-cell {
    height: 100%;
    line-height: 28px;
  }
}

.ag-floating-filter-input {
  pointer-events:none;
}

.table-cell-left {
  text-align: left;
  vertical-align: middle;
}

.table-cell-center {
  text-align: center;
  vertical-align: middle;
}

.table-cell-right {
  text-align: right;
  vertical-align: middle;
}
</style>