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
    data.reftabs.sort((a, b) => a.order - b.order);
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
        add: Object.assign({}, { [item.tablename]: {} }),
        modify: Object.assign({}, { [item.tablename]: {} }),
        delete: Object.assign({}, { [item.tablename]: {} }),
        default: {},
        checkedInfo: {},
        changeData: Object.assign({}, state.updateData[item.tablename] ? state.updateData[item.tablename].changeData : {}) // 表单修改的值，第二次回显用
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
  },
  updateNewMainTableDeleteData(state, data) { // 删除返回信息
    state.buttonsData.deleteData = data.message;
  },
  updateFormDataForRefshow(state) { // 去除子表缓存
    const { componentAttribute } = state.tabPanels[state.tabCurrentIndex];
    componentAttribute.formData.isShow = false;
  },
  changeCopy(state, data) {
    state.copy = data;
  },
  copyDefaultData(state, { tableName }) { // 执行按钮复制操作重新给form赋值
    // state.tabPanels.forEach((item) => {
    //   if (item.tablename === tableName) {
    state.tabPanels[0].componentAttribute.panelData = Object.assign(state.tabPanels[0].componentAttribute.panelData, state.defaultForCopyData);
    //   }
    // });
  },
  // changeFormDataForCopy(state, { defaultForCopyDatas, tableName }) {
  //   state.updateData[tableName].add = defaultForCopyDatas;
  // },
  savaCopyData(state, copyData) { // 执行按钮复制操作存储form默认值数据
    state.defaultDataForCopy = copyData;
    // state.defaultDataForCopy.data.addcolums.map((item, index) => {
    //   if (item.parentdesc === '日志') {
    //     return state.defaultDataForCopy.data.addcolums.splice(index, 1);
    //   }
    //   return state.defaultDataForCopy; 
    // });
  },
  emptyChangeData(state, tableName) {
    state.updateData[tableName].changeData = {};
  },
  updateCopyDataForRealdOnly(state, data) {
    state.copyDataForReadOnly = data;
  },
  updateCopyData(state, tableName) { // form的配置信息按照新增接口返回值
    const copySaveDataForParam = {};

    if (Object.keys(state.defaultDataForCopy).length > 0) {
      state.copyDataForReadOnly.addcolums.forEach((d) => { // 复制按钮操作时江接口请求回来的配置信息赋值给form
        state.defaultDataForCopy.data.addcolums.forEach((item) => {
          d.childs.forEach((c) => {
            item.childs.forEach((b) => {
              if (b.name === c.name) {
                b.readonly = c.readonly;
                if (c.readonly === true) {
                  b.valuedata = '';// 将配置为不可编辑的值置空
                } else if (b.valuedata) {
                  copySaveDataForParam[b.colname] = b.valuedata;// 重组数据添加到add
                } else if (b.fkdisplay === 'drp' || b.fkdisplay === 'mrp') {
                  copySaveDataForParam[b.colname] = b.refobjid;
                } 
              }
            });
          });
        });
      });  
      state.updateData[tableName].add[tableName] = copySaveDataForParam;
      state.updateData[tableName].changeData = copySaveDataForParam;
      state.tabPanels[0].componentAttribute.panelData = Object.assign({}, state.defaultDataForCopy, state.copyDataForReadOnly);
    }
  }

};
