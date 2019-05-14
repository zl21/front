import { STANDARD_TABLE_COMPONENT_PREFIX } from '../../constants/global';

export default {
  updateTableData({
    ag
  }, data) {
    ag.datas = data;
  },
  updateTableStatus4css({
    ag
  }, data) {
    ag.status4css = data;
  },

  // 表单
  updateDefaultFormItemsLists({ formItems }, data) {
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
  updateButtonsTabcmd({
    buttons
  }, data) {
    buttons.tabcmd = data;
    console.log('🍓', buttons.tabcmd);
  },
  updateButtonWaListButtons({ buttons }, data) { // 获取静默类型的按钮数据
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
    buttons.isSolr = data.isolr; // 是否获取合计
    buttons.showBigDefaultIcon = data.isbig;
    buttons.tabledesc = buttons.tabcmd.desc;
    buttons.tableId = data.tableid;
    buttons.tableName = data.table;
    // 双击条状判断
    buttons.objTableUrl = data.tableurl;
  },
  setActiveTabActionValue({
    buttons
  }, obj) {
    buttons.activeTabAction = obj;
  },
  updateButtonExeActionData({ buttons }, data) {
    buttons.ExeActionData = data;
  },
  updateButtonGetActionData({ buttons }, data) {
    buttons.ExeActionData = data;
  },
  updateButtonSetFavoriteData({ buttons }, data) { // 收藏
    if (data.code === 0) {
      buttons.dataArray.collectiImg = !buttons.dataArray.collectiImg;
      this.state.global.favorite = data.data;
    }
  },
  updateDefaultButtonGroupData({ buttons }, data) {
    console.log('🦋', data);
    buttons.dataArray.buttonGroupShowConfig.buttonGroupShow = data;
  },
  onSelectionChangedAssignment({ buttons }, { rowIdArray, rowArray }) {
    buttons.selectIdArr = rowIdArray;
    buttons.selectArr = rowArray;
  },
  setImportDialogTitle({ buttons }) { // 导出操作
    buttons.importData.importDialog = true;
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
  updateButtonDeleteData({ buttons }, data) {
    buttons.batchDeleteData = data;
  },
  setErrorModalValue({ buttons }, {
    title, contentText, footerHide 
  }) { // 设置error弹窗提示信息
    buttons.dialogConfig = {
      title,
      footerHide,
      contentText,
    };
  },
  setActionDialog({ buttons }, obj) {
    // buttons.actionDialog.queryString = obj.action.split('/')[1];
    buttons.actionDialog.show = true;
    buttons.actionDialog.title = obj.webdesc;
  },
  updateButtonbatchSubmitData({ buttons }, data) { // 批量提交
    buttons.batchSubmitData = data;
  },
  updateButtonbatchUnSubmitData({ buttons }, data) { // 批量反提交
    buttons.batchUnSubmitData = data;
  },
  updateUserConfig(state, { userConfig }) {
    state.hideColumn = userConfig.hideColumn;
    state.colPosition = userConfig.colPosition;
    state.fixedColumn = userConfig.fixedColumn;
  },
};
