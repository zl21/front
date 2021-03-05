/* eslint-disable */
import { Grid }  from 'ag-grid';
// import * as agGrid  from 'ag-grid';
// import 'ag-grid-enterprise/main';
import { LicenseManager } from 'ag-grid-enterprise/main';
import { agGridEnterpriseLicenseKey } from './constant';
import loadingSVG from '../image/loading.svg';
import { getKeepAliveModuleName } from '../../__config__/router.navigation.guard';
import store from '../../__config__/store.config';
import router from '../../__config__/router.config';
import createModal from '../../__component__/PreviewPicture/index.js';

// 设置enterprise key
// const { Grid, LicenseManager } = agGrid;
LicenseManager.setLicenseKey(agGridEnterpriseLicenseKey);
const cssFeatures = {
  hover: 'ag-syman-hover',
  imagePreviewBox: 'image-preview-box',
  tooltipBox: 'tooltip-box',
  tooltipTopBox: 'tooltip-top-box',
  textRight: 'text-right',
  attachment: 'attachment',
};

const AG_SEQUENCE_COLUMN_NAME = '__ag_sequence_column_name__';

const config = {
  smallImageSize: 20, // 图片缩略图最小尺寸
  previewImageSize: 150, // 图片预览图尺寸
};

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
};

// for image
const imageComponent = function () {
};

imageComponent.prototype.init = function (params) {
  const eGui = document.createElement('div');
  eGui.style.height = '100%';
  eGui.style.position = 'relative';
  this.eGui = eGui;
  let url = '';
  try {
    url = JSON.parse(params.value)[0].URL;
  } catch (e) {
    url = params.value;
  }
  const imgSmall = document.createElement('img');
  imgSmall.style.width = `${config.smallImageSize}px`;
  imgSmall.style.height = `${config.smallImageSize}px`;
  imgSmall.setAttribute('class', cssFeatures.hover);
  imgSmall.style.verticalAlign = 'middle';
  imgSmall.onmouseenter = function (e) {
    const { target } = e;
    const { agGridDiv, imagePreviewBox } = params;
    // 递归处理方式，这种方式不适用与ag-Grid中将某一列拖拽至最后一列的情况
    // let offsetLeft = 0;
    // const getOffsetLeftBaseRoot = (node) => {
    //   offsetLeft += node.offsetLeft;
    //   if (node.offsetParent && node.offsetParent !== agGridDiv) {
    //     getOffsetLeftBaseRoot(node.offsetParent);
    //   }
    // };
    // getOffsetLeftBaseRoot(target);
    const offsetLeft = target.getBoundingClientRect().left - agGridDiv.getBoundingClientRect().left;
    const offsetTop = target.getBoundingClientRect().top - agGridDiv.getBoundingClientRect().top;
    imagePreviewBox.childNodes[0].setAttribute('src', `${url}?x-oss-process=image/resize,w_${config.previewImageSize}`);
    imagePreviewBox.style.display = '';
    imagePreviewBox.style.opacity = 1;
    imagePreviewBox.style.left = `${offsetLeft + (config.smallImageSize * 2)}px`;
    imagePreviewBox.style.top = `${
      offsetTop - (config.previewImageSize - config.smallImageSize) / 2}px`;
  };
  imgSmall.onmouseleave = function () {
    const { imagePreviewBox } = params;
    imagePreviewBox.style.opacity = 0;
    imagePreviewBox.style.display = 'none';
  };
  if (params.value && url && url !== '') {
    imgSmall.setAttribute('src', `${url}?x-oss-process=image/resize,w_${config.smallImageSize}`);
    eGui.appendChild(imgSmall);
  }

  function isIE(){
    if (window.navigator.userAgent.indexOf("MSIE")>=1) 
    return true; 
    else
    return false; 
  }

  if(!isIE()){
    imgSmall.ondblclick = function (event) {
      let item = {
        field: `${params.column.colId}_${params.options.datas.row[params.rowIndex].ID.val}`
      }
      createModal(JSON.parse(params.value),item)
      event.stopPropagation();
      event.preventDefault()
    }
  }


};



imageComponent.prototype.getGui = function () {
  return this.eGui;
};

// for fk
const fkComponent = function () {
};

fkComponent.prototype.init = function (params) {
  const eGui = document.createElement('span');
  this.eGui = eGui;
  const { value } = params;
  // 设置fk icon 的样式
  const template = value !== null && value !== ''
    ? `<i class="iconfont ${cssFeatures.hover} iconbj_link" data-target-tag="fkIcon" style="color: #0f8ee9; font-size: 12px"></i> ${params.value || ''}`
    : '';

  if (params.data && params.data.ID.val !== '合计' && params.data.ID.val !== '总计') {
    // 当前模式如果为非分组模式，则判断当前行是否是“合计行”、“总计行”
    eGui.innerHTML = template;
  } else if (params.data && params.data.ID.val === '合计' || params.data.ID.val === '总计') {
    // 如果是fk 并且返回了总计行，则直接显示值
    eGui.innerHTML = params.value;
  } else if (params.columnApi.getRowGroupColumns().length !== 0) {
    // 当前模式如果为分组模式，则不考虑特殊情况，所有行正常渲染。
    eGui.innerHTML = template;
  }
};

fkComponent.prototype.getGui = function () {
  return this.eGui;
};

// for mopFkComponent
const mopFkComponent = function() {};

mopFkComponent.prototype.init = function(params) {
  const eGui = document.createElement('span');
  this.eGui = eGui;
  const { data, column } = params;
  const columnName = column.colId
  if (data[columnName] && data[columnName].refobjid) {
    try {
      // const info =  JSON.parse(data[columnName].refobjid);
      // eGui.innerHTML = info.lists.result.map(d => d.screen_string).toString();
      eGui.innerHTML = params.value;
    } catch (e) {
      eGui.innerHTML = params.value;
      console.error(e);
    }
  }
};

mopFkComponent.prototype.getGui = function() {
  return this.eGui;
};

// for attachment
const attachmentComponent = function () {
};

