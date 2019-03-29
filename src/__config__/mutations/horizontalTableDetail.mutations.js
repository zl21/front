import router from '../router.config';

export default {
  updateTabPanelsData(state, data) {
    const { tableName, tableId, itemId } = router.currentRoute.params;
    const arr = [{
      label: '标签',
      table: tableName,
      id: tableId
    }];
    data.reftabs.forEach((item) => {
      item.label = item.tabledesc;
      arr.push(item);
    });
    state.tabPanels = arr;
  }, // 更新按钮数据
  updateButtonsData(state, data) {
    state.buttonsData.isShow = true;
    state.buttonsData.buttonsTabcmd = data.tabcmd;
    state.buttonsData.buttonsTabwebact = data.tabwebact;
  }, // 更新按钮数据
  updateFormData(state, data) {
    if (data && data.length > 0) {
      state.formData.isShow = true;
    }
    state.formData.data = data;
  }, // 更新form数据
  updateTableData(state, data) {
    state.tableData.isShow = true;
    state.tableData.data = data;
  }, // 更新表格数据
  updateIsShow(state) {
    state.buttonsData.isShow = false;
    state.formData.isShow = false;
    state.tableData.isShow = false;
  }
};
