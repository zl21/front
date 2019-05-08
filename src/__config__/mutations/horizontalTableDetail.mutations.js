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
          isShow: true,
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
      state.updateData[item.tablename] = {
        add: Object.assign({}, { [item.tablename]: {} }), modify: Object.assign({}, { [item.tablename]: {} }), delete: Object.assign({}, { [item.tablename]: {} }), default: {}, checkedInfo: {}, changeData: {} // 表单修改的值，第二次回显用
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
  }, //

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
  updateChangeData(state, data) {
    state.updateData[data.tableName].changeData = data.value;
  },
  updateCheckedInfoData(state, data) {
    state.updateData[data.tableName].checkedInfo = data.value;
  },
  updateNewMainTableAddSaveData(state, { data, itemName }) { // 主表新增保存返回信息
    state.buttonsData.newMainTableSaveData = data.data;
    state.buttonsData.message = data.message;
    // if (data.message.indexOf('新增成功!') === 0) {
    //   state.buttonsData.newMainTableSaveData = data.data;
    //   state.buttonsData.message = data.message;
    // } else if (data.message.indexOf('更新成功') === 0) {
    //   state.buttonsData.newMainTableSaveData = data.data;
    // } else if (itemName) {
    //   if (data.message.indexOf('修改成功') === 0) {
    //     state.buttonsData.newMainTableSaveData = data.data;
    //   } else if (data.message.indexOf('保存成功') === 0) {
    //     state.buttonsData.newMainTableSaveData = data.data;
    //   } else {
    //     state.buttonsData.newMainTableSaveData = JSON.parse(data);
    //   }
    // }
  },
  updateNewMainTableDeleteData(state, data) { // 删除返回信息
    state.buttonsData.deleteData = data.message;
  },
};