attachmentComponent.prototype.init = function (params) {
  const eGui = document.createElement('span');
  this.eGui = eGui;
  const { value } = params;
   // webconf配置docFile则走docFile配置程序，点击上传的文件取消下载功能，改为预览功能
   let getDocFileWebConfUrl = '';
   let getDocFileWebConf = false;
   const getCurrentKeepAliveModuleName=store.state[getKeepAliveModuleName(router.currentRoute)]
   if (getCurrentKeepAliveModuleName.webConf &&getCurrentKeepAliveModuleName.webConf.docFile&&getCurrentKeepAliveModuleName.webConf.docFile.isPreview) {
     getDocFileWebConf =getCurrentKeepAliveModuleName.webConf.docFile.isPreview;
     getDocFileWebConfUrl =getCurrentKeepAliveModuleName.webConf.docFile.url;
   }
  if (Object.prototype.toString.call(JSON.parse(value)) === '[object Array]') {
    if (getDocFileWebConf) {
      eGui.innerHTML = JSON.parse(value).map(d => `<span class="attachment-wrapper"><a class="attachment"   href="${getDocFileWebConfUrl}?url=${d.url || ''}" target="_blank"><i class="iconfont iconmd-document"></i> ${d.name} ${d.Size ? `(${d.Size})` : ''}</a></span>`).join(' ');

    }else{
      eGui.innerHTML = JSON.parse(value).map(d => `<span class="attachment-wrapper"><a class="attachment" href="${d.url || ''}"><i class="iconfont iconmd-document"></i> ${d.name} ${d.Size ? `(${d.Size})` : ''}</a></span>`).join(' ');

    }
  }
};

attachmentComponent.prototype.getGui = function () {
  return this.eGui;
};

// for customerurl
const customerUrlComponent = function () {
};

customerUrlComponent.prototype.init = function (params) {
  const eGui = document.createElement('span');
  this.eGui = eGui;
  const template = `<span class="${cssFeatures.hover}" style="text-decoration: underline; color: #0F8EE9; " data-target-tag="customerUrlText">${params.value || ''}</span>`;
  eGui.innerHTML = template;
};

customerUrlComponent.prototype.getGui = function () {
  return this.eGui;
};

// for sequence component 错误信息提示tooltip
const sequenceComponent = function () {
};

sequenceComponent.prototype.init = function (params) {
  const {
    agGridDiv, tooltipBox, options, value, failIds,
  } = params;
  const eGui = document.createElement('span');
  this.eGui = eGui;
  const valueOfId = params.data ? params.data.ID.val : '';
  const template = valueOfId === '合计' || valueOfId === '总计' ? valueOfId : `<span style="color: #0f8ee9" data-target-tag="rowIndex">${params.data[AG_SEQUENCE_COLUMN_NAME].val + parseInt(params.options.datas.start, 10)}</span>`;
  eGui.innerHTML = template;

  // for tooltip icon
  if (failIds && failIds.indexOf(`${value}`) > -1) {
    const toolTipIcon = document.createElement('i');
    toolTipIcon.setAttribute('class', `iconfont iconbj_listwarning ${cssFeatures.hover}`);
    toolTipIcon.style.color = 'red';
    // toolTipIcon.innerHTML = '&#xe61b;';
    toolTipIcon.onmouseenter = function (e) {
      const { target } = e;
      const offsetLeft = target.getBoundingClientRect().left - agGridDiv.getBoundingClientRect().left;
      const offsetTop = target.getBoundingClientRect().top - agGridDiv.getBoundingClientRect().top;
      const offsetBottom = agGridDiv.getBoundingClientRect().bottom - target.getBoundingClientRect().bottom;
      tooltipBox.style.display = '';
      tooltipBox.style.left = `${offsetLeft + 22}px`;
      tooltipBox.style.top = `${offsetTop - (target.offsetHeight / 2)}px`;
      if (options && options.datas && options.datas.deleteFailInfo && Object.prototype.toString.call(options.datas.deleteFailInfo) === '[object Array]') {
        tooltipBox.innerText = options.datas.deleteFailInfo[failIds.indexOf(value)].message;
      }
      const offsetBottomCalibration = tooltipBox.offsetHeight - offsetBottom - 12;
      if (offsetBottomCalibration > 0) {
        tooltipBox.style.top = `${(offsetTop - (target.offsetHeight / 2)) - (offsetBottomCalibration)}px`;
        const pseudoStyle = document.createElement('style');
        pseudoStyle.setAttribute('type', 'text/css');
        pseudoStyle.setAttribute('id', 'pseudoStyle');
        pseudoStyle.innerText = `
        .${cssFeatures.tooltipBox}::before {
            top: ${8 + (offsetBottomCalibration)}px !important;
        }`;
        document.head.appendChild(pseudoStyle);
      }
    };
    toolTipIcon.onmouseleave = function () {
      tooltipBox.style.display = 'none';
      const pseudoStyle = document.getElementById('pseudoStyle');
      if (pseudoStyle) {
        pseudoStyle.remove();
      }
    };
    eGui.appendChild(toolTipIcon);
  }
};

sequenceComponent.prototype.getGui = function () {
  return this.eGui;
};

// for header component
const customHeader = function () {
};

