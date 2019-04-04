import router from '../router.config';

export default {
  updateTabPanelsData(state, data) {
    const { tableName, tableId } = router.currentRoute.params;
    const arr = [{
      label: '标签',
      tablename: tableName,
      id: tableId,
      componentAttribute: {
        buttonsData: {
          isShow: true,
          data
        },
        formData: {
          isShow: false,
          data: {}
        },
        panelData: {
          isShow: true,
          data: {}
        },
        tableData: {
          isShow: false,
          data: {}
        }
      }
    }];
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
    arr.forEach((item) => {
      state[item.tablename] = {
        add: {}, modify: {}, delete: {}, default: {}, checkedInfo: []
      };
    });
    state.tabPanels = arr;
  }, // 更新按钮数据
  updateButtonsData(state, data) {
    const { componentAttribute } = state.tabPanels[state.tabCurrentIndex];
    componentAttribute.buttonsData.isShow = true;
    componentAttribute.buttonsData.data = data;
  }, // 更新按钮数据
  updateFormData(state, data) {
    const { componentAttribute } = state.tabPanels[state.tabCurrentIndex];
    componentAttribute.formData.isShow = true;
    componentAttribute.formData.data = data;
  }, // 更新form数据
  updatePanelData(state, data) {
    const { componentAttribute } = state.tabPanels[state.tabCurrentIndex];
    componentAttribute.panelData.isShow = true;
    componentAttribute.panelData.data = data;
  }, // 更新form数据
  updateTableData(state, data) {
    const { componentAttribute } = state.tabPanels[state.tabCurrentIndex];
    componentAttribute.tableData.isShow = true;
    componentAttribute.tableData.data = data;
  }, // 更新表格数据
  updateTabCurrentIndex(state, index) {
    state.tabCurrentIndex = index;
  }, // 更新当前tab的索引
  updateDefaultData(state, data) {
    state[data.tableName].default = data.value;
  },
  updateAddData(state, data) {
    state[data.tableName].add = data.value;
  },
  updateModifyData(state, data) {
    state[data.tableName].modify = data.value;
  },
  updateDeleteData(state, data) {
    state[data.tableName].delete = data.value;
  },
  updateCheckedInfoData(state, data) {
    state[data.tableName].checkedInfo = data.value;
  }
};
