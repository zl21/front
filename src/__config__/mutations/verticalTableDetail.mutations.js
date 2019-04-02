export default {
  updateObjectForMainTableForm({ mainFormInfo }, data) { // 更新主表面板数据
    mainFormInfo.formData.isShow = data.addcolums && data.addcolums.length > 0;
    mainFormInfo.formData.data = data || [];
  },
  updateMainTabPanelsData(state, data) { // 更新主表tab数据
    const arr = [];
    data.reftabs.forEach((item) => {
      const obj = { ...item };
      obj.label = item.tabledesc;
      obj.componentAttribute = {
        buttonsData: {
          isShow: false,
          data: {}
        },
        formData: {
          isShow: false,
          data: {}
        },
        panelData: {
          isShow: false,
          data: {}
        },
        tableData: {
          isShow: false,
          data: {}
        }
      };
      arr.push(obj);
    });
    state.tabPanels = arr;
  },
  updateMainButtonsData({ mainFormInfo }, data) { // 更新主表按钮数据
    // state.mainFormInfo.buttonsData.isShow = true;
    mainFormInfo.buttonsData.data = data;
  },
  updateRefButtonsData(state, data) { // 更新子表按钮数据
    const { componentAttribute } = state.tabPanels[state.tabCurrentIndex];
    componentAttribute.buttonsData.isShow = false; /** warn: 导出好像必有 */
    componentAttribute.buttonsData.data = data;
  },
  updateFormDataForRefTable(state, data) { // 更新子表表单数据
    const { componentAttribute } = state.tabPanels[state.tabCurrentIndex];
    componentAttribute.formData.isShow = data.inpubobj && data.inpubobj.length > 0;
    componentAttribute.formData.data = data || [];
  },
  updateTableListForRefTable(state, data) { // 更新子表列表数据
    const { componentAttribute } = state.tabPanels[state.tabCurrentIndex];
    componentAttribute.tableData.isShow = data.tabth && data.tabth.length > 0;
    componentAttribute.tableData.data = data;
  },
  updateTabCurrentIndex(state, index) { // 更新当前tab的索引
    state.tabCurrentIndex = index;
  },
};