customHeader.prototype.init = function (params) {
  const {
    displayName, enableMenu, enableSorting, column, agGridDiv, tooltipTopBox,
  } = params;
  this.params = params;
  const eGui = document.createElement('div');
  this.eGui = eGui;
  eGui.setAttribute('class', 'ag-cell-label-container');
  eGui.innerHTML = `
    <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button" style="opacity: 0; ${enableMenu ? '' : 'display: none;'}} ">
      <span class="ag-icon ag-icon-menu"></span>
    </span>
    <div ref="eLabel" class="ag-header-cell-label" role="presentation" style="${enableMenu ? '' : 'width: 100%;'}">
        <span ref="eText" class="ag-header-cell-text" role="columnheader">
          ${params.column.colDef.comment ? `<i class="iconfont comment iconios-information-circle-outline ${cssFeatures.hover}" style="color: orangered"></i> ` : ''} ${displayName}
        </span>
        <span ref="eSortOrder" class="ag-header-icon ag-sort-order" ></span>
        <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon ${params.column.colDef.isorder && params.column.colDef.sort === 'asc' ? '' : 'ag-hidden'}" >
          <span class="ag-icon ag-icon-asc ${cssFeatures.hover} trigger-sorting"></span>
        </span>
        <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon ${params.column.colDef.isorder && params.column.colDef.sort === 'desc' ? '' : 'ag-hidden'}" >
          <span class="ag-icon ag-icon-desc ${cssFeatures.hover} trigger-sorting"></span>
        </span>
        <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon ${!params.column.colDef.sort && params.column.colDef.isorder ? '' : 'ag-hidden'}" >
          <span class="ag-icon ag-icon-none ${cssFeatures.hover} trigger-sorting"></span>
        </span>
    </div>
  `;
  this.eMenuButton = eGui.querySelector('.ag-header-cell-menu-button');
  this.eSortOrderAsc = eGui.querySelector('.ag-sort-ascending-icon');
  this.eSortOrderDesc = eGui.querySelector('.ag-sort-descending-icon');
  this.eSortNone = eGui.querySelector('.ag-sort-none-icon');
  this.eComment = eGui.querySelector('i.comment');
  if (this.eComment) {
    this.eComment.onmouseenter = (e) => {
      const { target } = e;
      const offsetLeft = target.getBoundingClientRect().left;
      const offsetTop = target.getBoundingClientRect().top;
      tooltipTopBox.innerText = column.colDef.comment;
      tooltipTopBox.style.display = '';
      tooltipTopBox.style.top = `${offsetTop - tooltipTopBox.offsetHeight - 7}px`;
      tooltipTopBox.style.left = `${offsetLeft - (tooltipTopBox.offsetWidth / 2)}px`;
    };
    this.eComment.onmouseleave = () => {
      tooltipTopBox.style.display = 'none';
    };
  }

  // 处理column menu:hover
  eGui.onmouseenter = () => {
    if (enableMenu) {
      this.eMenuButton.style.opacity = 1;
    }
  };
  eGui.onmouseleave = () => {
    this.eMenuButton.style.opacity = 0;
  };

  // 处理column menu
  if (enableMenu) {
    this.onMenuClickListener = this.onMenuClick.bind(this);
    this.eMenuButton.addEventListener('click', this.onMenuClickListener);
  }

  // 处理label click
  this.onHeaderClickListener = this.onHeaderClick.bind(this);
  eGui.addEventListener('click', this.onHeaderClickListener);

  // 处理排序信息
  if (enableSorting) {
    this.onSortChangeListener = this.onSortChanged.bind(this);
    column.addEventListener('sortChanged', this.onSortChangeListener);
  }
};

customHeader.prototype.onMenuClick = function () {
  this.params.showColumnMenu(this.eMenuButton);
};

customHeader.prototype.onHeaderClick = function (event) {
  if (this.params.column.colDef.isorder && event.target.getAttribute('class').indexOf('trigger-sorting') > -1) {
    this.params.progressSort(event.shiftKey);
  }
};

customHeader.prototype.onSortChanged = function () {
  const { column } = this.params;
  const { eSortOrderAsc, eSortOrderDesc, eSortNone } = this;
  const sortState = column.getSort();
  if (sortState === 'asc') {
    eSortOrderAsc.classList.remove('ag-hidden');
  } else {
    eSortOrderAsc.classList.add('ag-hidden');
  }

  if (sortState === 'desc') {
    eSortOrderDesc.classList.remove('ag-hidden');
  } else {
    eSortOrderDesc.classList.add('ag-hidden');
  }

  if (sortState === null && column.colDef.isorder) {
    // 只有当此列允许排序，并且当前排序模式为null时，则显示图标
    eSortNone.classList.remove('ag-hidden');
  } else {
    eSortNone.classList.add('ag-hidden');
  }
};

customHeader.prototype.getGui = function () {
  return this.eGui;
};

customHeader.prototype.destroy = function () {
  if (this.onMenuClickListener) {
    this.eMenuButton.removeEventListener('click', this.onMenuClickListener);
  }
  this.params.column.removeEventListener('sortChanged', this.onSortChangeListener);
  this.eGui.removeEventListener('click', this.onHeaderClickListener);
};

// 公共方法
const cleanChildNode = (node) => {
  // 清空agGridTableContainer
  while (node && node.firstChild) {
    node.removeChild(node.firstChild);
  }
};

const currencyFormat = (value, decimal) => {
  const arr = `${value}`.split('.');
  const num = decimal
    ? `${Number(arr[0]) >= 0 ? arr[0].replace(/(?=(?!^)(\d{3})+$)/g, ',') : `-${String(Math.abs(arr[0])).replace(/(?=(?!^)(\d{3})+$)/g, ',')}`}.${arr[1] || ''}`
    : `${Number(arr[0]) >= 0 ? arr[0].replace(/(?=(?!^)(\d{3})+$)/g, ',') : `-${String(Math.abs(arr[0])).replace(/(?=(?!^)(\d{3})+$)/g, ',')}`}`;
  /* 李斌改 */
  return parseFloat(num) === 0 ? 0 : num;
};

/**
 * @param container // 容器
 * @param opt // 配置项
 * @returns {function(*=, *=)} 函数
 */
