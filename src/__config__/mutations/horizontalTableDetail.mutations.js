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
        addDefault: {},
        default: {},
        checkedInfo: {},
        changeData: Object.assign({}, state.updateData[item.tablename] ? state.updateData[item.tablename].changeData : {}) // 表单修改的值，第二次回显用
      };
    });
    state.tabPanels = arr;
  }, // 更新按钮数据
  updateButtonsData(state, data) {
    const { componentAttribute } = state.tabPanels[data.tabIndex];
    componentAttribute.buttonsData.isShow = true;
    componentAttribute.buttonsData.data = data;
  }, // 更新按钮数据
  updateFormData(state, data) {
    const { componentAttribute } = state.tabPanels[data.tabIndex];
    componentAttribute.formData.isShow = true;
    componentAttribute.formData.data = data;
  }, //

  updatePanelData(state, data) {
    const { componentAttribute } = state.tabPanels[data.tabIndex];
    componentAttribute.panelData.isShow = true;
    componentAttribute.panelData.data = data;
  }, // 更新form数据
  updateTableData(state, data) {
    const { componentAttribute } = state.tabPanels[data.tabIndex];
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
    if (Object.values(data.value).length === 0) {
      state.updateData[data.tableName].add[data.tableName] = {};
    } else {
      state.updateData[data.tableName].add[data.tableName] = Object.assign(state.updateData[data.tableName].add[data.tableName], data.value[data.tableName]);
    }
  },
  
  updateModifyData(state, data) {
    state.updateData[data.tableName].modify = data.value;
  },
  updateAddDefaultData(state, data) {
    state.updateData[data.tableName].addDefault = data.value;
  },
  updateDeleteData(state, data) {
    state.updateData[data.tableName].delete = data.value;
  },
  updateChangeData(state, data) {
    state.updateData[data.tableName].changeData = Object.assign(data.value, {});
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
  updateTablePageInfo(state, data) { //  更改列表分页数据
    state.tablePageInfo = data;
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
  savaCopyData(state, { copyDatas, tableName }) { // 执行按钮复制操作存储form默认值数据
    console.log('🍌', copyDatas);
    // state.defaultDataForCopy = copyData;
    // console.log('🍌', state.defaultDataForCopy);
    const copySaveDataForParam = {};
    // if (Object.keys(copyData).length > 0) {
    state.copyDataForReadOnly.addcolums.forEach((d) => { // 复制按钮操作时江接口请求回来的配置信息赋值给form
      copyDatas.data.addcolums.forEach((item) => {
        d.childs.forEach((c) => {
          item.childs.forEach((b) => {
            if (b.name === c.name) {
              b.readonly = c.readonly;
              if (c.readonly === true) {
                b.valuedata = '';// 将配置为不可编辑的值置空
              } else if (b.valuedata) {
                if (b.fkdisplay === 'drp' || b.fkdisplay === 'mrp' || b.fkdisplay === 'mop' || b.fkdisplay === 'pop' || b.fkdisplay === 'pop') {
                  copySaveDataForParam[b.colname] = [{ ID: b.refobjid, Label: b.valuedata }];
                } else {
                  copySaveDataForParam[b.colname] = b.valuedata;// 重组数据添加到add
                }
              }
            }
          });
        });
      });
    });
    state.updateData[tableName].changeData = Object.assign({}, copySaveDataForParam);
    const a = Object.assign({}, copyDatas, state.copyDataForReadOnly);
    state.tabPanels[0].componentAttribute.panelData = a;
  },
  emptyChangeData(state, tableName) {
    state.updateData[tableName].changeData = {};
  },
  updateCopyDataForRealdOnly(state, data) {
    state.copyDataForReadOnly = data;
  },
  updateButtonsExport(state, data) { // 导出
    state.buttonsData.exportdata = data;
  },
  updatetooltipForItemTableData(state, data) { // 表格操作单条明细失败返回值
    state.tooltipForItemTable = data;
  },
  updateSubmitData(state, submitData) { // 提交
    state.buttonsData.submitData = submitData;
  },
  updateUnSubmitData(state, unSubmitData) { // 取消提交
    state.buttonsData.unSubmitData = unSubmitData;
  },
  updateiInvalidData(state, invalidData) { // 作废
    state.buttonsData.invalidData = invalidData;
  },
  updateObjTabActionSlientConfirm(state, data) { // 动作定义类型接口返回值
    state.objTabActionSlientConfirmData = data;
  }
  
};
