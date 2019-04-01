export default {
  updateObjectForMainTableForm({mainFormInfo}, data) { // 更新主表面板数据
    mainFormInfo.formData = data.addcolums || [];
    mainFormInfo.isShow = data.addcolums && data.addcolums.length > 0;
  },
  updateMainTabPanelsData(state, data) { // 更新主表tab数据
    const arr = [];
    data.reftabs.forEach((item) => {
      item.label = item.tabledesc;
      arr.push(item);
    });
    state.tabPanels = arr;
  },
  updateMainButtonsData({mainFormInfo}, data) { // 更新主表按钮数据
    // state.mainFormInfo.buttonsData.isShow = true;
    mainFormInfo.buttonsData.buttonsTabcmd = data.tabcmd;
    mainFormInfo.buttonsData.buttonsTabwebact = data.tabwebact;
  },
  updateRefButtonsData({activaRefFormInfo}, data) { // 更新子表按钮数据
    activaRefFormInfo.buttonsData.isShow = true; /** warn: 导出好像必有 */ 
    activaRefFormInfo.buttonsData.buttonsTabcmd = data.tabcmd;
    activaRefFormInfo.buttonsData.buttonsTabwebact = data.tabwebact;
  },
  updateFormDataForRefTable({activaRefFormInfo}, data) { // 更新子表表单数据
    activaRefFormInfo.formData.isShow = data.inpubobj && data.inpubobj.length > 0;
    activaRefFormInfo.formData.data = data.inpubobj || [] ;
  },
  updateTableListForRefTable({activaRefFormInfo}, data) { // 更新子表列表数据
    activaRefFormInfo.tableData.isShow = data.tabth && data.tabth.length > 0;
    activaRefFormInfo.tableData.data = data;
  },
  updateActiveRefFormInfo({activaRefFormInfo}, data) {
    activaRefFormInfo.refInfo = data;
  }
};