const initializeAgTable = (container, opt) => {
  const agTable = (agGridTableContainer, options) => {
    agTable.fixContainerHeight = () => {
      const cssControl = true;
      if (cssControl) {
        agGridTableContainer.style.height = 'calc(100% - 65px)'
      } else {
        const queryDesc = document.querySelector('.queryDesc');
        if (queryDesc) {
          // 重置agGridTableContainer高度
          agGridTableContainer.style.height = `${document.body.clientHeight - agGridTableContainer.getBoundingClientRect().top - queryDesc.offsetHeight - 20}px`;
        }
      }
    };
    agTable.customizeOptions = options;
    let isResetAllColumn = false;
    let updateColumnPositionDelay = -1; // column move 延迟计时器
    let updateColumnVisibleDelay = -1; // column visible 延迟计时器
    let updateBodyScrollDelay = -1; // 横向滚动延迟计时器
    if (!(agGridTableContainer instanceof HTMLElement)) {
      console.log('agGridTableContainer is not a HTMLElement: agGridTableContainer = ', agGridTableContainer);
      agTable.containerIsNull = true;
      return agTable;
    }
    agTable.containerIsNull = false;
    window.onresize = function () {
      agTable.fixContainerHeight();
    };

    // 判断agGridTableContainer是否已经被ag实例化
    if (agGridTableContainer.agTable) {
      agGridTableContainer.agTable.customizeOptions = Object.assign(agGridTableContainer.agTable.customizeOptions || {}, options || {});
      return agGridTableContainer.agTable;
    }

    cleanChildNode(agGridTableContainer); // 清空agGridTableContainer节点

    // 处理deleteFailInfo
    const getFailIds = () => {
      const options = agTable.customizeOptions;
      const failIds = [];
      if (options && options.datas && options.datas.deleteFailInfo && Object.prototype.toString.call(options.datas.deleteFailInfo) === '[object Array]') {
        options.datas.deleteFailInfo.forEach((d) => {
          if (d.objid && d.objid !== '') {
            failIds.push(`${d.objid}`);
          }
        });
        return failIds;
      }
    };

    const zhColumnNameMap = {}; // 每列的中文字段名映射，形如{ '中文字段名': 'english_name' }
    const agGridDiv = document.createElement('div');

    // 图片预览框
    const imagePreviewBox = document.createElement('div');
    imagePreviewBox.innerHTML = '<img alt="" style="width: 100%; height: 100%" />';
    imagePreviewBox.classList.add(cssFeatures.imagePreviewBox);

    // 自定义tooltip
    const tooltipBox = document.createElement('div');
    tooltipBox.classList.add(cssFeatures.tooltipBox);

    // 自定义toolTipTop
    const tooltipTopBox = document.createElement('div');
    tooltipTopBox.classList.add(cssFeatures.tooltipTopBox);
    tooltipTopBox.classList.add('arrow-down');
    tooltipTopBox.style.display = 'none';

    agGridDiv.style.width = '100%';
    // agGridDiv.style.height = `${agGridTableContainer.offsetHeight}px`;
    agGridDiv.style.height = '100%';
    agGridDiv.style.margin = '0 auto';
    agGridDiv.style.position = 'relative';
    agGridDiv.classList.add('ag-theme-balham');
    agGridDiv.classList.add('fc-ag-table-container');
    agGridTableContainer.appendChild(agGridDiv);
    // 设置通用样式
    // agGridDiv.appendChild(setCommonStyles(agTable.customizeOptions));

    // 列组件筛选器
    const componentPicker = (columnItem) => {
      if (columnItem.display === 'doc') {
        return 'attachmentComponent';
      }
      if (columnItem.colname === 'ID') {
        return 'sequenceComponent';
      }
      if (columnItem.customerurl) {
        return 'customerUrlComponent';
      }
      if (columnItem.isfk) {
        if (columnItem.fkdisplay === 'mop') {

          return 'mopFkComponent';
        } else if(columnItem.fkdisplay === 'drp' || columnItem.fkdisplay === 'pop') {
          return 'fkComponent';
        }
      }
      if (columnItem.display === 'image') {
        return 'imageComponent';
      }
      // 默认返回字符串的时候，要判断其字符长度
      return function (params) {
        if (params.colDef.type.toLocaleLowerCase() === 'string' && params.value && params.value.length > 1000) {
          return `${params.value.substring(0, 50)}...`;
        }
        return params.value;
      };
    };

    const getPinnedState = (colId) => {
      const { pinnedLeft, pinnedRight } = JSON.parse(decodeURI(agGridTableContainer.getAttribute('data-pinned-status'))) || {
        pinnedLeft: [],
        pinnedRight: [],
      };
      if (pinnedLeft.indexOf(colId) > -1) {
        return 'left';
      } if (pinnedRight.indexOf(colId) > -1) {
        return 'right';
      }
      return null;
    };

    // 处理列数据
    const transformColumnDefs = (data) => {
      const options = agTable.customizeOptions;
      let hideColumn = [];
      if (options && options.datas && options.datas.hideColumn) {
        hideColumn = [].concat(options.datas.hideColumn.split(','));
      }

      // ---------- 处理默认排序 ---------------
      const defaultSortKeyMap = {};
      if (options && options.datas && options.datas.ordids && Object.prototype.toString.call(options.datas.ordids) === '[object Array]') {
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

      return data.map((d) => {
        if (d.colname === 'headerName') {
          alert('headerName : 列名冲突');
        }
        if (d.colname === 'field') {
          alert('field : 列名冲突');
        }
        const item = JSON.parse(decodeURI(encodeURI(JSON.stringify(d))));
        item.headerName = d.colname === 'ID' ? '序号' : d.name || '未定义';
        item.lockVisible = d.colname === 'ID'; // 锁定序号列的隐藏功能
        item.suppressToolPanel = d.colname === 'ID'; // 锁定ID列工具栏操作能力
        item.pinned = d.colname === 'ID' ? 'left' : getPinnedState(d.colname);
        item.maxWidth = d.colname === 'ID' ? 80 : null; // 为ID列预设最大宽度
        item.suppressResize = d.colname === 'ID'; // 禁止拖动ID列边缘以改变其列宽
        item.suppressMovable = d.colname === 'ID'; // 禁用ID列拖拽
        item.lockPinned = true; // 锁定序号列的pinned功能
        item.lockPosition = d.colanme === 'ID'; //  锁定ID列的位置
        item.headerComponent = options && options.useDefaultHeader ? null : 'customHeader'; // 如果外界传值useDefaultHeader = true，则不适用headerComponent
        item.headerComponentParams = { agGridDiv, tooltipBox, tooltipTopBox };
        item.field = `${d.colname}.val`; // 参与显示和计算的列值
        item.colId = d.colname; // 每一列的ID，默认和item.field一致。
        item.sort = defaultSortKeyMap[d.colname]; // 设置默认排序列
        item.suppressFilter = !d.isagfilter; // 根据d.isfilter 判断是否需要禁用浮动框
        item.cellRenderer = componentPicker(item);
        item.cellRendererParams = {
          agGridDiv,
          imagePreviewBox,
          options,
          tooltipBox,
          tooltipTopBox,
          failIds: getFailIds(),
        }; // 在cell rendering 中自定义一个agGridDiv 用于以后的寻根定位
        item.sortingOrder = item.isorder ? ['asc', 'desc'] : [null]; // 处理每列默认的单击后的排序顺序
        item.unSortIcon = item.isorder; // 设置未排序图表Icon
        item.hide = hideColumn.indexOf(item.colname) > -1;
        item.suppressMenu = d.colname === 'ID'; // 是否禁用每一列的菜单选择
        // if (d.agfilter === 'FUZZY') {
        //   item.filter = 'agTextColumnFilter';
        // }
        item.checkboxSelection = d.colname === 'ID' ? function (params) {
          return params.columnApi.getRowGroupColumns().length === 0 && params.data.ID.val !== '合计' && params.data.ID.val !== '总计';
        } : null;
        item.headerCheckboxSelection = d.colname === 'ID' ? function (params) {
          return params.columnApi.getRowGroupColumns().length === 0;
        } : null;
        item.headerCheckboxSelectionFilteredOnly = d.colname === 'ID';
        item.cellClass = function (params) {
          const { colDef } = params;
          const { display, type, colId } = colDef;
          if (colId !== 'ID' && display.toLowerCase() === 'text' && type.toLowerCase() === 'number') {
            return cssFeatures.textRight;
          }
          return null;
        }; // 所有type=Number, display=text 的列，居右侧显示其数值
        // 最后处理zhColumnNameMap
        zhColumnNameMap[item.headerName] = d.colname;
        return item;
      });
    };

    const dealWithFullRangeSubTotalRow = (fullRangeSubTotalRow) => {
      const fullRangeSubTotalRowData = {};
      columnApi.getAllColumns().forEach((d) => {
        const { colname } = d.colDef;
        fullRangeSubTotalRowData[colname] = { val: colname === 'ID' ? '总计' : fullRangeSubTotalRow[colname] ? fullRangeSubTotalRow[colname].val : '' };
      });
      if (JSON.stringify(fullRangeSubTotalRow) !== '{}') {
        fullRangeSubTotalRowData.__ag_is_statistic_row__ = true;
      }
      return fullRangeSubTotalRowData;
    };

    // 处理行数据
    const transformRowData = (data) => {
      const options = agTable.customizeOptions;
      const { ids } = options.datas;
      const keySetOfIdSequence = {};
      let rowData = [];
      if (Object.prototype.toString.call(ids) === '[object Array]' && ids.length > 0) {
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
      if (options.datas) {
        const { datas } = options;
        fullRangeSubTotalRow = datas.fullRangeSubTotalRow;
        isFullRangeSubTotalEnabled = datas.isFullRangeSubTotalEnabled;
        isSubTotalEnabled = datas.isSubTotalEnabled;
      }

      // 计算合计值
      if (isSubTotalEnabled) {
        const subtotalRowData = {};

        // 前端计算合计值
        const sumField = [];
        columnApi.getAllColumns().forEach((d) => {
          subtotalRowData[d.colDef.colname] = { val: '' };
          if (d.colDef.issubtotal) {
            sumField.push(d.colDef.colname);
          }
        });
        sumField.forEach((field) => {
          // subtotalRowData[field].val = data.reduce((sum, row) => sum + (parseFloat(`${row[field].val}`.replace(/\,/g, '')) || 0), 0);
          subtotalRowData[field].val = options.datas.subtotalRow[field]  //获取后端返回数据
          let scale = 0;
          columnApi.getAllColumns().some((d) => {
            if (d.colId === field) {
              scale = d.colDef.scale || 0;
              return true;
            }
            return false;
          });
          // subtotalRowData[field].val = currencyFormat(subtotalRowData[field].val.toFixed(scale), scale !== 0);
          subtotalRowData[field].val = subtotalRowData[field].val
        });
        subtotalRowData.ID.val = '合计';
        subtotalRowData.__ag_is_statistic_row__ = true;
        console.log(subtotalRowData)
        pinnedBottomRowData.push(subtotalRowData);
      }

      // 计算总计值
      if (isFullRangeSubTotalEnabled && fullRangeSubTotalRow) {
        pinnedBottomRowData.push(dealWithFullRangeSubTotalRow(fullRangeSubTotalRow));
      }

      return { rowData, pinnedBottomRowData };
    };

    // 处理ag-body-viewport 横向滚动问题
    const horizontalScrollTo = function (element, scrollValue) {
      element.scrollLeft = parseFloat(scrollValue);
      columnApi.autoSizeAllColumns();
    };

    const initGridOptions = () => {
      const options = agTable.customizeOptions;
      console.log(options)
      return {
        columnDefs: options && options.columnDefs ? options.columnDefs : [], // 列定义
        rowData: options && options.rowData ? options.rowData : [], // 行数据
        multiSortKey: 'ctrl', // 多列排序组合键（按下ctrl + 鼠标点击某一列）
        animateRows: true, // 显示row动画
        pagination: options && options.pagination !== undefined ? options.pagination : false, // 是否启用分页
        paginationPageSize: options && options.paginationPageSize ? options.paginationPageSize : 10, // 分页状态下，默认每页显示条目
        enableColResize: options && options.enableColResize !== undefined ? options.enableColResize : true, // 允许用户调整列宽
        enableSorting: options && options.enableSorting !== undefined ? options.enableSorting : true, // 允许按照列值排序
        suppressAutoSize: options && options.suppressAutoSize !== undefined ? options.suppressAutoSize : false, // 禁止双击某列边缘进行当前列宽自适应
        enableFilter: options && options.enableFilter !== undefined ? options.enableFilter : true, // 是否允许过滤
        toolPanelSuppressSideButtons: options && options.toolPanelSuppressSideButtons !== undefined ? options.toolPanelSuppressSideButtons : true,
        enableStatusBar: options && options.enableStatusBar !== undefined ? options.enableStatusBar : true, // 当用户在视图区进行区域选择的时候，是否显示所有可计算数据的[平均、求和、计数、最大、最小]等值
        enableRangeSelection: options && options.enableRangeSelection !== undefined ? options.enableRangeSelection : false, // 是否允许进行单元格区域选择
        rowSelection: 'multiple', // 行选择模式
        suppressRowClickSelection: true, // 禁用单击事件选中行
        rowDeselection: options && options.rowDeselection !== undefined ? options.rowDeselection : false, // 是否允许按住ctrl + click 取消选中某个已经选中的行
        quickFilterText: null,
        groupSelectsChildren: options && options.groupSelectsChildren !== undefined ? options.groupSelectsChildren : false, // 当进行分组的时候，控制选择分组的行为，是否连带其children一起选中
        defaultColDef: {
          // minWidth: options && options.minWidth ? options.minWidth : 100,
          comparator: options && options.sortByLocal ? null : function () {
            return 0;
          },
          enableRowGroup: true,
          enablePivot: true,
          enableValue: true,
        }, // 默认列配置
        enableCellChangeFlash: true,
        floatingFilter: options.floatingFilter , // 是否显表头下方的浮动筛选框
        rowDragManaged: true,
        rowGroupPanelShow: options && options.rowGroupPanelShow ? options.rowGroupPanelShow : 'onlyWhenGrouping', // 是否显最顶部的group panel
        rowBuffer: 10,
        enterMovesDownAfterEdit: true,
        enterMovesDown: true,
        localeText,
        groupDefaultExpanded: 1,
        domLayout: null,
        groupMultiAutoColumn: true, // 分组时，显示分组原字段
        components: {
          imageComponent,
          fkComponent,
          mopFkComponent,
          customerUrlComponent,
          sequenceComponent,
          customHeader,
          attachmentComponent,
        },
        columnTypes: {
          // 防止后台api返回的colDef中有type，会引起columnType警告
          NUMBER: {},
          STRING: {},
        },
        overlayLoadingTemplate: `<img src="${loadingSVG}" />`,
        getContextMenuItems(param) {
          return [
            'copy',
            'copyWithHeaders',
            'paste',
            // 'export',
            {
              name: '显示所有列',
              action() {
                if (typeof options.onColumnVisibleChanged === 'function') {
                  param.columnApi.resetColumnState();
                  // 将所有隐藏列都显示出来
                  param.columnApi.setColumnsVisible(param.columnApi.getColumnState().map(d => d.colId), true);
                  setTimeout(() => {
                    clearTimeout(updateColumnVisibleDelay);
                  }, 0);
                  // 处理列排序问题。
                  if (agTable.colPosition && agTable.colPosition !== '') {
                    agTable.colPosition.split(',').forEach((d, i) => {
                      param.columnApi.moveColumn(d, i);
                    });
                    setTimeout(() => {
                      clearTimeout(updateColumnPositionDelay);
                    }, 0);
                  }
                  // 向后台发送API，清除所有隐藏列
                  options.onColumnVisibleChanged('');
                  agTable.preventPinnedEmit = true;
                  agTable.dealWithPinnedColumns();
                  setTimeout(function() {
                    agTable.preventPinnedEmit = false;
                  }, 100);
                }
              },
            },
          ];
        }, // 表体右击菜单
        getMainMenuItems(params) {
          return [
            'pinSubMenu',
            'separator',
            'autoSizeThis',
            'autoSizeAll',
            'separator',
            {
              name: '重置所有列位置信息',
              action() {
                isResetAllColumn = true;
                if (typeof options.onColumnMoved === 'function') {
                  const visibleColumns = [];
                  agTable.originColumnDefs.map(d => d.colname).forEach((d) => {
                    if (params.columnApi.getColumn(d).visible) {
                      visibleColumns.push(d);
                    }
                  });
                  visibleColumns.forEach((d, i) => {
                    params.columnApi.moveColumn(d, i);
                  });
                  ((params.columnApi.getDisplayedLeftColumns().map(d => d.colId))
                    .concat(params.columnApi.getDisplayedRightColumns().map(d => d.colId)))
                    .forEach((colId) => {
                      if (colId !== 'ID') {
                        params.columnApi.setColumnPinned(colId, false);
                      }
                    });
                  setTimeout(() => {
                    clearTimeout(updateColumnPositionDelay);
                  }, 0);
                  options.onColumnMoved('');
                  agTable.colPosition = '';
                }
                if (typeof options.onColumnPinned === 'function') {
                  options.onColumnPinned('ID|')
                }
                setTimeout(() => {
                  isResetAllColumn = false;
                }, 500);
              },
            },
          ];
        }, // 设置每列的general menu item
        onCellClicked(params) {
          const { colDef, data, event } = params;
          const { __ag_is_statistic_row__ } = data;
          if (typeof options.cellSingleClick === 'function' && !__ag_is_statistic_row__) {
            options.cellSingleClick(colDef, data, event.target);
          }
        }, // 单元格单击
        onCellDoubleClicked(params) {
          const { colDef, data, event } = params;
          const { __ag_is_statistic_row__ } = data;
          if (typeof options.cellSingleClick === 'function' && !__ag_is_statistic_row__) {
            options.cellDoubleClick(colDef, data, event.target);
          }
        }, // 单元格双击
        onRowClicked(params) {
          const { colDef, data, event } = params;
          const { __ag_is_statistic_row__ } = data;
          if (typeof options.rowSingleClick === 'function' && !__ag_is_statistic_row__) {
            options.rowSingleClick(colDef, data, event.target);
          }
        }, // 行单击,
        onRowDoubleClicked(params) {
          const { colDef, data, event } = params;
          const { __ag_is_statistic_row__ } = data;
          if (typeof options.rowDoubleClick === 'function' && !__ag_is_statistic_row__) {
            options.rowDoubleClick(colDef, data, event.target);
          }
        }, // 行双击
        onSelectionChanged(params) {
          if (typeof options.onSelectionChanged === 'function') {
            const ids = [];
            const rows = [];
            params.api.getSelectedRows().forEach((d) => {
              const { val } = d.ID;
              if (val !== '合计' && val !== '总计') {
                ids.push(val);
                rows.push(d);
              }
            });
            options.onSelectionChanged(ids, rows);
          }
        }, // 行选中事件
        onSortChanged(params) {
          const { api } = params;
          if (typeof options.onSortChanged === 'function') {
            if (api.getSortModel().length !== 0) {
              api.showLoadingOverlay();
              options.onSortChanged(api.getSortModel());
            }
          }
        }, // 响应排序事件
        onGridReady(params) {
          const { columnApi } = params;
          // 自适应所有列
          horizontalScrollTo(agGridDiv.querySelector('.ag-body-viewport'), agGridTableContainer.getAttribute('data-scroll-left')); // 处理表体的横向滚动问题。
          columnApi.autoSizeAllColumns();
          agGridDiv.appendChild(imagePreviewBox);
          agGridDiv.appendChild(tooltipBox);
          document.body.appendChild(tooltipTopBox);
          // 移除ag-tool-panel
          agGridDiv.querySelector('.ag-tool-panel').remove();
          agTable.dealWithPinnedColumns(true);
        }, // 当表格渲染好之后，触发onGridReady
        // onBodyScroll(params) {
        //   const { columnApi, direction } = params;
        //   clearTimeout(updateBodyScrollDelay);
        //   if (direction === 'horizontal') {
        //     updateBodyScrollDelay = setTimeout(() => {
        //       columnApi.autoSizeAllColumns();
        //     }, 10); // 当检测到滚动条为横向滚动时，自适应当前视口范围内的所有列
        //   }
        //   agGridTableContainer.setAttribute('data-scroll-left', params.left);
        // }, // 当表体发生滚动时候触发该事件
        onVirtualColumnsChanged(params) {
          // const allVirtualCols = params.columnApi.getAllDisplayedVirtualColumns();
          // const currentLastVirtualColumn = allVirtualCols[allVirtualCols.length - 1].colId;
          // agGridTableContainer.setAttribute('data-last-virtual-column', currentLastVirtualColumn);
        }, // 当列很多时，如果用户横向拉动混动条以查看其它不在视口区域的列，则会触发此事件
        onColumnVisible(params) {
          clearTimeout(updateColumnVisibleDelay);
          updateColumnVisibleDelay = setTimeout(() => {
            if (typeof options.onColumnVisibleChanged === 'function') {
              const hideColumns = [];
              params.columnApi.getColumnState().forEach((d) => {
                if (d.hide) {
                  hideColumns.push(d.colId);
                }
              });
              options.onColumnVisibleChanged(hideColumns.toString());
            }
          }, 10);
        }, // 显示或者隐藏列的监听
        onColumnMoved(param) {
          // if (param.columns.length > 0) {
          //   if(param.columns[0].pinned===null||param.columns[0].pinned===undefined){
          const { columnApi } = param;
          clearTimeout(updateColumnPositionDelay);
          updateColumnPositionDelay = setTimeout(() => {
            if (typeof options.onColumnMoved === 'function') {
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
              agTable.colPosition = ['ID'].concat(orderedColumns).toString();
              options.onColumnMoved(['ID'].concat(orderedColumns).toString());
            }
          }, 500);
          // } else {
          //   this.onColumnPinned(param)
          // }
          // }
        },
        onColumnPinned(params) {
          const pinnedLeft = params.columnApi.getDisplayedLeftColumns().map(d => d.colId);
          const pinnedRight = params.columnApi.getDisplayedRightColumns().map(d => d.colId);
          agGridTableContainer.setAttribute('data-pinned-status', encodeURI(JSON.stringify({
            pinnedLeft,
            pinnedRight,
          })));

          //  取消固定列的时候将该固定放到固定位置
          if (typeof options.onColumnPinned === 'function') {
            if (!isResetAllColumn) {
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
                // options.onColumnMoved(orderedColumns.concat([params.column.colId]).toString());

                //  取消固定列的时候将该列移动到所有列的列首
                agTable.colPosition = ['ID'].concat([params.column.colId].concat(orderedColumns)).toString();
                setTimeout(() => {
                  agTable.colPosition.split(',').forEach((d, i) => {
                    params.columnApi.moveColumn(d, i);
                  });
                }, 48);
                options.onColumnMoved(['ID'].concat([params.column.colId].concat(orderedColumns)).toString());
              }
            }

            //  将固定列保存到数据库
            const pinnedPosition = `${pinnedLeft.join(',')}|${pinnedRight.join(',')}`;
            if (!agTable.preventPinnedEmit) {
              options.onColumnPinned(pinnedPosition);
            }
          }
        },
        getRowClass(params) {
          let className = '';
          const { data } = params;
          if (options.cssStatus) {
            options.cssStatus.forEach((d) => {
              if (data && zhColumnNameMap[d.desc]) {
                const columnName = zhColumnNameMap[d.desc]; // 与d.desc所述中文字段相匹配的英文字段名
                const columnValueOfCurrentRow = data[columnName].val; // 与d.desc所述中文字段相匹配的当前行的columnName的取值
                className += `${d.css[d.value.indexOf(columnValueOfCurrentRow)] || ''} ` || ' ';
              }
            });
          }
          return className;
        }, // 处理行级样式
      };
    };

    const gridOptions = initGridOptions();

    // 初始化ag grid
    new Grid(agGridDiv, gridOptions);

    const { api, columnApi } = gridOptions;
    agTable.api = api;
    agTable.columnApi = columnApi;

    // 清空数据
    agTable.cleanRows = () => {
      api.setRowData([]);
    };

    agTable.emptyAllFilters = () => {
      api.setFilterModel(null);
      if (agGridTableContainer) {
        agGridTableContainer.querySelectorAll('.ag-floating-filter-input').forEach(e => { e.value = '' })
      }
    };

    // 设置columnDefs
    agTable.setCols = (data) => {
      agTable.colPosition = '';
      const options = agTable.customizeOptions;
      if (!data) {
        return agTable;
      } // 如果未传参，则返回。
      agTable.originColumnDefs = data;
      if (!(Object.prototype.toString.call(data) === '[object Array]')) {
        alert('agTable.setCols requires Array as first param');
        return agTable;
      }

      // 移动列的顺序
      const { colPosition } = options.datas;
      if (colPosition && colPosition !== '') {
        // 初始化的时候，记录colPosition，以便点击“显示所有列”按钮时，可以还原已经排序列的顺序
        agTable.colPosition = colPosition;
        const positionColumns = colPosition.split(',');
        const columnMap = {};
        const visibleColumns = [];   // 不可见列
        const unVisibleColumns = [];  // 可见列

        data.forEach((d) => {
          columnMap[d.colname] = d;
          if (positionColumns.indexOf(d.colname) === -1) {
            unVisibleColumns.push(d);
          }
        });

        positionColumns.forEach((columnName) => {
          if (columnMap[columnName]) {
            visibleColumns.push(columnMap[columnName]);
          }
        });

        // console.table(positionColumns.map(colname => ({ name: columnMap[colname].name, colname })));
        // console.table(visibleColumns.map(d => ({ name: d.name, colname: d.colname })));
        // console.table(unVisibleColumns.map(d => ({ name: d.name, colname: d.colname })));

        api.setColumnDefs(transformColumnDefs(visibleColumns.concat(unVisibleColumns)));
      } else {
        api.setColumnDefs(transformColumnDefs(data));
      }

      // 自适应所有列宽
      columnApi.autoSizeAllColumns();
      return agTable;
    };

    // 处理pinned columns
    agTable.dealWithPinnedColumns = (preventPinnedEmit, fixedColumns) => {
      if (preventPinnedEmit) {
        agTable.preventPinnedEmit = true;
        setTimeout(() => {
          agTable.preventPinnedEmit = false;
        }, 400);
      }
      const options = agTable.customizeOptions;
      const pinnedPosition = fixedColumns || options.datas.pinnedPosition;
      if (pinnedPosition !== null && pinnedPosition !== undefined) {
        const pinnedColumns = pinnedPosition.split('|');
        const pinnedLeftColumns = pinnedColumns[0].split(',');
        if (pinnedColumns[1] != null) {
          const pinnedRightColumns = pinnedColumns[1].split(',');
          columnApi.setColumnsPinned(pinnedRightColumns, 'right');
        }
        columnApi.setColumnsPinned(pinnedLeftColumns, 'left');
      }
    };

    // 设置rowData
    agTable.setRows = (data) => {
      if (!data) {
        return agTable;
      } // 如果未传参，则返回。
      if (!(Object.prototype.toString.call(data) === '[object Array]')) {
        alert('agTable.setRows requires Array as first param');
        return agTable;
      }
      const { rowData, pinnedBottomRowData } = transformRowData(data);
      // 为每行增加序号值
      rowData.forEach((d, i) => {
        d[AG_SEQUENCE_COLUMN_NAME] = { val: i + 1 };
      });
      agTable.pinnedBottomRowData = pinnedBottomRowData;
      api.setRowData(rowData);
      api.setPinnedBottomRowData(pinnedBottomRowData);
      api.hideOverlay();
      agTable.fixAgRenderChoke();
      return agTable;
    };

    // 设置显示和隐藏列
    agTable.setHiddenCols = (colString) => {
      columnApi.setColumnsVisible(colString.split(','), false);
      return agTable;
    };

    // 设置默认排序规则
    agTable.setSortModel = (data) => {
      if (!data) {
        return agTable;
      } // 如果未传参，则返回。
      // data: [{ colId: 'IMAGE', sort: 'asc' }]
      if (!(Object.prototype.toString.call(data) === '[object Array]')) {
        alert('agTable.setSortModel requires Array as first param');
        return agTable;
      }
      api.setSortModel(data);
    };

    // 暴露纵向滚动方法
    agTable.fixAgRenderChoke = () => {
      const viewport = document.querySelector('.ag-body-viewport');
      if (viewport) {
        const currentViewPortScrollLeft = viewport.scrollLeft;
        viewport.scrollTop = 5;
        viewport.scrollLeft = 1;
        setTimeout(() => {
          viewport.scrollTop = 0;
          viewport.scrollLeft = currentViewPortScrollLeft || 0;
          columnApi.autoSizeAllColumns();
        }, 50);
      }
      return agTable;
    };
    
    // 清空选中所有列
    agTable.deselectAll = () => {
      api.deselectAll();
    };

    // 暴露ag showOverlay方法
    agTable.showLoading = () => {
      api.clearFocusedCell(); // 清楚选中单元格
      columnApi.autoSizeAllColumns();
      api.showLoadingOverlay();
      return agTable;
    };

    // 暴露ag hideOverlay方法
    agTable.hideLoading = () => {
      api.hideOverlay();
      return agTable;
    };

    // 暴露销毁方法，释放内存
    agTable.destroy = () => {
      api.destroy();
      return agTable;
    };

    // 暴露设置fullRangeSubTotalRow的方法
    agTable.setFullRangeSubTotalRow = (data) => {
      const { pinnedBottomRowData } = agTable;
      api.setPinnedBottomRowData(pinnedBottomRowData.concat([dealWithFullRangeSubTotalRow(data)]));
    };

    agGridTableContainer.agTable = agTable;

    return agTable;
  };
  return agTable(container, opt);
};

export default initializeAgTable;
