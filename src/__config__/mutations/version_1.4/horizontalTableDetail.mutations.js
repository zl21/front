import router from '../../router.config';

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
      obj.tableSearchData = {
        selectedValue: '',
        inputValue: ''
      }; // 表格搜索的数据
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
    if (!state.instanceId) {
      const { componentAttribute } = state.tabPanels[data.tabIndex];
      componentAttribute.buttonsData.isShow = true;
      componentAttribute.buttonsData.data = data;
    }
  }, // 更新按钮数据
  updateButtonsDataForCustomization(state, { tabIndex, isShowValue }) {
    const { componentAttribute } = state.tabPanels[tabIndex];
    componentAttribute.buttonsData.isShow = isShowValue;
  }, // 全定制tab更新按钮数据
  updateFormData(state, data) {
    const { componentAttribute } = state.tabPanels[data.tabIndex];
    if (data.inpubobj) {
      componentAttribute.formData.isShow = true;
    }
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
    if (state.updateData[data.tableName]) {
      if (Object.values(data.value).length === 0) {
        state.updateData[data.tableName].add[data.tableName] = {};
      } else {
        state.updateData[data.tableName].add[data.tableName] = Object.assign(state.updateData[data.tableName].add[data.tableName], data.value[data.tableName]);
      }
    }
  },

  updateModifyData(state, data) {
    if (state.updateData[data.tableName]) {
      state.updateData[data.tableName].modify = data.value;
    }
  },
  updateAddDefaultData(state, data) {
    if (state.updateData[data.tableName]) {
      state.updateData[data.tableName].addDefault = data.value;
    }
  },
  updateDeleteData(state, data) {
    if (state.updateData[data.tableName]) {
      if (Object.values(data.value).length === 0) {
        state.updateData[data.tableName].delete[data.tableName] = data.value;
      } else {
        state.updateData[data.tableName].delete = data.value;
      }
    }
  },
  updateChangeData(state, data) {
    data = JSON.parse(JSON.stringify(data));
    if (state.updateData[data.tableName]) {
      state.updateData[data.tableName].changeData = Object.assign(data.value, {});
      state.updateData = Object.assign({}, state.updateData);
    }
  },
  updateCheckedInfoData(state, data) {
    if (state.updateData[data.tableName]) {
      state.updateData[data.tableName].checkedInfo = data.value;
    }
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
  savaCopyData(state, { copyDatas, tableName, modifyData }) { // 执行按钮复制操作存储form默认值数据
    // state.defaultDataForCopy = copyData;
    const copySaveDataForParam = {};// 整合changeData所需数据格式
    const hidecolunmArray = [];
    state.copyDataForReadOnly.addcolums.forEach((d) => { // 复制按钮操作时江接口请求回来的配置信息赋值给form
      copyDatas.data.addcolums.forEach((item) => {
        d.childs.forEach((c) => {
          item.childs.forEach((b) => {
            if (c.hidecolumn) {
              if (c.hidecolumn && c.hidecolumn.refcolumn === b.colname) {
                if (c.hidecolumn && c.hidecolumn.refval !== b.valuedata) {
                  c.valuedata = '';
                  hidecolunmArray.push(c);
                }
              } 
            }         
            if (b.name === c.name) {
              b.readonly = c.readonly;
              if (hidecolunmArray.length > 0) {
                hidecolunmArray.forEach((hidecolumnItem) => {
                  if (b.colname !== hidecolumnItem.colname) {
                    if (c.readonly === true) {
                      if (c.defval) { // 处理复制时有不可编辑，且有默认值情况
                        copySaveDataForParam[b.colname] = c.defval;
                      } else {
                        b.valuedata = '';// 将配置为不可编辑的值置空
                      }
                    } else if (b.valuedata) {
                      if (b.fkdisplay === 'drp' || b.fkdisplay === 'mrp' || b.fkdisplay === 'pop' || b.fkdisplay === 'pop') { // 外键类型要特殊整合
                        copySaveDataForParam[b.colname] = [{ ID: b.refobjid, Label: b.valuedata }];
                      } else if (b.fkdisplay === 'mop') {
                        const number = JSON.parse(b.valuedata).lists.result.length;
                        copySaveDataForParam[b.colname] = [{ ID: b.valuedata, Label: `已经选中${number}条数据` }];
                      } else {
                        copySaveDataForParam[b.colname] = b.valuedata;// 重组数据添加到add
                      }
                    }
                  }
                });
              } else if (c.readonly === true) {
                if (c.defval) { // 处理复制时有不可编辑，且有默认值情况
                  copySaveDataForParam[b.colname] = c.defval;
                } else {
                  b.valuedata = '';// 将配置为不可编辑的值置空
                }
              } else if (b.valuedata) {
                if (b.fkdisplay === 'drp' || b.fkdisplay === 'mrp' || b.fkdisplay === 'pop' || b.fkdisplay === 'pop') { // 外键类型要特殊整合
                  copySaveDataForParam[b.colname] = [{ ID: b.refobjid, Label: b.valuedata }];
                } else if (b.fkdisplay === 'mop') {
                  const number = JSON.parse(b.valuedata).lists.result.length;
                  copySaveDataForParam[b.colname] = [{ ID: b.valuedata, Label: `已经选中${number}条数据` }];
                } else {
                  copySaveDataForParam[b.colname] = b.valuedata;// 重组数据添加到add
                }
              }
            }
          });
        });
      });
    });
    // Object.keys(modifyData).map((modify) => {//将修改过的值重新赋值给form所需数据
    //   copyDatas.data.addcolums.forEach((copy) => {
    //     copy.childs.forEach((childs) => {
    //       if (modify === childs.colname) {
    //         childs.valuedata = modifyData[modify];
    //       }
    //     });
    //   });
    // });
    state.updateData[tableName].add = {};
    state.updateData[tableName].changeData = Object.assign({}, copySaveDataForParam, modifyData);// 用于通过改变changeData触发form抛出值，以便保存时可以拿到add里面的值作为参数
    state.updateData = Object.assign({}, state.updateData);

    copyDatas.data.addcolums.forEach((item) => { // 去除配置了clearWhenHidden的
      if (item.parentdesc !== '日志') {
        item.childs.forEach((itemValue) => {
          item.childs.forEach((childValue) => {
            if (itemValue.hidecolumn && itemValue.hidecolumn.refcolumn === childValue.colname) {
              if (itemValue.hidecolumn && itemValue.hidecolumn.refval !== childValue.valuedata) {
                itemValue.valuedata = '';
                delete (itemValue.refobjid);
              }
            }
          });
        });
      }
    });
    state.tabPanels[0].componentAttribute.panelData.data = copyDatas.data;// 替换panelData新增逻辑接口返回数据，将上一界面值重新赋值给form
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
  },
  updateLinkageForm(state, data) {
    let mappStatus = {};
    if (data.length > 0) {
      mappStatus = data.reduce((arry, item) => {
        if (item.srccol) {
          arry[item.key] = item.srccol;
        }
        return arry;
      }, {});
      state.LinkageForm = state.LinkageForm.concat(data);
      state.mappStatus = Object.assign(state.mappStatus, mappStatus);
    } else {
      state.LinkageForm = [];
      state.mappStatus = {};
    }
  },
  updateMaping(state, data) {
    // form 联动校验map 图
    //  获取映射关系
    const temp = Object.keys(data).reduce((a, c) => {
      const f = (key) => {
        if (!data[key]) {
          return [];
        }
        return [data[key]].concat(f(data[key]));
      };
      a[c] = f(c);
      return a;
    }, {});
    return temp;
  },
  updateTableSearchData(state, data) {
    const { tableSearchData } = state.tabPanels[state.tabCurrentIndex];
    tableSearchData.selectedValue = data.selectedValue;
    tableSearchData.inputValue = data.inputValue;
  }, // 修改单对象表格搜索的值
  jflowPlugin(state, {
    buttonsData, newButtons, buttonAnother, instanceId 
  }) { // jflowPlugin按钮逻辑
    state.jflowPluginDataArray = newButtons;
    state.instanceId = instanceId;
    state.mainFormInfo.buttonsData.data.tabwebact.objbutton = [];
    if (buttonAnother) { 
      state.tabPanels[0].componentAttribute.buttonsData.data.tabcmd.prem = buttonsData;
      state.anotherData = buttonAnother;
    } else if (state.anotherData.length > 0) {
      state.tabPanels[0].componentAttribute.buttonsData.data.tabcmd.prem = state.anotherData;
    } else {
      state.tabPanels[0].componentAttribute.buttonsData.data.tabcmd.prem = buttonsData;
    }
  },
  updateRefreshButton(state, value) { // 控制刷新按钮开关
    state.refreshButton = value;
  }
};
