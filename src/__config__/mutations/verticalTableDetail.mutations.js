export default {
  updateObjectForMainTableForm({mainFormInfo}, data) { // 更新主表面板数据
    mainFormInfo.formData = data.addcolums;
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
  updateMainButtonsData(state, data) { // 更新主表按钮数据
    // state.mainFormInfo.buttonsData.isShow = true;
    state.mainFormInfo.buttonsData.buttonsTabcmd = data.tabcmd;
    state.mainFormInfo.buttonsData.buttonsTabwebact = data.tabwebact;
  },
  updateRefButtonsData(state, data) { // 更新子表按钮数据
    
  },
  updateFormDataForRefTable(state, data) { // 更新子表表单数据

  }
};
