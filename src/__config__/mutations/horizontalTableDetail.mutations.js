
export default {
  updateTabPanelsData(state, data) { // 更新按钮数据
    const arr = [{
      label: '标签'
    }];
    data.reftabs.forEach((item) => {
      item.label = item.tabledesc;
      arr.push(item);
    });
    state.tabPanels = arr;
  },
  updateButtonsData(state, data) { // 更新按钮数据
    state.buttonsData.isShow = true;
    state.buttonsData.buttonsTabcmd = data.tabcmd;
    state.buttonsData.buttonsTabwebact = data.tabwebact;
  }
};
