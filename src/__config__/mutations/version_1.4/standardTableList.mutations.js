
import { getSeesionObject } from '../../../__utils__/sessionStorage';
import router from '../../router.config';
import store from '../../store.config';

export default {

  updateFailInfo({ ag }, failInfo) {
    ag.datas.deleteFailInfo = failInfo;
    ag.datas = Object.assign({}, ag.datas);
  },
  updateTableDataWithMerge({ ag }, data) {
    ag.datas = Object.assign({}, ag.datas);
  },
  updateTableData({
    ag
  }, data) {
    ag.datas = data;
  },
  updateTableStatus4css({
    ag
  }, data) {
    if (data && data.tableurl) {
      ag.tableurl = data.tableurl;
    }
    ag.status4css = data.status4css;
  },
  // setAgTableErrorMessage({ ag }, errorData) { // ag iconfont
  //   ag.datas.deleteFailInfo = Object.assign({}, ag.datas.deleteFailInfo, errorData);
  //   console.log( ag.datas.deleteFailInfo )
  // },

  // 表单
  async updateDefaultFormItemsLists({ formItems, userInfo }, data) {
    const { tableId } = router.currentRoute.params;

    const getSTDefaultQuery = getSeesionObject(tableId);
    if (data && data.length > 0 && getSTDefaultQuery && getSTDefaultQuery.length > 0) {
      getSTDefaultQuery.map((c) => {
        data.map((d) => {
          if (Number(c.colid) === Number(d.colid)) {
            d.default = c.defaultValue;
            if (c.display && c.display === 'OBJ_FK') { // 如果是外键类型，需要配置refobjid
              d.refobjid = c.refobjid;
            }
          }
        });
      });
    }
    
    formItems.defaultFormItemsLists = data;
  },
  updateFormData({
    formItems
  }, data) {
    formItems.data = data;
  },
  updateDefaultSearchFoldnum({ formItems }, data) {
    formItems.searchFoldnum = data;
  },
  

  // 按钮组
  updatestopOnRowDoubleClickData({
    buttons
  }, data) {
    buttons.onRowDoubleClick = data;
  },
  
  updateButtonsTabcmd({
    buttons
  }, data) {
    buttons.tabcmd = data;
  },

  updataIsBig({ buttons }, value) {
    buttons.isBig = value; // 更新是否为海量表
  },
  updateButtonWaListButtons({ buttons }, data) { // 获取静默类型的按钮数据
    if (data) {
      data.forEach((item, index) => {
        if (item.ishide) {
          data.splice(index);
        }
        buttons.isrefrsh = item.isrefrsh;
      });
    }
   
    buttons.dataArray.waListButtonsConfig.waListButtons = data;
  },
  collectTablelist({ buttons }) { // 判断页面加载时收藏按钮状态
    const tableName = this.state.global.activeTab.tableName;
    const favorite = this.state.global.favorite;
    favorite.forEach((element) => {
      if (element.value === tableName) {
        buttons.dataArray.collectiImg = true;
      }
    });
  },
  updateDefaultButtonsdatas({
    buttons
  }, data) {
    buttons.isBig = data.isbig; // 是否为海量表
    buttons.isBigStatus = data.isbig; // 用于判断海量状态
    buttons.isSolr = data.isolr; // 是否获取合计
    buttons.showBigDefaultIcon = data.isbig;
    buttons.tabledesc = buttons.tabcmd.desc;
    buttons.tableId = data.tableid;
    buttons.tableName = data.table;
    // 双击条状判断
    buttons.objTableUrl = data.tableurl;
  },
  updataSelectIdArr({ buttons }, id) {
    buttons.selectIdArr.push(id);
  },
  setActiveTabActionValue({
    buttons
  }, obj) {
    buttons.activeTabAction = obj;
  },
  updateButtonExeActionData({ buttons }, message) {
    buttons.ExeActionData = message;
  },
  updateButtonGetActionData({ buttons }, data) {
    buttons.ExeActionDataForComponent = data;
  },
  updateButtonSetFavoriteData({ buttons }, data) { // 收藏
    if (data.code === 0) {
      buttons.dataArray.collectiImg = !buttons.dataArray.collectiImg;
      this.state.global.favorite = data.data;
    }
  },
  setPrintValueForButtons({ buttons }, value) { // 控制打印按钮开关
    buttons.dataArray.printValue = value;
  },
  updateDefaultButtonGroupData({ buttons }, data) {
    buttons.dataArray.buttonGroupShowConfig.buttonGroupShow = data;
  },
  onSelectionChangedAssignment({ buttons }, { rowIdArray, rowArray }) {
    buttons.selectIdArr = rowIdArray;
    buttons.selectArr = rowArray;
  },
  setImportDialogTitle({ buttons }, value) { // 导出操作
    buttons.importData.importDialog = value;
    buttons.importData.importDialogTitle = this.state.global.activeTab.label;
  },
  closeImportDialog({ buttons }) { // 导出操作
    buttons.importData.importDialog = false;
  },
  updateButtonImportGetUploadParameters({ buttons }, data) { // 获取导入上传参数
    buttons.importParameters = data;
  },
  updateButtonDownloadImportTemplate({ buttons }, data) {
    buttons.importTemplate = data;
  },
  updateButtonDeleteData({ buttons, ag }, data) {
    buttons.batchDeleteData = data;
    ag.datas.deleteFailInfo = data.data;
    ag.datas = Object.assign({}, ag.datas);
  },
  setErrorModalValue({ buttons }, {
    title, contentText, footerHide
  }) { // 设置error弹窗提示信息
    buttons.dialogConfig = {
      title,
      footerHide,
      contentText,
      mask: true
    };
  },
  setActionDialog({ buttons }, obj) {
    // buttons.actionDialog.queryString = obj.action.split('/')[1];
    buttons.actionDialog.show = true;
    buttons.actionDialog.title = obj.webdesc;
  },
  updateButtonbatchSubmitData({ buttons, ag }, data) { // 批量提交
    buttons.batchSubmitData = data;
    ag.datas.deleteFailInfo = data;
    ag.datas = Object.assign({}, ag.datas);
  },
  updateButtonbatchUnSubmitData({ buttons, ag }, data) { // 批量反提交
    buttons.batchUnSubmitData = data;
    ag.datas.deleteFailInfo = data;
    ag.datas = Object.assign({}, ag.datas);
  },
  batchVoidForButtonsData({ buttons, ag }, data) { // 作废
    buttons.batchVoidForButtonsData = data;
    ag.datas.deleteFailInfo = data;
    ag.datas = Object.assign({}, ag.datas);
  },
  updateUserConfig(state, { userConfig }) {
    // state.hideColumn = userConfig.hideColumn;
    // state.colPosition = userConfig.colPosition;
    // state.fixedColumn = userConfig.fixedColumn;
    // 将控制隐藏列、列顺序、固定列等信息统一由state.userConfigForAgTable控制
    if (userConfig) {
      state.userConfigForAgTable = {
        hideColumn: userConfig.hideColumn,
        colPosition: userConfig.colPosition,
        fixedColumn: userConfig.fixedColumn
      };
    }
  },
  updateAgConfig(state, { key, value }) {
    // e.g: state['hideColumn'] = [];
    // e.g: state['colPosition'] = '';
    // e.g: state['fixedColumn'] = '';
    state.userConfigForAgTable = Object.assign({}, state.userConfigForAgTable, {
      [key]: value
    });
  },
  updateButtonsExport({ buttons }, data) { // 导出
    buttons.exportdata = data;
  },
  updateWebconfCommonTable({ webconf }, data) {
    webconf.commonTable = data.commonTable;
  }, // 修改state中commonTable的值
  updateWebconfDynamicRouting({ webconf }, data) {
    webconf.dynamicRouting = data.dynamicRouting;
  }, // 修改state中dynamicRouting的值
  updataWebConf(state, data) {
    state.webConf = data;
  },
  updateSearchDBdata(state, data) {
    state.searchDBdata = data;
  }
};
