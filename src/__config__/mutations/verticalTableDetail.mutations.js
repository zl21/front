import router from '../router.config';

export default {
  updateObjectForMainTableForm(state, data) { // 更新主表面板数据
    const { tableName, tableId } = router.currentRoute.params;
    state.mainFormInfo.tablename = tableName;
    state.mainFormInfo.tableid = tableId;
    state.mainFormInfo.formData.isShow = data.addcolums && data.addcolums.length > 0;
    state.mainFormInfo.formData.data = Object.assign({}, data);
    state.updateData[tableName] = {
      add: Object.assign({}, { [tableName]: {} }), modify: Object.assign({}, { [tableName]: {} }), delete: Object.assign({}, { [tableName]: {} }), default: {}, checkedInfo: {}
    };
  },
  updateMainTabPanelsData(state, data) { // 更新主表tab数据
    const arr = [];
    data.reftabs.forEach((item) => {
      const obj = { ...item };
      obj.label = item.tabledesc;
      obj.componentAttribute = {
        buttonsData: {
          isShow: false,
          data: ({})
        },
        formData: {
          isShow: false,
          data: ({})
        },
        panelData: {
          isShow: false,
          data: ({})
        },
        tableData: {
          isShow: false,
          data: ({})
        }
      };
      state.updateData[item.tablename] = {
        add: Object.assign({}, { [item.tablename]: {} }), modify: Object.assign({}, { [item.tablename]: {} }), delete: Object.assign({}, { [item.tablename]: {} }), default: {}, checkedInfo: {}
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
    componentAttribute.buttonsData.isShow = false;
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
  updateDefaultData(state, data) {
    // console.trace(data.tableName);
    state.updateData[data.tableName].default = data.value;
  },
  updateAddData(state, data) {
    state.updateData[data.tableName].add[data.tableName] = Object.assign(state.updateData[data.tableName].add[data.tableName], data.value[data.tableName]);
  },
  updateModifyData(state, data) {
    state.updateData[data.tableName].modify = data.value;
  },
  updateDeleteData(state, data) {
    state.updateData[data.tableName].delete = data.value;
  },
  updateCheckedInfoData(state, data) {
    state.updateData[data.tableName].checkedInfo = data.value;
  },
  updatePanelData(state, data) { // 更新子表面板数据
    const { componentAttribute } = state.tabPanels[state.tabCurrentIndex];
    componentAttribute.panelData.isShow = true;
    componentAttribute.panelData.data = data;
  },
 
  // updateNewMainTableAddSaveData(state, data) { // 主表新增保存返回信息
  //   console.log('🍅', data);
  //   state.mainFormInfo.buttonsData.newMainTableSaveData = JSON.parse(data);
  // },
  // updateNewMainTableModifySaveData(state, data) { // 主表修改保存返回信息
  //   state.mainFormInfo.buttonsData.newMainTableSaveData = data;
  // },
  updateNewMainTableAddSaveData(state, data) { // 主表新增保存返回信息
    console.log('🍅', data);
    state.mainFormInfo.buttonsData.newMainTableSaveData = data;
  },
  updateNewMainTableModifySaveData(state, data) { // 主表修改保存返回信息
    alert(1);
    console.log('🍅主表修改保存返回信息', data);

    state.mainFormInfo.buttonsData.newMainTableSaveData = data;
  },
};
