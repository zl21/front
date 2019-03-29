
export default {
  updateTabPanelsData(state, data) {
    const arr = [{
      label: '标签'
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
    if (data.length > 0) {
      state.formData.isShow = true;
    }
    state.formData.data = data;
  }, // 更新form数据
};
